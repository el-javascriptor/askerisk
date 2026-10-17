from typing import TypedDict, Literal, Dict, Any
from collections.abc import Generator

Role = Literal["user", "assistant", "system", "tool"]
Status = Literal["success", "error"]

# represents a single message
class Message(TypedDict):
    role: Role
    content: str

class ToolData(TypedDict):
    name: str
    arguments: Dict[str, Any]

# FIXME: Deprecated
class Data(TypedDict):
    content: str
    tool: bool
    tool_data: ToolData | None

class ToolMessage(TypedDict):
    type: str
    name: str
    call_id: str
    result: str

# the following types refer to the types of data passed
# between the different modules, and eventually from the server to
# the front end. This is the new CJF format.

# INFO: Tool microtype (tool calls, and thoughts)
class ToolBundle(TypedDict):
    type: Literal["tool"]
    name: str
    result: str

# INFO: Event microtype (success, failure)
class EventBundle(TypedDict):
    type: Literal["event"]
    status: Status
    content: str | None

# INFO: Token microtype (may contain more than one token)
class TokenBundle(TypedDict):
    type: Literal["token"]
    content: str

type DataBundle = ToolBundle | EventBundle | TokenBundle

# import types
History = list[Message]

TokenGenerator = Generator[str, None, None]
ObjectTokenGenerator = Generator[DataBundle, None, None]

ModelStreamOption = Literal['gemini', 'ollama']

class InteractionToolCall(TypedDict):
    tool_called: str | None
    tool_arguments: str
    tool_call_id: str | None

class WebResult(TypedDict):
    title: str
    url: str
    body: str

