const Bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
    
    encrypt: (plain) => {
        return Bcrypt.hashSync(plain, saltRounds);
    },

    compare: (plain, hash) => {
        return Bcrypt.compareSync(plain, hash);
    }
}