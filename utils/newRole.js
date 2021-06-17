const { Role } = require('../models/index');
const inquirer = require('inquirer');
const cTable = require('console.table');

module.exports = newRole = async () => {
    let next = false
    const questions = [{
        type: 'input',
        name: 'newRoleTitle',
        message: 'Enter the title of the Role you\'d like to add: ', 
    },
    {
        type: 'input',
        name: 'newRoleID',
        message: 'Enter the ID# of the Role you\'d like to add (Must be unique): ', 
    },
    {
        type: 'input',
        name: 'newRoleDepartmentID',
        message: 'Enter the ID# of the Department you\'d like to add this Role to (Department ID# must Exist): ', 
    },
    {
        type: 'input',
        name: 'newRoleSalary',
        message: 'Enter the salary of the Role you\'d like to add: ', 
    }];

    do (await inquirer.prompt(questions).then( async (response) => {
            console.table( response );
            let newRoleInfo = response;
            await inquirer.prompt({
                type: 'list', 
                name: 'newRoleConfirm', 
                message: 'Does everything on your screen look correct?',
                choices: ['Yes', 'No']

            }).then(async (response) => { 
                if (response.newRoleConfirm === 'Yes') {
                    try {
                        await Role.create({
                            id: newRoleInfo.newRoleID,
                            title: newRoleInfo.newRoleTitle,
                            salary: newRoleInfo.newRoleSalary,
                            department_id: newRoleInfo.newRoleDepartmentID
                        });
                        console.log('Role added to Database');
                        console.log('Returning to the Role main menu...');
                        next = true;
                        return;
                    }
                    catch (err) {
                        console.log('Value Error, ID# must be unique, Salary must be numerical, Department ID# must exist.');
                    }
                }
                return;
            });
        }))
    while (next !== true);
};
