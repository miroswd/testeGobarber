import Sequelize, { Model } from 'sequelize';

class File extends Model {
  static init(sequelize) {
    // Método que vai ser chamado automaticamente pelo sequelize
    super.init(
      {
        // Enviando as colunas - serão preenchidas pelo user
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL, // Somente aqui, não vai para o banco de dados
          get() {
            return `http://localhost:3333/files/${this.path}`; // Retornando a URL do arquivo
          },
        },
      },
      {
        sequelize,
      }
    ); // Chamando o metodo init da class Model
    return this;
  }
}

export default File;
