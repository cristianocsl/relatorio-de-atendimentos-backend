const {
  BAD_REQUEST,
  CONFLICT,
  UNAUTHORIZED, NOT_FOUND } = require('http-status-codes').StatusCodes;

  const INCORRECT_LOGIN = { code: BAD_REQUEST, message: 'Senha incorreta!' };
  
  const EMAIL_EXISTING = { code: CONFLICT, message: 'Usuário já registrado!' };
  
  const TOKEN_NOT_FOUND = { code: UNAUTHORIZED, message: 'Token não encontrado!' };
  
  const INVALID_TOKEN = { code: UNAUTHORIZED, message: 'Token inválido ou expirado!' };
  
  const USER_DOES_NOT_EXIST = {
    code: NOT_FOUND, message: 'Usuário não existe ou email está incorreto!',
  };
    
  const UNAUTHORIZED_USER = { code: UNAUTHORIZED, message: 'Usuário não autorizado!' };

  const INVALID_ID_LENGTH = { code: BAD_REQUEST, message: 'Mongodb id must be 24 characters' };

module.exports = {
  INCORRECT_LOGIN,
  EMAIL_EXISTING,
  TOKEN_NOT_FOUND,
  INVALID_TOKEN,
  USER_DOES_NOT_EXIST,
  UNAUTHORIZED_USER,
  INVALID_ID_LENGTH,
};
