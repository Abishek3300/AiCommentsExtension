import ollama
from fastapi import FastAPI, Request
from faiss_rag import CodeRAG

app = FastAPI()
rag = CodeRAG()

@app.post("/generate_comments")
async def generate_comments(request: Request):
    data = await request.json()
    code_snippet = data["code"]

    # Retrieve similar code using FAISS
    similar_code = rag.search_similar_code(code_snippet, k=1)
    retrieved_context = similar_code[0] if similar_code else ""

    # Generate a comment using Ollama
    prompt = f"Here is a function:\n{code_snippet}\n\nA similar function:\n{retrieved_context}\n\nProvide a concise comment for it."
    response = ollama.chat(model="codellama:7b", messages=[{"role": "user", "content": prompt}])
    
    return {"comment": response["message"]["content"]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)