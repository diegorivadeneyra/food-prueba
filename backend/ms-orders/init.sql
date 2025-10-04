CREATE DATABASE IF NOT EXISTS ordersdb;
USE ordersdb;

CREATE TABLE IF NOT EXISTS pedidos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  cliente_id INT NOT NULL,
  fecha DATETIME NOT NULL,
  estado VARCHAR(20) DEFAULT 'pendiente',
  notas TEXT
);

CREATE TABLE IF NOT EXISTS items_pedido (
  id INT PRIMARY KEY AUTO_INCREMENT,
  pedido_id INT NOT NULL,
  plato_id VARCHAR(50) NOT NULL,
  cantidad INT NOT NULL,
  precio DECIMAL(10,2) NOT NULL
);
