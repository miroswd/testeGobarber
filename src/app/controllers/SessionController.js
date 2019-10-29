// Autenticação do Usuário
import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import User from '../models/User';

import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(), // Não é responsabilidade desse controller receber o número de caracteres da senha
    });

    // Verifica se o req.body recebe os valores validados
    if (!(await schema.isValid(req.body))) {
      // Se falhar retorna false

      return res.status(400).json({ errror: 'Validation fails' });
    }
    const { email, password } = req.body; // Para se autenticar precisa do email e senha

    // Verifica se o email existe
    const user = await User.findOne({ where: { email } });

    if (!user) {
      // 401 - sem permissão
      return res.status(401).json({ error: 'User not found' });
    }

    // Verificar se a senha está correta - dentro do User.js

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name } = user;
    return res.json({
      user: { id, name, email },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
