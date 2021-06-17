const { Employee } = require('../models');
const inquirer = require('inquirer');
const cTable = require('console.table');

const employeeDelete = async (employeeID) => {
    await inquirer.prompt({
        type: 'list', 
        name: 'deleteConfirm', 
        message: 'Are you sure you want to remove this employee from the Database (All information will be lost):',
        choices: ['Yes', 'No']
    }).then(async (response) => {
        if (response.deleteConfirm === 'Yes') { 
            await Employee.destroy(
                { 
                    where: { 
                        id: employeeID 
                    }
                }); 
            console.log('Employee has been removed from the Database');
            console.log('Returning to the Employee Main Menu...')
            return;
        };
        console.log('Returning to Employee main menu...')
        return;
    });
}
module.exports = deleteMenu = async () => {
    let next = false;
    do (await inquirer.prompt({
        type: 'input', 
        name: 'empID', 
        message: 'Enter the ID# of the Employee you\'d like to delete from the Database: '

    }).then(async (response) => {

        try {
            let employee = await Employee.findByPk(response.empID);
            employee = employee.get({ plain: true });
            
            console.table(employee);
            await employeeDelete(employee.id);
        }
        catch (err) {
            console.log('An employee with that ID# does not exit!');
            console.log('Returning to the Employee main menu...');
            return;
        }
        next = true;
    }))
    while (next !== true)
    return;
};