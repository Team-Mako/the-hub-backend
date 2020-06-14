import mysql from 'mysql';
import databaseConfig from '../../config/database';

class Post {
  create(data) {
    const db = mysql.createPool(databaseConfig);

    const columns = {
      post_title: data.title,
      post_description: data.desc,
      post_difficult: data.difficult,
      post_duration: data.duration,
      post_url: data.url,
      user_id: data.userId,
      category_id: data.categoryId,
      type_id: data.typeId,
    };

    const query = 'INSERT INTO posts SET ?';

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

    const query = 'SELECT * FROM posts LIMIT ?,?';

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

  findBySlug(slug) {
    const db = mysql.createPool(databaseConfig);

    const columns = [
      slug,
    ];

    const query = 'SELECT * FROM posts WHERE post_url = ? LIMIT 1';

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

  update(data) {
    const db = mysql.createPool(databaseConfig);

    const { id } = data;

    const columns = {
      post_title: data.title,
      post_description: data.desc,
      post_difficult: data.difficult,
      post_duration: data.duration,
      post_url: data.url,
      post_visible: data.visible,
      category_id: data.categoryId,
      type_id: data.typeId,
    };

    const query = 'UPDATE posts SET ? WHERE post_id = ?';

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

  delete(data) {
    const db = mysql.createPool(databaseConfig);

    const { id } = data;

    const query = 'DELETE FROM posts WHERE post_id = ? LIMIT 1';

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

export default new Post();
