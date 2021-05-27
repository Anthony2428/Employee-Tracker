const sequelize = require('../config/connection');
const { Employee, Department, Role } = require('../models');

const employeeData = require('./employeeData.json');
const departmentData = require('./departmentData.json');
const roleData = require('./roleData.json');


const seedDatabase = async () => {
  await sequelize.sync({ force: false });

  const departments = await Department.bulkCreate(departmentData);
  const roles = await Role.bulkCreate(roleData);
  const employees = await Employee.bulkCreate(employeeData);

  process.exit(1);
};

seedDatabase();