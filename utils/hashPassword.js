const { createHash } = require('crypto');

const hashPassword = (password)=> {
    const hash = createHash('sha256');
    hash.update(password);
    const hashedPassword = hash.digest('hex');
    return hashedPassword;
}
module.exports = { hashPassword };