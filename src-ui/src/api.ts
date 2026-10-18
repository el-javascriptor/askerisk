import type { DataBundle } from "./helpers/definitions";

const API_ENDPOINT = "http://localhost:5000"

export function streamGenResponse(prompt: string, useOllama: boolean, clear: boolean, updateByBundle: (bundle: DataBundle) => void, onFinish: Function) {

    // filter prompt, create random id, send to eventSource
    const filtered_prompt = encodeURIComponent(prompt);
    const id = Math.random();
    const full_url = `${API_ENDPOINT}/api/gen-${useOllama ? "ollama" : "gemini"}-response?n=${id}&prompt=${filtered_prompt}&clear_history=${clear}`;
    const eventSource = new EventSource(full_url);

    // each time we recieve a token
    eventSource.onmessage = (event) => {

        try {
            const data: DataBundle = JSON.parse(event.data);

            updateByBundle(data);

            if (data.type == "event") {

                if (data.status == "success") {
                    eventSource.close();
                    onFinish(true);
                    return;
                } else {
                    console.log(`Error: ${data.status}`);
                    eventSource.close();
                    onFinish(false);
                }
            }

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
