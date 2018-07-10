DROP DATABASE IF EXISTS pac;
CREATE DATABASE pac;
USE pac;

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
categoryId INT PRIMARY KEY AUTO_INCREMENT,
category VARCHAR(50)
);

INSERT INTO articles_categories (category) VALUES ("Actualité");
INSERT INTO articles_categories (category) VALUES ("Evénement");
INSERT INTO articles_categories (category) VALUES ("Presse");
INSERT INTO articles_categories (category) VALUES ("Communiqués de presse");

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
  REFERENCES articles_categories(categoryId)
  ON DELETE CASCADE
);
-- TODO: FOREIGN keys (O:M resources; O:M tags)

CREATE TABLE documents_types
(
typeId INT PRIMARY KEY AUTO_INCREMENT,
type VARCHAR(50)
);

INSERT INTO documents_types (type) VALUES ("Textes politiques");
INSERT INTO documents_types (type) VALUES ("Documents de position des organisations membres");
INSERT INTO documents_types (type) VALUES ("Documents réservés aux membres");
INSERT INTO documents_types (type) VALUES ("Travaux de recherche");
INSERT INTO documents_types (type) VALUES ("Autres documents de position");

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
  REFERENCES documents_types(typeId)
  ON DELETE CASCADE
);
-- TODO: FOREIGN keys (O:M tags)

CREATE TABLE events
(
id INT PRIMARY KEY AUTO_INCREMENT,
createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
eventDate DATETIME,
title VARCHAR(90),
shortDescription TEXT,
description TEXT
);

CREATE TABLE users
(
id INT PRIMARY KEY AUTO_INCREMENT,
createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
isAdmin BOOLEAN DEFAULT 0,
username VARCHAR(30) NOT NULL UNIQUE,
password VARCHAR(100) NOT NULL
);

-- ADMIN ACCOUNT
INSERT INTO users (username, password, isAdmin) VALUES ("admin", "$2b$10$Iae4rGF5t4Fm.RPVDDabSuZNzWg97q5sqXEl/aoP4JiVpIufwBhVu", 1);
-- MEMBER ACCOUNT
INSERT INTO users (username, password, isAdmin) VALUES ("member", "$2b$10$OHIeQ/eY1UvjzRDVDtofmOBl5l9Sq6ix8hW2mnOgl1vcMCnCt9.gq", 0);

CREATE TABLE subscribers
(
id INT PRIMARY KEY AUTO_INCREMENT,
createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
reuseableInfo BOOLEAN,
firstName VARCHAR(90) NOT NULL,
lastName VARCHAR(90) NOT NULL,
phoneNumber INT(10) NOT NULL,
email VARCHAR(90) NOT NULL
)
