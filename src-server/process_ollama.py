from helpers.custom_types import History, ToolBundle
from helpers.prepare import MODEL_NAME, TOOLSET_JSON
from helpers.tools import Tool
from helpers.custom_types import ObjectTokenGenerator
from helpers.ollama_helpers import HistoryManager, process_chunk
import json
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

        token = process_chunk(chunk, collected_tool_calls)

        if token:
            yield token
            response_text += token["content"]

    HistoryManager.appendAssistantMessageToHistory(history, response_text)

    # if there is a tool call present, call the tool, then generate new response.
    for tool in collected_tool_calls:

        interaction_tool = Tool.ollama_tool_to_interaction(tool)

        result = Tool.run_tool(interaction_tool)

        tool_bundle: ToolBundle = {
            "type": "tool",
            "name": tool.function.name,
            "arguments": json.dumps(tool.function.arguments),
            "result": result
        }

        yield tool_bundle

        # create tool response
        HistoryManager.appendToolMessageToHistory(history, tool.function.name, result)

    if collected_tool_calls: yield from gen_response(history)
