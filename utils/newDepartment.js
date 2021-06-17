const { Department } = require('../models/index');
const inquirer = require('inquirer');
const cTable = require('console.table');

module.exports = newDepartment = async () => {
    let next = false
    const questions = [{
        type: 'input',
        name: 'newDepartmentName',
        message: 'Enter the name of the Department you\'d like to add: ', 
    },
    {
        type: 'input',
        name: 'newDepartmentID',
        message: 'Enter the ID# of the Department you\'d like to add (Must be unique): ', 
    }];

    do (await inquirer.prompt(questions).then( async (response) => {
            console.table( response );
            let newDepartmentInfo = response;
            await inquirer.prompt({
                type: 'list', 
                name: 'newDepartmentConfirm', 
                message: 'Does everything on your screen look correct?',
                choices: ['Yes', 'No']

            }).then(async (response) => { 
                if (response.newDepartmentConfirm === 'Yes') {
                    try {
                        await Department.create({
                            id: newDepartmentInfo.newDepartmentID,
                            name: newDepartmentInfo.newDepartmentName,
                        });
                        console.log('Department added to Database');
                        console.log('Returning to the Department main menu...');
                        next = true;
                        return;
                    }
                    catch (err) {
                        console.log('A Department with that ID# already exists...');
                        console.log('ID#\'s must be unique and numerical');
                    }
                }
                return;
            });
        }))
    while (next !== true);
};
