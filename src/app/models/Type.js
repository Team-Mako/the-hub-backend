import mysql from 'mysql';
import databaseConfig from '../../config/database';

class Type {
  create(data) {
    const db = mysql.createPool(databaseConfig);

    const columns = {
      type_title: data.title,
      category_id: data.categoryId,
    };

    const query = 'INSERT INTO types SET ?';

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

  list(page, limit = 20) {
    const db = mysql.createPool(databaseConfig);

    const begin = (limit * page) - limit;

    const query = 'SELECT * FROM types LIMIT ?,?';

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

    const query = 'SELECT * FROM types WHERE type_id = ? LIMIT 1';

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
      type_title: data.title,
    };

    const query = 'UPDATE types SET ? WHERE type_id = ? LIMIT 1';

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

    const query = 'DELETE FROM types WHERE type_id = ? LIMIT 1';

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

export default new Type();
