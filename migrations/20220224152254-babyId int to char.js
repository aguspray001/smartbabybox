module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn("Babies", "id", {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      }),
      // queryInterface.addColumn("Babies", "department_address", {
      //   type: Sequelize.STRING,
      // }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn("Babies", "id"),
      // queryInterface.removeColumn("Babies", "department_address"),
    ]);
  },
};