CREATE TABLE IF NOT EXISTS users (
  user_id INT NOT NULL AUTO_INCREMENT,
  user_name VARCHAR(255) NOT NULL,
  user_last_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  user_password VARCHAR(255) NOT NULL,
  user_avatar VARCHAR(255),
  user_bio TEXT,
  user_created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  user_allowed BOOLEAN NOT NULL DEFAULT 1,
  PRIMARY KEY (user_id),
  UNIQUE(user_email)
);

CREATE TABLE IF NOT EXISTS categories (
  category_id INT NOT NULL AUTO_INCREMENT,
  category_title VARCHAR(255) NOT NULL,
  category_cover VARCHAR(255) NOT NULL,
  PRIMARY KEY (category_id),
  UNIQUE(category_title)
);

CREATE TABLE IF NOT EXISTS types (
  type_id INT NOT NULL AUTO_INCREMENT,
  type_title VARCHAR(255) NOT NULL,
  PRIMARY KEY (type_id),
  UNIQUE(type_title)
);

CREATE TABLE IF NOT EXISTS categories_types (
	category_id INT NOT NULL,
	type_id INT NOT NULL,
  FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (type_id) REFERENCES types(type_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS posts (
  post_id INT NOT NULL AUTO_INCREMENT,
  post_title VARCHAR(255) NOT NULL,
  post_cover VARCHAR(255),
  post_description TEXT NOT NULL,
  post_views INT(10),
  post_visible BOOLEAN NOT NULL DEFAULT 1,
  post_difficult VARCHAR(20) NOT NULL,
  post_duration VARCHAR(30) NOT NULL,
  post_created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  post_url VARCHAR(255) NOT NULL,
  user_id INT NOT NULL,
  category_id INT NOT NULL,
  type_id INT NOT NULL,
  PRIMARY KEY (post_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (type_id) REFERENCES types(type_id) ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE(post_url)
);

CREATE TABLE IF NOT EXISTS posts_likes (
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS materials (
  material_id INT NOT NULL AUTO_INCREMENT,
  material_name VARCHAR(255) NOT NULL,
  PRIMARY KEY (material_id),
  UNIQUE(material_name)
);

CREATE TABLE IF NOT EXISTS posts_materials (
  post_material_qty INT NOT NULL,
  post_material_meas VARCHAR(255) NOT NULL,
  post_id INT NOT NULL,
  material_id INT NOT NULL,
  FOREIGN KEY (material_id) REFERENCES materials(material_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE ON UPDATE CASCADE  
);

CREATE TABLE IF NOT EXISTS posts_steps (
  post_step_id INT NOT NULL AUTO_INCREMENT,
	post_step_description TEXT NOT NULL,
	post_step_cover VARCHAR(255),
	post_step_video VARCHAR(255),
	post_id INT NOT NULL,
	PRIMARY KEY (post_step_id),
  FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS favorites (
	user_id INT NOT NULL,
	post_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE ON UPDATE CASCADE
);