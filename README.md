# Bem vindo(a) ao repositório do projeto Relatório de atendimentos Api.

## Contexto

API (Application Programming Interface) desenvolvida em NodeJS com MongoDB e MongoDB Atlas. Utiliza arquitetura em camadas (MSC - Model Service Controllers), aplica a técnica de Test-Driven Development (TDD), e constitui parte integrante de uma aplicação fullstack com o objetivo de criar relatórios de atendimentos mensais de profissionais da área da saúde com foco em home care.

------------
<!-- ### Veja a aplicação no ar por este link: https://frontend-todolist-cris.herokuapp.com/ -->
------------

## Rotas

<!-- Para as requisições a seguir deve ser utilizado este link: https://backend-todo-list-cristiano.herokuapp.com -->

## Registro do usuário

### Endpoint POST <code>/register</code>

* o corpo da requisição deve ter o seguinte formato:

```json
{
  "name": "Cristiano",
  "security_phrase": "frase de segurança para recuperação de senha",
  "email": "cristiano@exemplo.com",
  "password": "senhasenha",
}
```

### Caso de sucesso na requisição para a rota <code>/register</code>:

O caso de sucesso na validação da requisição terá como resposta uma mensagem de sucesso acompanhada pelo nome do usuário:

```json
{
  "message": "Parabéns, Cristiano! Seu cadastro foi realizado com sucesso!",
}
```

### Casos de falha na requisição para a rota <code>/register</code>:

Casos de falha na validação da requisição terão as seguintes respostas seguindo a estrutura abaixo:

<strong>Não é possível registrar o profissional com um email já existente no banco de dados:</strong>
```json
{
  "code": 409,
  "message": "Usuário já registrado!"
}
```

## Login do usuário

### Endpoint POST <code>/login</code>

* o corpo da requisição deve ter o seguinte formato:

```json
{
  "email": "cristiano@exemplo.com",
  "password": "senhasenha",
}
```

### Caso de sucesso na requisição para a rota <code>/login</code>:

```json
{
  "name": "Usuário",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmEyYjNkMmY5OThmNDU4N2UzZjczMDMiLCJuYW1lIjoiVXN1w6FyaW8gMiIsImVtYWlsIjoidXN1YXJpby0yQGdtYWlsLmNvbSIsImlhdCI6MTY1NDgzMDA4Nn0.C6c5nNkxxcm1EHcKpTCb3z-ycZf011ka-_5wfnJ10aE"
}
```

Casos de falha na validação da requisição terão as seguintes respostas seguindo a estrutura abaixo:

<strong>Não é possível fazer o login do profissional com um email que não existe no banco de dados:</strong>
```json
{
  "code": 404,
  "message": "Usuário não existe ou email está incorreto!"
}
```

<strong>O email do profissional foi encontrado no banco de dados, mas a senha está incorreta:</strong>
```json
{
  "code": 400,
  "message": "Senha incorreta!"
}
```

## Registro de um paciente

### Endpoint POST <code>/registerPatient</code>

* o corpo da requisição deve ter o seguinte formato:

```json
{
    "patient": "João",
    "neighborhood": "Farol",
    "days": [1, 4],
    "serviceGoal": {
      "weekly": 3,
      "monthly": 12
    },
    "servicePerformed": {
      "weekly": 0,
      "monthly": 0
    },
    "healthInsurance": "Home Care Saúde",
    "unitPrice": 40.00,
    "evolution": "Some information"
}
```

Obs.: dias da semana: 0 = domingo, 1 = segunda-feira, ... , 7 = sábado.

### Caso de sucesso na requisição para a rota <code>/registerPatient</code>:

```json
{
  "patient": "João",
  "neighborhood": "Farol",
  "days": [
    1,
    4
  ],
  "serviceGoal": {
    "weekly": 3,
    "monthly": 12
  },
  "servicePerformed": {
    "weekly": 0,
    "monthly": 0
  },
  "healthInsurance": "Home Care Saúde",
  "unitPrice": 40,
  "evolution": "",
  "userId": "62a2b3d2f998f4587e3f7303",
  "prevTotalPrice": 480,
  "doneTotalPrice": 0,
  "servicePending": {
    "weekly": 3,
    "monthly": 12
  },
  "_id": "62a2b54ef134851b64ef6840",
  "message": "Paciente cadastrado com sucesso!"
```

Casos de falha na validação da requisição terão as seguintes respostas seguindo a estrutura abaixo:

<strong>Não é possível registrar um paciente duplicado no banco de dados para o mesmo profissional:</strong>
```json
{
  "code": 409,
  "message": "Paciente já cadastrado!"
}
```




