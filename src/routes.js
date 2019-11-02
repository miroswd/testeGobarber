import { Router } from 'express'; // Separo o roteamento do express
import multer from 'multer';

// import User from './app/models/User';

import multerConfig from './config/multer';
import authMiddleware from './app/middlewares/auth';

// Import controlers
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';

// Declarando variáveis
const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware); // Passando de forma global, para as rotas a baixo

// Essa rota, só pode ser acessada se o user estiver autenticado
routes.put('/users', /* authMiddleware, */ UserController.update);

// Listagem de prestadores
routes.get('/providers', ProviderController.index);

// Upload do avatar
routes.post('/files', upload.single('file'), FileController.store);

// Agendamento do usuário com o prestador
routes.get('/appointments', AppointmentController.index);
routes.post('/appointments', AppointmentController.store);

// Agendamento - provider
routes.get('/schedule', ScheduleController.index);

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





*/

// Alimentado manualmente
routes.get('/teste', (req, res) => {
  return res.json({ msg: 'bom dia' });
});
export default routes;
