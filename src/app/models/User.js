import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    // Método que vai ser chamado automaticamente pelo sequelize
    super.init(
      {
        // Enviando as colunas - serão preenchidas pelo user
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL, // Nunca vai existir no banco de dados
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    ); // Chamando o metodo init da class Model
    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    }); // Antes de qualquer usuário ser salvo, esse código será rodado automaticamente
    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash); // Compara a senha que está sendo digitada com a senha criptografada no db
    // return true or false
  }
}

export default User;
