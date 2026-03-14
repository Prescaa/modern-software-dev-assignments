# Week 7 Write-up
Tip: To preview this markdown file
- On Mac, press `Command (⌘) + Shift + V`
- On Windows/Linux, press `Ctrl + Shift + V`

## Instructions

Fill out all of the `TODO`s in this file.

## Submission Details

Name: Rifky Putra Mahardika \
SUNet ID: 2310817210023 \
Citations: Gemini 3 Flash (AI Collaborator), FastAPI Documentation, SQLAlchemy Documentation

This assignment took me about **3** hours to do. 


## Task 1: Add more endpoints and validations
a. Links to relevant commits/issues
> 

b. PR Description
> **Problem:** The initial API lacked specific note retrieval/update capabilities and strict input validation.  
> **Approach:** Implemented `GET /notes/{id}` and `PUT /notes/{id}`. Added Pydantic `Field` constraints (`min_length`, `max_length`) to the `NoteCreate` schema. Also fixed a critical bug in `main.py` where the app would crash if the frontend directory was missing during tests.  
> **Testing:** Ran `pytest` and verified that requests for non-existent IDs correctly return `404` responses.

c. Graphite Diamond generated code review
> Graphite reported that **no issues were found**. The AI review confirmed that the implementation followed best practices for FastAPI error handling and schema validation.


## Task 2: Extend extraction logic
a. Links to relevant commits/issues
> 

b. PR Description
> **Problem:** The action item extraction logic was too basic, only detecting patterns like `"TODO"` or `"!"`.  
> **Approach:** Enhanced `extract.py` using **Regex patterns** to detect priorities (`urgent`, `high`, `low`) and due dates (`tomorrow`, weekdays). Metadata is appended in brackets such as `[priority: x]` to preserve backward compatibility with the existing `list[str]` return type.  
> **Testing:** Verified that a string like `"TODO: fix login urgent tomorrow"` is correctly extracted with metadata. Also fixed a **Windows PermissionError** in `conftest.py` to ensure tests tear down properly.

c. Graphite Diamond generated code review
> Graphite noted that using `re.compile` for regex patterns improves efficiency. It also suggested ensuring that the bracketed metadata format does not interfere with potential downstream UI parsing.


## Task 3: Try adding a new model and relationships
a. Links to relevant commits/issues
> 

b. PR Description
> **Problem:** Notes could not be categorized, which limited organization features.  
> **Approach:** Created a `Category` model with a **one-to-many relationship** to `Note`. Updated `schemas.py` and `models.py` to include `category_id`. Added a defensive check in the router so that if a user assigns a note to a non-existent category, the API returns a `404`.  
> **Testing:** Successfully created notes both with and without `category_id` and verified the relationship integrity in the database.

c. Graphite Diamond generated code review
> Graphite highlighted that the **404 validation check for `category_id`** is a good defensive programming practice that helps prevent invalid references in the database.


## Task 4: Improve tests for pagination and sorting
a. Links to relevant commits/issues
> 

b. PR Description
> **Problem:** There was no automated verification for pagination (`limit`, `offset`) and sorting functionality.  
> **Approach:** Added a Pytest fixture to seed **10 dummy notes** into the test database. Implemented tests verifying that `limit=5` returns exactly five items and that `skip=5` correctly retrieves the second page without overlap. Also tested sorting by `title` and `created_at` in both ascending and descending orders.  
> **Testing:** All four tests in `test_notes.py` passed successfully.

c. Graphite Diamond generated code review
> Graphite confirmed that using a comparison such as `max(ids) < min(ids)` is an effective way to verify correct pagination displacement between pages.


## Brief Reflection 
a. The types of comments you typically made in your manual reviews (e.g., correctness, performance, security, naming, test gaps, API shape, UX, docs).
> In my manual reviews, I focused primarily on **correctness** (ensuring proper `404` responses for invalid IDs) and **environment stability**, such as fixing the Windows-specific `PermissionError`. I also paid attention to **API shape**, making sure that adding new features did not break the existing frontend-backend contract.

b. A comparison of **your** comments vs. **Graphite’s** AI-generated comments for each PR.
> My comments tended to be more **context-aware**, especially regarding the local development environment (for example Windows-specific issues and missing directories). In contrast, Graphite's comments were more **standard-focused**, emphasizing Python best practices, naming conventions, and structural optimizations that I sometimes overlooked while focusing on functionality.

c. When the AI reviews were better/worse than yours (cite specific examples)
> **Better:** Graphite suggested using `re.compile` in Task 2, which improves regex performance and maintainability.  
> **Worse:** Graphite did not detect the Windows-specific `PermissionError` that prevented tests from running locally. This issue had to be manually diagnosed and fixed in the `dispose()` logic in `conftest.py`.

d. Your comfort level trusting AI reviews going forward and any heuristics for when to rely on them.
> I am fairly comfortable trusting AI reviews for **syntax issues, security patterns, and boilerplate optimizations**. However, I would avoid relying on them for **complex architectural decisions or environment-specific debugging**. My general heuristic is to use AI to catch small mistakes and improve code quality, but always perform a **manual sanity check** for core business logic and environment stability.