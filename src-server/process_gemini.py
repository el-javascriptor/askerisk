from google import genai
from helpers.tools import Tool
from helpers.misc import load_instructions
from helpers.custom_types import ObjectTokenGenerator, Data, InteractionToolCall, ToolMessage
from helpers.gemini_helpers import process_interaction_event
from dotenv import load_dotenv
from google.genai.interactions import StepParam # type: ignore
from typing import List

GEMINI_MODEL="gemini-3.5-flash-lite"

load_dotenv()

client = genai.Client()
interaction_id = None
ollama_tools = None
system_instructions = load_instructions()
tools = Tool.gemini_format(Tool.get_tools())

def query_gemini(prompt: str | List[StepParam] | List[ToolMessage], clear_history: bool) -> ObjectTokenGenerator:

    global interaction_id

    if clear_history:
        interaction_id = None
    
    # function calling stuff
    tool_info: InteractionToolCall = {
        'tool_arguments': '',
        'tool_call_id': None,
        'tool_called': None
    }

    interaction = client.interactions.create(model=GEMINI_MODEL, input=prompt, system_instruction=system_instructions, previous_interaction_id=interaction_id, stream=True, tools=tools)

    for event in interaction:

        if isinstance(event, tuple): continue

        # FIXME: This needs to return the InteractionProcessResult type
        token = process_interaction_event(event, tool_info)

        if token != None:

            object_token: Data = {
                "content": token,
                "tool": False,
                "tool_data": None
            }

            yield object_token

        if event.event_type == "interaction.created":
            interaction_id = event.interaction.id

    if tool_info['tool_call_id']:
        result = Tool.run_tool(tool_info)

        yield from query_gemini([Tool.create_tool_message(tool_info, result)], False)
