module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('appointments', {
      id: {
        type: Sequelize.INTEGER, // tipo
        allowNull: false, // não poderá ser vazio
        autoIncrement: true, // auto incremental
        primaryKey: true, // chave primária
      },

      date: {
        // DATA DO AGENDAMENTO
        type: Sequelize.DATE,
        allowNull: false,
      },
      user_id: {
        // Referenciando o agendamento ao usuário
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL', // Mesmo deletando, mantém no histórico
        allowNull: true,
      },
      provider_id: {
        // Referenciando o agendamento ao prestador
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL', // Mesmo deletando, mantém no histórico
        allowNull: true,
      },
      canceled_at: {
        // Caso seja cancelado
        type: Sequelize.DATE,
        // Como o agendamento pode não estar cancelado, não precisa do allowNull
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
    return queryInterface.dropTable('appointments');
  },
};
