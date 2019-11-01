// Tratando apenas os prestadores de serviço

import User from '../models/User'; // O provider é um usuário
import File from '../models/File';

class ProviderController {
  async index(req, res) {
    // Método utilizado para fazer a listagem
    const providers = await User.findAll({
      where: { provider: true },
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [
        { model: File, as: 'avatar', attributes: ['name', 'path', 'url'] },
      ], // Retorna todos os dados do avatar
    });
    return res.json(providers);
  }
}

export default new ProviderController();
