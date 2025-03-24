import requests

url = "http://127.0.0.1:8000/generate_comments"
data = {"code": "def add(a,b): return a+b"}

response = requests.post(url, json=data)
print(response.json())
