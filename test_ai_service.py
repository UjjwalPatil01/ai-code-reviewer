import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), "backend"))
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "backend", ".env"))
api_key = os.getenv('GEMINI_API_KEY')
print("API Key available:", bool(api_key))

from backend.api.services.ai_service import generate_code_review

try:
    generate_code_review("print('Hello')", "python")
    print("Success!")
except Exception as e:
    import traceback
    traceback.print_exc()
