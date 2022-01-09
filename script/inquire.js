const Util = require('./Uitil');
const inquirer = require('inquirer');
const questions = require('./questions.json');
const {
    menuQuestions,
    addEmployee, 
    addRole, 
    addDepartment, 
} = questions;

class Inquire {
    db;
    constructor(dbCon) { this.db = dbCon }
    
    startPrompts() {
        inquirer.prompt(menuQuestions).then(answers => {
            const rootAnswers = JSON.stringify(answers.root);
            if (answers.root.includes("Employee")) {
                this.employeePrompts(rootAnswers);
            } else if (answers.root.includes("Department")) {
                this.departmentPrompts(rootAnswers);
            } else if (answers.root.includes("Role")) {
                this.rolePrompts(rootAnswers);
            } else if (answers.root.includes("Quit")) {
                Util.Log("Goodbye!");
                process.kill(process.pid,'SIGTERM');
            }
        });
    }

    resetPrompts() {
        setTimeout(() => this.startPrompts(), 50);
    }

    employeePrompts(root) {
        if(root.includes("View")){
            this.db.EmployeeView('');
            this.resetPrompts();
        } else if (root.includes("Add")) {
            addEmployee[2].choices = this.db.getRoles();
            inquirer.prompt(addEmployee).then(answers =>{
                //Util.Log('answers', answers);
                if (answers.addEmployeeManager.toLowerCase().includes("none")) {
                    answers.addEmployeeManager = null;
                } else {
                    //Util.Log('addEmployee[2].choices.indexOf(answers.addEmployeeRole) + 1', addEmployee[2].choices.indexOf(answers.addEmployeeRole) + 1);
                    answers.addEmployeeManager = (addEmployee[2].choices.indexOf(answers.addEmployeeRole) / 2) + 1;
                    if(addEmployee[2].choices.indexOf(answers.addEmployeeRole) % 2 > 0) answers.addEmployeeManager += 0.5;
                    answers.addEmployeeManager -= 1;
                }
                answers.addEmployeeRole = addEmployee[2].choices.indexOf(answers.addEmployeeRole) + 1;
                this.db.EmployeeAdd(answers);
                this.resetPrompts();
            });
            return;
        }
        else if (root.includes("Return")) {
            this.resetPrompts();
        }
    }

    departmentPrompts(root) {
        Util.Log('departmentPrompts(root)');
        if(root.includes("View")){
            this.db.DepartmentView('');
            this.resetPrompts();
        } else if (root.includes("Add")) {
            inquirer.prompt(addDepartment).then(answers => {
                this.db.DepartmentAdd(answers);
                this.resetPrompts();
            });
        } else if (root.includes("Return")) {
            this.resetPrompts();
        }
    }

    rolePrompts(root) {
        addRole[2].choices = this.db.getDepartments();
        //Util.Log('rolePrompts(root)');
        if(root.includes("View")){
            this.db.RoleViewAll();
            this.resetPrompts();
        } else if(root.includes("Add")) {
            inquirer.prompt(addRole).then(answers => {
                answers.addRoleDepartmentId = addRole[2].choices.indexOf(answers.addRoleDepartmentId) + 1;
                this.db.RoleAdd(answers);
                this.resetPrompts();
            });
        } else if (root.includes("Return")) {
            this.resetPrompts();
        }
    }

}

module.exports = Inquire;

//Util.Log('questions.json: ', questions);

/*
        type:
        (String) Type of the prompt. 
        Defaults: input 
        Possible values: input, number, confirm, list, rawlist, expand, checkbox, password, editor
        
        name:
        (String) The name to use when storing the answer in the anwers hash.
        
        message:
        (String) The question to print.
        Defaults to the value of name (followed by a colon).
        
        default:
        (String|Number|Array|Function) Default value(s) to use if nothing is entered, or a function that returns the default value(s). 
        If defined as a function, the first parameter will be the current inquirer session answers.
        
        choices:
        (Array|Function) Choices array or a function returning a choices array. If defined as a function, the first parameter 
        will be the current inquirer session answers. Array values can be simple numbers, strings, or objects containing a name 
        (to display in list), a value (to save in the answers hash), and a short (to display after selection) properties. 
        The choices array can also contain a Separator.
        
        validate:
        (Function) Receive the user input and should return true if the value is valid, and an error message (String) otherwise. 
        If false is returned, a default error message is provided.
        
        filter:
        (Function) Receive the user input and return the filtered value to be used inside the program. 
        The value returned will be added to the Answers hash.

        transformer: 
        (Function) Receive the user input, answers hash and option flags, and return a transformed value to display to the user. 
        The transformation only impacts what is shown while editing. It does not modify the answers hash.

        when: 
        (Function, Boolean) Receive the current user answers hash and should return true or false depending on whether or
        not this question should be asked. The value can also be a simple boolean.

        pageSize: 
        (Number) Change the number of lines that will be rendered when using list, rawList, expand or checkbox.

        prefix: 
        (String) Change the default prefix message.

        suffix: 
        (String) Change the default suffix message.

        askAnswered: 
        (Boolean) Force to prompt the question if the answer already exists.

        loop: 
        (Boolean) Enable list looping. 
        Defaults: true


        default, choices(if defined as functions), validate, filter and when functions can be called asynchronously. Either return 
        a promise or use this.async() to get a callback you'll call with the final value.

    {
        "type": "",
        "name": "",
        "message": "",
        "default": "",
        "choices": ["", "", "", ""],
        "validate": "",
        "filter": "",
        "when": "",
        "pageSize": "",
        "prefix": "",
        "suffix": "",
        "askAnswered": "",
        "loop": ""
    }
*/
