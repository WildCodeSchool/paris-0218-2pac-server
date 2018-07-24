DROP DATABASE IF EXISTS pac;
CREATE DATABASE pac CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pac;

CREATE TABLE articles_categories
(
categoryId INT PRIMARY KEY AUTO_INCREMENT,
category VARCHAR(50)
);

INSERT INTO articles_categories (category) VALUES ("Article");
INSERT INTO articles_categories (category) VALUES ("Presse");
INSERT INTO articles_categories (category) VALUES ("Actualité");
INSERT INTO articles_categories (category) VALUES ("Evénement");

CREATE TABLE articles
(
id INT PRIMARY KEY AUTO_INCREMENT,
createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
title VARCHAR(90),
shortDescription TEXT,
description TEXT,
eventDate TEXT,
categoryId INT NOT NULL,
imageURL VARCHAR(2083),
imageDescription TEXT,
isMemberOnly BOOLEAN,
isStared BOOLEAN DEFAULT 0,
tags TEXT,
FOREIGN KEY (categoryId)
  REFERENCES articles_categories(categoryId)
  ON DELETE CASCADE
);

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
FOREIGN KEY (typeId)
  REFERENCES documents_types(typeId)
  ON DELETE CASCADE
);

CREATE TABLE users
(
id INT PRIMARY KEY AUTO_INCREMENT,
createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
isAdmin BOOLEAN DEFAULT 0,
username VARCHAR(30) NOT NULL UNIQUE,
password VARCHAR(100) NOT NULL
);

CREATE TABLE subscribers
(
id INT PRIMARY KEY AUTO_INCREMENT,
createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
reuseableInfo BOOLEAN,
firstName VARCHAR(90) NOT NULL,
lastName VARCHAR(90) NOT NULL,
phoneNumber TEXT(20) NOT NULL,
email VARCHAR(90) NOT NULL
);

CREATE TABLE statics
(
id INT PRIMARY KEY AUTO_INCREMENT,
slug TEXT,
content TEXT
);
