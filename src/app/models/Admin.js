import mysql from 'mysql';
import databaseConfig from '../../config/database';

class Admin {
  create(data) {
    const db = mysql.createPool(databaseConfig);

    const columns = {
      admin_name: data.name,
      admin_last_name: data.lastName,
      admin_email: data.email,
      admin_password: mysql.raw(`SHA2('${data.password}', 256)`),
      admin_master: data.master,
    };

    const query = 'INSERT INTO admins SET ?';

    return new Promise((resolve, reject) => {
      db.getConnection((err, connection) => {
        if (err) reject(err);

        connection.query(query, columns, (error, results) => {
          connection.release();
          connection.destroy();

          if (error) reject(error);

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

    const query = 'SELECT * FROM admins WHERE admin_email = ? AND admin_password = ? LIMIT 1';

    return new Promise((resolve, reject) => {
      db.getConnection((err, connection) => {
        if (err) reject(err);

        connection.query(query, columns, (error, results) => {
          connection.release();
          connection.destroy();

          if (error) reject(error);

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

    const query = 'SELECT admin_name FROM admins WHERE admin_id = ? AND admin_allowed = 1 LIMIT 1';

    return new Promise((resolve, reject) => {
      db.getConnection((err, connection) => {
        if (err) reject(err);

        connection.query(query, columns, (error, results) => {
          connection.release();
          connection.destroy();

          if (error) reject(error);

          resolve(results[0]);
        });
      });
    });
  }

  list(page, limit = 20) {
    const db = mysql.createPool(databaseConfig);

    const begin = (limit * page) - limit;

    const query = 'SELECT admin_id, admin_name, admin_last_name, admin_email, admin_avatar, admin_created_at, admin_allowed, admin_master FROM admins LIMIT ?,?';

    return new Promise((resolve, reject) => {
      db.getConnection((err, connection) => {
        if (err) reject(err);

        connection.query(query, [begin, limit], (error, results) => {
          connection.release();
          connection.destroy();

          if (error) reject(error);

          resolve(results);
        });
      });
    });
  }

  findById(id) {
    const db = mysql.createPool(databaseConfig);

    const query = 'SELECT admin_id, admin_name, admin_last_name, admin_email, admin_avatar, admin_created_at, admin_allowed, admin_master FROM admins WHERE admin_id = ?';

    return new Promise((resolve, reject) => {
      db.getConnection((err, connection) => {
        if (err) reject(err);

        connection.query(query, id, (error, results) => {
          connection.release();
          connection.destroy();

          if (error) reject(error);

          resolve(results[0]);
        });
      });
    });
  }

  update(data) {
    const db = mysql.createPool(databaseConfig);

    const { id, password, avatar } = data;

    const columns = {
      admin_name: data.name,
      admin_last_name: data.lastName,
      admin_allowed: data.allowed,
      admin_master: data.master,
    };

    if (password) columns.admin_password = password;
    if (avatar) columns.admin_avatar = avatar;

    const query = 'UPDATE admins SET ? WHERE admin_id = ? LIMIT 1';

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

    const query = 'DELETE FROM admins WHERE admin_id = ? LIMIT 1';

    return new Promise((resolve, reject) => {
      db.getConnection((err, connection) => {
        if (err) reject(err);

        connection.query(query, id, (error, results) => {
          connection.release();
          connection.destroy();

          if (error) reject(error);

          resolve(results);
        });
      });
    });
  }
}

export default new Admin();
