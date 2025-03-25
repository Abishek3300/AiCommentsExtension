import ollama
from fastapi import FastAPI, Request

app = FastAPI()

@app.post("/generate_comments")
async def generate_comments(request: Request):
    data = await request.json()
    code_snippet = data["code"]

    # Generate a comment using Ollama directly
    #prompt = f"Here is a function:\n{code_snippet}\n\n generate a short, to-the-point comment within 7-10 words"

    prompt = f"""
You are an AI that provides concise, meaningful comments for Python code. 
For each line of the given function, generate a short, to-the-point comment (7-10 words max).
Place each comment **above** the corresponding line.

Example:
Input:
X, y = data.data, data.target

Output:
# Extract features and labels
X, y = data.data, data.target

Here is the function:
{code_snippet}

Provide the output in the same format.
"""
    prompt = f"""
    You are an AI that provides concise, meaningful comments for Python code. 
    For each line of the given function, generate a short, to-the-point comment (7-10 words max).
    Place each comment **above** the corresponding line without extra formatting.

    Here is the function:
    {code_snippet}

    Provide the commented version of the code.
    """




    response = ollama.chat(model="codellama:7b", messages=[{"role": "user", "content": prompt}])
    
    return {"comment": response["message"]["content"]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
