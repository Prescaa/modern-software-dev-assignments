from collections.abc import Generator

import pytest


def test_create_list_and_patch_notes(client):
    payload = {"title": "Test", "content": "Hello world"}
    r = client.post("/notes/", json=payload)
    assert r.status_code == 201, r.text
    data = r.json()
    assert data["title"] == "Test"
    assert "created_at" in data and "updated_at" in data

    r = client.get("/notes/")
    assert r.status_code == 200
    items = r.json()
    assert len(items) >= 1

    r = client.get("/notes/", params={"q": "Hello", "limit": 10, "sort": "-created_at"})
    assert r.status_code == 200
    items = r.json()
    assert len(items) >= 1

    note_id = data["id"]
    r = client.patch(f"/notes/{note_id}", json={"title": "Updated"})
    assert r.status_code == 200
    patched = r.json()
    assert patched["title"] == "Updated"


@pytest.fixture()
def seeded_notes(client) -> Generator[list[dict], None, None]:
    titles = [f"Note {i}" for i in range(1, 11)]
    created_items: list[dict] = []
    for title in titles:
        resp = client.post("/notes/", json={"title": title, "content": f"Content for {title}"})
        assert resp.status_code == 201
        created_items.append(resp.json())

    yield created_items


def test_pagination_with_limit_and_skip(client, seeded_notes):
    # First page
    r = client.get("/notes/", params={"skip": 0, "limit": 5, "sort": "id"})
    assert r.status_code == 200
    first_page = r.json()
    assert len(first_page) == 5

    # Second page
    r = client.get("/notes/", params={"skip": 5, "limit": 5, "sort": "id"})
    assert r.status_code == 200
    second_page = r.json()
    assert len(second_page) == 5

    # Ensure pages don't overlap and are ordered by id asc
    first_ids = [n["id"] for n in first_page]
    second_ids = [n["id"] for n in second_page]
    assert max(first_ids) < min(second_ids)


def test_sorting_by_created_at_desc_and_asc(client, seeded_notes):
    # Default sort by -created_at (desc)
    r = client.get("/notes/", params={"sort": "-created_at"})
    assert r.status_code == 200
    desc_items = r.json()
    desc_created = [item["created_at"] for item in desc_items]
    assert desc_created == sorted(desc_created, reverse=True)

    # Ascending created_at
    r = client.get("/notes/", params={"sort": "created_at"})
    assert r.status_code == 200
    asc_items = r.json()
    asc_created = [item["created_at"] for item in asc_items]
    assert asc_created == sorted(asc_created)


def test_sorting_by_title_asc_and_desc(client, seeded_notes):
    r = client.get("/notes/", params={"sort": "title"})
    assert r.status_code == 200
    asc_items = r.json()
    asc_titles = [item["title"] for item in asc_items]
    assert asc_titles == sorted(asc_titles)

    r = client.get("/notes/", params={"sort": "-title"})
    assert r.status_code == 200
    desc_items = r.json()
    desc_titles = [item["title"] for item in desc_items]
    assert desc_titles == sorted(desc_titles, reverse=True)


