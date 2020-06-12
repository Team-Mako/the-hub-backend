import mysql from 'mysql';
import databaseConfig from '../../config/database';

class User {
  create(data) {
    const db = mysql.createPool(databaseConfig);

    const columns = {
      user_name: data.name,
      user_last_name: data.lastName,
      user_email: data.email,
      user_password: mysql.raw(`SHA2('${data.password}', 256)`),
      user_avatar: data.avatar,
      user_bio: data.bio,
    };

    const query = 'INSERT INTO users SET ?';

    return new Promise((resolve, reject) => {
      db.getConnection((err, connection) => {
        if (err) reject(err);

        connection.query(query, columns, (error, results) => {
          connection.release();

          connection.destroy();

          if (error) {
            reject(error);
          }

          resolve(results);
        });
      });
    });
  }

  listAll() {
    const db = mysql.createPool(databaseConfig);

    const query = 'SELECT user_id AS id, user_name AS name, user_last_name AS lastName, user_email AS email, user_avatar AS avatar, user_bio AS bio, user_created_at AS createdAt, user_allowed AS allowed FROM users';

    return new Promise((resolve, reject) => {
      db.getConnection((err, connection) => {
        if (err) reject(err);

        connection.query(query, (error, results) => {
          connection.release();
          connection.destroy();

          if (error) {
            reject(error);
          }

          resolve(results);
        });
      });
    });
  }

  findById(id) {
    const db = mysql.createPool(databaseConfig);

    const columns = {
      user_id: id,
    };

    const query = 'SELECT * FROM users WHERE ? LIMIT 1';

    return new Promise((resolve, reject) => {
      db.getConnection((err, connection) => {
        if (err) reject(err);

        connection.query(query, columns, (error, results) => {
          connection.release();
          connection.destroy();

          if (error) {
            reject(error);
          }

          resolve(results);
        });
      });
    });
  }

  // TODO User Update

  delete(id) {
    const db = mysql.createPool(databaseConfig);

    const columns = {
      user_id: id,
    };

    const query = 'DELETE FROM users WHERE ? LIMIT 1';

    return new Promise((resolve, reject) => {
      db.getConnection((err, connection) => {
        if (err) reject(err);

        connection.query(query, columns, (error, results) => {
          connection.release();
          connection.destroy();

          if (error) {
            reject(error);
          }

          resolve(results);
        });
      });
    });
  }

  login(data) {
    const db = mysql.createPool(databaseConfig);

    const columns = [
      data.email,
      mysql.raw(`SHA2('${data.password}', 256)`),
    ];

    const query = 'SELECT user_id AS id, user_name AS name, user_email AS email FROM users WHERE user_email = ? AND user_password = ? LIMIT 1';

    return new Promise((resolve, reject) => {
      db.getConnection((err, connection) => {
        if (err) reject(err);

        connection.query(query, columns, (error, results) => {
          connection.release();
          connection.destroy();

          if (error) {
            reject(error);
          }

          resolve(results[0]);
        });
      });
    });
  }

  verifyBlock(id) {
    const db = mysql.createPool(databaseConfig);

    const columns = [
      id,
    ];

    const query = 'SELECT user_name FROM users WHERE user_id = ? AND user_allowed = 1 LIMIT 1';

    return new Promise((resolve, reject) => {
      db.getConnection((err, connection) => {
        if (err) reject(err);

        connection.query(query, columns, (error, results) => {
          connection.release();
          connection.destroy();

          if (error) {
            reject(error);
          }

          resolve(results[0]);
        });
      });
    });
  }
}

export default new User();
