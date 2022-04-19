const Joi = require('joi');

// const SCHEMA = Joi.object({
//   name: Joi.string().min(3).not().empty()
//     .required(),
//   email: Joi.string().email().not().empty()
//     .required(),
//   password: Joi.string().min(6).not().empty()
//     .required(),
// });

const ERR_REGISTER = {
  'any.required': 'Este campo é obrigatório.',
  'string.base': 'Preencha apenas com letras.',
  'string.empty': 'Este campo não pode ser vazio.',
  'string.min': 'Utilize no mínimo de 6 caracteres.',
  'string.email': 'Preencha este campo com um email válido.',
};

const SCHEMA = {
  name: Joi.string().min(3).required().messages(ERR_REGISTER),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .messages(ERR_REGISTER),
  password: Joi.string().min(6).required().messages(ERR_REGISTER),
  confirmPassword: Joi.string().min(6).required().messages(ERR_REGISTER),
  securityPhrase: Joi.string().required().messages(ERR_REGISTER),
};

const validateUserRegister = async (body) => SCHEMA.validate(body);

module.exports = validateUserRegister;