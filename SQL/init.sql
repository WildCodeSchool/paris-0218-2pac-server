DROP DATABASE IF EXISTS pac;
CREATE DATABASE pac;
USE pac;

CREATE USER IF NOT EXISTS 'server'@'localhost';
GRANT ALL PRIVILEGES ON pac.* To 'server'@'localhost' IDENTIFIED BY 'mysql';

-- TODOS:
-- - tags table
-- - pinnedArticles table

-- CREATE TABLE tags
-- (
-- id INT PRIMARY KEY AUTO_INCREMENT,
-- name VARCHAR(50)
-- )


CREATE TABLE articles_categories
(
id INT PRIMARY KEY AUTO_INCREMENT,
name VARCHAR(50)  
);

INSERT INTO articles_categories (name)
VALUES
('actualité'), 
('évènement'), 
('presse'), 
('communiqués de presse');

CREATE TABLE articles
(
id INT PRIMARY KEY AUTO_INCREMENT,
createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
title VARCHAR(90),
shortDescription TEXT,
description TEXT,
eventDate DATETIME,
categoryId INT NOT NULL,
imageURL VARCHAR(2083),
imageDescription TEXT,
FOREIGN KEY (categoryId)
  REFERENCES articles_categories(id)
  ON DELETE CASCADE
);
-- TODO: FOREIGN keys (O:M resources; O:M tags)

CREATE TABLE documents_types
(
id INT PRIMARY KEY AUTO_INCREMENT,
name VARCHAR(50)  
);

INSERT INTO documents_types (name)
VALUES
('textes politiques'),
('documents de position des organisations membres'),
('travaux de recherche'),
('autres documents de position'),
('documents réservés aux membres');

CREATE TABLE documents
(
id INT PRIMARY KEY AUTO_INCREMENT,
createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
typeId INT NOT NULL,
title VARCHAR(90),
shortDescription TEXT,
url VARCHAR(2083),
isMemberOnly BOOLEAN,
isResource BOOLEAN,
isArchived BOOLEAN,
FOREIGN KEY (typeId)
  REFERENCES documents_types(id)
  ON DELETE CASCADE
);
-- TODO: FOREIGN keys (O:M tags)

CREATE TABLE users
(
id INT PRIMARY KEY AUTO_INCREMENT,
createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
isAdmin BOOLEAN,
username VARCHAR(30) NOT NULL,
password VARCHAR(30) NOT NULL
);

CREATE TABLE subscribers
(
id INT PRIMARY KEY AUTO_INCREMENT,
createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
firstName VARCHAR(90) NOT NULL,
lastName VARCHAR(90) NOT NULL,
email VARCHAR(90) NOT NULL
)
