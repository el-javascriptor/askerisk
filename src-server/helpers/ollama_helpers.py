import ollama
from helpers.custom_types import Message, History, TokenBundle
from helpers.prepare import MODEL_NAME, TOOLSET_JSON

def process_chunk(chunk, collected_tool_calls) -> TokenBundle | None:

    if chunk.message.tool_calls:
        collected_tool_calls.extend(chunk.message.tool_calls)
    
    if chunk.message.content:

        object_token: TokenBundle = {
            "type": "token",
            "content": chunk.message.content
        }

        return object_token

class HistoryManager:

    @staticmethod
    def appendAssistantMessageToHistory(history: History, message: str):

        new_message: Message = {
            "role": "assistant",
            "content": message
        }

        history.append(new_message)

    @staticmethod
    def appendToolMessageToHistory(history: History, tool_name: str, tool_result: str):
        
        tool_message: Message = {
            "role": "tool",
            "content": f"TOOL_RAN: {tool_name}\nRESULT: {tool_result}"
        }

        history.append(tool_message)

    @staticmethod
    def appendUserMessageToHistory(history: History, prompt: str):

        user_message: Message = {
            "role": "user",
            "content": prompt
        }

        history.append(user_message)

# currently unused, may be useful in the future
def boot_model():
    
    ollama.chat(model=MODEL_NAME, messages=[{"role": "user", "content": "Booting you up..."}], tools=TOOLSET_JSON, keep_alive="2m", options={"num_predict": 1})

    return True
