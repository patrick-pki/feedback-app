#!/bin/bash
set -e

echo "═══════════════════════════════════════════════════"
echo "  🔨 Starting Event Feedback Hub"
echo "═══════════════════════════════════════════════════"

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
until pg_isready -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME"; do
  echo "   PostgreSQL not ready yet... waiting 2s"
  sleep 2
done
echo "✅ PostgreSQL is ready!"

# Run database migrations
echo "📦 Running database migrations..."
python -c "
import psycopg2, os
conn = psycopg2.connect(
    host=os.environ['DB_HOST'],
    database=os.environ['DB_NAME'],
    user=os.environ['DB_USER'],
    password=os.environ['DB_PASSWORD']
)
cur = conn.cursor()
cur.execute('''
    CREATE TABLE IF NOT EXISTS feedback (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255),
        category VARCHAR(50) NOT NULL,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
''')
conn.commit()
conn.close()
print('✅ Database migration completed!')
"

# Start the Flask application
echo "🚀 Starting Flask application..."
exec python main.py
