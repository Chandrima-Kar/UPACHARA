import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib

# Your list of diseases
diseases = {
    "15": "Fungal infection",
    "4": "Allergy",
    "16": "GERD",
    "9": "Chronic cholestasis",
    "14": "Drug Reaction",
    "33": "Peptic ulcer disease",
    "1": "AIDS",
    "12": "Diabetes",
    "17": "Gastroenteritis",
    "6": "Bronchial Asthma",
    "23": "Hypertension",
    "30": "Migraine",
    "7": "Cervical spondylosis",
    "32": "Paralysis (brain hemorrhage)",
    "28": "Jaundice",
    "29": "Malaria",
    "8": "Chicken pox",
    "11": "Dengue",
    "37": "Typhoid",
    "40": "Hepatitis A",
    "19": "Hepatitis B",
    "20": "Hepatitis C",
    "21": "Hepatitis D",
    "22": "Hepatitis E",
    "3": "Alcoholic hepatitis",
    "36": "Tuberculosis",
    "10": "Common Cold",
    "34": "Pneumonia",
    "13": "Dimorphic hemorrhoids(piles)",
    "18": "Heart attack",
    "39": "Varicose veins",
    "26": "Hypothyroidism",
    "24": "Hyperthyroidism",
    "25": "Hypoglycemia",
    "31": "Osteoarthritis",
    "5": "Arthritis",
    "0": "(vertigo) Paroxysmal Positional Vertigo",
    "2": "Acne",
    "38": "Urinary tract infection",
    "35": "Psoriasis",
    "27": "Impetigo",
}

# Map diseases to specializations (you need to define this)
disease_specialization_mapping = {
    "Fungal infection": "Dermatology",
    "Allergy": "Immunology",
    "GERD": "Gastroenterology",
    "Chronic cholestasis": "Gastroenterology",
    "Drug Reaction": "Toxicology",
    "Peptic ulcer disease": "Gastroenterology",
    "AIDS": "Infectious Disease",
    "Diabetes": "Endocrinology",
    "Gastroenteritis": "Gastroenterology",
    "Bronchial Asthma": "Pulmonology",
    "Hypertension": "Cardiology",
    "Migraine": "Neurology",
    "Cervical spondylosis": "Orthopedics",
    "Paralysis (brain hemorrhage)": "Neurology",
    "Jaundice": "Gastroenterology",
    "Malaria": "Infectious Disease",
    "Chicken pox": "Infectious Disease",
    "Dengue": "Infectious Disease",
    "Typhoid": "Infectious Disease",
    "Hepatitis A": "Gastroenterology",
    "Hepatitis B": "Gastroenterology",
    "Hepatitis C": "Gastroenterology",
    "Hepatitis D": "Gastroenterology",
    "Hepatitis E": "Gastroenterology",
    "Alcoholic hepatitis": "Gastroenterology",
    "Tuberculosis": "Pulmonology",
    "Common Cold": "General Physician",
    "Pneumonia": "Pulmonology",
    "Dimorphic hemorrhoids(piles)": "Proctology",
    "Heart attack": "Cardiology",
    "Varicose veins": "Vascular Surgery",
    "Hypothyroidism": "Endocrinology",
    "Hyperthyroidism": "Endocrinology",
    "Hypoglycemia": "Endocrinology",
    "Osteoarthritis": "Orthopedics",
    "Arthritis": "Rheumatology",
    "(vertigo) Paroxysmal Positional Vertigo": "Otolaryngology",
    "Acne": "Dermatology",
    "Urinary tract infection": "Urology",
    "Psoriasis": "Dermatology",
    "Impetigo": "Dermatology",
}

# Create a DataFrame for training
data = {"disease": [], "specialization": []}
for disease in diseases.values():
    specialization = disease_specialization_mapping.get(disease, "General Physician")
    data["disease"].append(disease)
    data["specialization"].append(specialization)

df = pd.DataFrame(data)

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(
    df["disease"], df["specialization"], test_size=0.2, random_state=42
)

# Vectorize the disease names
vectorizer = TfidfVectorizer()
X_train_vectorized = vectorizer.fit_transform(X_train)
X_test_vectorized = vectorizer.transform(X_test)

# Train the model
model = MultinomialNB()
model.fit(X_train_vectorized, y_train)

# Evaluate the model
y_pred = model.predict(X_test_vectorized)
accuracy = accuracy_score(y_test, y_pred)
print(f"Model Accuracy: {accuracy * 100:.2f}%")

# Save the model and vectorizer
joblib.dump(model, "disease_specialization_model.pkl")
joblib.dump(vectorizer, "tfidf_vectorizer.pkl")

print("Model and vectorizer saved successfully!")