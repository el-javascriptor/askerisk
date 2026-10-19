from helpers.custom_types import EventBundle, TokenGenerator, ModelStreamOption, History 
from process_gemini import query_gemini
from process_ollama import gen_response
from helpers.ollama_helpers import HistoryManager
import json

# the global history object
# this stores the past Ollama (not Gemini) chats
history: History = []

def stream_response(prompt: str, model: ModelStreamOption, clear_history: bool) -> TokenGenerator:
    
    global history
    stream = None

    if clear_history:
        history = []

    try:
        # we initialize the stream based on which model we are running
        if model == 'gemini':
            stream = query_gemini(prompt, clear_history)
        else:
            HistoryManager.appendUserMessageToHistory(history, prompt)
            stream = gen_response(history)

        # one `token` is one Data object.
        for token in stream:

            token_str = json.dumps(token)
            yield f"data: {token_str}\n\n"

        # let's the front end know that the stream has completed.
        done_flag: EventBundle = { "type": "event", "status": "success", "content": "done"}
        yield f"data: {json.dumps(done_flag)}\n\n"
    
    except Exception as e:
        error_flag: EventBundle = { "type": "event", "status": "error", "content": f"{e}"}
        yield f"data: {json.dumps(error_flag)}\n\n"

