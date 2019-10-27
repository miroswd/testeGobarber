module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
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

      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, // email precisa ser único
      },

      password_hash: {
        // Senha criptografada
        type: Sequelize.STRING,
        allowNull: false,
      },

      provider: {
        type: Sequelize.BOOLEAN,
        defaultValue: false, // Por padrão todo user será um cliente
        allowNull: false,
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
    return queryInterface.dropTable('users');
  },
};
