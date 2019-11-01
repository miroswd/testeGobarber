module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'avatar_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'files', // referencie a tabela files
        key: 'id', // id da tabela files
        onUpdate: 'CASCADE', // Se for alterado, faz com q tmb seja atualizado na tabela
        onDelete: 'SET NULL', // se for deletado, setar como nulo
        allowNull: true,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('users', 'avatar_id');
  },
};
