import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()


class food_report_generator:
    def report(self, image_bytes, disease):
        def input_file(uploaded_file=None):
            if uploaded_file:
                # Convert BytesIO to raw bytes
                bytes_data = uploaded_file.getvalue()
                image_parts = {
                    "mime_type": "image/jpeg",  # Assuming JPEG format, modify if needed
                    "data": bytes_data,
                }
                return image_parts
            return None

        # Convert BytesIO image to required format
        image = input_file(uploaded_file=image_bytes)

        if not image:
            return {"error": "Invalid image data"}

        # Generate prompt based on disease presence
        image_prompt = """
        

You are an expert nutritionist. Analyze the food items from the image and provide the nutritional value in the following strict JSON format, ensuring each food item has its own breakdown:

Meal Format:

{
    "meal": [
      {
        "item": "Item Name",
        "nutritional_value": {
          "macros": {
            "carbohydrates": "Value",
            "fat": "Value",
            "protein": "Value"
          },
          "micronutrients": {
            "vitamin_a": "Value",
            "vitamin_b6": "Value",
            "vitamin_c": "Value",
            "vitamin_k": "Value",
            "iron": "Value",
            "calcium": "Value",
            "magnesium": "Value",
            "potassium": "Value"
          }
        }
      },
      {
        "item": "Next Item Name",
        "nutritional_value": {
          "macros": {
            "carbohydrates": "Value",
            "fat": "Value",
            "protein": "Value"
          },
          "micronutrients": {
            "vitamin_a": "Value",
            "vitamin_b6": "Value",
            "vitamin_c": "Value",
            "vitamin_k": "Value",
            "iron": "Value",
            "calcium": "Value",
            "magnesium": "Value",
            "potassium": "Value"
          }
        }
      }
    ],
    "meal_assessment": {
      "overall": "good/bad",
      "reasoning": "A detailed explanation based on overall nutritional value, highlighting benefits and concerns."
    }
  }


Guidelines:

List every food item separately in the meal array, each with its own macro and micronutrient values.
Ensure strictly valid JSON output with no extra text, explanations, or formatting outside JSON.
Follow the structure precisely without modifications.
If a nutrient is missing, omit the key instead of leaving it blank.
Assess whether the meal is "good" or "bad" for the meal’s nutritional balance and explain the reasoning concisely.
DO NOT include extra text like "Here's your JSON response". Return only the raw JSON output.


"""

        image_disease_prompt = """
You are an expert nutritionist. Analyze the food items from the image and provide the nutritional value in the following strict JSON format, ensuring each food item has its own breakdown:

Meal Format:

{
    "meal": [
      {
        "item": "Item Name",
        "nutritional_value": {
          "macros": {
            "carbohydrates": "Value",
            "fat": "Value",
            "protein": "Value"
          },
          "micronutrients": {
            "vitamin_a": "Value",
            "vitamin_b6": "Value",
            "vitamin_c": "Value",
            "vitamin_k": "Value",
            "iron": "Value",
            "calcium": "Value",
            "magnesium": "Value",
            "potassium": "Value"
          }
        }
      },
      {
        "item": "Next Item Name",
        "nutritional_value": {
          "macros": {
            "carbohydrates": "Value",
            "fat": "Value",
            "protein": "Value"
          },
          "micronutrients": {
            "vitamin_a": "Value",
            "vitamin_b6": "Value",
            "vitamin_c": "Value",
            "vitamin_k": "Value",
            "iron": "Value",
            "calcium": "Value",
            "magnesium": "Value",
            "potassium": "Value"
          }
        }
      }
    ],
    "meal_assessment": {
      "overall": "good/bad",
      "reasoning": "Detailed explanation based on the given disease {disease}, highlighting benefits and concerns."
    }
}

Guidelines:

List every food item separately in the meal array, each with its own macro and micronutrient values.
Ensure strictly valid JSON output with no extra text, explanations, or formatting outside JSON.
Follow the structure precisely without modifications.
If a nutrient is missing, omit the key instead of leaving it blank.
Assess whether the meal is "good" or "bad" for the given disease {disease} and explain the reasoning concisely.
DO NOT include extra text like "Here's your JSON response". Return only the raw JSON output.
"""

        # Load API key
        load_dotenv()
        api_key = os.getenv("GOOGLE_API_KEY")
        genai.configure(api_key=api_key)

        model = genai.GenerativeModel(model_name="gemini-1.5-flash")
        

        # Select prompt based on disease input
        response = model.generate_content([image, image_disease_prompt if disease else image_prompt])
        
        # Extract text response
        response_text = response.text

        # Clean and parse JSON response
        response_text = response_text.replace("```json", "").replace("```", "").strip()

        try:
            json_response = json.loads(response_text)  # Convert string to JSON
            return {"report": json_response}
        except json.JSONDecodeError:
            return {"error": "Failed to parse JSON", "raw_response": response_text}
