CREATE TABLE IF NOT EXISTS feedback (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    category VARCHAR(50) NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample data to make it look alive
INSERT INTO feedback (name, email, category, rating, message) VALUES 
('Alice Johnson', 'alice@example.com', 'UI/UX', 5, 'The interface is absolutely stunning! Very intuitive and user-friendly.'),
('Bob Smith', 'bob@example.com', 'Content', 4, 'Great content, but I would love to see more technical deep-dives.'),
('Carol White', 'carol@example.com', 'Technical', 5, 'The deployment was seamless. Really impressed with the infrastructure.'),
('Dave Brown', 'dave@example.com', 'Speaker', 4, 'The speakers were engaging and knowledgeable. Looking forward to the next event!'),
('Eve Davis', 'eve@example.com', 'Venue', 3, 'Nice venue, but the Wi-Fi could be better. Otherwise, great experience!');
