import ollama
from fastapi import FastAPI, Request

app = FastAPI()

@app.post("/generate_comments")
async def generate_comments(request: Request):
    data = await request.json()
    code_snippet = data["code"]

    # Generate a comment using Ollama directly
    prompt = f"Here is a function:\n{code_snippet}\n\nProvide a small comment for it."
    response = ollama.chat(model="codellama:7b", messages=[{"role": "user", "content": prompt}])
    
    return {"comment": response["message"]["content"]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
