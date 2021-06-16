const sequelize = require('./config/connection');
const { Employee, Department, Role } = require('./models')
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
                    message: 'Enter the new Role ID of this employee: '
                
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
                        console.log(response.empConfirm)
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
                        console.log('Edit discarded');
                        next = true;
                        return;
                    })
                };
                break;
        };

        
    }))
    while (next !== true);
    return;
    
};

const editMenu = async (employees) => {
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
            console.log('An employee with that ID# does not exit! Returning to main menu...');
            return;
        }
    });
    return;
};

const employeeMenu = async (employees) => {
    let next = false;
    console.table(employees);

    do (await inquirer.prompt({
        type: 'list',
        name: 'empAction',
        message: 'Employee Main Menu : What would you like to do?',
        choices: ['New Employee', 'Edit Employee', 'Remove Employee', 'Return']

    }).then(async (response) => {

        switch (response.empAction) {
            case 'New Employee':
                let newEmp = newEmployee();
            break;

            case 'Edit Employee':
                await editMenu(employees);
            break;
            
            default:
                console.log('Returning to main menu...');
                next = true
            break;
        };

        return;
    }))
    while (next !== true);
    return;
}
const employeeQuery = async () => {
    let employeeData = await Employee.findAll();

    let employees = employeeData.map( (emp) => emp.get({ plain: true }));

    return (employees);
}
const startApplication = async () => {
    let next = false;

    do (await inquirer.prompt({
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: ['View all Employees', 'Add/Edit Employee', 'Add/Edit Role', 'Add/Edit Department', 'Exit']

    }).then(async (response) => {

        let employees = await employeeQuery();

        switch (response.action) {

            case 'View all Employees':
                console.table(employees);;
                break;

            case 'Add/Edit Employee':
                let newEmp = await employeeMenu(employees);
                break;

            case 'Add/Edit Role':
                break;

            case 'Add/Edit Department':
                break;

            default:
                console.log('Exiting...');
                next = true
                return;
            }

        return;
    }))
    while (next !== true);

    sequelize.close();
    return;
};


sequelize.sync({ force: false }).then(() => {
    startApplication();
});
