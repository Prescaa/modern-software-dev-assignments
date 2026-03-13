# Week 2 Write-up
Tip: To preview this markdown file
- On Mac, press `Command (⌘) + Shift + V`
- On Windows/Linux, press `Ctrl + Shift + V`

## INSTRUCTIONS

Fill out all of the `TODO`s in this file.

## SUBMISSION DETAILS

Name: **Dika**
SUNet ID: **2310817210023
Citations: **Cursor AI (Claude 3.5 Sonnet), Ollama (TinyLlama model).**

This assignment took me about **3* hours to do. 


## YOUR RESPONSES
For each exercise, please include what prompts you used to generate the answer, in addition to the location of the generated response. Make sure to clearly add comments in your code documenting which parts are generated.

### Exercise 1: Scaffold a New Feature
Prompt: 
```text
Create a new function extract_action_items_llm(text: str) -> List[str] using ollama.chat. Use the 'tinyllama' model to extract action items from the input text and return them as a JSON array of strings. Ensure the prompt to the LLM is clear about only returning the list without extra explanation.
TODO
``` 

Generated Code Snippets:
File: week2/app/services/extract.py
Lines: 45 - 85 (Implemented function: extract_action_items_llm)
TODO: List all modified code files with the relevant line numbers.
```

### Exercise 2: Add Unit Tests
Prompt: 
Write comprehensive unit tests for the extract_action_items_llm function in week2/tests/test_extract.py using pytest. Please use @patch('ollama.generate') to mock the Ollama response so the tests run instantly without calling a real model. Cover empty input, bullet points, and keyword prefixes.
TODO
``` 

Generated Code Snippets:
File: week2/tests/test_extract.py
Lines: Entire file (Successfully passed 6 test cases using mocking).
TODO: List all modified code files with the relevant line numbers.
```

### Exercise 3: Refactor Existing Code for Clarity
Prompt: 
I need to complete TODO 3 and TODO 4. Please refactor the backend: Implement Pydantic schemas in week2/app/main.py for API contracts, clean up the database logic in week2/app/db.py, and add robust try-except error handling.
TODO
``` 

Generated/Modified Code Snippets:
File: week2/app/main.py (Lines 15-40: Added Pydantic schemas for request/response)
File: week2/app/db.py (Lines 30-90: Cleaned up CRUD functions and row_factory usage)

TODO: List all modified code files with the relevant line numbers. (We anticipate there may be multiple scattered changes here – just produce as comprehensive of a list as you can.)
```


### Exercise 4: Use Agentic Mode to Automate a Small Task
Prompt: 
Add two new endpoints: POST /extract-llm and GET /notes. Then, update the frontend (index.html) to include 'Extract LLM' and 'List Notes' buttons. Connect them to the new endpoints so the results appear in the list dynamically.
TODO
``` 

Generated Code Snippets:
File: week2/app/main.py (Lines 50-70: Implemented new FastAPI routes)
File: week2/app/frontend/index.html (Lines 35-125: Added UI buttons and JavaScript fetch handlers)
TODO: List all modified code files with the relevant line numbers.
```


### Exercise 5: Generate a README from the Codebase
Prompt: 
@Codebase Analyze the current week2 folder and generate a professional README.md. Include a project overview, setup instructions (Conda & Poetry), API endpoint descriptions, and instructions for running the test suite.
TODO
``` 

Generated Code Snippets:
File: week2/README.md
Lines: Entire file (Generated documentation based on project structure).
TODO: List all modified code files with the relevant line numbers.
```


## SUBMISSION INSTRUCTIONS
1. Hit a `Command (⌘) + F` (or `Ctrl + F`) to find any remaining `TODO`s in this file. If no results are found, congratulations – you've completed all required fields. 
2. Make sure you have all changes pushed to your remote repository for grading.
3. Submit via Gradescope. 