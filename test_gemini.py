import requests
import os
import json
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "backend", ".env"))
api_key = os.getenv('GEMINI_API_KEY')

url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"

prompt = "Hello"
payload = {
    "contents": [{
        "parts": [{"text": prompt}]
    }],
    "generationConfig": {
        "temperature": 0.2,
        "responseMimeType": "application/json"
    }
}
headers = {"Content-Type": "application/json"}

print("Sending request to:", url.split("key=")[0] + "key=HIDDEN")
response = requests.post(url, headers=headers, json=payload)
print(f"Status: {response.status_code}")
try:
    print("Response JSON:")
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    print("Failed to parse JSON")
    print("Response text:")
    print(response.text)
