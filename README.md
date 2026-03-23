# opsboard

Aplicação fullstack de gerenciamento operacional de tarefas e equipes. Permite cadastrar funcionários, organizar times e acompanhar tarefas em um painel centralizado.

## Sobre o projeto

O **opsboard** é composto por três partes principais:

- **API REST** (`apps/api`) — backend em Node.js com Express, autenticação via JWT e persistência em PostgreSQL. Expõe rotas para employees, teams, tasks e login, com documentação Swagger disponível em `/api-docs`.
- **Frontend** (`apps/web/opsboard`) — interface construída com React 19, Vite e Tailwind CSS. Inclui tela de login, dashboard de tarefas e gerenciamento de equipes.
- **Schemas compartilhados** (`packages/schemas`) — validações Zod reutilizadas entre API e frontend.

## Stack

| Camada      | Tecnologia                              |
|-------------|-----------------------------------------|
| Backend     | Node.js, Express, JWT, bcryptjs         |
| Banco        | PostgreSQL 16 (via Docker)              |
| Frontend    | React 19, Vite, Tailwind CSS            |
| Validação   | Zod                                     |
| Infra local | Docker Compose                          |

---

## Como rodar o projeto

### Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) e Docker Compose
- [Node.js](https://nodejs.org/) v18 ou superior

---

### 1. Subir o banco de dados

Na raiz do projeto, execute:

```bash
docker compose up -d postgres
```

O container será criado com as seguintes credenciais:

| Parâmetro | Valor        |
|-----------|--------------|
| Banco     | `opsboard`   |
| Usuário   | `opsboard`   |
| Senha     | `opsboard123`|
| Porta     | `55433`      |

O schema é inicializado automaticamente a partir de `apps/api/sql/init.sql`.  
O volume `postgres_data` garante persistência entre reinicializações.

> **Atenção:** se você já subiu o banco com um schema antigo, o `init.sql` não será reaplicado automaticamente. Nesse caso, recrie o banco com:
> ```bash
> docker compose down -v
> docker compose up -d postgres
> ```

---

### 2. Configurar a API

Crie o arquivo `.env` dentro de `apps/api/`:

```env
PORT=3333
DATABASE_URL=postgresql://opsboard:opsboard123@localhost:55433/opsboard
JWT_SECRET=troque-este-segredo-em-producao
```

---

### 3. Instalar dependências e rodar a API

```bash
cd apps/api
npm install
npm run dev
```

A API ficará disponível em `http://localhost:3333`.  
A documentação Swagger estará acessível em `http://localhost:3333/api-docs`.

---

### 4. Instalar dependências e rodar o frontend

Em outro terminal:

```bash
cd apps/web/opsboard
npm install
npm run dev
```

O frontend ficará disponível em `http://localhost:5173`.

---

### 5. Validar a conexão

Com a API em execução, verifique o health check:

```bash
curl http://localhost:3333/api/health
```

A resposta deve indicar `status: ok` e `db.connected: true`.

---

## Observação técnica

O schema SQL inclui a coluna `password_hash` na tabela `employees`, exigida pelos fluxos de criação de funcionário e login em `employees.controller.js` e `login.controller.js`. A porta exposta pelo Docker é `55433` (mapeada para `5432` internamente), portanto a `DATABASE_URL` deve referenciar a porta `55433` ao rodar a API localmente.
