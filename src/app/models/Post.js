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
      post_cover: data.cover,
      user_id: data.userId,
      category_id: data.categoryId,
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

    const query = 'SELECT p.*, u.user_id, u.user_name, u.user_avatar, c.category_id, c.category_title, (SELECT COUNT(post_id) FROM posts_likes WHERE post_id = p.post_id) AS post_likes, (SELECT COUNT(post_id) FROM posts_views WHERE post_id = p.post_id) AS post_views FROM posts AS p LEFT JOIN categories AS c ON p.category_id = c.category_id LEFT JOIN users AS u ON p.user_id = u.user_id ? GROUP BY post_id ORDER BY post_created_at DESC LIMIT ?,?';

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

  listByCategory(page, limit, category) {
    const db = mysql.createPool(databaseConfig);

    limit = parseInt(limit);
    const begin = (limit * page) - limit;

    const query = 'SELECT p.*, u.user_id, u.user_name, u.user_avatar, c.category_id, c.category_title, (SELECT COUNT(post_id) FROM posts_likes WHERE post_id = p.post_id) AS post_likes, (SELECT COUNT(post_id) FROM posts_views WHERE post_id = p.post_id) AS post_views FROM posts AS p LEFT JOIN categories AS c ON p.category_id = c.category_id LEFT JOIN users AS u ON p.user_id = u.user_id WHERE p.category_id = ? GROUP BY post_id ORDER BY post_created_at DESC LIMIT ?,?';

    return new Promise((resolve, reject) => {
      db.getConnection((err, connection) => {
        if (err) reject(err);

        connection.query(query, [category, begin, limit], (error, results) => {
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

    const query = 'SELECT p.*, u.user_name, u.user_avatar, c.category_title, (SELECT COUNT(post_id) FROM posts_likes WHERE post_id = p.post_id) AS post_likes, (SELECT COUNT(post_id) FROM posts_views WHERE post_id = p.post_id) AS post_views FROM posts AS p LEFT JOIN categories AS c ON p.category_id = c.category_id LEFT JOIN users AS u ON p.user_id = u.user_id WHERE post_url = ?';

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

  getId(slug) {
    const db = mysql.createPool(databaseConfig);

    const columns = [
      slug,
    ];

    const query = 'SELECT post_id, category_id FROM posts WHERE post_url = ?';

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
      post_visible: data.visible,
      category_id: data.categoryId,
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

  totalPosts(user, category, search) {
    const db = mysql.createPool(databaseConfig);

    let sql;

    if (user) {
      sql = mysql.raw(`WHERE user_id = ${user}`);
    } else if (category) {
      sql = mysql.raw(`WHERE category_id = ${category}`);
    } else if (search) {
      sql = mysql.raw(`WHERE post_title LIKE '${search}'`);
    } else {
      sql = mysql.raw('');
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

  addStep(description, cover, id) {
    const db = mysql.createPool(databaseConfig);

    const columns = {
      post_step_description: description,
      post_id: id,
    };

    if (cover.length > 0) {
      columns.post_step_cover = cover;
    }

    const query = 'INSERT INTO posts_steps SET ?';

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

  deleteStep(id) {
    const db = mysql.createPool(databaseConfig);

    const columns = [
      id,
    ];

    const query = 'DELETE FROM posts_steps WHERE post_step_id = ?';

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

  addMaterial(meas, postId, materialId, userId) {
    const db = mysql.createPool(databaseConfig);

    const columns = {
      post_material_meas: meas,
      post_id: postId,
      material_id: materialId,
      user_id: userId,
    };

    const query = 'INSERT INTO posts_materials SET ?';

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

  topCategories(data) {
    const db = mysql.createPool(databaseConfig);

    const columns = [
      data,
    ];

    const query = 'SELECT COUNT(p.category_id) AS top, c.category_title FROM posts AS p LEFT JOIN categories AS c ON p.category_id = c.category_id WHERE user_id = ? GROUP BY p.category_id ORDER BY top DESC LIMIT 5';

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

  topMaterials(data) {
    const db = mysql.createPool(databaseConfig);

    const columns = [
      data,
    ];

    const query = 'SELECT COUNT(pm.material_id) AS top, m.material_name FROM posts_materials AS pm LEFT JOIN materials AS m ON pm.material_id = m.material_id WHERE user_id = ? GROUP BY pm.material_id ORDER BY top DESC LIMIT 3';

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

  postMaterials(data) {
    const db = mysql.createPool(databaseConfig);

    const columns = [
      data,
    ];

    const query = 'SELECT pm.post_material_meas, pm.material_id, m.material_name FROM posts_materials AS pm LEFT JOIN materials AS m ON pm.material_id = m.material_id WHERE pm.post_id = ?';

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

  postSteps(data) {
    const db = mysql.createPool(databaseConfig);

    const columns = [
      data,
    ];

    const query = 'SELECT * FROM posts_steps WHERE post_id = ?';

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

  updateViews(postId, userId) {
    const db = mysql.createPool(databaseConfig);

    const columns = {
      post_view_date: mysql.raw('NOW()'),
      post_id: postId,
      user_id: userId,
    };

    const query = 'INSERT INTO posts_views SET ?';

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

  checkLike(data) {
    const db = mysql.createPool(databaseConfig);

    const columns = [
      parseInt(data.postId),
      data.userId,
    ];

    const query = 'SELECT COUNT(post_id) AS "check" FROM posts_likes WHERE post_id = ? AND give_id = ?';

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

  insertLike(data) {
    const db = mysql.createPool(databaseConfig);

    const columns = {
      user_id: data.userId,
      post_id: data.postId,
      give_id: data.giveId,
    };

    const query = 'INSERT INTO posts_likes SET ?';

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

  removeLike(data) {
    const db = mysql.createPool(databaseConfig);

    const columns = [
      data.postId,
      data.userId,
    ];

    const query = 'DELETE FROM posts_likes WHERE post_id = ? AND give_id = ?';

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

  setFavourite(data) {
    const db = mysql.createPool(databaseConfig);

    const columns = {
      user_id: data.userId,
      post_id: data.postId,
    };

    const query = 'INSERT INTO favorites SET ?';

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

  checkFavourite(data) {
    const db = mysql.createPool(databaseConfig);

    const columns = [
      data.userId,
      data.postId,
    ];

    const query = 'SELECT COUNT(post_id) AS "check" FROM favorites WHERE user_id = ? AND post_id = ?';

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

  removeFavourite(data) {
    const db = mysql.createPool(databaseConfig);

    const columns = [
      data.postId,
      data.userId,
    ];

    const query = 'DELETE FROM favorites WHERE post_id = ? AND user_id = ?';

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

  favList(data) {
    const db = mysql.createPool(databaseConfig);

    const columns = [
      data,
    ];

    const query = 'SELECT f.post_id, p.post_title, p.post_cover, p.post_url, u.user_name, u.user_avatar, (SELECT COUNT(post_id) FROM posts_views WHERE post_id = f.post_id) AS post_views, (SELECT COUNT(post_id) FROM posts_likes WHERE post_id = f.post_id) AS post_likes FROM favorites AS f LEFT JOIN posts AS p ON f.post_id = p.post_id LEFT JOIN users AS u ON p.user_id = u.user_id WHERE f.user_id = ?';

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

  timelineView(data) {
    const db = mysql.createPool(databaseConfig);

    const date = new Date();
    const setOld = date.setDate(date.getDate() - 7);
    const oldDay = `${date.getFullYear(setOld)}-${date.getMonth(setOld) + 1}-${date.getDate(setOld)}`;

    const columns = [
      data,
      oldDay,
    ];

    const query = 'SELECT COUNT(user_id) AS Total, post_view_date FROM posts_views WHERE user_id = ? AND post_view_date BETWEEN ? AND NOW() GROUP BY post_view_date';

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

  searchByName(search, page, limit) {
    const db = mysql.createPool(databaseConfig);

    const value = mysql.raw(`LIKE '%${search}%'`);

    limit = parseInt(limit);
    const begin = (limit * page) - limit;

    const query = 'SELECT p.*, u.user_id, u.user_name, u.user_avatar, c.category_id, c.category_title, (SELECT COUNT(post_id) FROM posts_likes WHERE post_id = p.post_id) AS post_likes, (SELECT COUNT(post_id) FROM posts_views WHERE post_id = p.post_id) AS post_views FROM posts AS p LEFT JOIN categories AS c ON p.category_id = c.category_id LEFT JOIN users AS u ON p.user_id = u.user_id WHERE p.post_title ? GROUP BY post_id ORDER BY post_created_at DESC LIMIT ?,?';

    return new Promise((resolve, reject) => {
      db.getConnection((err, connection) => {
        if (err) reject(err);

        connection.query(query, [value, begin, limit], (error, results) => {
          connection.release();
          connection.destroy();

          if (error) reject(error);

          resolve(results);
        });
      });
    });
  }

  totalLikes(data) {
    const db = mysql.createPool(databaseConfig);

    const query = 'SELECT (SELECT COUNT(user_id) FROM posts_likes WHERE user_id = ?) AS "received", (SELECT COUNT(give_id) FROM posts_likes WHERE give_id = ?) AS "given" FROM posts_likes';

    return new Promise((resolve, reject) => {
      db.getConnection((err, connection) => {
        if (err) reject(err);

        connection.query(query, [data, data], (error, results) => {
          connection.release();
          connection.destroy();

          if (error) reject(error);

          resolve(results);
        });
      });
    });
  }

  insertComment(data) {
    const db = mysql.createPool(databaseConfig);

    const columns = {
      post_comment_content: data.comment,
      post_comment_at: mysql.raw('NOW()'),
      post_id: data.postId,
      user_id: data.userId,
      give_id: data.giveId,
    };

    const query = 'INSERT INTO posts_comments SET ?';

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

  getComments(data) {
    const db = mysql.createPool(databaseConfig);

    const query = 'SELECT c.*, u.user_name, u.user_avatar FROM posts_comments AS c LEFT JOIN users AS u ON c.give_id = u.user_id WHERE post_id = ? ORDER BY post_comment_at DESC';

    return new Promise((resolve, reject) => {
      db.getConnection((err, connection) => {
        if (err) reject(err);

        connection.query(query, data, (error, results) => {
          connection.release();
          connection.destroy();

          if (error) reject(error);

          resolve(results);
        });
      });
    });
  }

  totalComents(data) {
    const db = mysql.createPool(databaseConfig);

    const query = 'SELECT (SELECT COUNT(user_id) FROM posts_comments WHERE user_id = ?) AS "received", (SELECT COUNT(give_id) FROM posts_comments WHERE give_id = ?) AS "given" FROM posts_comments';

    return new Promise((resolve, reject) => {
      db.getConnection((err, connection) => {
        if (err) reject(err);

        connection.query(query, [data, data], (error, results) => {
          connection.release();
          connection.destroy();

          if (error) reject(error);

          resolve(results);
        });
      });
    });
  }

  filter(material = '', difficulty = '', time = '', categoryId, page, limit) {
    const db = mysql.createPool(databaseConfig);

    if (material) {
      material = mysql.raw(`AND pm.material_id = ${material}`);
    } else {
      material = mysql.raw('');
    }

    if (difficulty) {
      difficulty = mysql.raw(`AND p.post_difficult = '${difficulty}'`);
    } else {
      difficulty = mysql.raw('');
    }

    if (time) {
      time = mysql.raw(`AND p.post_duration = '${time}'`);
    } else {
      time = mysql.raw('');
    }

    limit = parseInt(limit);
    const begin = (limit * page) - limit;

    const query = 'SELECT p.*, u.user_id, u.user_name, u.user_avatar, c.category_id, c.category_title, (SELECT COUNT(post_id) FROM posts_likes WHERE post_id = p.post_id) AS post_likes, (SELECT COUNT(post_id) FROM posts_views WHERE post_id = p.post_id) AS post_views FROM posts AS p LEFT JOIN categories AS c ON p.category_id = c.category_id LEFT JOIN users AS u ON p.user_id = u.user_id LEFT JOIN posts_materials AS pm ON p.post_id = pm.post_id WHERE p.category_id = ? ? ? ? GROUP BY p.post_id ORDER BY p.post_created_at DESC LIMIT ?,?';

    return new Promise((resolve, reject) => {
      db.getConnection((err, connection) => {
        if (err) reject(err);

        connection.query(query, [categoryId, material, difficulty, time, begin, limit], (error, results) => {
          connection.release();
          connection.destroy();

          if (error) reject(error);

          resolve(results);
        });
      });
    });
  }

  countFilter(material = '', difficulty = '', time = '', categoryId) {
    const db = mysql.createPool(databaseConfig);

    let queryComplex = mysql.raw('');

    if (material) {
      material = mysql.raw(`AND pm.material_id = ${material}`);
      queryComplex = mysql.raw('LEFT JOIN posts_materials AS pm ON p.post_id = pm.post_id');
    } else {
      material = mysql.raw('');
    }

    if (difficulty) {
      difficulty = mysql.raw(`AND p.post_difficult = '${difficulty}'`);
    } else {
      difficulty = mysql.raw('');
    }

    if (time) {
      time = mysql.raw(`AND p.post_duration = '${time}'`);
    } else {
      time = mysql.raw('');
    }

    const query = 'SELECT COUNT(p.post_id) AS total FROM posts AS p ? WHERE p.category_id = ? ? ? ?';

    return new Promise((resolve, reject) => {
      db.getConnection((err, connection) => {
        if (err) reject(err);

        connection.query(query, [queryComplex, categoryId, material, difficulty, time], (error, results) => {
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
