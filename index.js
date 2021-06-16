const sequelize = require('./config/connection');
const { Employee, Department, Role } = require('./models')
const inquirer = require('inquirer');
const cTable = require('console.table');
const newHire = require('./utils/newEmployee');
const editMenu = require('./utils/editEmployee')


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
                await newHire();
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
