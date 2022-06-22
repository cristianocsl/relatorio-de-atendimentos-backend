const {
  BAD_REQUEST,
  CONFLICT,
  UNAUTHORIZED, NOT_FOUND } = require('http-status-codes').StatusCodes;

  const INCORRECT_PASSWORD = { code: BAD_REQUEST, message: 'Senha incorreta!' };
  
  const EMAIL_EXISTING = { code: CONFLICT, message: 'Usuário já registrado!' };
  
  const EMPTY_BODY = {
      code: BAD_REQUEST, message: 'Não é possível cadastrar um usuário com campos vazios!' };
  
  const TOKEN_NOT_FOUND = { code: UNAUTHORIZED, message: 'Token não encontrado!' };
  
  const INVALID_TOKEN = { code: UNAUTHORIZED, message: 'Token inválido ou expirado!' };
  
  const USER_DOES_NOT_EXIST = {
    code: NOT_FOUND, message: 'Usuário não existe ou email está incorreto!',
  };
    
  const EMPTY_PATIENT_LIST = {
    code: NOT_FOUND, message: 'Não há pacientes cadastrados para este usuário!',
  };

  const INVALID_ID_LENGTH = { code: BAD_REQUEST, message: 'Mongodb id must be 24 characters' };

  const EXISTING_PATIENT = { code: CONFLICT, message: 'Paciente já cadastrado!' };

  const INEXISTING_PATIENT = { code: NOT_FOUND, message: 'Paciente não encontrado!' };

  const USERID_DOES_NOT_MATCH = { code: NOT_FOUND, message: 'Id do usuário não confere!' };

  const EMPTY_FIELD = { code: NOT_FOUND, message: 'Este campo não pode ser vazio!' };

  const INVALID_PASSWORD = { code: BAD_REQUEST, message: 'A senha deve ter no mínimo 6 dígitos!' };

  const INVALID_EMAIL = { code: BAD_REQUEST, message: 'Formato de e-mail inválido!' };

module.exports = {
  INCORRECT_PASSWORD,
  EMAIL_EXISTING,
  TOKEN_NOT_FOUND,
  INVALID_TOKEN,
  USER_DOES_NOT_EXIST,
  EMPTY_PATIENT_LIST,
  EMPTY_FIELD,
  INVALID_ID_LENGTH,
  INVALID_PASSWORD,
  INVALID_EMAIL,
  EMPTY_BODY,
  EXISTING_PATIENT,
  INEXISTING_PATIENT,
  USERID_DOES_NOT_MATCH,
};
