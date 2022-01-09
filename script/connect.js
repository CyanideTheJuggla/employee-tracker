require('dotenv').config();
const mysql = require('mysql2');
const fs = require('fs');
const Util = require('./Uitil');

class DatabaseConnection {
    //#region Connection
    #connection;
    Connect() { 
        Util.Log(`Connecting to {${process.env.DB_NAME}}...`, undefined, false);
        this.#connection = mysql.createConnection(
            {
                host: 'localhost',
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
            },
            Util.Log(`Connected.`, undefined, true)
        );
        //this.CheckRows();
    }

    Disconnect() {
        Util.Log('Disconnecting...');
        this.#connection.promise().end().then(res => {
            Util.Log('Disconnected.');
        });

    }
    //#endregion

    //#region Seed
    /*CheckRows(){
        let seedQuery;
        this.#connection.query(
            'SELECT COUNT(*) AS cnt FROM employee;', 
            (err, results, fields) => {
                //Util.Log('err: ', err);
                //Util.Log('fields: ', fields);
                const resultsCount = Number.parseInt(results[0].cnt);
                if (resultsCount == 0) {
                    fs.readFile('./db/seed.sql', (err, data) => {
                        //Util.Log('err: ', err);
                        //Util.Log('data: \n', data.toString().split().join());
                        
                        seedQuery = data.toString().split('\n');
                        this.#connection.query(seedQuery.toLocaleLowerCase(), (err, results, fields) => {
                            
                            
                            //Util.Log("err", err);
                            //Util.Log("results", results);
                            //Util.Log("fields", fields);
                        });
                    });
                    //this.SeedDatabase();
                }
                  
            }
        );
    
           
    }

    SeedDatabase() {
        fs.readFile('../db/seed.sql', (err, data) => {
            Util.Log('data: ', data);
            //this.#connection.query()
        });
    }*/

    //#endregion

