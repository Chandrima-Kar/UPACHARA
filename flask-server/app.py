import os
import sys
import psycopg2

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import text

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
os.environ['KMP_DUPLICATE_LIB_OK'] = 'TRUE'
import tensorflow as tf
from flask_cors import CORS, cross_origin
import warnings
import json
import pandas as pd
import logging
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
from datetime import datetime

import os
import asyncio
from flask import Flask, request, jsonify
warnings.filterwarnings("ignore", category=UserWarning, message="Trying to unpickle estimator")

tf.get_logger().setLevel(logging.ERROR)

from io import BytesIO
from src.exception import CustomException
from src.logger import logging as lg
from src.disease_prediction.disease_prediction import DiseasePrediction
from src.alternativedrug.AlternativeDrug import AlternateDrug
from src.Prediction.disease_predictions import ModelPipeline
from src.Insurance.insurance_calculator import calculate_insurance_price
from src.ImagePrediction.image_prediction import ImagePrediction
from src.DrugResponse.drugresponse import report_generator2
from src.llm_report.Report import report_generator
from src.Food.food import food_report_generator
#from src.ChatBot.chatbot import ingest_data,user_input
from src.ChatBot.chatbot import get_gemini_response
from src.recommendarticles.articles_recommendation import recommend_articles
from src.doctors_recommendation.doctors_recommendation import recommend_doctors
from utils.helper import get_patient_id_from_token
from psycopg2.extras import RealDictCursor

current_dir = os.path.abspath(os.path.dirname(__file__))
cors_origin = os.getenv("FLASK_CORS_ORIGIN", "*")
flask_postgres_connection = os.getenv("FLASK_POSTGRES_STRING","*")

app = Flask(__name__)
CORS(app, origins=[cors_origin], methods=["GET", "POST", "OPTIONS"])
app.config['SQLALCHEMY_DATABASE_URI'] = flask_postgres_connection
app.config['SECRET_KEY'] = 'healthmap'
db = SQLAlchemy(app)

class Patient(db.Model):
    __tablename__ = 'patients'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    date_of_birth = db.Column(db.Date, nullable=False)
    gender = db.Column(db.String(10))
    blood_group = db.Column(db.String(5))
    phone = db.Column(db.String(20))
    address = db.Column(db.Text)
    image_url = db.Column(db.Text)
    medical_history = db.Column(db.ARRAY(db.Text))
    emergency_contact = db.Column(db.String(100))
    emergency_phone = db.Column(db.String(20))
    created_at = db.Column(db.TIMESTAMP, default=db.func.current_timestamp())

class Disease(db.Model):
    __tablename__ = 'disease'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, unique=True)
    patient_id = db.Column(db.Integer, db.ForeignKey("patients.id"), nullable=False)
    symptoms = db.Column(db.ARRAY(db.String(30)), nullable=False)
    predicted_disease = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(200))
    precautions = db.Column(db.JSON)
    diet = db.Column(db.JSON)
    workout = db.Column(db.JSON)
    created_at = db.Column(db.TIMESTAMP, default=datetime.utcnow)

with app.app_context():
    Disease.__table__.create(db.engine, checkfirst=True)

