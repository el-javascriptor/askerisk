import ollama
import json
from .misc import load_instructions
from pathlib import Path

CURRENT_DIR = Path(__file__).parent
MODEL = "qwen2.5:7b"
MODEL_NAME = "askerisk"
TOOLSET_JSON = None
INSTRUCTIONS = load_instructions()

with open(CURRENT_DIR / "../resources/tools.json", "r") as file:
    TOOLSET_JSON = json.load(file)

ollama.create(from_=MODEL, model=MODEL_NAME, system=INSTRUCTIONS)

# response = ollama.chat(model=MODEL_NAME, messages=test_messages, tools=TOOLSET_JSON)
