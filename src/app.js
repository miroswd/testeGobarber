import express from 'express';
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
  }

  routes() {
    this.server.use(routes); // Executa o arquivo routes.js
  }
}

export default new App().server; // Exporta o server
