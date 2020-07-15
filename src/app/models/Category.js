import mysql from 'mysql';
import databaseConfig from '../../config/database';

class Category {
  create(data) {
    const db = mysql.createPool(databaseConfig);

    const columns = {
      category_title: data.title,
      category_subtitle: data.subtitle,
      category_cover: data.cover,
      category_cover_small: 'teste',
      category_slug: 'teste',
    };

    const query = 'INSERT INTO categories SET ?';

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

    const query = 'SELECT * FROM categories LIMIT ?,?';

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

    const query = 'SELECT * FROM categories WHERE category_id = ? LIMIT 1';

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

    const { id } = data;

    const columns = {
      category_title: data.title,
    };

    if (data.cover) columns.category_cover = data.cover;

    const query = 'UPDATE categories SET ? WHERE category_id = ? LIMIT 1';

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

    const query = 'DELETE FROM categories WHERE category_id = ? LIMIT 1';

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

export default new Category();
