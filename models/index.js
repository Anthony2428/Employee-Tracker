const { Employee, Department, Role } = require('./Models');

Employee.hasOne(Employee, {
  foreignKey: 'manager_id',
  onDelete: 'CASCADE',
});

Department.hasMany(Role, {
  foreignKey: 'department_id',
  onDelete: 'CASCADE',
});

Employee.belongsTo(Role, {
  foreignKey: 'role_id',
});


module.exports = { Employee, Department, Role };
