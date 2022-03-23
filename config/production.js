module.exports = {
  env: 'production',
  log: {
    level: 'production',
    disabled: false,
  },
  cors: {
    origins: ['http://localhost:3000'],
    maxAge: 3 * 60 * 60,
  },
  database: {
    client: 'mysql2',
    host: '',
    port: 3306,
    name: '',
    username: '',
    password: '',
  },
  auth: {
    argon: {
      saltLength: 16, //128 bits
      hashLength: 32, //256 bits
      timeCost: 4,
      memoryCost: 2 ** 17, //1024bits
    },
    jwt: {
      secret: '',
      expirationInterval: 60 * 60, //1u
      issuer: '',
      audience: '',
    },
  },
};
