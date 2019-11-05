// Background Job

import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    // get key -> é como se tivesse declarando uma variável
    return 'CancellationMail'; // Chave única, para cada job precisa de uma chave única
  }

  async handle({ data }) {
    // Tarefa que vai executar quando esse processo for executado

    const { appointment } = data;

    console.log('Funcionou');

    // Enviando o email
    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}> `,
      subject: 'Agendamento cancelado',
      template: 'cancellation',
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(
          parseISO(appointment.date),
          "'dia' dd 'de' MMMM ', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new CancellationMail();
