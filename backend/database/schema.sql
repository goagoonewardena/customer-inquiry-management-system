CREATE TABLE inquiries (
    id SERIAL PRIMARY KEY,
    customer VARCHAR(100) NOT NULL,
    contact VARCHAR(150) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    description VARCHAR(2000) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'New'
        CHECK (status IN ('New', 'In Progress', 'Resolved')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);