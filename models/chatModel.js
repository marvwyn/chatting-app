const connection = require('../config/db');

class Chat {
    static createTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS chats (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                to_user_id INT NOT NULL,
                message TEXT NOT NULL,
                created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        return this.executeQuery(query);
    }

    static async getChats(currentUserId, chatUserId) {
        const query = `
            SELECT * FROM chats 
            WHERE (user_id = ? AND to_user_id = ?) 
            OR (user_id = ? AND to_user_id = ?) 
            ORDER BY created ASC
        `;
        return this.executeQuery(query, [currentUserId, chatUserId, chatUserId, currentUserId]);
    }

    static async sendChat(currentUserId, chatUserId, message) {
        const query = 'INSERT INTO chats (user_id, to_user_id, message) VALUES (?, ?, ?)';
        return this.executeQuery(query, [currentUserId, chatUserId, message]);
    }

    static async clientList() {
        const query = 'SELECT username, email, id FROM users';
        return this.executeQuery(query);
    }

    static executeQuery(query, params = []) {
        return new Promise((resolve, reject) => {
            connection.query(query, params, (err, results) => {
                if (err) {
                    console.error("Database query error:", err);
                    return reject(err);
                }
                resolve(results);
            });
        });
    }
}

module.exports = Chat;
