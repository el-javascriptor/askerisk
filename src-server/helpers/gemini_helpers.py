from typing import TypedDict
from .tools import Tool
from .custom_types import InteractionProcessResult, InteractionToolCallEnded, InteractionToken

class InteractionToolCall(TypedDict):
    tool_called: str | None
    tool_arguments: str
    tool_call_id: str | None

def process_interaction_event(event, tool_info: InteractionToolCall) -> InteractionProcessResult:

    if event.event_type == "step.start":
        if event.step.type == "function_call":
            tool_info['tool_called'] = event.step.name
            tool_info['tool_call_id'] = event.step.id

            # return f"<tool>{Tool.make_display_name(event.step.name)}()</tool>"

    if event.event_type == "step.stop":
        return { "event": "tool_call_ended" }


    elif event.event_type == "step.delta":
        if event.delta.type == "text":
            return { "event": "token", "content": event.delta.text }
        
        elif event.delta.type == "arguments_delta":

            if event.delta.arguments: tool_info['tool_arguments'] += event.delta.arguments

    return { "event": "skip" }
