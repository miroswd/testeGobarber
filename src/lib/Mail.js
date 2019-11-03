// Configurações do email

import nodemailer from 'nodemailer';
import exphbs from 'express-handlebars';
import nodemailerhbs from 'nodemailer-express-handlebars';
import { resolve } from 'path';
import mailConfig from '../config/mail';

class Mail {
  constructor() {
    const { host, port, secure, auth } = mailConfig;

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null, // Verifica se dentro de auth tem um usuário
    }); // O nodemailer chama essa variável para fazer serviços externos

    this.configuretemplates();
  }

  sendMail(message) {
    // Resposável por enviar o email
    return this.transporter.sendMail({
      ...mailConfig.default, // ... joga tudo que estiver dentro de mailConfig.default
      ...message,
    });
  }

  configuretemplates() {
    const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails'); // Caminho dos templates

    this.transporter.use(
      'compile',
      nodemailerhbs({
        viewEngine: exphbs.create({
          layoutsDir: resolve(viewPath, 'layouts'),
          partialsDir: resolve(viewPath, 'partials'),
          defaultLayout: 'default',
          extname: '.hbs',
        }),
        viewPath,
        extName: '.hbs',
      })
    ); // Como compila os templates de email
  }
}

export default new Mail();
