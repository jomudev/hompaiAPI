CREATE DATABASE Hompai;
USE Hompai;
CREATE TABLE Users (
	id VARCHAR(255) NOT NULL PRIMARY KEY UNIQUE,
    displayName VARCHAR(50),
    email VARCHAR(50) NOT NULL,
    photoURL TEXT,
    phoneNumber INT
);

CREATE TABLE Measures (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    acronym VARCHAR(59)
);

CREATE TABLE Ubications (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    idUsers VARCHAR(255) NOT NULL REFERENCES Users(id),
    name VARCHAR(50) NOT NULL
);

CREATE TABLE Articles (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    idUsers VARCHAR(255) NOT NULL REFERENCES Users(id),
    name VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    initialPrice DECIMAL(10, 2),
    idMeasures INT REFERENCES Measures(id),
    idUbications INT REFERENCES Ubications(id)
);

CREATE TABLE Pantries (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50),
    idUsers VARCHAR(255) NOT NULL REFERENCES Users(id)
);

CREATE TABLE Stock (
	id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    idPantries INT NOT NULL REFERENCES Pantries(id)
);

CREATE TABLE Batches (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    idPantries INT NOT NULL REFERENCES Pantries(id),
    date DATETIME NOT NULL DEFAULT NOW()
);

CREATE TABLE BatchesArticles (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    idArticles INT NOT NULL REFERENCES Articles(id),
    idBatches INT NOT NULL REFERENCES Batches(id),
    quantity INT,
    price DECIMAL(10,2)
);

CREATE TABLE StockProducts (
	idBatchesArticles INT NOT NULL REFERENCES BatchesArticles(id),
    remainingPercentage DECIMAL(3,2) DEFAULT 1.00,
    quantity INT,
    expirationDate DATE
);

CREATE TABLE OutOfStockProducts (
	idBatchesArticles INT NOT NULL REFERENCES BatchesArticles(id)
);

CREATE TABLE ExpiredArticles (
	idBatchesArticles INT NOT NULL REFERENCES BatchesArticles(id),
    checked BOOLEAN DEFAULT FALSE
);