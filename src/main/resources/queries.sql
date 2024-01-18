--user table
CREATE TABLE user (
    userid INT PRIMARY KEY AUTO_INCREMENT,
    emailid VARCHAR(50) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(200) NOT NULL,
    status BOOLEAN DEFAULT TRUE,  -- Added status field with default TRUE
    createddate DATETIME DEFAULT CURRENT_TIMESTAMP,
    updateddate DATETIME ON UPDATE CURRENT_TIMESTAMP
);
--systemadmin
CREATE TABLE systemadmin (
    sysid INT PRIMARY KEY AUTO_INCREMENT,
    userid INT UNIQUE NOT NULL,
    createddate DATETIME DEFAULT CURRENT_TIMESTAMP,
    updateddate DATETIME ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userid) REFERENCES user(userid) ON DELETE CASCADE
);
--admin table
CREATE TABLE admin (
    adminid INT PRIMARY KEY AUTO_INCREMENT,
    userid INT UNIQUE NOT NULL,
    name VARCHAR(200),
    field1 VARCHAR(250),
    field2 VARCHAR(250),
    field3 VARCHAR(250),
    field4 VARCHAR(250),
    field5 VARCHAR(250),
    createddate DATETIME DEFAULT CURRENT_TIMESTAMP,
    updateddate DATETIME ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userid) REFERENCES user(userid) ON DELETE CASCADE
);
--student table
CREATE TABLE student (
    stuid INT PRIMARY KEY AUTO_INCREMENT,
    userid INT UNIQUE NOT NULL,
    fname VARCHAR(200),
    lname VARCHAR(200),
    field1 VARCHAR(250),
    field2 VARCHAR(250),
    field3 VARCHAR(250),
    field4 VARCHAR(250),
    field5 VARCHAR(250),
    createddate DATETIME DEFAULT CURRENT_TIMESTAMP,
    updateddate DATETIME ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userid) REFERENCES user(userid) ON DELETE CASCADE
);
--teacher table
CREATE TABLE teacher (
    teacherid INT PRIMARY KEY AUTO_INCREMENT,
    userid INT UNIQUE NOT NULL,
    fname VARCHAR(200),
    lname VARCHAR(200),
    field1 VARCHAR(250),
    field2 VARCHAR(250),
    field3 VARCHAR(250),
    field4 VARCHAR(250),
    field5 VARCHAR(250),
    createddate DATETIME DEFAULT CURRENT_TIMESTAMP,
    updateddate DATETIME ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userid) REFERENCES user(userid) ON DELETE CASCADE
);

INSERT INTO user (emailid, phone, password, status)
VALUES ('admin@example.com', '123-456-7890', '1234567890', TRUE)
ON DUPLICATE KEY UPDATE status = TRUE;

INSERT INTO systemadmin (userid)
VALUES (LAST_INSERT_ID());