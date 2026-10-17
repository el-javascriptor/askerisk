from helpers.custom_types import EventBundle, TokenGenerator, ModelStreamOption, History 
from process_gemini import query_gemini
from process_ollama import gen_response, add_prompt_to_history
import json

# the global history object
# this stores the past Ollama (not Gemini) chats
history: History = []

def stream_response(prompt: str, model: ModelStreamOption, clear_history: bool) -> TokenGenerator:
    
    global history
    stream = None

    if clear_history:
        history = []

    # we initialize the stream based on which model we are running
    if model == 'gemini':
        stream = query_gemini(prompt, clear_history)
    else:
        history = add_prompt_to_history(prompt, history, 'user')
        stream = gen_response(history)

    # one `token` is one Data object.
    for token in stream:

        token_str = json.dumps(token)
        yield f"data: {token_str}\n\n"

    # let's the front end know that the stream has completed.
    done_flag: EventBundle = { "type": "event", "status": "success", "content": "done"}
    yield f"data: {json.dumps(done_flag)}\n\n"
