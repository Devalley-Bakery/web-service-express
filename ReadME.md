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