# Function to get a database connection
def get_db_connection():
    conn = psycopg2.connect(flask_postgres_connection)
    return conn

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        token = request.headers.get("Authorization")  
        patient_id = get_patient_id_from_token(token)  

        if not patient_id:
            return jsonify({"error": "Invalid token or user not authenticated"}), 401

        symptoms_list = [
            data.get('symptom_1'), 
            data.get('symptom_2'), 
            data.get('symptom_3'), 
            data.get('symptom_4')
        ]
        symptoms_list = [s for s in symptoms_list if s]  

        model = DiseasePrediction()
        predicted_disease, dis_des, my_precautions, medications, rec_diet, rec_workout, _ = model.predict(symptoms_list)

        def convert_json(data):
            if isinstance(data, pd.Series):
                data = data.tolist()

            try:
                return json.loads(data) if isinstance(data, str) else data
            except json.JSONDecodeError:
                return []

        my_precautions = convert_json(my_precautions)
        medications = convert_json(medications)
        rec_diet = convert_json(rec_diet)
        rec_workout = convert_json(rec_workout)

        disease_entry = Disease(
            patient_id=patient_id,
            symptoms=symptoms_list,
            predicted_disease=predicted_disease,
            description=dis_des,
            precautions=my_precautions,
            diet=rec_diet,
            workout=rec_workout
        )
        db.session.add(disease_entry)
        db.session.commit()

        db.session.execute(
            text("""
                UPDATE patients
                SET medical_history = array_append(medical_history, :disease)
                WHERE id = :patient_id
                AND NOT (:disease = ANY(medical_history))  -- Avoid duplicates
            """),
            {"disease": predicted_disease, "patient_id": patient_id}
        )
        db.session.commit()

        return jsonify({
            'diseaseId': disease_entry.id,
            'predictedDisease': predicted_disease,
            'disDes': dis_des,
            'myPrecautions': my_precautions,
            'myDiet': rec_diet,
            'myWorkout': rec_workout
        }), 200

    except Exception as e:
        lg.error(f"Error in /predict route: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/drugs', methods=['POST'])
def drugs():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid request, JSON data required"}), 400
        llm = report_generator2()
        result = llm.report(data)

        return jsonify(result), 200

    except Exception as e:
        lg.error(f"Error in /drugres route: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/alternativedrug', methods=['GET', 'POST'])
def alternativedrug():
    try:
        alt = AlternateDrug()

        if request.method == 'POST':
            data = request.get_json()
            selected_medicine = data.get("name_of_medicine", "").strip()

            if not selected_medicine:
                return jsonify({"error": "Medicine name is required"}), 400

            recommendations = alt.recommendation(selected_medicine)
            return jsonify({"prediction_text": recommendations[0]})

        elif request.method == 'GET':
            medicines_data = alt.medi()
            return jsonify({"medicines": medicines_data})

    except Exception as e:
        lg.error(f"Error in /alternativedrug route: {e}")
        return jsonify({"error": "An internal server error occurred"}), 500

@app.route('/liver', methods=['POST'])
def liver():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON payload"}), 400

        processed_data = {}

        for k, v in data.items():
            if k == "gender":
                processed_data[k] = v
            else:
                try:
                    processed_data[k] = float(v)
                except ValueError:
                    return jsonify({"error": f"Invalid number format in field: {k}"}), 400

        if processed_data["gender"].lower() not in ["male", "female"]:
            return jsonify({"error": "Gender must be 'male' or 'female'"}), 400

        model = ModelPipeline()
        pred = model.liver_predict(processed_data)

        return jsonify({"result": pred})

    except Exception as e:
        lg.error(f"Error in /liver route: {e}")
        return jsonify({"error": str(e)}), 500



@app.route('/breast', methods=['GET', 'POST'])
def breast():
    try:
        if request.method == 'POST':
            to_predict_dict = request.form.to_dict()
            model = ModelPipeline()
            pred = model.breast_cancer_predict(to_predict_dict)
        #     return render_template("breast.html", prediction_text=pred)
        # else:
        #     return render_template("breast.html")
    except Exception as e:
        lg.error(f"Error in /breast route: {e}")
        raise CustomException(e, sys)

@app.route('/diabetes', methods=['POST'])
def diabetes():
    try:
        if request.method == 'POST':
            data = request.get_json()

            processed_data = {}
            for k, v in data.items():
                try:
                    processed_data[k] = float(v)
                except ValueError:
                    return jsonify({"error": f"Invalid number format in field: {k}"}), 400

            model = ModelPipeline()
            pred = model.diabetes_predict(processed_data)

            return jsonify({"result": pred})

    except Exception as e:
        lg.error(f"Error in /diabetes route: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/heart', methods=['POST'])
def heart():
    try:
        if request.method == 'POST':
            data = request.get_json()

            processed_data = {}
            for key, value in data.items():
                try:
                    processed_data[key] = float(value)
                except ValueError:
                    processed_data[key] = value

            model = ModelPipeline()
            pred = model.heart_predict(processed_data)
            return jsonify({"result": "😟 The results suggest some concerns with your Heart function. Let's not panic, but we need to discuss these results and come up with a plan. Let's schedule a follow-up appointment to discuss these results in more detail and explore the next steps." if pred == 1 else "😇 Peace of mind: Your Heart is functioning perfectly! Stay Connected with us for further health related updates."})

    except Exception as e:
        lg.error(f"Error in /heart route: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/kidney', methods=['GET', 'POST'])
def kidney():
    try:
        if request.method == 'POST':
            to_predict_dict = request.form.to_dict()
            model = ModelPipeline()
            pred = model.kidney_predict(to_predict_dict)
        #     return render_template("kidney.html", prediction_text=pred)
        # else:
        #     return render_template("kidney.html")
    except Exception as e:
        lg.error(f"Error in /kidney route: {e}")
        raise CustomException(e, sys)


@app.route('/parkinsons', methods=['POST'])
def parkinsons():
    try:
        if request.is_json:
            to_predict_dict = request.get_json()

            required_fields = [
                'MDVP:Fo(Hz)', 'MDVP:Fhi(Hz)', 'MDVP:Flo(Hz)', 'MDVP:Jitter(%)',
                'MDVP:Jitter(Abs)', 'MDVP:RAP', 'MDVP:PPQ', 'Jitter:DDP', 'MDVP:Shimmer',
                'MDVP:Shimmer(dB)', 'Shimmer:APQ3', 'Shimmer:APQ5', 'MDVP:APQ', 'Shimmer:DDA',
                'NHR', 'HNR', 'RPDE', 'DFA', 'spread1', 'spread2', 'D2', 'PPE'
            ]

            missing_fields = [field for field in required_fields if field not in to_predict_dict]
            if missing_fields:
                return jsonify({"error": f"Missing fields: {', '.join(missing_fields)}"}), 400

            model = ModelPipeline()

            pred = model.parkinsons_predict(to_predict_dict)

            return jsonify({"prediction": pred}), 200
        else:
            return jsonify({"error": "Request must be in JSON format"}), 400

    except Exception as e:
        lg.error(f"Error in /parkinsons route: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/insurance', methods=['POST'])
def insurance():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid request, JSON data required"}), 400

        required_fields = [
            "gender", "city", "occupation", "smoking_status",
            "alcohol_consumption", "education_level", "previous_claims",
            "past_disease_history", "family_disease_history","age","income_level"
        ]

        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({"error": f"Missing fields: {', '.join(missing_fields)}"}), 400

        insurance_price = calculate_insurance_price(data) / 20

        generator = report_generator()
        insurance_report = generator.insurance_report(insurance_price, data)

        return jsonify({
            "insurance_price": insurance_price,
            "insurance_report": insurance_report
        }), 200

    except Exception as e:
        print(f"Error in /insurance route: {e}")
        return jsonify({"error": str(e)}), 500
        

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/disease_image_input', methods=['POST'])
def disease_image_input():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image uploaded"}), 400

        file = request.files['image']
        if file and allowed_file(file.filename):
            img = BytesIO(file.read())  

            model = ImagePrediction()
            pred, class_name = model.predict(img)

            llm = report_generator()
            response = llm.report(pred, class_name)

            return jsonify({"prediction": pred, "class_name": class_name, "report": response})

        return jsonify({"error": "Invalid file format"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/food", methods=["POST"])
def food():
    try:
        # Check if file was uploaded
        if "file" not in request.files:
            return jsonify({"error": "No image uploaded"}), 400

        file = request.files["file"]

        if not file or not allowed_file(file.filename):
            return jsonify({"error": "Invalid file format"}), 400

        img = BytesIO(file.read())  # Read image into memory

        disease = request.form.get("disease", "").strip()
        disease = disease if disease else None

        generator = food_report_generator()

        response = generator.report(img, disease)

        return jsonify(response), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/chatbot')
def chatbot():
    if not os.path.exists("Faiss"):
        ingest_data()
    #     return redirect(url_for('chatbot'))
    # return render_template('chatbot.html')

# @app.route('/chat', methods=['POST'])
# # @cross_origin()  # Explicitly allowing CORS for this endpoint
# def chat():
#     print("BACKEND REQUEST RECEIVED .............")
#     print(request)
#     print("================================================")
#     # Get JSON data from request
#     # Log the raw request and the data extracted from it
#     print(f"Request Data: {request.data}")  # This logs the raw data (just to confirm it's coming through)
#     data = request.get_json()
    
#     print(f"Received data (JSON): {data}")  # This will print the parsed JSON
    
#     user_question = data.get("question", "")
#     chat_history = data.get("history", [])
    
#     print(f"User Question: {user_question}")  # Logs the extracted user question
#     print(f"Chat History: {chat_history}")  # Logs the extracted chat history
#     response = asyncio.run(user_input(user_question, chat_history))
#     return jsonify(response)

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    question = data.get("question")
    chat_history = data.get("chat_history", [])
    
    if not question:
        return jsonify({"error": "Question is required"}), 400
    
    response = get_gemini_response(question, chat_history)
    return jsonify({"response": response})

@app.route("/recommend-articles", methods=["POST"])
def get_recommendations():
    try:
        data = request.get_json()
        user_history_list = data.get("user_history", [])

        if not isinstance(user_history_list, list) or not user_history_list:
            return jsonify({"error": "user_history must be a non-empty list"}), 400

        with db.engine.connect() as conn:  # Establish connection manually
            recommendations = recommend_articles(user_history_list, conn)

        return jsonify({"recommendations": recommendations})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Endpoint to recommend doctors based on predicted disease
@app.route("/recommend-doctors", methods=["POST"])
def recommend_doctors_endpoint():
    # Get the predicted disease from the request
    data = request.get_json()
    predicted_disease = data.get("predicted_disease")

    if not predicted_disease:
        return jsonify({"error": "Predicted disease is required"}), 400
    
    # Get a database connection
    conn = get_db_connection()
    
    try:
        # Call the recommend_doctors function
        # with db.engine.connect() as conn:  # Establish connection manually
        return recommend_doctors(predicted_disease, conn)
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
    finally:
        # Ensure the connection is closed
        if conn:
            conn.close()
    
    

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5000)