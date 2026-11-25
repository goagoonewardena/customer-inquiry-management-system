CREATE TABLE IF NOT EXISTS inquiries (
    id SERIAL PRIMARY KEY,
    customer VARCHAR(100) NOT NULL,
    contact VARCHAR(150) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    description VARCHAR(2000) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'New'
        CHECK (status IN ('New', 'In Progress', 'Resolved')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS staff_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(254) NOT NULL,
    password_hash VARCHAR(60) NOT NULL,
    approved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE staff_users
    ADD COLUMN IF NOT EXISTS approved BOOLEAN NOT NULL DEFAULT FALSE;

CREATE UNIQUE INDEX IF NOT EXISTS staff_users_email_lower_idx
    ON staff_users (LOWER(email));

CREATE TABLE IF NOT EXISTS staff_sessions (
    token_hash VARCHAR(64) PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES staff_users(id) ON DELETE CASCADE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS staff_sessions_user_id_idx ON staff_sessions(user_id);
CREATE INDEX IF NOT EXISTS staff_sessions_expires_at_idx ON staff_sessions(expires_at);