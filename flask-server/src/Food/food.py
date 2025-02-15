import os

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
You are an expert nutritionist. Analyze the food items from the image and provide the nutritional value in the following format:

1. Item 1 - Nutritional value with Estimated Macro and Micro Nutrients 
2. Item 2 - Nutritional value with Estimated Macro and Micro Nutrients 
----
----
Tell me if this meal is good or bad for the user. Explain your reasoning.
"""

        image_disease_prompt = f"""
You are an expert nutritionist. Analyze the food items from the image and provide the nutritional value in the following format:

1. Item 1 - Nutritional value with Estimated Macro and Micro Nutrients 
2. Item 2 - Nutritional value with Estimated Macro and Micro Nutrients 
----
----
Based on the nutritional value and the disease "{disease}", tell me if this meal is good or bad for the user. Explain your reasoning.
"""

        # Load API key
        load_dotenv()
        api_key = os.getenv("GOOGLE_API_KEY")
        genai.configure(api_key=api_key)

        model = genai.GenerativeModel(model_name="gemini-1.5-flash")

        # Select prompt based on disease input
        response = model.generate_content([image, image_disease_prompt if disease else image_prompt])

        return {"report": response.text}