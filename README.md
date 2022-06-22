# Bem vindo(a) ao repositório do projeto Relatório de atendimentos Api.

## Contexto

API (Application Programming Interface) desenvolvida em NodeJS com MongoDB e MongoDB Atlas. Utiliza arquitetura em camadas (MSC - Model Service Controllers), aplica a técnica de Test-Driven Development (TDD), e constitui parte integrante de uma aplicação fullstack com o objetivo de criar relatórios de atendimentos mensais de profissionais da área da saúde com foco em home care.

Nesta aplicação é possível cadastrar dados de um paciente, metas semanais e mensais de atendimentos e também atualizar dados como a quantidade de serviços prestados. Também é possível ter uma projeção financeira dos valores a serem recebidos a partir dos atendimentos realizados.

## Rotas

## Registro do usuário

### Endpoint POST <code>/register</code>

* o corpo da requisição deve ter o seguinte formato:

```json
{
  "name": "Cristiano",
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
  "status": "Ativo",
  "priority": "Normal",
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

## Atualizando dados de um paciente

### Endpoint PUT <code>/registerPatient/:patientId</code>

* o corpo da requisição deve ter o seguinte formato:

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
    "weekly": 3,
    "monthly": 0
  },
  "status": "Ativo",
  "priority": "Normal",
  "healthInsurance": "Home Care Saúde",
  "unitPrice": 40,
  "evolution": ""
}
```

### Caso de sucesso na requisição para a rota <code>/registerPatient/:patientId</code>:

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
    "weekly": 3,
    "monthly": 0
  },
  "status": "Ativo",
  "priority": "Normal",
  "healthInsurance": "Home Care Saúde",
  "unitPrice": 40,
  "evolution": "",
  "userId": "6282d5893854824c30bfe84f",
  "_id": "629f79c96becd8d13b4ceda5",
  "message": "Paciente atualizado com sucesso!"
}
```

Casos de falha na validação da requisição terão as seguintes respostas seguindo a estrutura abaixo:

<strong>Não é possível atualizar dados de um paciente se ele não está cadastrado no banco de dados:</strong>
```json
{
  "code": 404,
  "message": "Paciente não encontrado!"
}
```

<strong>Não é possível atualizar dados de um paciente se o _id do profissional não está presente nos dados de um paciente no banco de dados:</strong>
```json
{
  "code": 404,
  "message": "Id do usuário não confere!"
}
```

## Visualizando pacientes cadastrados

### Caso de sucesso na requisição do Endpoint GET <code>/patients</code>
```json
[
  {
    "_id": "62ac9e9a6702b297adbaa5f3",
    "patient": "José",
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
    "healthInsurance": "saude & suporte",
    "unitPrice": 40,
    "evolution": "",
    "userId": "62ac9e3e6702b297adbaa5f2",
    "status": "Ativo",
    "priority": "Normal",
    "createdAt": "2022-06-17T15:32:42.031Z",
    "prevTotalPrice": 480,
    "doneTotalPrice": 0,
    "servicePending": {
      "weekly": 3,
      "monthly": 12
    }
  },
  {
    "_id": "62ac9ec56702b297adbaa5f4",
    "patient": "Maria",
    "neighborhood": "Farol",
    "days": [
      2,
      5
    ],
    "serviceGoal": {
      "weekly": 3,
      "monthly": 12
    },
    "servicePerformed": {
      "weekly": 0,
      "monthly": 0
    },
    "healthInsurance": "saude & suporte",
    "unitPrice": 40,
    "evolution": "",
    "userId": "62ac9e3e6702b297adbaa5f2",
    "status": "Ativo",
    "priority": "Normal",
    "createdAt": "2022-06-17T15:33:25.965Z",
    "prevTotalPrice": 480,
    "doneTotalPrice": 0,
    "servicePending": {
      "weekly": 3,
      "monthly": 12
    }
  }
]
```

---

# Autor

  Cristiano Seabra de Lima
<br />
  Desenvolvedor WEB FullStack em constante aprendizado e entusiasta por tecnologia e sua força transformadora no mundo!

  <a href="https://www.linkedin.com/in/cristianolimacsl/" target="_blank"><img src="https://img.shields.io/badge/-LinkedIn-%230077B5?style=for-the-badge&logo=linkedin&logoColor=white" target="_blank"></a>
---
