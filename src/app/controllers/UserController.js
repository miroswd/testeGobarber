import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    // Verifica se o req.body recebe os valores validados
    if (!(await schema.isValid(req.body))) {
      // Se falhar retorna false
      return res.status(400).json({ errror: 'Validation fails' });
    } // Se for válido retorna true

    const userExists = await User.findOne({ where: { email: req.body.email } });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    // Vai ter a mesma face de um middleware store(req,res)
    // Por enquanto os dados são passados pelo insomnia
    const { id, name, email, provider } = await User.create(req.body); // Pega todos os dados

    return res.json({ id, name, email, provider }); // Apenas as informações necessárias para o usuário
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    // Verifica se o req.body recebe os valores validados
    if (!(await schema.isValid(req.body))) {
      // Se falhar retorna false
      return res.status(400).json({ error: 'Validation fails' });
    } // Se for válido retorna true

    // console.log(req.userId); // Agora consigo usar o userId para fazer as alterações
    const { email, oldPassword } = req.body; // Buscando dentro do req.body

    const user = await User.findByPk(req.userId);
    // console.log(user);
    // Verificação do usuário

    // Se estiver mudando o email
    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }

    // verificando se a oldpassword equivale a senha que ele já tem
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      // Só faz a verificação da senha se ele fornecer a oldPassword, assim ele quer mudar a senha
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name, provider } = await user.update(req.body);
    return res.json({ id, name, email, provider });
  }
}

export default new UserController();
