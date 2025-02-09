import os
import sys

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import text

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
os.environ['KMP_DUPLICATE_LIB_OK'] = 'TRUE'
import tensorflow as tf
from flask_cors import CORS
import warnings
import json
import pandas as pd
import logging
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
from datetime import datetime

import os
import asyncio
from flask import Flask, request, jsonify, redirect, url_for
warnings.filterwarnings("ignore", category=UserWarning, message="Trying to unpickle estimator")

tf.get_logger().setLevel(logging.ERROR)

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
from src.ChatBot.chatbot import ingest_data,user_input
from src.recommendarticles.articles_recommendation import recommend_articles
from utils.helper import get_patient_id_from_token


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
    medications = db.Column(db.JSON)
    diet = db.Column(db.JSON)
    workout = db.Column(db.JSON)
    created_at = db.Column(db.TIMESTAMP, default=datetime.utcnow)

with app.app_context():
    Disease.__table__.create(db.engine, checkfirst=True)



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
            medications=medications,
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
            'predictedDisease': predicted_disease,
            'disDes': dis_des,
            'myPrecautions': my_precautions,
            'medications': medications,
            'myDiet': rec_diet,
            'myWorkout': rec_workout
        }), 200

    except Exception as e:
        lg.error(f"Error in /predict route: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/drugres', methods=['GET', 'POST'])
def drugres():
    try:
        if request.method == 'POST':
            data = request.form.to_dict()
            llm = report_generator2()
            data = llm.report(data)
        #     return render_template('drug_response_output.html', data=data)
        
        # return render_template('drug_response.html')
    except Exception as e:
        lg.error(f"Error in /drugresponse route: {e}")
        raise CustomException(e, sys)

@app.route('/alternativedrug', methods=['GET', 'POST'])
def alternativedrug():
    try:
        if request.method == 'POST':
            selected_medicine = request.form['medicine']
            alt = AlternateDrug()
            recommendations, medicines_data = alt.recommendation(selected_medicine)  
            # return render_template("alternativedrug.html", medicines=medicines_data, prediction_text=recommendations)
        else:
            alt = AlternateDrug()
            medicines_data = alt.medi()
            # return render_template("alternativedrug.html", medicines=medicines_data)
    except Exception as e:
        lg.error(f"Error in /alternativedrug route: {e}")
        raise CustomException(e, sys)

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

@app.route('/insurance', methods=['GET', 'POST'])
def insurance():
    if request.method == 'POST':
        form_data = request.form.to_dict()
        insurance_price = calculate_insurance_price(form_data)/20
        
    #     return render_template("insurance.html", insurance_price = insurance_price)
    # else:
    #     return render_template("insurance.html")
    





UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/disease_image_input', methods=['POST', 'GET'])
def disease_image_input():
    if request.method == 'POST':
        file = request.files['image']
        if file and allowed_file(file.filename):
            if not os.path.exists(app.config['UPLOAD_FOLDER']):
                os.makedirs(app.config['UPLOAD_FOLDER'])
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
            file.save(file_path)
            img = file_path

            model = ImagePrediction()
            pred, class_name = model.predict(img)
            llm = report_generator()
            response = llm.report(pred,class_name)
            

    #         return render_template("disease_image_input.html", response = response)
    #     return render_template("disease_image_input.html")
    # return render_template("disease_image_input.html")

@app.route('/food', methods=['GET', 'POST'])
def food():
    if request.method == 'POST':
        file = request.files['file']
        if file and allowed_file(file.filename):
            if not os.path.exists(app.config['UPLOAD_FOLDER']):
                os.makedirs(app.config['UPLOAD_FOLDER'])
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
            file.save(file_path)
            file = file_path

        disease = request.form.get('disease')
        if disease == "":
            disease = None
        else:
            disease = disease.strip()  # Ensure it's a clean string

        # Create an instance of the class
        generator = food_report_generator()
        
        #Call the report method
        response = generator.report(file, disease)
    #     return render_template('food-output.html', response=response)
    # return render_template('food-input.html')


@app.route('/chatbot')
def chatbot():
    if not os.path.exists("Faiss"):
        ingest_data()
    #     return redirect(url_for('chatbot'))
    # return render_template('chatbot.html')

@app.route('/chat', methods=['POST'])
def chat():
    user_question = request.form['question']
    chat_history = request.form['history']
    response = asyncio.run(user_input(user_question, chat_history))
    return jsonify(response)

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

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5000)