from helpers.custom_types import History, Message, Role
from helpers.prepare import MODEL_NAME, TOOLSET_JSON
from helpers.tools import Tool
from collections.abc import Generator
from helpers.custom_types import Data, ObjectTokenGenerator
import ollama

# takes in History, returns updated History
def gen_response(history: History) -> ObjectTokenGenerator:
    
    # generate response
    response_stream = ollama.chat(model=MODEL_NAME, messages=history, tools=TOOLSET_JSON, stream=True)
    
    # since we're streaming, we need to collect tool calls for the end
    collected_tool_calls = []
    response_text = ""

    # receive chunks from response stream, append to response text
    for chunk in response_stream:
        if chunk.message.content:
            response_text += chunk.message.content
            
            object_token: Data = {
                "content": chunk.message.content,
                "tool": False,
                "tool_data": None
            }

            yield object_token

        # if there's a tool call, we add to the tool calls.
        if chunk.message.tool_calls:
            collected_tool_calls.extend(chunk.message.tool_calls)

    # create new message
    new_message: Message = {
        "role": "assistant",
        "content": response_text
    }

    # append to history
    history.append(new_message)
    
    # if there is a tool call present, call the tool, then generate new response.
    for tool in collected_tool_calls:
        if tool.function.name == "run_command":
            
            tool_data: Data = {
                "content": f"<tool>RunCommand({tool.function.arguments['command']})</tool>",
                "tool_data": None,
                "tool": False,
            }

            yield tool_data

            # run command
            result = Tool.run_command(tool.function.arguments["command"])
            
            # create tool response
            tool_message: Message = {
                "role": "tool",
                "content": f"Command: {tool.function.arguments["command"]}\nResult: {result}"
            }

            # append to history
            history.append(tool_message)

    if collected_tool_calls: yield from gen_response(history)

def add_prompt_to_history(prompt: str, history: History, role: Role) -> History:
    new_message: Message = {
        "role": role,
        "content": prompt
    }

    history.append(new_message)
    return history

def boot_model():
    
    ollama.chat(model=MODEL_NAME, messages=[{"role": "user", "content": "Booting you up..."}], tools=TOOLSET_JSON, keep_alive="2m", options={"num_predict": 1})

    return True
