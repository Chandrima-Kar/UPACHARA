import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sqlalchemy.sql import text  # Import text() for executing raw SQL


# Function to fetch articles
def fetch_articles(conn):
    try:
        query = text("SELECT id, title, image_url, content, category FROM articles WHERE status = 'published'")
        with conn as connection:  # Open a DB connection
            result = connection.execute(query)
            articles = result.fetchall()

        # Convert result to Pandas DataFrame
        return pd.DataFrame(articles, columns=["id", "title", "image_url", "content", "category"])
    except Exception as e:
        print("Database Query Error:", e) 
        return pd.DataFrame([])


# Function to recommend articles
def recommend_articles(user_history_list, conn):
    articles = fetch_articles(conn)
    if articles.empty:
        return []

    vectorizer = TfidfVectorizer()
    
    # Combine all user history entries into one text
    user_history_text = " ".join(user_history_list)  

    # Prepare text corpus
    all_texts = list(articles["content"]) + [user_history_text]
    tfidf_matrix = vectorizer.fit_transform(all_texts)

    # Compute cosine similarity
    similarity_scores = cosine_similarity(tfidf_matrix[-1], tfidf_matrix[:-1])

    # Get top 3 article recommendations
    recommended_indices = np.argsort(similarity_scores[0])[-3:][::-1]

    return articles.iloc[recommended_indices].to_dict(orient="records")
