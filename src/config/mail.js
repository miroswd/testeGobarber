// Configurações de envio de email
// As credenciais foram obtidas através do mailtrap

export default {
  host: 'smtp.mailtrap.io', // O envio do email será através de SMTP (Protocolo de envio de emails)
  port: '2525',
  secure: false,
  auth: {
    user: '8b35c4e8f022a3',
    pass: 'e7179ec9d7656d',
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
