import mysql from 'mysql';
import databaseConfig from '../../config/database';

class Material {
  create(data) {
    const db = mysql.createPool(databaseConfig);

    const columns = {
      material_name: data.name,
      category_id: data.category,
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

  list(page, limit, category) {
    const db = mysql.createPool(databaseConfig);

    const begin = (limit * page) - limit;
    limit = parseInt(limit);

    if (category) {
      category = mysql.raw(`WHERE category_id = ${category}`);
    } else {
      category = mysql.raw('');
    }

    const query = 'SELECT * FROM materials ? ORDER BY material_name ASC LIMIT ?,?';

    return new Promise((resolve, reject) => {
      db.getConnection((err, connection) => {
        if (err) reject(err);

        connection.query(query, [category, begin, limit], (error, results) => {
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

    const query = 'SELECT * FROM materials WHERE material_id = ? ORDER BY material_name ASC LIMIT 1';

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

  checkIfExists(data) {
    const db = mysql.createPool(databaseConfig);

    const columns = [
      data.name,
      data.category,
    ];

    const query = 'SELECT COUNT(material_id) AS total FROM materials WHERE material_name = ? AND category_id = ?';

    return new Promise((resolve, reject) => {
      db.getConnection((err, connection) => {
        if (err) reject(err);

        connection.query(query, columns, (error, results) => {
          connection.release();
          connection.destroy();

          if (error) reject(error);

          resolve(results[0].total);
        });
      });
    });
  }
}

export default new Material();
