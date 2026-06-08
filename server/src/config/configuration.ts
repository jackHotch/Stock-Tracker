export default () => ({
  port: parseInt(process.env.APP_PORT ?? '3000', 10),
  database: {
    connectionString: process.env.DATABASE_STRING,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  },
});
