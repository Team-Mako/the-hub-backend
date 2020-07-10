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
      post_created_at: mysql.raw('NOW()'),
      post_views: 0,
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

  list(page, limit, user) {
    const db = mysql.createPool(databaseConfig);

    if (user) {
      user = mysql.raw(`WHERE p.user_id = ${user}`);
    } else {
      user = mysql.raw('');
    }

    limit = parseInt(limit);
    const begin = (limit * page) - limit;

    const query = 'SELECT p.*, u.user_id, u.user_name, u.user_avatar, c.category_id, c.category_title, t.type_title, t.type_id, COUNT(l.post_id) AS post_like FROM posts AS p LEFT JOIN categories AS c ON p.category_id = c.category_id LEFT JOIN users AS u ON p.user_id = u.user_id LEFT JOIN types AS t ON p.type_id = t.type_id LEFT JOIN posts_likes AS l ON p.post_id = l.post_id ? GROUP BY post_id ORDER BY post_created_at DESC LIMIT ?,?';

    return new Promise((resolve, reject) => {
      db.getConnection((err, connection) => {
        if (err) reject(err);

        connection.query(query, [user, begin, limit], (error, results) => {
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

    const query = 'SELECT p.*, u.user_name, c.category_title, t.type_title FROM posts AS p LEFT JOIN categories AS c ON p.category_id = c.category_id LEFT JOIN users AS u ON p.user_id = u.user_id LEFT JOIN types AS t ON p.type_id = t.type_id WHERE post_url = ? LIMIT 1';

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

  totalPosts(user, category) {
    const db = mysql.createPool(databaseConfig);

    let sql;

    if (user) {
      sql = mysql.raw(`WHERE user_id = ${user}`);
    } else if (category) {
      sql = mysql.raw(`WHERE category_id = ${category}`);
    }

    const query = 'SELECT COUNT(post_id) AS total FROM posts ?';

    return new Promise((resolve, reject) => {
      db.getConnection((err, connection) => {
        if (err) reject(err);

        connection.query(query, sql, (error, results) => {
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
