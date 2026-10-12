from process_gemini import query_gemini

while True:
    prompt = input("\n>> ")

    stream = query_gemini(prompt, True)

    for token in stream:
        print(token, end="", flush=True)
