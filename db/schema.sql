DROP DATABASE IF EXISTS employee_tracker_db;
CREATE DATABASE IF NOT EXISTS employee_tracker_db;
USE employee_tracker_db;

CREATE TABLE IF NOT EXISTS department(
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(30) NOT NULL
);
CREATE TABLE IF NOT EXISTS roles(
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    role_title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTEGER NOT NULL,
    FOREIGN KEY (department_id)
    REFERENCES department(id)
);
CREATE TABLE IF NOT EXISTS employee(
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    f_name VARCHAR(30) NOT NULL,
    l_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER,
    FOREIGN KEY (role_id)
    REFERENCES roles(id)
);
