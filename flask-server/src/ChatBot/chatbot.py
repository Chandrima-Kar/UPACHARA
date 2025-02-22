from flask import request, jsonify
import requests
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Get the Gemini API key from environment variable
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=" + GOOGLE_API_KEY

def get_gemini_response(question, chat_history):
    """Send user question and chat history to Gemini API and return the response."""
    payload = {
        "contents": [{
            "role": "user",
            "parts": [{"text": question}]
        }]
    }
    
    # Adding chat history to maintain conversation context
    for chat in chat_history:
        payload["contents"].insert(0, {
            "role": chat["role"],
            "parts": [{"text": chat["message"]}]
        })
    
    response = requests.post(GEMINI_API_URL, json=payload)
    response_json = response.json()
    
    if "candidates" in response_json:
        return response_json["candidates"][0]["content"]["parts"][0]["text"]
    else:
        return "Sorry, I couldn't generate a response."