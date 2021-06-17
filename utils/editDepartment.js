const { Department } = require('../models');
const inquirer = require('inquirer');
const cTable = require('console.table');

const departmentEdit = async (base, edit) => {
    let next = false;

    do (await inquirer.prompt({
        type: 'list', 
        name: 'departmentEdit', 
        message: 'What would you like to edit for this department?', 
        choices: ['Name', 'ID', 'Return']

    }).then(async (response) => {

        switch (response.departmentEdit) {

            case 'Name':
                await inquirer.prompt({
                    type: 'input', 
                    name: 'departmentName', 
                    message: 'Enter the new name of this Department: '

                }).then(async (response) => {

                    edit.name = response.departmentName;
                    console.log('Setting Department Name...');

                });
                break;
        
            
            case 'ID':
                await inquirer.prompt({
                    type: 'input', 
                    name: 'departmentID', 
                    message: 'Enter the new ID of this Department: '
                
                }).then(async (response) => {

                    edit.id = response.departmentID;
                    console.log('Setting Department ID...');

                });
            break;
            default:
                let original = Object.values(base)
                let changes = Object.values(edit)


                if (original !== changes) {
                    console.table( base, edit )
                    await inquirer.prompt({
                        type: 'list', 
                        name: 'departmentConfirm', 
                        message: 'Confirm the change made to this Department:',
                        choices: ['Save', 'Discard']
                    }).then(async (response) => {
                        if (response.departmentConfirm === 'Save') {

                            await Department.update(
                                {
                                    name: edit.name, 
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

module.exports = departmentMenu = async () => {
    await inquirer.prompt({
        type: 'input', 
        name: 'departmentID', 
        message: 'Enter the ID# of the Department you\'d like to edit: '

    }).then(async (response) => {

        try {
            let department = await Department.findByPk(response.departmentID);
            department = department.get({ plain: true });
            let edit = JSON.parse(JSON.stringify(department));
            console.table(department);
            await departmentEdit(department, edit);
        }
        catch (err) {
            console.log('ID# must unique and numerical');
            console.log('Returning to the Department Main Menu...');
            return;
        }
    });
    return;
};