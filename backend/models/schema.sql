CREATE TABLE roles
(
  role_id SERIAL PRIMARY KEY,
  is_deleted INT DEFAULT 0,
  role_name VARCHAR(255) NOT NULL
);

CREATE TABLE permissions
(
  is_deleted INT DEFAULT 0,
  permission_id SERIAL PRIMARY KEY,
  permission_name VARCHAR(255) NOT NULL

);

CREATE TABLE role_permissions
(
  id SERIAL PRIMARY KEY,
  role_id INT NOT NULL,
  permission_id INT NOT NULL,
  is_deleted INT DEFAULT 0,
  FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(permission_id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE users
(
  user_id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20),
  images TEXT,
  is_deleted INT DEFAULT 0,
  role_id INT NOT NULL,
  FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE categories
(
  category_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  images TEXT,
  is_deleted INT DEFAULT 0
);

CREATE TABLE shops
(
  shop_id SERIAL PRIMARY KEY,
  category_id INT NOT NULL,
  role_id INT NOT NULL,
  name VARCHAR(255) UNIQUE NOT NULL ,
  description TEXT,
  images TEXT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20),
  is_deleted INT DEFAULT 0,
  FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE ON UPDATE CASCADE ,
  FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE products
(
  product_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  images TEXT,
  shop_id INT NOT NULL,
  is_deleted INT DEFAULT 0,
  FOREIGN KEY (shop_id) REFERENCES shops(shop_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE orders
(
  order_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  driver_id INT,
  status VARCHAR(20) DEFAULT 'In progress' CHECK (status IN ('In progress', 'ACCEPTED', 'REJECTED')),
  payment_method VARCHAR(20) CHECK (payment_method IN ('CashOnDelivery', 'PayPal')),
  is_deleted INT DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (driver_id) REFERENCES users(user_id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE order_products
(
  id SERIAL PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  is_deleted INT DEFAULT 0,
  FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE cart
(
  cart_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  is_deleted INT DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE cart_products
(
  id SERIAL PRIMARY KEY,
  cart_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  is_deleted INT DEFAULT 0,

  FOREIGN KEY (cart_id) REFERENCES cart(cart_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE reviews
(
  review_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  review_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted INT DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE ON UPDATE CASCADE

);



-- create roles and permessions 
-- INSERT INTO
--   roles (role)
-- VALUES
--   ('Admin');

-- INSERT INTO
--   permissions (permission)
-- VALUES
--   ('CREATE_ARTICLE');

-- INSERT INTO
--   permissions (permission)
-- VALUES
--   ('CREATE_COMMENT');

-- INSERT INTO
--   role_permission (role_id, permission_id)
-- VALUES
--   (1, 1);

-- INSERT INTO
--   role_permission (role_id, permission_id)
-- VALUES
--   (1, 2);