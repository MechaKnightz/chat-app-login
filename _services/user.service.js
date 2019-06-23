const config = require('config');
const jwt = require('jsonwebtoken');
const Role = require('../_models/role');
const mysql = require('mysql2');
const pool = mysql.createPool(config.get("dbPoolConfig"));
console.log(config.get("dbPoolConfig"));
pool.query('SELECT 1', (error, results, fields) => {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);
});

module.exports = {
    authenticate//,
    // getAll,
    // getById
};

async function authenticate({ username, password }) {

    const user = getUser({ username, password });
    console.log(user);

    //const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        console.log(user);
        const token = jwt.sign({ sub: user.id, role: user.role }, config.get('secret'));
        const { password, ...userWithoutPassword } = user;
        return {
            ...userWithoutPassword,
            token
        };
    }
}

function getUser({ username, password }) {
    console.log("username: " + username + " password: " + password);
    pool.execute(
        'SELECT * FROM `users` WHERE `username` = ? AND `password` = ?',
        [username, password],
        function (err, results, fields) {
            return results;
            console.log(results); // results contains rows returned by server
            console.log(fields); // fields contains extra meta data about results, if available
        }
    );
}

// async function getAll() {
//     return users.map(u => {
//         const { password, ...userWithoutPassword } = u;
//         return userWithoutPassword;
//     });
// }

// async function getById(id) {
//     const user = users.find(u => u.id === parseInt(id));
//     if (!user) return;
//     const { password, ...userWithoutPassword } = user;
//     return userWithoutPassword;
// }