import os

from flask import Flask, jsonify, render_template, request
import psycopg2
from psycopg2.extras import RealDictCursor


app = Flask(__name__)


def get_db_connection():
    """Connect to PostgreSQL using environment variables."""
    conn = psycopg2.connect(
        host=os.environ.get("DB_HOST", "postgres"),
        database=os.environ.get("DB_NAME", "feedbackdb"),
        user=os.environ.get("DB_USER", "postgres"),
        password=os.environ.get("DB_PASSWORD", "secretpassword")
    )
    return conn


@app.route("/")
def index():
    """Serve the main page."""
    return render_template("index.html")


@app.route("/api/feedback", methods=["GET"])
def get_feedback():
    """API endpoint to fetch all feedback."""
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    cur.execute("SELECT * FROM feedback ORDER BY created_at DESC;")
    feedbacks = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(feedbacks)


@app.route("/api/feedback", methods=["POST"])
def create_feedback():
    """API endpoint to submit new feedback."""
    data = request.get_json()

    name = data.get("name", "Anonymous")
    email = data.get("email", "")
    category = data.get("category", "General")
    rating = data.get("rating", 3)
    message = data.get("message", "")

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute(
        """
        INSERT INTO feedback (name, email, category, rating, message)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING id;
        """,
        (name, email, category, rating, message)
    )

    feedback_id = cur.fetchone()[0]

    conn.commit()
    cur.close()
    conn.close()

    return jsonify(
        {
            "success": True,
            "id": feedback_id,
            "message": "Feedback submitted successfully!"
        }
    ), 201


@app.route("/api/stats", methods=["GET"])
def get_stats():
    """API endpoint for dashboard statistics."""
    conn = get_db_connection()
    cur = conn.cursor()

    # Total feedback count
    cur.execute("SELECT COUNT(*) FROM feedback;")
    total = cur.fetchone()[0]

    # Average rating
    cur.execute("SELECT AVG(rating) FROM feedback;")
    avg_rating = cur.fetchone()[0] or 0

    # Category breakdown
    cur.execute(
        """
        SELECT category, COUNT(*) as count
        FROM feedback
        GROUP BY category
        ORDER BY count DESC;
        """
    )
    categories = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(
        {
            "total_feedback": total,
            "average_rating": round(float(avg_rating), 1),
            "categories": [
                {"name": cat[0], "count": cat[1]}
                for cat in categories
            ]
        }
    )


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )
