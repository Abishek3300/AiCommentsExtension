import faiss
import os
from langchain_ollama import OllamaEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.schema import Document

class CodeRAG:
    def __init__(self):
        """Initialize FAISS with Ollama embeddings"""
        self.embeddings = OllamaEmbeddings(model="codellama:7b")  # ✅ Use CodeLlama
        self.vectorstore = None
        self.load_or_create_faiss_db()  # ✅ Properly load/create FAISS

    def load_or_create_faiss_db(self):
        """Load FAISS DB if exists, else create an empty one when adding first snippet"""
        if os.path.exists("faiss_db"):
            print("[INFO] Loading existing FAISS DB...")
            self.vectorstore = FAISS.load_local("faiss_db", self.embeddings, allow_dangerous_deserialization=True)
        else:
            print("[INFO] FAISS DB will be created when adding code snippets.")

    def add_code_snippets(self, code_snippets):
        """Adds code snippets to FAISS database"""
        documents = [Document(page_content=snippet) for snippet in code_snippets]

        if self.vectorstore is None:
            print("[INFO] Creating new FAISS DB...")
            self.vectorstore = FAISS.from_documents(documents, self.embeddings)
        else:
            self.vectorstore.add_documents(documents)

        self.vectorstore.save_local("faiss_db")
        print(f"[INFO] Added {len(code_snippets)} code snippets to FAISS DB.")

    def search_similar_code(self, query, k=1):
        """Searches for similar code in FAISS"""
        if self.vectorstore is None:
            print("[ERROR] FAISS DB is empty. Add code snippets first.")
            return []
        results = self.vectorstore.similarity_search(query, k=k)
        return [doc.page_content for doc in results]

if __name__ == "__main__":
    rag = CodeRAG()

    # Sample code snippets to store in FAISS
    sample_snippets = [
        "def add(a, b): return a + b",
        "def multiply(x, y): return x * y"
    ]

    rag.add_code_snippets(sample_snippets)
    print("[INFO] Searching for similar code...")
    print(rag.search_similar_code("def sum_numbers(a, b): return a + b"))
