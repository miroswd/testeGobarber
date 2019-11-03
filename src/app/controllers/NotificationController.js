// Acessível apenas para prestadores de serviço
import Notification from '../schemas/Notification';
import User from '../models/User';

class NotificationController {
  async index(req, res) {
    // Checando se é um provider
    const checkIsProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!checkIsProvider) {
      return res
        .status(401)
        .json({ error: 'Only provider can load notifications' });
    }

    // listando as notificações
    const notifications = await Notification.find({
      // Passando os objetos com os filtros
      user: req.userId,
    })
      // .sort('createdAdd') esquema de fila
      .sort({ createdAt: 'desc' }) // Esquema de pilha, mostrando as notificações mais recentes
      .limit(20); // No sequelize é o findAll

    return res.json(notifications);
  }

  async update(req, res) {
    // Notificações lidas
    // const notification = await Notification.findById(req.params.id);

    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true }, // transforma o read em true
      { new: true } // após atualizar retorna o valor atualizado
    );
    return res.json(notification);
  }
}

export default new NotificationController();
