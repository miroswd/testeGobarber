// Configurações de envio de email
// As credenciais foram obtidas através do mailtrap

export default {
  host: process.env.MAIL_HOST, // O envio do email será através de SMTP (Protocolo de envio de emails)
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  default: {
    from: 'Equipe GoBarber <noreply@gobarber.com>',
  },
};

/*
  Serviços de envio de email
  Amazon SES
  Mailgun
  Sparkpost
  Mandril
  Mailtrap (apenas para ambiente de desenvolvimento)
*/
