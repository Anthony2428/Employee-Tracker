const { Employee } = require('../models');
const inquirer = require('inquirer');
const cTable = require('console.table');

const employeeEdit = async (emp, edit) => {
    let next = false;

    do (await inquirer.prompt({
        type: 'list', 
        name: 'empEdit', 
        message: 'What would you like to edit for this employee?', 
        choices: ['First Name', 'Last Name', 'ID', 'Role ID', 'Manager ID', 'Return']

    }).then(async (response) => {

        switch (response.empEdit) {

            case 'First Name':
                await inquirer.prompt({
                    type: 'input', 
                    name: 'empFirstName', 
                    message: 'Enter the First Name of this employee: '

                }).then(async (response) => {

                    edit.first_name = response.empFirstName;
                    console.log('Setting First Name...');

                });
                break;
            
            case 'Last Name':
                await inquirer.prompt({
                    type: 'input', 
                    name: 'empLastName', 
                    message: 'Enter the new Last Name of this employee: '

                }).then(async (response) => {

                    edit.last_name = response.empLastName;
                    console.log('Setting Last Name...');

                });
                break;
            
            case 'ID':
                await inquirer.prompt({
                    type: 'input', 
                    name: 'empID', 
                    message: 'Enter the new ID of this employee: '
                
                }).then(async (response) => {

                    edit.id = response.empID;
                    console.log('Setting ID...');

                });

            case 'Role ID':
                await inquirer.prompt({
                    type: 'input', 
                    name: 'empRoleID', 
                    message: 'Enter the new Role ID of this employee (Role ID# must Exist): '
                
                }).then(async (response) => {

                    edit.role_id = response.empRoleID;
                    console.log('Setting Role ID...');

                });
                break;
            
            case 'Manager ID':
                await inquirer.prompt({
                    type: 'input', 
                    name: 'empManagerID', 
                    message: 'Enter the new Manager ID of this employee: '
                
                }).then(async (response) => {
                    
                    edit.manager_id = response.empManagerID
                    console.log('Setting Manager ID...');

                });
                break;
            default:
                let base = Object.values(emp)
                let changes = Object.values(edit)


                if (base !== changes) {
                    console.table( emp, edit )
                    await inquirer.prompt({
                        type: 'list', 
                        name: 'empConfirm', 
                        message: 'Confirm the change made to this employee:',
                        choices: ['Save', 'Discard']
                    }).then(async (response) => {
                        if (response.empConfirm === 'Save') {

                            await Employee.update(
                                {
                                    first_name: edit.first_name, 
                                    last_name: edit.last_name, 
                                    id: edit.id, 
                                    role_id: edit.role_id, 
                                    manager_id: edit.manager_id 
                                }, 
                                {
                                    where: {
                                        id: emp.id
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

module.exports = editMenu = async () => {
    await inquirer.prompt({
        type: 'input', 
        name: 'empID', 
        message: 'Enter the ID# of the Employee you\'d like to edit: '

    }).then(async (response) => {

        try {
            let employee = await Employee.findByPk(response.empID);
            employee = employee.get({ plain: true });
            let edit = JSON.parse(JSON.stringify(employee));
            console.table(employee);
            await employeeEdit(employee, edit);
        }
        catch (err) {
            console.log('Value Error, ID# must unique, Role ID and Manager ID must be numerical and must exist.');
            console.log('Returning to the Employee main menu...');
            return;
        }
    });
    return;
};