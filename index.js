const sequelize = require('./config/connection');
const { Employee, Department, Role } = require('./models')
const inquirer = require('inquirer');
const cTable = require('console.table');
const newHire = require('./utils/newEmployee');
const editMenu = require('./utils/editEmployee');
const editDepartment = require('./utils/editDepartment');
const newDepartment = require('./utils/newDepartment');
const deleteEmployee = require('./utils/deleteEmployee');
const deleteDepartment = require('./utils/deleteDepartment');

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
            
            case 'Remove Employee':
                await deleteEmployee(employees);
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
};

const departmentMenu = async (departments) => {
    let next = false;
    await departmentQuery();

    do (await inquirer.prompt({
        type: 'list',
        name: 'empAction',
        message: 'Department Main Menu : What would you like to do?',
        choices: ['New Department', 'Edit Department', 'Remove Department', 'Return']

    }).then(async (response) => {

        switch (response.empAction) {
            case 'New Department':
                await newDepartment();                
                await departmentQuery();
            break;

            case 'Edit Department':
                await editDepartment();
                await departmentQuery();
            break;
            
            case 'Remove Department':
                await deleteDepartment();
                await departmentQuery();
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
};
const departmentQuery = async () => {
    let departmentData = await Department.findAll();

    let departments = departmentData.map( (depo) => depo.get({ plain: true }));

    console.table(departments);

    return;
};

const employeeQuery = async () => {
    let employeeData = await Employee.findAll();

    let employees = employeeData.map( (emp) => emp.get({ plain: true }));

    return (employees);
};

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
                await employeeMenu(employees);
                break;

            case 'Add/Edit Role':
                break;

            case 'Add/Edit Department':
                await departmentMenu()
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
