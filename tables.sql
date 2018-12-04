DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS friendships;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    first VARCHAR(255) NOT NULL,
    last VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE CHECK(email <> ''),
    password VARCHAR(255) NOT NULL,
    bio TEXT,
    profilePicUrl TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE friendships(
    id SERIAL PRIMARY KEY,
    receiver_id INTEGER NOT NULL REFERENCES users(id),
    sender_id INTEGER NOT NULL REFERENCES users(id),
    accepted BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
