import mysql from 'mysql';
import databaseConfig from '../../config/database';

class Material {
  create(data) {
    const db = mysql.createPool(databaseConfig);

    const columns = {
      material_name: data.name,
    };

    const query = 'INSERT INTO materials SET ?';

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

  list(page, limit) {
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

    const query = 'SELECT * FROM materials WHERE material_id = ? LIMIT 1';

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
      material_name: data.name,
    };

    const query = 'UPDATE materials SET ? WHERE material_id = ? LIMIT 1';

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

    const query = 'DELETE FROM materials WHERE material_id = ? LIMIT 1';

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

export default new Material();
