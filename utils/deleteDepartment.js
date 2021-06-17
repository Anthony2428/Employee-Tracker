const { Department } = require('../models');
const inquirer = require('inquirer');
const cTable = require('console.table');

const departmentDelete = async (departmentID) => {
    await inquirer.prompt({
        type: 'list', 
        name: 'deleteConfirm', 
        message: 'Are you sure you want to remove this Department from the Database (All information will be lost):',
        choices: ['Yes', 'No']
    }).then(async (response) => {
        if (response.deleteConfirm === 'Yes') { 
            await Department.destroy(
                { 
                    where: { 
                        id: departmentID 
                    }
                }); 
            console.log('Department has been removed from the Database');
            console.log('Returning to the Department Main Menu...')
            return;
        };
        console.log('Returning to Department main menu...')
        return;
    });
}
module.exports = deleteMenu = async () => {
    let next = false;
    do (await inquirer.prompt({
        type: 'input', 
        name: 'departmentID', 
        message: 'Enter the ID# of the Department you\'d like to delete from the Database: '

    }).then(async (response) => {

        try {
            let department = await Department.findByPk(response.departmentID);
            department = department.get({ plain: true });
            
            console.table(department);
            await departmentDelete(department.id);
        }
        catch (err) {
            console.log('A Department with that ID# does not exit!');
            console.log('Returning to the Department main menu...');
            return;
        }
        next = true;
    }))
    while (next !== true)
    return;
};