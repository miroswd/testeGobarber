import 'dotenv/config';

import express from 'express';
import 'express-async-errors';
import path from 'path';

import Youtch from 'youch';

import * as Sentry from '@sentry/node';
import routes from './routes';

import sentryConfig from './config/sentry';

import './database'; // Carrega todas as variáveis

class App {
  constructor() {
    this.server = express();

    Sentry.init(sentryConfig);

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler()); // Vem antes de tudo
    this.server.use(express.json()); // Permite ler JSON
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'temp', 'uploads'))
    ); // Recurso do express para servir arquivos estáticos, imagens. css, html, que podem ser acessados diretamente pelo navegador
  }

  routes() {
    this.server.use(routes); // Executa o arquivo routes.js
    this.server.use(Sentry.Handlers.errorHandler()); // Depois de tudo
  }

  exceptionHandler() {
    // Os erros vão cair aqui
    // Quando um middleware recebe 4 parâmetros, ele é um middleware de tratamento de exceções
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youtch(err, req).toJSON();
        return res.status(500).json(errors); // Internal Server error
      }
      return res.status(500).json({ error: 'Internal server error' });
    });
  }
}

export default new App().server; // Exporta o server
