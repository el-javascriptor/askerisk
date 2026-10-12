from pathlib import Path

CURRENT_DIR = Path(__file__).parent

def load_instructions():
    system_instructions = ""

    with open(CURRENT_DIR / "../resources/instructions.md", "r") as file:
        for line in file:
            system_instructions += line

    return system_instructions
