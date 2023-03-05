import Manager from "./lib/Manager.js";
import Engineer from "./lib/Engineer.js";
import Intern from "./lib/Intern.js";
import inquirer from "inquirer";
import { resolve, join, dirname } from "path";
import { fileURLToPath } from 'url';
import fs from "fs";

// https://flaviocopes.com/fix-dirname-not-defined-es-module-scope/
const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = resolve(__dirname, "output");
const outputPath = join(OUTPUT_DIR, "team.html");

import render from "./src/page-template.js";

// TODO: Write Code to gather information about the development team members, and render the HTML file.
const team = [];

function start () {

    function createTeamMember(type = "manager") {
        inquirer.prompt([
            {   
                default: "Jon",
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
                default: "JRD",
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
                default: "jrd@my-team.com",
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
                default: "123",
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
                default: "trunten",
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
                default: "MIT",
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
                fs.writeFileSync(outputPath, render(team), "utf-8");
            }
        })
    }
        
    createTeamMember();
}

start();