-- Create database schema for Dark-Nexis
-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Files table  
CREATE TABLE IF NOT EXISTS files (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    filename VARCHAR(255) NOT NULL,
    s3_key VARCHAR(500) NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    status VARCHAR(50) DEFAULT 'UPLOADED',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Analysis table
CREATE TABLE IF NOT EXISTS analysis (
    id SERIAL PRIMARY KEY,
    file_id INTEGER REFERENCES files(id),
    user_id INTEGER REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'PENDING',
    confidence FLOAT,
    is_deepfake BOOLEAN,
    detected_tools TEXT[],
    metadata JSONB,
    processing_time FLOAT,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create test user
INSERT INTO users (email, username, first_name, last_name) 
VALUES ('test@darknexis.com', 'testuser', 'Test', 'User')
ON CONFLICT (email) DO NOTHING;

-- Verify tables
\dt