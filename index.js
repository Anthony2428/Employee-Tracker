const sequelize = require('./config/connection');
const { Employee, Department, Role } = require('./models')
const inquirer = require('inquirer');
const cTable = require('console.table');

const startApplication = async () => {

    await inquirer.prompt({
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: ['View all Employees', 'Add/Edit Employee', 'Add/Edit Role', 'Add/Edit Department']
    }).then(async (response) => {
        let employeeData = await Employee.findAll();

        let employees = employeeData.map((emp) =>
        emp.get({ plain: true })
    );
        switch (response.action) {
            case 'View all Employees':
                console.table(employees)
                break;
            case 'Add/Edit Employee':
                break;
            case 'Add/Edit Role':
                break;
            case 'Add/Edit Department':
                return;
            }
        return;
    })

};


sequelize.sync({ force: false }).then(() => {
    startApplication();
});
