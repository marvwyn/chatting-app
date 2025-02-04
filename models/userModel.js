const connection = require('../config/db');
const bcrypt = require('bcrypt');

class User {
    static _executeQuery(query, params = []) {
        return new Promise((resolve, reject) => {
            connection.query(query, params, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    }

    static createTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                username VARCHAR(255) NOT NULL,
                user_password VARCHAR(255) NOT NULL,
                token VARCHAR(255)
            )
        `;
        return this._executeQuery(query).then(() => console.log('Users table is ready')).catch(console.error);
    }

    static findByEmail(email) {
        return this._executeQuery('SELECT * FROM users WHERE email = ?', [email])
            .then(results => results[0] || null);
    }

    static async create(email, username, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return this._executeQuery('INSERT INTO users (email, username, user_password) VALUES (?, ?, ?)', [email, username, hashedPassword]);
    }

    static clientList() {
        return this._executeQuery('SELECT username, email, id FROM users');
    }

    static getUsersByToken(token) {
        return this._executeQuery('SELECT * FROM users WHERE token = ?', [token])
            .then(results => results[0] || null);
    }

    static updateToken(userId, token) {
        return this._executeQuery('UPDATE users SET token = ? WHERE id = ?', [token, userId]);
    }
}

module.exports = User;
