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
const editRole = require('./utils/editRole');
const newRole = require('./utils/newRole');
const deleteRole = require('./utils/deleteRole');

const employeeMenu = async () => {
    let next = false;
    await employeeQuery();

    do (await inquirer.prompt({
        type: 'list',
        name: 'empAction',
        message: 'Employee Main Menu : What would you like to do?',
        choices: ['New Employee', 'Edit Employee', 'Remove Employee', 'Return']

    }).then(async (response) => {

        switch (response.empAction) {
            case 'New Employee':
                await newHire();
                await employeeQuery();
            break;

            case 'Edit Employee':
                await editMenu();
                await employeeQuery();
            break;
            
            case 'Remove Employee':
                await deleteEmployee();
                await employeeQuery();
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

const departmentMenu = async () => {
    let next = false;
    await departmentQuery();

    do (await inquirer.prompt({
        type: 'list',
        name: 'departmentAction',
        message: 'Department Main Menu : What would you like to do?',
        choices: ['New Department', 'Edit Department', 'Remove Department', 'Return']

    }).then(async (response) => {

        switch (response.departmentAction) {
            
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

const roleMenu = async () => {
    let next = false;
    await roleQuery();

    do (await inquirer.prompt({
        type: 'list',
        name: 'roleAction',
        message: 'Role Main Menu : What would you like to do?',
        choices: ['New Role', 'Edit Role', 'Remove Role', 'Return']

    }).then(async (response) => {

        switch (response.roleAction) {
            case 'New Role':
                await newRole();                
                await roleQuery();
            break;

            case 'Edit Role':
                await editRole();
                await roleQuery();
            break;
            
            case 'Remove Role':
                await deleteRole();
                await roleQuery();
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

const roleQuery = async () => {
    let roleData = await Role.findAll();

    let roles = roleData.map( (role) => role.get({ plain: true }));

    console.table(roles);

    return;
};

const employeeQuery = async () => {
    let employeeData = await Employee.findAll();

    let employees = employeeData.map( (emp) => emp.get({ plain: true }));

    console.table(employees);

    return;
};

const startApplication = async () => {
    let next = false;

    do (await inquirer.prompt({
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: ['View all Employees', 'Add/Edit Employee', 'Add/Edit Role', 'Add/Edit Department', 'Exit']

    }).then(async (response) => {

        switch (response.action) {

            case 'View all Employees':
                await employeeQuery();
                break;

            case 'Add/Edit Employee':
                await employeeMenu();
                break;

            case 'Add/Edit Role':
                await roleMenu();
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
