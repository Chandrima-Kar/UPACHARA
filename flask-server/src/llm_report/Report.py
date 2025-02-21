import json
import os

import google.generativeai as genai
from dotenv import load_dotenv


class report_generator:

    def report(self,disease, area):
        prompt = f""" {disease} on {area} area, just give me a json file containing,
                name of disease, description, most likely cause of disease, Precautions we need to take, 
                Symptoms of that disease, diet we need to follow, affect of disease, 
                  remember to always give me output in json format and 
                make sure the key name is  consistant and values are in list format"""

        
        load_dotenv()
        api_key = os.getenv('GOOGLE_API_KEY')
        genai.configure(api_key=api_key) 
        model = genai.GenerativeModel(model_name="gemini-1.5-flash")
        response = model.generate_content([prompt])
        response = response.text

        if "```json" in response:
            response = response.replace("```json","")
        if "```" in response:
            response = response.replace("```","")

        pos = response.find("\n\n\n")
        response = response[:pos]

        with open("src/data/Content.json", "w") as f:
            f.writelines(response)
        with open("src/data/Content.json","r") as file:
            data = json.load(file)

        return data


    def insurance_report(self,insurance_price, user_data):
        prompt = f"""
                Given the following user details:
- Gender: {user_data['gender']}
- Age: {user_data['age']}
- City: {user_data['city']}
- Occupation: {user_data['occupation']}
- Smoking Status: {user_data['smoking_status']}
- Alcohol Consumption: {user_data['alcohol_consumption']}
- Education Level: {user_data['education_level']}
- Previous Claims: {user_data['previous_claims']}
- Past Disease History: {user_data['past_disease_history']}
- Family Disease History: {user_data['family_disease_history']}
- Income Level: {user_data['income_level']}

The calculated **insurance cost** is **${insurance_price} per year**.

Generate a structured JSON report with the **EXACT SAME KEY NAMES EVERY TIME**. The JSON **MUST** follow this format:

```json
{{
    "reportTitle": "Insurance Cost Report for User",
    "insuranceCost": {insurance_price},
    "costJustification": "Explain why the insurance amount is appropriate.",
    "factorsAffectingCost": [
        {{
            "factor": "Factor Name",
            "description": "How this factor affects the cost",
            "impact": "Low/Medium/High"
        }}
    ],
    "premiumReductionRecommendations": [
        {{
            "recommendation": "Recommendation Name",
            "description": "How this can reduce the insurance premium"
        }}
    ],
    "generalInsuranceAdvice": [
        "List of general insurance tips"
    ],
    "userDetails": {{
        "age": {user_data['age']},
        "gender": "{user_data['gender']}",
        "city": "{user_data['city']}",
        "occupation": "{user_data['occupation']}",
        "smokingStatus": "{user_data['smoking_status']}",
        "alcoholConsumption": "{user_data['alcohol_consumption']}",
        "educationLevel": "{user_data['education_level']}",
        "previousClaims": {user_data['previous_claims']},
        "pastDiseaseHistory": {user_data['past_disease_history']},
        "familyDiseaseHistory": {user_data['family_disease_history']},
        "incomeLevel": {user_data['income_level']}
    }}
}}
                """
        load_dotenv()
        api_key = os.getenv("GOOGLE_API_KEY")
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel(model_name="gemini-1.5-flash")
        response = model.generate_content([prompt])
        response = response.text


        response = response.replace("```json", "").replace("```", "").strip()

        try:
            insurance_report = json.loads(response)
        except json.JSONDecodeError:
            return {"error": "Failed to parse insurance report"}

        return insurance_report