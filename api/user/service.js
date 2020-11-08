const pool = require("../../config/database");

module.exports = {
    create: (data, callBack) => {
        pool.query(
            `insert into user(username, password, avatar, created_date, status, gender) 
                values(?,?,?,?,?,?)`,
            [
                data.username,
                data.password,
                '/avatar.png',
                new Date(),
                1,
                data.gender
            ],
            (error, results, fields) => {
                if (error) {
                    callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    getUserByUsername: (username, callback) => {
        pool.query(
            `select * from user where username = ?`,
            [username],
            (error, results, fields) => {
                if (error) {
                    callback(error);
                }
                return callback(null, results[0]);
            }
        );
    },
    getUserByUserId: (id, callBack) => {
        pool.query(
            `select * from user where id = ?`,
            [id],
            (error, results, fields) => {
                if (error) {
                    callBack(error);
                }
                return callBack(null, results[0]);
            }
        );
    },
    getUsers: callBack => {
        pool.query(
            `select id,firstName,lastName,gender,email,number from registration`,
            [],
            (error, results, fields) => {
                if (error) {
                    callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    updateUser: (data, callBack) => {
        pool.query(
            `update registration set firstName=?, lastName=?, gender=?, email=?, password=?, number=? where id = ?`,
            [
                data.first_name,
                data.last_name,
                data.gender,
                data.email,
                data.password,
                data.number,
                data.id
            ],
            (error, results, fields) => {
                if (error) {
                    callBack(error);
                }
                return callBack(null, results[0]);
            }
        );
    },
    deleteUser: (data, callBack) => {
        pool.query(
            `delete from registration where id = ?`,
            [data.id],
            (error, results, fields) => {
                if (error) {
                    callBack(error);
                }
                return callBack(null, results[0]);
            }
        );
    }
};
