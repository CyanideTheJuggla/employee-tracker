USE employee_tracker_db;
INSERT INTO department(department_name)
    VALUES 
        ("Engineering"),
        ("Finance"),
        ("Legal"),
        ("Sales"),
        ("Administration");

INSERT INTO roles(role_title, salary, department_id, manager)
    VALUES
        ("Lead Engineer", 150000.0, 1),
        ("Software Engineer", 120000.0, 1),
        ("Account Manager", 160000.0, 2),
        ("Accountant", 125000.0, 2),
        ("Sales Lead", 100000.0, 4),
        ("Salesperson", 80000.0, 4),
        ("Legal Team Lead", 250000.0, 3),
        ("Attorney", 190000.0, 3);

INSERT INTO employee(f_name, l_name, role_id, manager_id)
    VALUES
        ("John", "Doe", 5, NULL),
        ("Mike", "Chan", 6, 1),
        ("Ashley", "Rodriguez", 1, NULL),
        ("Kevin", "Tupik", 2, 3),
        ("Kunal", "Singh", 3, NULL),
        ("Malia", "Brown", 4, 5),
        ("Sarah", "Lourd", 7, NULL),
        ("Tom", "Allen", 8, 7);