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
      user_created_at: mysql.raw('NOW()'),
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

  login(data) {
    const db = mysql.createPool(databaseConfig);

    const columns = [
      data.email,
      mysql.raw(`SHA2('${data.password}', 256)`),
    ];

    const query = 'SELECT * FROM users WHERE user_email = ? AND user_password = ? LIMIT 1';

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

    const query = 'SELECT user_name FROM users WHERE user_id = ? AND user_allowed = 1 LIMIT 1';

    return new Promise((resolve, reject) => {
      db.getConnection((err, connection) => {
        if (err) reject(err);

        connection.query(query, id, (error, results) => {
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

  list(page, limit = 20) {
    const db = mysql.createPool(databaseConfig);

    const begin = (limit * page) - limit;

    const query = 'SELECT user_id, user_name, user_last_name, user_email, user_avatar, user_bio, user_created_at, user_allowed FROM users LIMIT ?,?';

    return new Promise((resolve, reject) => {
      db.getConnection((err, connection) => {
        if (err) reject(err);

        connection.query(query, [begin, limit], (error, results) => {
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

    const query = 'SELECT user_avatar, user_bio, user_created_at, user_email, user_id, user_last_name, user_name FROM users WHERE user_id = ? LIMIT 1';

    return new Promise((resolve, reject) => {
      db.getConnection((err, connection) => {
        if (err) reject(err);

        connection.query(query, id, (error, results) => {
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

  update(data) {
    const db = mysql.createPool(databaseConfig);

    const { id } = data;

    const columns = {
      user_name: data.name,
      user_last_name: data.lastName,
      user_bio: data.bio,
    };

    const query = 'UPDATE users SET ? WHERE user_id = ? LIMIT 1';

    return new Promise((resolve, reject) => {
      db.getConnection((err, connection) => {
        if (err) reject(err);

        connection.query(query, [columns, id], (error, results) => {
          connection.release();
          connection.destroy();

          if (error) reject(error);

          resolve(results);
        });
      });
    });
  }

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

  checkPassword(data) {
    const db = mysql.createPool(databaseConfig);

    const oldPassword = mysql.raw(`SHA2('${data.oldPassword}', 256)`);
    const { id } = data;

    const columns = [
      id,
      oldPassword,
    ];

    const query = 'SELECT user_id FROM users WHERE user_id = ? AND user_password = ?';

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

  updatePassword(data) {
    const db = mysql.createPool(databaseConfig);

    const columns = [
      mysql.raw(`SHA2('${data.password}', 256)`),
      data.id,
    ];

    const query = 'UPDATE users SET user_password = ? WHERE user_id = ?';

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

  updateAvatar(data) {
    const db = mysql.createPool(databaseConfig);

    const columns = [
      data.avatar,
      data.id,
    ];

    const query = 'UPDATE users SET user_avatar = ? WHERE user_id = ?';

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
}

export default new User();
