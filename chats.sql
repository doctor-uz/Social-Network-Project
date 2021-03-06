DROP TABLE IF EXISTS chats;

CREATE TABLE chats(
    id SERIAL PRIMARY KEY,
    messages TEXT NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id),
    createtime TIMESTAMP DEFAULT current_timestamp
);
