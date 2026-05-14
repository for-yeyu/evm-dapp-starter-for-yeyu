import 'server-only'

export const serverConfig = {
  jwtSecret: process.env.JwtSecret as string,
}
