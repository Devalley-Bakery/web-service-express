# Bakery Management System

<p align="center">
   <img src="http://img.shields.io/static/v1?label=STATUS&message=EM%20DESENVOLVIMENTO&color=RED&style=for-the-badge" #vitrinedev/>
</p>


Este é um sistema de gerenciamento interno para uma padaria, desenvolvido com **Node.js** e **Express**. O sistema permite que os funcionários gerenciem pedidos, controlem o estoque e visualizem relatórios detalhados, otimizando as operações internas.


### Funcionalidades

- Gerenciamento de pedidos: Criação, atualização e visualização de pedidos.
- Controle de estoque: Gerenciar quantidade e preços dos produtos.
- Geração de relatórios: Relatórios sobre pedidos e estoque para otimizar as operações.

  
### Padrões de Projeto Utilizados

- **Singleton**: Garantir que o gerenciamento de estoque seja feito por uma única instância.
- **Facade**: Centralizar operações relacionadas ao gerenciamento de pedidos e estoque através de uma interface simplificada.
- **Observer**: Notificar automaticamente as partes interessadas quando o estado de um pedido mudar.


### Pré-requisitos

- **Node.js** (v14 ou superior)
- **npm** (v6 ou superior)
- **MySQL**: um banco de dados MySQL configurado e acessível.

### Ferramentas Utilizadas

- **Express**: Framework web para Node.js
- **Prisma**:  ORM para facilitar a interação com o banco de dados
- **Postman**: Para testar as APIs

### Instalação

Siga os passos abaixo para configurar e rodar o projeto localmente:
`
Instale as depências do projeto

```bash
$ npm install
```

### Set up the environment

Crie um arquivo ".env" e insira o conteúdo existente no arquivo ".env.example". Nesse novo arquivo criado, insira as informações do seu banco de dados corretamente.

```bash
$ .env => in this file, whe have our database URL. Basically, his default body is like this:

DATABASE_URL="mysql://{database user}:{database password}@{host}:{database port}/{database name}"
```

### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

```
Com o comando "watch mode" o servidor será iniciado com reinicialização automática quando mudanças forem feitas no código.

### Populando o Banco de dados

O projeto inclui um arquivo seed.mjs para popular o banco de dados com os dados dos produtos, os quais sempre serão fixos.

```bash
npm run seed
```

### Estrutura de pastas

```bash
├── node_modules/
├── prisma/
│   ├── schema.prisma   # Configuração do Prisma
│   └── seed.js         # Arquivo de seed para popular o banco de dados
├── src/
│   └── app.js          # Arquivo principal do servidor
├── package.json         # Configurações do projeto
├── package-lock.json    # Arquivo de dependências
└── README.md            # Documentação do projeto
```

### Testes do Sistema de Gerenciamento de Pedidos (Bakery Management System)

A seguir, serão descritos os testes realizados para validar o comportamento das APIs do sistema de gerenciamento de pedidos, incluindo criação de pedidos, consulta de pedidos por ID e status, e atualização do status dos pedidos. O objetivo desses testes é garantir que as funcionalidades do sistema funcionem corretamente e que os erros sejam tratados adequadamente.

### Testes dos Endpoints

Endpoint: `POST /orders`
- Objetivo: Criar um novo pedido.
- Requisição:
- Método: `POST`
- URL: `/orders`
- Body:
```
{
  "employeeId": 1,
  "products": [
    {"productId": 1, "quantity": 2}, 
     {"productId": 3, "quantity": 1}
  ]
}
```

Comportamento Esperado:
- O sistema deve validar se o funcionário existe.
- O sistema deve verificar se os produtos estão em estoque e se a quantidade é suficiente.
- O estoque de cada produto deve ser atualizado após a criação do pedido.
- O pedido deve ser registrado com o status in_progress.
- A resposta deve retornar o pedido criado com o total calculado.
---
Endpoint: `GET /orders/:id`

- Objetivo: Obter os detalhes de um pedido específico pelo ID.
- Requisição:
- Método: `GET`
- URL: `/orders/{id}`
- Parametros: id - ID do pedido.

Comportamento Esperado:
- O sistema deve buscar o pedido pelo ID.
- O sistema deve retornar os detalhes do pedido, incluindo os produtos associados, suas quantidades e preços.
- Caso o pedido não seja encontrado, o sistema deve retornar um erro `404`.
---
Endpoint: `GET /orders`

- Objetivo: Obter os pedidos filtrados por status.

Requisição:
- Método: `GET`
- URL: `/orders`
- Query Params: status - Status do pedido (ex: in_progress, completed, canceled).

Comportamento Esperado:
- O sistema deve validar se o status fornecido é válido.
- O sistema deve retornar todos os pedidos que correspondem ao status solicitado.
- Caso não haja pedidos com o status solicitado, o sistema deve retornar uma lista vazia.
- Caso o status fornecido seja inválido, o sistema deve retornar um erro 400.
---
Endpoint: `PUT /orders/:id`

- Objetivo: Atualizar o status de um pedido.
- Requisição:
- Método: `PUT`
- URL: `/orders/{id}`

Body:

```
{
  "status": "completed"
}
```

Comportamento Esperado:
- O sistema deve validar se o status fornecido é válido.
- O sistema deve verificar se o pedido existe.
- O sistema deve garantir que um pedido com status completed ou canceled não possa ser alterado.
- O sistema deve retornar o status do pedido atualizado ou um erro, caso a atualização não seja permitida.

### Exemplos de Respostas

`POST /orders` - Criação de Pedido
- Resposta Esperada (200):

```
{
  "id": 1,
  "employeeId": 1,
  "total": 100.0,
  "status": "in_progress",
  "orderDate": "2024-11-13T00:00:00.000Z",
  "products": [
    {
      "productName": "Produto 1",
      "quantity": 2,
      "price": 20.0
    },
    {
      "productName": "Produto 3",
      "quantity": 1,
      "price": 60.0
    }
  ]
}
```
---
`GET /orders/`
- Detalhes do Pedido

- Resposta Esperada (200):

```
{
  "id": 1,
  "status": "in_progress",
  "total": 100.0,
  "orderDate": "2024-11-13T00:00:00.000Z",
  "products": [
    {
      "productName": "Produto 1",
      "quantity": 2,
      "price": 20.0
    },
    {
      "productName": "Produto 3",
      "quantity": 1,
      "price": 60.0
    }
  ]
}
```

---
`GET /orders` - Obter Pedidos por Status

- Resposta Esperada (200):

```
[
  {
    "id": 1,
    "status": "in_progress",
    "total": 100.0,
    "orderDate": "2024-11-13T00:00:00.000Z",
    "products": [
      {
        "productName": "Produto 1",
        "quantity": 2,
        "price": 20.0
      },
      {
        "productName": "Produto 3",
        "quantity": 1,
        "price": 60.0
      }
    ]
  }
]
```
---
`PUT /orders/`
- Atualizar Status de Pedido

Resposta Esperada (200):

```
{
  "status": "Order status successfully updated"
}
```

### Testes de Erros

`POST /orders` - Erro de Estoque Insuficiente

Resposta Esperada (400):
```
{
  "error": "Insufficient stock for product Produto 1."
}
```
---
`GET /orders/`
- Pedido Não Encontrado

Resposta Esperada (404):
```
{
  "error": "Order not found."
}
```
---
`GET /orders` - Status Inválido

Resposta Esperada (400):
```
{
  "error": "Invalid status."
}
```
---
`PUT /orders/`
- Tentativa de Atualizar Pedido com Status completed ou canceled

Resposta Esperada (400):
```
{
  "error": "Order cannot be updated."
}
```