// LISTAGEM PARA O USUÁRIO COMUM

import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt'; // Para conseguir usar o mês em português
import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';
import Notification from '../schemas/Notification';
import Queue from '../../lib/Queue';

import CancellationMail from '../jobs/CancellationMail';

class AppointmentController {
  // -> Listagem de agendamentos
  async index(req, res) {
    const { page = 1 } = req.query; // Se o page não for informado, por padrão o user está na page 1
    // Método de listagem que usamos por padrão
    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      limit: 20, // 20 registros por vez
      offset: (page - 1) * 20, // Quantos registros pular
      attributes: ['id', 'date', 'past', 'cancelable'],
      include: [
        {
          // Retornando os dados do provider
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar', // apelido
              attributes: ['id', 'path', 'url'], // Sou obrigado a pegar o path para pegar a url
            },
          ],
        },
      ],
    });
    return res.json(appointments);
  }

  // -> Validando os dados de entrada
  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      // Caso os dados não sejam válidos
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { provider_id, date } = req.body;

    // Checando se o provider_id é um provider de serviço
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true }, // Encontrar um registro, onde o id do usuário seja provider_id e provider true
    }); // Para encontrar um registro

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'You can only create appointments with providers' });
    }

    if (req.userId === provider_id) {
      // Impede o provider de agendar com ele mesmo
      return res
        .status(401)
        .json({ error: 'For to appointment, need be an user common' });
    }

    // -> Validações da data de agendamento

    // Checa se a data de agendamento é futura
    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permmited' });
    }

    // Checa se o prestador já tem horário marcado

    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkAvailability) {
      // O horário não está vago
      return res
        .status(401)
        .json({ error: 'Appointment date is not available' });
    }

    /*
      ** parseISO -> Transforma a string "2019-07-01T19:00-03:00" em um objeto date do JS // [(T19:00-03:00) -> Timezone]
      ** startOfHour -> Como o a string foi passada para date, agora é possível utilizar dentro desse método
                     -> Pega sempre o início da hora

    */

    // -> Criando o agendamento
    const appointment = await Appointment.create({
      user_id: req.userId, // Setado pelo middleware de autenticação
      provider_id,
      date,
    });

    // -> Notificando o provider

    const user = await User.findByPk(req.userId);

    const formattedDate = format(hourStart, "dd 'de' MMMM, 'às' H:mm'h'", {
      locale: pt,
    }); // Formatando a data

    await Notification.create({
      content: `Novo agendamento de ${user.name} para ${formattedDate}`, // Conteúdo da notificação
      user: provider_id,
    });

    return res.json(appointment);
  }

  // -> Cancelamento
  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });

    if (appointment.user_id !== req.userId) {
      // Verificando se o user é o dono do agendamento
      return res.status(401).json({
        error: "You don't have permission to cancel this appointment",
      });
    }
    // Verificando se está há 2 horas do compromisso
    const dateWithSub = subHours(appointment.date, 2);

    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({
        error: ' You can only cancel appointments 2 hours in advance',
      });
    }

    appointment.canceled_at = new Date(); // campo q tem no model

    await appointment.save();

    await Queue.add(CancellationMail.key, {
      appointment,
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
