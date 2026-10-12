from typing import TypedDict, Literal, Dict, Any
from collections.abc import Generator

Role = Literal["user", "assistant", "system", "tool"]

# represents a single message
class Message(TypedDict):
    role: Role
    content: str

class ToolData(TypedDict):
    name: str
    arguments: Dict[str, Any]

class Data(TypedDict):
    content: str
    tool: bool
    tool_data: ToolData | None

class ToolMessage(TypedDict):
    type: str
    name: str
    call_id: str
    result: str

# import types
History = list[Message]

TokenGenerator = Generator[str, None, None]
ObjectTokenGenerator = Generator[Data, None, None]

ModelStreamOption = Literal['gemini', 'ollama']

class InteractionToolCall(TypedDict):
    tool_called: str | None
    tool_arguments: str
    tool_call_id: str | None

class WebResult(TypedDict):
    title: str
    url: str
    body: str

