import mysql from 'mysql';
import databaseConfig from '../../config/database';

class Admin {
  create(data) {
    const db = mysql.createPool(databaseConfig);

    const columns = {
      admin_name: data.name,
      admin_last_name: data.name,
      admin_email: data.email,
      admin_password: mysql.raw(`SHA2('${data.password}', 256)`),
      admin_can_delete: data.canDelete,
    };

    const query = 'INSERT INTO admins SET ?';

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

    const query = 'SELECT admin_id AS id, admin_name AS name, admin_email AS email FROM admins WHERE admin_email = ? AND admin_password = ? LIMIT 1';

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

          if (error) {
            reject(error);
          }

          resolve(results[0]);
        });
      });
    });
  }
}

export default new Admin();
