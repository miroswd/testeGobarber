module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('files', {
      id: {
        type: Sequelize.INTEGER, // tipo
        allowNull: false, // não poderá ser vazio
        autoIncrement: true, // auto incremental
        primaryKey: true, // chave primária
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      path: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, // email precisa ser único
      },

      created_at: {
        // Data da Criação
        type: Sequelize.DATE,
        allowNull: false,
      },

      updated_at: {
        // Data da Atualização
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('files');
  },
};
