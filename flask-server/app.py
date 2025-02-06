from flask_sqlalchemy import SQLAlchemy
import os
import sys
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
os.environ['KMP_DUPLICATE_LIB_OK'] = 'TRUE'
import tensorflow as tf
from flask_cors import CORS
import warnings
import json
import logging
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
import pandas as pd
import ast
from src.ChatBot.chatbot import ingest_data,user_input
import os
import asyncio
from flask import Flask, request, jsonify, redirect, url_for
# Suppress warning
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


current_dir = os.path.abspath(os.path.dirname(__file__))
cors_origin = os.getenv("FLASK_CORS_ORIGIN", "*")
flask_postgres_connection = os.getenv("FLASK_POSTGRES_STRING","*")

app = Flask(__name__)
CORS(app, origins=[cors_origin], methods=["GET", "POST", "OPTIONS"])
# app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///"+os.path.join(current_dir, "database2.sqlite3")
app.config['SQLALCHEMY_DATABASE_URI'] = flask_postgres_connection
app.config['SECRET_KEY'] = 'healthmap'
db = SQLAlchemy(app)



class Symptoms(db.Model):
    __tablename__ = 'symptoms'
    id = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True, unique=True)
    fname = db.Column(db.String(30), nullable=False)
    lname = db.Column(db.String(30), nullable=False)
    phone = db.Column(db.String(13), nullable=False)
    email = db.Column(db.String(40), nullable=False)
    symp1 = db.Column(db.String(30), nullable=False)
    symp2 = db.Column(db.String(30))
    symp3 = db.Column(db.String(30))
    symp4 = db.Column(db.String(30))


class Precautions(db.Model):
    __tablename__ = 'precautions'
    sl = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True, unique=True)
    p_id = db.Column(db.Integer, db.ForeignKey("symptoms.id"), nullable=False)
    precaution = db.Column(db.JSON, nullable=False)

class Medications(db.Model):
    __tablename__ = 'medications'
    sl = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True, unique=True)
    m_id = db.Column(db.Integer, db.ForeignKey("symptoms.id"), nullable=False)
    medication = db.Column(db.JSON, nullable=False)

class Disease(db.Model):
    __tablename__ = 'disease'
    sl = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True, unique=True)
    d_id = db.Column(db.Integer, db.ForeignKey("symptoms.id"), nullable=False)
    disease = db.Column(db.String(30), nullable=False)

class Diet(db.Model):
    __tablename__ = 'diet'
    sl = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True, unique=True)
    di_id = db.Column(db.Integer, db.ForeignKey("symptoms.id"), nullable=False)
    diet = db.Column(db.JSON, nullable=False)

class Workout(db.Model):
    __tablename__ = 'workout'
    sl = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True, unique=True)
    w_id = db.Column(db.Integer, db.ForeignKey("symptoms.id"), nullable=False)
    workout = db.Column(db.JSON, nullable=False)

class Description(db.Model):
    __tablename__ = 'description'
    sl = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True, unique=True)
    des_id = db.Column(db.Integer, db.ForeignKey("symptoms.id"), nullable=False)
    description = db.Column(db.String(200), nullable=False)

with app.app_context():
    db.create_all()


@app.route('/predict', methods=['GET', 'POST'])
def predict():
    try:
        if request.method == 'POST':
            data = request.json
            fname = data.get('fname')
            lname = data.get('lname')
            phone = data.get('phone')
            email = data.get('email')
            symptom_1 = data.get('symptom_1')
            symptom_2 = data.get('symptom_2')
            symptom_3 = data.get('symptom_3')
            symptom_4 = data.get('symptom_4')
            symptoms_list = [symptom_1, symptom_2, symptom_3, symptom_4]
            symp_list = Symptoms(fname=fname, lname=lname, phone=phone, email=email, symp1 = symptom_1, symp2 = symptom_2, symp3 = symptom_3, symp4 = symptom_4)
            db.session.add(symp_list)
            db.session.commit()

            symptom_id = symp_list.id

            model = DiseasePrediction()
            predicted_disease, dis_des, my_precautions, medications, rec_diet, rec_workout, symptoms_dict = model.predict(symptoms_list=symptoms_list)

            def convert_string_list(string_list):
                if not string_list:
                    return []

                try:
                    return ast.literal_eval(string_list[0])
                except (ValueError, SyntaxError):
                    return []

            if isinstance(rec_workout, pd.Series):
                rec_workout = rec_workout.tolist()

            if isinstance(medications, pd.Series):
                medications = medications.tolist()

            if isinstance(rec_diet, pd.Series):
                rec_diet = rec_diet.tolist()

            if isinstance(my_precautions, pd.Series):
                my_precautions = my_precautions.tolist()

            if isinstance(medications, str):
                try:
                    medications = convert_string_list(medications)
                except (ValueError, SyntaxError):
                    medications = []

            if isinstance(my_precautions, str):
                try:
                    my_precautions = json.loads(my_precautions)
                except json.JSONDecodeError:
                    my_precautions = []

            if isinstance(rec_workout, str):
                try:
                    rec_workout = json.loads(rec_workout)
                except json.JSONDecodeError:
                    rec_workout = []

            if isinstance(rec_diet, str):
                try:
                    rec_diet = convert_string_list(rec_diet)
                except (ValueError, SyntaxError):
                    rec_diet = []



            precaution_entry = Precautions(p_id=symptom_id, precaution=my_precautions)
            db.session.add(precaution_entry)
            db.session.commit()

            medication_entry = Medications(m_id=symptom_id, medication=medications)
            db.session.add(medication_entry)
            db.session.commit()

            if predicted_disease and isinstance(predicted_disease, str):
                disease_entry = Disease(d_id=symptom_id, disease=predicted_disease)
                db.session.add(disease_entry)
                db.session.commit()


            if dis_des and isinstance(dis_des, str):
                    description_entry =Description(des_id=symptom_id, description=dis_des)
                    db.session.add(description_entry)
            db.session.commit()

            workout_entry = Workout(w_id=symptom_id, workout=rec_workout)
            db.session.add(workout_entry)
            db.session.commit()


            diet_entry =Diet(di_id=symptom_id, diet=rec_diet)
            db.session.add(diet_entry)
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


