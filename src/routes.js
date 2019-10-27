import { Router } from 'express'; // Separo o roteamento do express
// import User from './app/models/User';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware); // Passando de forma global, para as rotas a baixo

// Essa rota, só pode ser acessada se o user estiver autenticado
routes.put('/users', /* authMiddleware, */ UserController.update);

/* ROTAS PARA TESTE

// Alimentado pelo database
routes.get('/', async (req, res) => {
  const user = await User.create({
    name: 'miro',
    email: 'miroswd12@email.com',
    password_hash: '12341234',
  });
  return res.json(user);
});

//Alimentado manualmente
routes.get('/', (req, res) => {
  return res.json({ msg: 'bom dia' });
});



*/
export default routes;