/*

SELECT 
    CONCAT(employee.f_name, " ", employee.l_name) as employee_name,
    roles.role_title as role, 
    roles.salary as salary, 
    department.department_name as department_name 
FROM 
    employee 
JOIN 
        roles 
    ON 
        roles.id = employee.role_id 
JOIN 
        department 
    ON 
        department.id = roles.department_id;


/////////////////////////////////////////


SELECT 
    employee.f_name as f_name, 
    employee.l_name as l_name, 
    roles.role_title as role, 
    roles.salary as salary, 
    department.department_name as department_name 
FROM 
    employee 
WHERE 
    employee.manager_id IS NULL 
JOIN 
        roles 
    ON 
        roles.id = employee.role_id 
JOIN 
        department 
    ON 
        department.id = roles.department_id;

/////////////////////////////////////////



SELECT 
    employee_name,
    role_title,
    salary,
    department
FROM (
    SELECT
        CONCAT(employee.f_name, " ", employee.l_name) as employee_name,
                roles.role_title as role, 
                roles.salary as salary, 
                department.department_name as department 
            FROM employee
        JOIN 
                roles
            ON 
                roles.id = employee.role_id 
        JOIN 
                department 
            ON 
                department.id = roles.department_id
        WHERE employee.manager_id IS NOT NULL
) AS employees;

SELECT 
    employee_name
FROM (
    SELECT
        CONCAT(employee.f_name, " ", employee.l_name) as employee_name,
                roles.role_title as role, 
                roles.salary as salary, 
                department.department_name as department 
            FROM employee
        JOIN 
                roles
            ON 
                roles.id = employee.role_id 
        JOIN 
                department 
            ON 
                department.id = roles.department_id
        WHERE employee.manager_id IS NULL
) AS managers;

/////////////////////////////////////////////////////////////////////////////////

SELECT 
        employee_name,
        role_title,
        salary,
        department
    FROM 
    (
        SELECT
                CONCAT(employee.f_name, " ", employee.l_name) as employee_name,
                roles.role_title as role, 
                roles.salary as salary, 
                department.department_name as department 
            FROM employee
            JOIN 
                    roles
                ON 
                    roles.id = employee.role_id 
            JOIN 
                    department 
                ON 
                    department.id = roles.department_id
            WHERE employee.manager_id IS NOT NULL
    ) 
AS employees
UNION
(
    SELECT
        CONCAT(employee.f_name, " ", employee.l_name) as employee_name
        FROM employee
        JOIN 
                roles
            ON 
                roles.id = employee.role_id 
        JOIN 
                department 
            ON 
                department.id = roles.department_id
        WHERE employee.manager_id IS NULL
) AS managers
JOIN
        managers
    ON
        employees.manager_id = managers.id;

    */

    //#region Employee
    EmployeeView(filter) {
        const queryString  = `
            SELECT 
                CONCAT(e.f_name, " ", e.l_name) as employee_name, 
                r.role_title as role, 
                d.department_name AS department, 
                CONCAT(m.f_name, " ", m.l_name) as manager
            FROM employee e
            INNER JOIN roles r ON r.id = e.role_id
            INNER JOIN department d on d.id = r.department_id
            LEFT JOIN employee m ON m.id = e.manager_id;`
        //Util.Log('queryString', queryString);
        this.#connection.query(
            queryString,
            (err, results, fields) => {
                if(results){
                    results.forEach(element => {
                        if (element.manager == null)  element.manager = 'Yes';
                    });
                    console.table(results);
                }
            }
        );

    }

    EmployeeAdd(values){
        Util.Log('values', values);
        if(values.addEmployeeManager != null && values.addEmployeeManager != undefined){
            const managerQuery = `
                SELECT 
                    d.id AS department_id,
                    r.id AS role_id,
                    e.id AS employee_id
                FROM
                    department d
                INNER JOIN roles r ON r.department_id = d.id
                LEFT JOIN employee e ON e.role_id = r.id
                WHERE 
                    e.manager_id IS NULL
                    AND
                    d.id = ${values.addEmployeeManager};
            `;
            this.#connection.query(
                managerQuery,
                (err, results, fields)=> {
                    Util.Log('results', results);
                    //Util.Log('err', err);
                    values.addEmployeeManager = results[0].employee_id;
                    //Util.Log('values', values);
                    const insertQuery = `
                        INSERT INTO 
                            employee(
                                f_name, 
                                l_name, 
                                role_id, 
                                manager_id
                            )
                        VALUES 
                            (
                                "${values.addEmployeeFirstName}",
                                "${values.addEmployeeLastName}",
                                "${values.addEmployeeRole}",
                                ${values.addEmployeeManager}
                            );`
                    Util.Log('');
                    this.#connection.query(
                        insertQuery,
                        (err, results, fields) => {
                            if (err) Util.Log('There was an error!', err, true);
                            else Util.Log('Success!');
                        }
                    )
                }
            );
        } else {
            //Util.Log('values', values);
            const insertQuery = `
                INSERT INTO 
                    employee(
                        f_name, 
                        l_name, 
                        role_id, 
                        manager_id
                    )
                VALUES 
                    (
                        "${values.addEmployeeFirstName}",
                        "${values.addEmployeeLastName}",
                        "${values.addEmployeeRole}",
                        NULL
                    );`
            this.#connection.query(
                insertQuery,
                (err, results, fields) => {
                    if (err) Util.Log('There was an error!', err, true);
                    else Util.Log('Success!');
                }
            )
        }
        
    }

    //#endregion

    //#region Department
    DepartmentView(filter){
        const queryString  = 'SELECT department_name FROM department;';
        //Util.Log(queryString);
        this.#connection.query(
            queryString,
            (err, results, fields) => {
                //Util.Log('results:', results)
                //Util.Log('err:', err)
                //Util.Log('fields:', fields)
                console.table(results);
            }
        );
    }

    DepartmentAdd(values){
        const insertQuery = `
            INSERT INTO 
                department(
                    department_name
                )
            VALUES
            (
                "${values.addDepartmentTitle}"
            );
        `;
        this.#connection.query(
            insertQuery,
            (err, results, fields) => {
                if (err) Util.Log('There was an error!', err, true);
                else Util.Log('Success!');
            }
        )
    }

    getDepartments() {
        const retArry = [];
        this.#connection.query(
            'SELECT * FROM department', 
            (err, results, fields)=> {
                results.forEach(element => {
                    //console.log(element);
                    retArry.push(element.department_name);
                });
            }
        );
        return retArry;
    }
    //#endregion
    
    //#region Roles
    RoleViewAll(){
        this.#connection.query(
            'SELECT r.role_title, r.salary, d.department_name as department FROM roles r LEFT JOIN department d ON r.department_id = d.id;',
            (err, res, fields) => {
                //Util.Log('results:', res);
                console.table(res);
            }
        )
    }

    RoleAdd(values){
        const insertQuery = `
            INSERT INTO 
                roles(
                    role_title,
                    salary,
                    department_id
                )
            VALUES
            (
                "${values.addRoleTitle}",
                ${values.addRoleSalary},
                ${values.addRoleDepartmentId}
            );
        `;
        this.#connection.query(
            insertQuery,
            (err, results, fields) => {
                if (err) Util.Log('There was an error!', err, true);
                else Util.Log('Success!');
            }
        )
    }

    getRoles() {
        const retArry = [];
        this.#connection.query(
            'SELECT * FROM roles', 
            (err, results, fields)=> {
                results.forEach(element => {
                    //console.log(element);
                    retArry.push(element.role_title);
                });
            }
        );
        return retArry;
    }

    //#endregion
}

module.exports = DatabaseConnection;