@app.route("/patient/<email>")
def patient(email):
    # email = Symptoms.email()
    user_data = Symptoms.query.filter_by(email=email).all()
    
    disease=Disease.query.all()
    description=Description.query.all()
    precautions = Precautions.query.all()
    medications=Medications.query.all()
    workout=Workout.query.all()
    diet=Diet.query.all()

    # return render_template("patient.html", email=email, user_data=user_data,disease=disease,description=description, precautions=precautions,medications=medications,workout=workout,diet=diet)




@app.route("/update_precaution", methods=['POST'])
def update_precaution():
    precaution_id = request.form.get('precaution_id')
    new_precaution = request.form.get('new_precaution')
    
    precaution = Precautions.query.filter_by(sl=precaution_id).first()
    if precaution:
        precaution.precaution = new_precaution
        db.session.commit()

    return redirect(url_for('data'))

@app.route("/update_medication", methods=['POST'])
def update_medication():
    medication_id = request.form.get('medication_id')
    new_medication = request.form.get('new_medication')
    print(f"Medication ID: {medication_id}")
    print(f"New Medication: {new_medication}")
    
    medication = Medications.query.filter_by(sl=medication_id).first()
    if medication:
        medication.medication = new_medication
        db.session.commit()

    return redirect(url_for('data'))

@app.route("/update_disease", methods=['POST'])
def update_disease():
    disease_id = request.form.get('disease_id')
    new_disease = request.form.get('new_disease')
    
    print(f"Disease ID: {disease_id}")
    print(f"New Disease: {new_disease}")

    disease = Disease.query.filter_by(sl=disease_id).first()
    
    if disease:
        disease.disease = new_disease  # Update the disease field
        db.session.commit()  # Commit the changes to the database
        print("Disease updated successfully")
    else:
        print("Disease not found")

    return redirect(url_for('data'))


    return redirect(url_for('data'))

@app.route("/update_description", methods=['POST'])
def update_description():
    description_id = request.form.get('description_id')
    new_description = request.form.get('new_description')
    
    description = Description.query.filter_by(sl=description_id).first()
    if description:
        description.description = new_description
        db.session.commit()

    return redirect(url_for('data'))

@app.route("/update_workout", methods=['POST'])
def update_workout():
    workout_id = request.form.get('workout_id')
    new_workout = request.form.get('new_workout')
    print(f"workout ID: {workout_id}")
    print(f"New workout: {new_workout}")
    
    workout = Workout.query.filter_by(sl=workout_id).first()
    if workout:
        workout.workout = new_workout
        db.session.commit()

    return redirect(url_for('data'))

@app.route("/update_diet", methods=['POST'])
def update_diet():
    diet_id = request.form.get('diet_id')
    new_diet = request.form.get('new_diet')
    
    diet = Diet.query.filter_by(sl=diet_id).first()
    if diet:
        diet.diet = new_diet
        db.session.commit()
    return redirect(url_for('data'))

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

@app.route('/liver', methods=['GET', 'POST'])
def liver():
    try:
        if request.method == 'POST':
            to_predict_dict = request.form.to_dict()
            model = ModelPipeline()
            pred = model.liver_predict(to_predict_dict)
        #     return render_template("liver.html", prediction_text_liver=pred)
        # else:
        #     return render_template("liver.html")
    except Exception as e:
        lg.error(f"Error in /liver route: {e}")
        raise CustomException(e, sys)

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

@app.route('/diabetes', methods=['GET', 'POST'])
def diabetes():
    try:
        if request.method == 'POST':
            to_predict_dict = request.form.to_dict()
            model = ModelPipeline()
            pred = model.diabetes_predict(to_predict_dict)
        #     return render_template("diabetes.html", prediction_text=pred)
        # else:
        #     return render_template("diabetes.html")
    except Exception as e:
        lg.error(f"Error in /diabetes route: {e}")
        raise CustomException(e, sys)

@app.route('/heart', methods=['GET', 'POST'])
def heart():
    try:
        if request.method == 'POST':
            to_predict_dict = request.form.to_dict()
            model = ModelPipeline()
            pred = model.heart_predict(form_data=to_predict_dict)
        #     return render_template("heart.html", prediction_text=pred)
        # else:
        #     return render_template("heart.html")
    except Exception as e:
        lg.error(f"Error in /heart route: {e}")
        raise CustomException(e, sys)

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

@app.route('/parkinsons', methods=['GET', 'POST'])
def parkinsons():
    try:
        if request.method == 'POST':
            to_predict_dict = request.form.to_dict()
            model = ModelPipeline()
            pred = model.parkinsons_predict(to_predict_dict)
        #     return render_template("parkinsons.html", prediction_text=pred)
        # else:
        #     return render_template("parkinsons.html")
    except Exception as e:
        lg.error(f"Error in /parkinsons route: {e}")
        raise CustomException(e, sys)

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

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5000)
    

