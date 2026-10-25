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

try:
    ollama.create(from_=MODEL, model=MODEL_NAME, system=INSTRUCTIONS)
except Exception as e:
    print(f"Could not load Ollama model (ollama is likely not running. Gemini is available, but /mode ollama will not be available for this session). Error: {e}")
# response = ollama.chat(model=MODEL_NAME, messages=test_messages, tools=TOOLSET_JSON)
