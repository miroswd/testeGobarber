// Middleware de autenticação
// Verifica se o usuário está autenticado através do token
// Dentro de auth no Insomnia -> bearer token -> coloco o token lá

import jwt from 'jsonwebtoken';

import { promisify } from 'util'; // Pega a função de callback e transforma numa função que posso usar async await

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  // Se chamar o next, o usuário está autenticado
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provide' });
  }

  const [, token] = authHeader.split(' '); // Separando bearer do token

  // Podendo retornar um erro de autenticação, por isso usar o try catch
  try {
    const decoded = await promisify(jwt.verify)(
      /* retorna uma função */ token,
      authConfig.secret
    );

    req.userId = decoded.id; // Para alterar o usuário -> no userController

    // console.log(decoded); // tem q mostrar o id do user

    return next(); // o usuário está autenticado
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
