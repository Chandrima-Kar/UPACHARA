from flask import jsonify
from psycopg2.extras import RealDictCursor
import joblib
import os

# Get the directory of the current script
current_dir = os.path.dirname(os.path.abspath(__file__))

# Construct paths to the .pkl files
MODEL_PATH = os.path.join(current_dir, "disease_specialization_model.pkl")
VECTORIZER_PATH = os.path.join(current_dir, "tfidf_vectorizer.pkl")

if not os.path.exists(MODEL_PATH) or not os.path.exists(VECTORIZER_PATH):
    raise FileNotFoundError("Model or vectorizer file not found. Please train the model first.")

model = joblib.load(MODEL_PATH)
vectorizer = joblib.load(VECTORIZER_PATH)

# Endpoint to recommend doctors based on predicted disease
def recommend_doctors(predicted_disease, conn):
    try:
        # Vectorize the input disease name
        disease_vectorized = vectorizer.transform([predicted_disease])
        # Predict the specialization
        predicted_specialization = model.predict(disease_vectorized)[0]
        # Get the model's confidence score
        confidence_score = model.predict_proba(disease_vectorized).max()
    except Exception as e:
        return jsonify({"error": f"Error in predicting specialization: {str(e)}"}), 500

    # Fallback to "General Physician" if confidence is low
    if confidence_score < 0.5:  # Adjust threshold as needed
        predicted_specialization = "General Physician"

    # Fetch doctors with the predicted specialization from the database
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    try:
        cursor.execute(
            """
            SELECT id, first_name, last_name, specialization, experience_years, phone, address, image_url
            FROM doctors
            WHERE specialization = %s
            ORDER BY experience_years DESC
            LIMIT 5
            """,
            (predicted_specialization,),
        )
        doctors = cursor.fetchall()
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

    if not doctors:
        return jsonify({"message": "No doctors found for the given specialization"}), 404

    return jsonify({
        "doctors": doctors,
        "predicted_specialization": predicted_specialization,
        "confidence_score": float(confidence_score),
    }), 200