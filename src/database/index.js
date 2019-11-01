import Sequelize from 'sequelize';

import User from '../app/models/User';
import File from '../app/models/File';
import Appoint from '../app/models/Appointment';

import databaseConfig from '../config/database';

const models = [User, File, Appoint]; // Array com todos os models

class Database {
  constructor() {
    this.init();
  }

  init() {
    // Conecta com o banco de dados e carrega os models
    this.connection = new Sequelize(databaseConfig); // Aqui faço a conexão com o banco de dados
    // Essa variável está sendo esperada detro de models, no método init

    // Percorro o array, chamo cada model que está dentro do array e acesso o método init passando a conexão
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
