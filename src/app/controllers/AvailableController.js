// Lista os horários disponíveis

import {
  startOfDay,
  endOfDay,
  setHours,
  setMinutes,
  setSeconds,
  format,
  isAfter,
} from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointment';
// Como vai enviar uma data, no query params, do insomnia

class AvailableController {
  async index(req, res) {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Invalid date' });
    }

    const searchDate = Number(date); // transforma em número inteiro, poderia ter usado parseInt()
    // retorna 2019-11-04 21:53:42

    // Criando um filtro, uma listagem no banco de dados para pegar os agendamentos dessa data

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.params.providerId, // vem através da URL
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        },
      },
    });

    const schedule = [
      // horários de atendimento
      '08:00', // 2019-11-04 08:00:00 -> Precisa criar os objetos da seguinte forma
      '09:00', // 2019-11-04 09:00:00
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
      '23:00',
    ];

    const available = schedule.map(time => {
      // Avaliar se não é um horário que já passou ou se já não está ocupado
      const [hour, minute] = time.split(':'); // Antes do : é hour e depois minute
      const value = setSeconds(
        setMinutes(setHours(searchDate, hour), minute),
        0 // minutos e segundos zerados
      );

      return {
        time,
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        available:
          isAfter(value, new Date()) &&
          !appointments.find(a => format(a.date, 'HH:mm') === time),
      };
    }); // Objeto que vai retornar as datas disponiveis

    return res.json(available);
  }
}

export default new AvailableController();
