import dotenv from 'dotenv'

dotenv.config()

export const env = {
  port: Number(process.env.PORT) || 3333,
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || 'change-this-secret-in-production',
  primaryPassword: process.env.PRIMARY_PASSWORD || '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '5h'
}
