var spicedPg = require("spiced-pg");

var db = spicedPg(
    process.env.DATABASE_URL || "postgres:postgres:postgres@localhost:5432/sn"
);

exports.createUser = (first, last, email, password) => {
    return db.query(
        `INSERT INTO users (first, last, email, password)
        VALUES ($1, $2, $3, $4)
        RETURNING id, first, last`,
        [first || null, last || null, email || null, password || null]
    );
};

exports.getUser = email => {
    return db.query(
        `SELECT users.id AS "userId", users.password
        FROM users
        WHERE users.email = $1`,
        [email]
    );
};

exports.getUserData = userId => {
    return db.query(
        `SELECT *
        FROM users
        WHERE id = $1`,
        [userId]
    );
};

exports.addImages = (userId, profilePicUrl) => {
    return db.query(
        `UPDATE users
        SET profilePicUrl = $2
        WHERE id = $1
        RETURNING *`,
        [userId, profilePicUrl]
    );
};

exports.updateBio = (userId, bio) => {
    return db.query(
        `UPDATE users
        SET bio = $2
        WHERE id=$1
        RETURNING *`,
        [userId, bio]
    );
};

exports.otherPersonProfiles = id => {
    return db.query(
        `SELECT first, last, email, profilepicurl, created_at, bio
        FROM users
        WHERE id = $1`,
        [id]
    );
};

exports.friendButton = (receiver, sender) => {
    return db.query(
        `SELECT *
        FROM friendships
        WHERE (receiverid = $1 AND senderid = $2)
        OR (receiverid = $2 AND senderid = $1)`,
        [receiver, sender]
    );
};

exports.makeFriends = (receiver, sender) => {
    return db.query(
        `INSERT INTO friendships (receiverid, senderid)
        VALUES ($1, $2)
        RETURNING *`,
        [receiver, sender]
    );
};

exports.cancelFriend = (receiverid, senderid) => {
    return db.query(
        `DELETE FROM friendships
            WHERE (receiverid = $1 AND senderid = $2)
            RETURNING *`,
        [receiverid, senderid]
    );
};

exports.acceptFriend = (receiverid, senderid) => {
    return db.query(
        `UPDATE friendships
            SET accepted = true
            WHERE (receiverid = $1 AND senderid = $2)
            RETURNING *`,
        [receiverid, senderid]
    );
};

exports.deleteFriend = (receiver, sender) => {
    return db.query(
        `DELETE FROM friendships
            WHERE (receiverid = $1 AND senderid = $2)
            OR (receiverid = $2 AND senderid = $1)
            RETURNING *`,
        [receiver, sender]
    );
};

exports.lists = id => {
    return db.query(
        `SELECT users.id, first, last, profilePicUrl, accepted
    FROM friendships
    JOIN users
    ON (accepted = false AND receiverid = $1 AND senderid = users.id)
    OR (accepted = true AND receiverid = $1 AND senderid = users.id)
    OR (accepted = true AND senderid = $1 AND receiverid = users.id)`,
        [id]
    );
};

exports.getUsersByIds = arrayOfIds => {
    const query = `SELECT id, first, last, profilepicurl FROM users WHERE id = ANY($1)`;
    return db.query(query, [arrayOfIds]);
};

exports.getJoinedId = id => {
    const query = `SELECT id, first, last, profilepicurl FROM users WHERE id = $1`;
    return db.query(query, [id]);
};

//insert messages
exports.insertMessages = (messages, user_id) => {
    return db.query(
        `INSERT INTO chats (messages, user_id)
       VALUES ($1, $2)
       RETURNING *`,
        [messages || null, user_id || null]
    );
};

//select messages
exports.getMessages = () => {
    return db.query(
        `SELECT u.first, u.last, u.profilePicUrl, c.messages AS messages, c.id AS "messageId"
        FROM chats AS c
       LEFT JOIN users AS u
       ON c.user_id = u.id
       LIMIT 10`
    );
};

exports.currentUser = () => {
    return db.query(
        `SELECT u.first, u.last, u.profilePicUrl, c.messages AS messages, c.id AS "messageId"
        FROM chats AS c
       LEFT JOIN users AS u
       ON c.user_id = u.id
       ORDER BY c.id DESC
       LIMIT 10`
    );
};
