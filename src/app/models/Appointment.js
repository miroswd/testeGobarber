import Sequelize, { Model } from 'sequelize';

import { isBefore, subHours } from 'date-fns';

class Appointment extends Model {
  static init(sequelize) {
    // Método que vai ser chamado automaticamente pelo sequelize
    super.init(
      {
        // Enviando as colunas - serão preenchidas pelo user
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
        past: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(this.date, new Date());
          },
        },
        cancelable: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(new Date(), subHours(this.date, 2));
          },
        },
      },
      {
        sequelize,
      }
    ); // Chamando o metodo init da class Model
    return this;
  }

  static associate(models) {
    // Quando tem mais de um relacionamento, é obrigatório ter o apelido
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' });
  }
}

export default Appointment;
