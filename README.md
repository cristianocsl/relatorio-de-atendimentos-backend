# Bem vindo(a) ao repositório do projeto Relatório de atendimentos Api.

## Contexto

API (Application Programming Interface) desenvolvida em NodeJS com MongoDB e MongoDB Atlas. Utiliza arquitetura em camadas (MSC - Model Service Controllers), aplica a técnica de Test-Driven Development (TDD), e constitui parte integrante de uma aplicação fullstack com o objetivo de criar relatórios de atendimento mensais de profissionais da área da saúde com foco em home care.

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
  "name": "Nome do Usuário",
  "security_phrase": "frase de segurança para recuperação de senha",
  "email": "email@exemplo.com",
  "password": "senhasenha",
}
```
