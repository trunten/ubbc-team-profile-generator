import Manager from "./lib/Manager.js";
import Engineer from "./lib/Engineer.js";
// import Intern from "./lib/Intern";
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

    function createManager() {
        inquirer.prompt([
            {   
                default: "Jon",
                type: "input",
                name: "name",
                message: "What is the team manager's name?",
                validate: answer => {
                    if (answer.trim() === "") {
                    return "Manager name cannot be blank";
                    }
                    return true;
                }
            },
            {   
                default: "JRD",
                type: "input",
                name: "id",
                message: "What is the team manager's ID?",
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
                message: "What is the team manager's email address?",
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
                default: "123",
                type: "input",
                name: "officeNumber",
                message: "What is the team manager's office number?",
                validate: answer => {
                    const num = parseInt(answer);
                    if (!num) {
                        return "Please enter a valid number";
                    }
                    return true;
                }
            },
        ]).then(answers => {
            const manager = new Manager(...Object.values(answers));
            // const manager = new Manager(answers.name, answers.id, answers.email, answers.officeNumber);
            team.push(manager);
            createTeam();
        })
    }

    function createTeam(){
        inquirer.prompt([{
            type: "list",
            name: "type",
            message: "What team member do you want to add next?",  
            choices: ["Engineer", "Intern", "No more employees needed"],
          }]).then(answers => {
            if (answers.type === "Engineer") {
                createEngineer();
            } else if (answers.type === "Intern") {
                createIntern();
            } else {
                console.log("Render");
                // fs.writeFileSync(outputPath, render(team), "utf-8");
            }
        })
    }

    function createEngineer() {
        console.log("Engineer");
        createTeam();
    }

    function createIntern() {
        console.log("Intern");
        createTeam();
    }
        
    createManager();
}

start();