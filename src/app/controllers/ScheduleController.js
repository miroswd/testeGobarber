import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize'; // Operador do sequelize
import Appointment from '../models/Appointment';
import User from '../models/User';

class ScheduleController {
  async index(req, res) {
    const checkUserProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!checkUserProvider) {
      return res.status('401').json({ error: 'User is not a provider' });
    }

    const { date } = req.query;
    const parsedDate = parseISO(date);

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          // Criando uma verificação para a data
          // 2019-12-31 00:00:00 -> startOfDay
          // 2019-12-31 23:59:59 -> endOfDay
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
          // Quais os agendamentos estão dentro da data
        },
      },
      order: ['date'],
    });

    return res.json(appointments);
  }
}

export default new ScheduleController();
