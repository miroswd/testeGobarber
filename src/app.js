import express from 'express';
import path from 'path';
import routes from './routes';

import './database';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json()); // Permite ler JSON
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'temp', 'uploads'))
    ); // Recurso do express para servir arquivos estáticos, imagens. css, html, que podem ser acessados diretamente pelo navegador
  }

  routes() {
    this.server.use(routes); // Executa o arquivo routes.js
  }
}

export default new App().server; // Exporta o server
