# import os
# import json
# import google.generativeai as genai
# from dotenv import load_dotenv

# load_dotenv()


# class food_report_generator:
#     def report(self, image_bytes, disease):
#         def input_file(uploaded_file=None):
#             if uploaded_file:
#                 # Convert BytesIO to raw bytes
#                 bytes_data = uploaded_file.getvalue()
#                 image_parts = {
#                     "mime_type": "image/jpeg",  # Assuming JPEG format, modify if needed
#                     "data": bytes_data,
#                 }
#                 return image_parts
#             return None

#         # Convert BytesIO image to required format
#         image = input_file(uploaded_file=image_bytes)

#         if not image:
#             return {"error": "Invalid image data"}

#         # Generate prompt based on disease presence
#         image_prompt = """
        
#     Make sure the response is **only** valid JSON, without explanations or formatting outside JSON. Do **not** include extra text like 'Here's your JSON data:'. Just return the raw JSON.

# You are an expert nutritionist. Analyze the food items from the image and provide the nutritional value in the following format. Create a JSON format so that it can be modified in designing, and keep it brief:

# 1. Item 1 - Nutritional value with Estimated Macro and Micro Nutrients 
# 2. Item 2 - Nutritional value with Estimated Macro and Micro Nutrients 
# ----
# ----
# Tell me if this meal is good or bad for the user. Explain your reasoning.



# """

#         image_disease_prompt = f"""
# You are an expert nutritionist. Analyze the food items from the image and provide the nutritional value in the following format:

# 1. Item 1 - Nutritional value with Estimated Macro and Micro Nutrients 
# 2. Item 2 - Nutritional value with Estimated Macro and Micro Nutrients 
# ----
# ----
# Based on the nutritional value and the disease "{disease}", tell me if this meal is good or bad for the user. Explain your reasoning.
# """

#         # Load API key
#         load_dotenv()
#         api_key = os.getenv("GOOGLE_API_KEY")
#         genai.configure(api_key=api_key)

#         model = genai.GenerativeModel(model_name="gemini-1.5-flash")
        

#         # Select prompt based on disease input
#         response = model.generate_content([image, image_disease_prompt if disease else image_prompt])
#         response = response.text
#         if "```json" in response:
#             response = response.replace("```json","")
#         if "```" in response:
#             response = response.replace("```","")

#         return {"report": response.text}
    
    
    
    





import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()


class food_report_generator:
    def report(self, image_bytes, disease):
        def input_file(uploaded_file=None):
            if uploaded_file:
                bytes_data = uploaded_file.getvalue()
                image_parts = {
                    "mime_type": "image/jpeg",  # Modify if needed
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
        You are an expert nutritionist. Analyze the food items from the image and provide the nutritional value in structured JSON format. 
        The output must be a valid JSON object with no additional text, markdown, or explanations. Follow this format:

        {
          "meal": [
            {
              "item": "Item Name",
              "serving_size": "Serving Size",
              "nutrients": {
                "calories": "Value",
                "protein": "Value",
                "carbohydrates": "Value",
                "fat": "Value",
                "fiber": "Value",
                "vitamin_a": "Value",
                "vitamin_c": "Value",
                "potassium": "Value"
              }
            }
          ],
          "analysis": "Summary of the meal's health benefits and concerns."
        }

        Strictly ensure that the response is ONLY valid JSON, without additional text, explanations, or formatting.
        """

        image_disease_prompt = f"""
        You are an expert nutritionist. Analyze the food items from the image and provide the nutritional value in structured JSON format. 
        Then, based on the nutritional value and the disease "{disease}", tell me if this meal is good or bad for the user and explain your reasoning.
        """

        # Load API key
        api_key = os.getenv("GOOGLE_API_KEY")
        genai.configure(api_key=api_key)

        model = genai.GenerativeModel(model_name="gemini-1.5-flash")

        # Select prompt based on disease input
        selected_prompt = image_disease_prompt if disease else image_prompt
        response = model.generate_content([image, selected_prompt])

        # Fix response formatting
        response_text = response if isinstance(response, str) else response.candidates[0].content
        response_text = response_text.replace("```json", "").replace("```", "").strip()

        try:
            return json.loads(response_text)  # Convert JSON string to a Python dictionary
        except json.JSONDecodeError:
            return {"error": "Invalid JSON format received from AI"}

