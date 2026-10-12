from flask import Flask, request, Response
from flask_cors import CORS
from main import stream_response

# initialize as CORS server
app = Flask(__name__)
CORS(app)


# Generate a response from Google Gemini
@app.route('/api/gen-gemini-response', methods=['GET'])
def gen_gemini_response() -> Response:
    
    prompt = request.args.get("prompt", "")
    clear  = True if request.args.get("clear_history") == "true" else False
    stream = stream_response(prompt, 'gemini', clear)

    return Response(stream, mimetype="text/event-stream")


# Generate a response from Ollama
@app.route('/api/gen-ollama-response', methods=['GET'])
def gen_ollama_response() -> Response:
    
    prompt = request.args.get("prompt", "")
    clear  = True if request.args.get("clear_history") == "true" else False
    stream = stream_response(prompt, 'ollama', clear)

    return Response(stream, mimetype="text/event-stream")


if __name__ == "__main__":
    app.run(debug=True, port=5000)
