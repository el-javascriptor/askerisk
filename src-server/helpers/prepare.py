import ollama
import json

MODEL = "qwen2.5:7b"
MODEL_NAME = "askerisk"
TOOLSET_JSON = None
INSTRUCTIONS = ""

with open("resources/tools.json", "r") as file:
    TOOLSET_JSON = json.load(file)

with open("resources/instructions.md", "r") as file:
    for line in file:
        INSTRUCTIONS += line + "\n"

ollama.create(from_=MODEL, model=MODEL_NAME, system=INSTRUCTIONS)

# response = ollama.chat(model=MODEL_NAME, messages=test_messages, tools=TOOLSET_JSON)
