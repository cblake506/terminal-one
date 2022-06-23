
const inquirer = require('inquirer');
const fs = require('fs');
const util = require('util');
const { generateMarkdown } = require('./generateMarkdown');



const init = () => {

    inquirer.prompt([
        {
            name: "Title",
            message: "What is the title of your note?",
            type: "input",
        },

        {
            name: "Description",
            message: "Write your note here",
            type: "input",
        },

        {
            type: 'input',
            message: 'Enter your username',
            name: 'Questions',

        },


    ])
        .then(answers => {
            writeToFile(answers)
            console.log('Success! Your README file has been created!')
        });
}


const writeFileAsync = util.promisify(fs.writeFile);

function writeToFile(answers) {
    writeFileAsync('Note.pdf', generateMarkdown(answers))
}

init();
