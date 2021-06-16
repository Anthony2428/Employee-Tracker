const { Employee } = require('../models/index');
const inquirer = require('inquirer');
const cTable = require('console.table');
const editEmployee = require('./editEmployee');

module.exports = newEmployee = async ( newHire ) => {
    let next = false
    const questions = [{
        type: 'input',
        name: 'newHireFirstName',
        message: 'Enter the new employee\'s first name: ', 
    },
    {
        type: 'input',
        name: 'newHireLastName',
        message: 'Enter the new employee\'s last name: ', 
    },
    {
        type: 'input',
        name: 'newHireID',
        message: 'Enter the new employee\'s ID number (Must be unique): ', 
    },
    {
        type: 'input',
        name: 'newHireRoleID',
        message: 'Enter the new employee\'s role ID: ', 
    },
    {
        type: 'input',
        name: 'managerID',
        message: 'Enter the manger\'s ID: ', 
    }];
    do (await inquirer.prompt(questions).then( async (response) => {
            console.table( response );
            let newHireInfo = response;
            await inquirer.prompt({
                type: 'list', 
                name: 'newHireConfirm', 
                message: 'Does everything on your screen look correct?',
                choices: ['Yes', 'No']

            }).then(async (response) => { 
                if (response.newHireConfirm === 'Yes') {
                    let newHire = await Employee.create({
                        id: newHireInfo.newHireID,
                        first_name: newHireInfo.newHireFirstName,
                        last_name: newHireInfo.newHireLastName,
                        role_id: newHireInfo.newHireRoleID,
                        manager_id: newHireInfo.managerID,

                        
                    });
                    console.log('Employee added to Database');
                    console.log('Returning to Employee main menu...');
                    next = true;
                    return;
                }
                return;
            });
        }))
    while (next !== true);
};
