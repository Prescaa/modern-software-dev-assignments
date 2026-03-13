from __future__ import annotations

import os
import re
from typing import List
import json
from typing import Any
from ollama import chat
from dotenv import load_dotenv

load_dotenv()

BULLET_PREFIX_PATTERN = re.compile(r"^\s*([-*•]|\d+\.)\s+")
KEYWORD_PREFIXES = (
    "todo:",
    "action:",
    "next:",
)


def _is_action_line(line: str) -> bool:
    stripped = line.strip().lower()
    if not stripped:
        return False
    if BULLET_PREFIX_PATTERN.match(stripped):
        return True
    if any(stripped.startswith(prefix) for prefix in KEYWORD_PREFIXES):
        return True
    if "[ ]" in stripped or "[todo]" in stripped:
        return True
    return False


def extract_action_items(text: str) -> List[str]:
    lines = text.splitlines()
    extracted: List[str] = []
    for raw_line in lines:
        line = raw_line.strip()
        if not line:
            continue
        if _is_action_line(line):
            cleaned = BULLET_PREFIX_PATTERN.sub("", line)
            cleaned = cleaned.strip()
            # Trim common checkbox markers
            cleaned = cleaned.removeprefix("[ ]").strip()
            cleaned = cleaned.removeprefix("[todo]").strip()
            extracted.append(cleaned)
    # Fallback: if nothing matched, heuristically split into sentences and pick imperative-like ones
    if not extracted:
        sentences = re.split(r"(?<=[.!?])\s+", text.strip())
        for sentence in sentences:
            s = sentence.strip()
            if not s:
                continue
            if _looks_imperative(s):
                extracted.append(s)
    # Deduplicate while preserving order
    seen: set[str] = set()
    unique: List[str] = []
    for item in extracted:
        lowered = item.lower()
        if lowered in seen:
            continue
        seen.add(lowered)
        unique.append(item)
    return unique


from typing import List
import ollama
import json


def extract_action_items_llm(text: str) -> List[str]:
    """
    Ekstrak action items menggunakan model tinyllama via Ollama, output harus array JSON string sesuai format structured output Ollama.
    """
    prompt = (
        "Extract all action items or to-dos from the text below in bullet point format. "
        'Return ONLY a JSON array of strings (no explanation). Example output: ["action 1", "action 2"]. '
        "Text:\n---\n"
        f"{text}\n---"
    )
    try:
        response = ollama.generate(model="tinyllama", prompt=prompt, options={"format": "json"})
        # Ollama may return JSON as string or dict, handle both
        if isinstance(response, dict):
            if "response" in response:
                content = response["response"]
            elif "choices" in response and response["choices"]:
                content = response["choices"][0].get("content", "")
            else:
                content = ""
        else:
            content = response

        # Try to parse as JSON (if the LLM returned extra text, try to extract JSON array)
        # Remove any prefix/suffix accidentally returned by LLM
        start = content.find("[")
        end = content.rfind("]")
        if start != -1 and end != -1:
            content = content[start : end + 1]
        items = json.loads(content)
        # Ensure result is a list of strings
        return [str(i).strip() for i in items if isinstance(i, str)]
    except Exception:
        # Fallback: return empty list if parsing fails
        return []


def _looks_imperative(sentence: str) -> bool:
    words = re.findall(r"[A-Za-z']+", sentence)
    if not words:
        return False
    first = words[0]
    # Crude heuristic: treat these as imperative starters
    imperative_starters = {
        "add",
        "create",
        "implement",
        "fix",
        "update",
        "write",
        "check",
        "verify",
        "refactor",
        "document",
        "design",
        "investigate",
    }
    return first.lower() in imperative_starters
