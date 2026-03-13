import os
import pytest
from unittest.mock import patch

from ..app.services.extract import extract_action_items, extract_action_items_llm


def test_extract_bullets_and_checkboxes():
    text = """
    Notes from meeting:
    - [ ] Set up database
    * implement API extract endpoint
    1. Write tests
    Some narrative sentence.
    """.strip()

    items = extract_action_items(text)
    assert "Set up database" in items
    assert "implement API extract endpoint" in items
    assert "Write tests" in items


@patch("ollama.generate")
def test_extract_action_items_llm_empty_input_returns_empty_list(mock_generate):
    mock_generate.return_value = "[]"

    result = extract_action_items_llm("")

    assert result == []
    mock_generate.assert_called_once()


@patch("ollama.generate")
def test_extract_action_items_llm_bullet_points_with_string_response(mock_generate):
    mock_generate.return_value = """
    Pre-text that should be ignored.
    ["Set up database", "implement API extract endpoint"]
    Some trailing explanation.
    """.strip()

    text = """
    - Set up database
    * implement API extract endpoint
    """.strip()

    result = extract_action_items_llm(text)

    assert result == ["Set up database", "implement API extract endpoint"]


@patch("ollama.generate")
@pytest.mark.parametrize(
    "mock_response, expected",
    [
        (
            {"response": '["finish report", "send summary email"]'},
            ["finish report", "send summary email"],
        ),
        (
            {"choices": [{"content": '["finish report", "send summary email", 123, null]'}]},
            ["finish report", "send summary email"],
        ),
    ],
)
def test_extract_action_items_llm_keyword_prefixes_with_dict_responses(
    mock_generate, mock_response, expected
):
    mock_generate.return_value = mock_response

    text = """
    todo: finish report
    action: send summary email
    """.strip()

    result = extract_action_items_llm(text)

    assert result == expected


@patch("ollama.generate")
def test_extract_action_items_llm_invalid_json_returns_empty_list(mock_generate):
    mock_generate.return_value = "not a json array at all"

    text = "Some random text without clear action items."

    result = extract_action_items_llm(text)

    assert result == []
