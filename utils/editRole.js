const { Role } = require('../models');
const inquirer = require('inquirer');
const cTable = require('console.table');

const roleEdit = async (base, edit) => {
    let next = false;

    do (await inquirer.prompt({
        type: 'list', 
        name: 'roleEdit', 
        message: 'What would you like to edit for this Role?', 
        choices: ['Title', 'Salary', 'ID', 'Department ID', 'Return']

    }).then(async (response) => {

        switch (response.roleEdit) {

            case 'Title':
                await inquirer.prompt({
                    type: 'input', 
                    name: 'roleTitle', 
                    message: 'Enter the new Title of this Role: '

                }).then(async (response) => {

                    edit.title = response.roleTitle;
                    console.log('Setting Role Title...');

                });
            break;
        
            case 'Salary':
                await inquirer.prompt({
                    type: 'input', 
                    name: 'roleSalary', 
                    message: 'Enter the new Salary of this Role: '
                
                }).then(async (response) => {

                    edit.salary = response.roleSalary;
                    console.log('Setting Role Salary...');

                });
            break;

            case 'Department ID':
                await inquirer.prompt({
                    type: 'input', 
                    name: 'roleDepartmentID', 
                    message: 'Enter the new Department ID of this Role (Department ID# must Exist): '
                
                }).then(async (response) => {

                    edit.department_id = response.roleDepartmentID;
                    console.log('Setting Role Department ID...');

                });
            break;

            case 'ID':
                await inquirer.prompt({
                    type: 'input', 
                    name: 'roleID', 
                    message: 'Enter the new ID of this Role: '
                
                }).then(async (response) => {

                    edit.id = response.roleID;
                    console.log('Setting Role ID...');

                });
            break;
            default:
                let original = Object.values(base)
                let changes = Object.values(edit)


                if (original !== changes) {
                    console.table( base, edit )
                    await inquirer.prompt({
                        type: 'list', 
                        name: 'roleConfirm', 
                        message: 'Confirm the change made to this Role:',
                        choices: ['Save', 'Discard']
                    }).then(async (response) => {
                        if (response.roleConfirm === 'Save') {

                            await Role.update(
                                {
                                    title: edit.title,
                                    salary: edit.salary,
                                    department_id: edit.department_id,
                                    id: edit.id, 
                                }, 
                                {
                                    where: {
                                        id: base.id
                                    },
                                }
                            );
                            console.log('Edit saved...');
                            next = true
                            return;
                        };
                        console.log('Edit discarded...');
                        next = true;
                        return;
                    })
                };
                break;
        };

        
    }))
    while (next !== true);
    return(edit);
    
};

module.exports = roleMenu = async () => {
    await inquirer.prompt({
        type: 'input', 
        name: 'roleID', 
        message: 'Enter the ID# of the Role you\'d like to edit: '

    }).then(async (response) => {

        try {
            let role = await Role.findByPk(response.roleID);
            role = role.get({ plain: true });
            let edit = JSON.parse(JSON.stringify(role));
            console.table(role);
            await roleEdit(role, edit);
        }
        catch (err) {
            console.log('Value Error, ID#\'s must be unique, Salary must be numerical, Department ID# must exist.');
            console.log('Returning to the Role Main Menu...');
            return;
        }
    });
    return;
};