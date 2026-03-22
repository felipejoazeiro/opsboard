import swaggerJSDoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'OpsBoard API',
      version: '1.0.0',
      description: 'Documentacao da API do OpsBoard.'
    },
    servers: [
      {
        url: 'http://localhost:3333/api',
        description: 'Servidor local'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        LoginRequest: {
          type: 'object',
          required: ['login', 'password'],
          properties: {
            login: { type: 'string', example: 'admin' },
            password: { type: 'string', example: 'admin123' }
          }
        },
        LoginSuccessResponse: {
          type: 'object',
          properties: {
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                name: { type: 'string' },
                email: { type: 'string', format: 'email' },
                role: { type: 'string', enum: ['Manager', 'Staff', 'Intern'] }
              }
            }
          }
        },
        ChangePasswordRequest: {
          type: 'object',
          required: ['login', 'oldPassword', 'newPassword'],
          properties: {
            login: { type: 'string', example: 'admin' },
            oldPassword: { type: 'string', example: 'admin123' },
            newPassword: { type: 'string', minLength: 8, example: 'NovaSenha@123' }
          }
        },
        EmployeeInput: {
          type: 'object',
          required: ['name', 'email', 'role', 'teamId'],
          properties: {
            name: { type: 'string', example: 'Ana Souza' },
            email: { type: 'string', format: 'email', example: 'ana@opsboard.local' },
            role: { type: 'string', enum: ['Manager', 'Staff', 'Intern'], example: 'Staff' },
            teamId: { type: 'string', example: 'core' },
            isActive: { type: 'boolean', example: true }
          }
        },
        Employee: {
          allOf: [
            { $ref: '#/components/schemas/EmployeeInput' },
            {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                createdAt: { type: 'string', format: 'date-time' }
              }
            }
          ]
        },
        EmployeeListResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/Employee' }
            },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'integer', example: 1 },
                pageSize: { type: 'integer', example: 10 },
                total: { type: 'integer', example: 1 },
                totalPages: { type: 'integer', example: 1 },
                hasNextPage: { type: 'boolean', example: false },
                hasPreviousPage: { type: 'boolean', example: false }
              }
            }
          }
        },
        TaskInput: {
          type: 'object',
          required: ['title', 'status', 'priority', 'createdBy'],
          properties: {
            title: { type: 'string', example: 'Atualizar inventario' },
            description: { type: 'string', example: 'Conferir equipamentos do setor A' },
            status: { type: 'string', enum: ['To Do', 'In Progress', 'Done'], example: 'To Do' },
            priority: { type: 'string', enum: ['Low', 'Medium', 'High'], example: 'High' },
            dueDate: { type: 'string', format: 'date-time' },
            createdBy: { type: 'string', example: 'admin' }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Erro interno no servidor.' },
            details: { type: 'string', example: 'Detalhes adicionais do erro.' }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
}

export const swaggerSpec = swaggerJSDoc(options)
