import os

import jwt
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
SECRET_KEY = os.getenv("JWT_SECRET", "your-secret-key")

def get_patient_id_from_token(token):
    
    try:
        if not token:
            raise ValueError("Missing Authorization token")
        
        if token.startswith("Bearer "):
            token = token.split(" ")[1]

        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])

        patient_id = decoded_token.get("id")  

        if not patient_id:
            raise ValueError("Token does not contain patient ID")

        return patient_id

    except ExpiredSignatureError:
        raise ValueError("Token has expired. Please log in again.")

    except InvalidTokenError:
        raise ValueError("Invalid token. Authentication failed.")
