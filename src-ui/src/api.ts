const API_ENDPOINT = "http://localhost:5000"

export function streamGenResponse(prompt: string, useOllama: boolean, clear: boolean, updateByToken: (string) => void, onFinish: Function) {

    // filter prompt, create random id, send to eventSource
    const filtered_prompt = encodeURIComponent(prompt);
    const id = Math.random();
    const full_url = `${API_ENDPOINT}/api/gen-${useOllama ? "ollama" : "gemini"}-response?n=${id}&prompt=${filtered_prompt}&clear_history=${clear}`;
    const eventSource = new EventSource(full_url);

    // each time we recieve a token
    eventSource.onmessage = (event) => {

        if (event.data == "[DONE]") {
            eventSource.close();
            onFinish(true);
            return;
        }
        try {
            const data = JSON.parse(event.data);

            // tools will processed later
            updateByToken(data.content);
        } catch (error) {
            alert(`Parse Error: ${error}`)
            eventSource.close();
            onFinish(false);
        }
    }

    eventSource.onerror = (error) => {
        console.log(`Error: ${JSON.stringify(error)}`);
        onFinish(false);
    }
}
