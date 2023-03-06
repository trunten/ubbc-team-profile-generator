const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const { resolve, join } = require("path");
const fs = require("fs");
const render = require("./src/page-template.js");

const OUTPUT_DIR = resolve(__dirname, "output");
const outputPath = join(OUTPUT_DIR, "team.html");
const team = [];

function start () {
    // Funciton to create the team member of 'type' (manager, engineer or intern)
    function createTeamMember(type = "manager") {
        inquirer.prompt([
            {   
                type: "input",
                name: "name",
                message: `What is the ${type}'s name?`,
                validate: answer => {
                    if (answer.trim() === "") {
                    return "Name cannot be blank";
                    }
                    return true;
                }
            },
            {   
                type: "input",
                name: "id",
                message: `What is the ${type}'s ID?`,
                validate: answer => {
                    if (answer.trim() === "") {
                        return "ID cannot be blank";
                    }
                    return true;
                }
            },
            {
                type: "input",
                name: "email",
                message: `What is the ${type}'s email address?`,
                validate: answer => {
                    // https://www.oreilly.com/library/view/regular-expressions-cookbook/9781449327453/ch04s01.html
                    const re = /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[A-Z0-9-]+\.)+[A-Z]{2,6}$/i;
                    if (!re.test(answer)) {
                        return "Please enter a valid email address";
                    }
                    return true;
                }
            },
            {
                when: () => type === "manager",
                type: "input",
                name: "officeNumber",
                message: `What is the ${type}'s office number?`,
                validate: answer => {
                    if (!parseInt(answer)) {
                        return "Please enter a valid number";
                    }
                    return true;
                }
            },
            {
                when: () => type === "engineer",
                type: "input",
                name: "github",
                message: `What is the ${type}'s github username?`,
                validate: answer => {
                    if (answer.trim() === "") {
                        return "Github username cannot be blank";
                    }
                    return true;
                }
            },
            {
                when: () => type === "intern",
                type: "input",
                name: "school",
                message: `What is the ${type}'s school name?`,
                validate: answer => {
                    if (answer.trim() === "") {
                        return "School name cannot be blank";
                    }
                    return true;
                }
            },
        ]).then(answers => {
            let employee;
            switch (type) {
                case "manager":
                    employee = new Manager(answers.name, answers.id, answers.email, answers.officeNumber);
                    break;
                
                case "engineer":
                    employee = new Engineer(answers.name, answers.id, answers.email, answers.github);
                    break;

                case "intern":
                    employee = new Intern(answers.name, answers.id, answers.email, answers.school);
                    break;
            }
            team.push(employee);
            chooseEmployeeType();
        })
    }

    // Funciton to promt user to pick which employee to generate next (or none at all)
    function chooseEmployeeType(){
        inquirer.prompt([{
            type: "list",
            name: "type",
            message: "What team member do you want to add next?",  
            choices: ["Engineer", "Intern", "No more employees needed"],
          }]).then(answers => {
            if (answers.type === "Engineer") {
                createTeamMember("engineer");
            } else if (answers.type === "Intern") {
                createTeamMember("intern");
            } else {
                generateOutput()
            }
        })
    }

    // Function to output the team roster html page
    function generateOutput() {
        fs.mkdirSync("output", { recursive: true }, err => { throw err });
        fs.writeFileSync(outputPath, render(team), "utf-8");
        console.log("Team Roster generated successfully: " + outputPath);
    }
    
    // Starts everything off
    createTeamMember();
}

//Init 
start();