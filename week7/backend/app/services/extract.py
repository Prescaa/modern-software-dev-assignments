import re
from collections.abc import Iterable


PRIORITY_PATTERN = re.compile(r"\b(urgent|high|low)\b", re.IGNORECASE)
DUE_DATE_PATTERN = re.compile(
    r"\b(tomorrow|next week|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b",
    re.IGNORECASE,
)


def _annotate_line_with_metadata(line: str) -> str:
    """
    Enrich an action item line with lightweight metadata inferred from the text.

    The function keeps the original line intact and appends structured hints in
    brackets so that the return type stays as `str`, maintaining compatibility
    with callers and schemas, while still exposing priority / due date info.
    """

    annotations: list[str] = []

    priority_match = PRIORITY_PATTERN.search(line)
    if priority_match:
        annotations.append(f"[priority: {priority_match.group(1).lower()}]")

    due_match = DUE_DATE_PATTERN.search(line)
    if due_match:
        annotations.append(f"[due: {due_match.group(1).lower()}]")

    if not annotations:
        return line

    return f"{line} " + " ".join(annotations)


def _iter_candidate_lines(text: str) -> Iterable[str]:
    return (line.strip("- ") for line in text.splitlines() if line.strip())


def extract_action_items(text: str) -> list[str]:
    lines = list(_iter_candidate_lines(text))
    results: list[str] = []

    for line in lines:
        normalized = line.lower()
        is_prefixed = normalized.startswith("todo:") or normalized.startswith("action:")
        is_emphatic = line.endswith("!")

        if is_prefixed or is_emphatic:
            enriched = _annotate_line_with_metadata(line)
            results.append(enriched)

    return results


