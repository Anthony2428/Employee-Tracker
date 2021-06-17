const { Role } = require('../models');
const inquirer = require('inquirer');
const cTable = require('console.table');

const roleDelete = async (roleID) => {
    await inquirer.prompt({
        type: 'list', 
        name: 'deleteConfirm', 
        message: 'Are you sure you want to remove this Role from the Database (All information will be lost):',
        choices: ['Yes', 'No']
    }).then(async (response) => {
        if (response.deleteConfirm === 'Yes') { 
            await Role.destroy(
                { 
                    where: { 
                        id: roleID 
                    }
                }); 
            console.log('Role has been removed from the Database');
            console.log('Returning to the Role Main Menu...')
            return;
        };
        console.log('Returning to Role main Menu...')
        return;
    });
}
module.exports = deleteMenu = async () => {
    let next = false;
    do (await inquirer.prompt({
        type: 'input', 
        name: 'roleID', 
        message: 'Enter the ID# of the Role you\'d like to delete from the Database: '

    }).then(async (response) => {

        try {
            let role = await Role.findByPk(response.roleID);
            role = role.get({ plain: true });
            
            console.table(role);
            await roleDelete(role.id);
        }
        catch (err) {
            console.log('A Role with that ID# does not exit!');
            console.log('Returning to the Role main menu...');
            return;
        }
        next = true;
    }))
    while (next !== true)
    return;
};