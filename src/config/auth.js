// Separando a parte do id único e data de expiração
// Configurações da parte de autenticação da aplicação
export default {
  secret: process.env.APP_SECRET,
  expiresIn: '7d',
};
