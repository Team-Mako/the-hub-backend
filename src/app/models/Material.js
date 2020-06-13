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
}

export default new Material();
