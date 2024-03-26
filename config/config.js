module.exports = {
  PORT: process.env.PORT,
  HOST: process.env.HOST,

  /** database */
  db: {
    mongo_url: process.env.MONGO_URL
  },

  /** AUTH KEY */
  jwt: {
    secret_key: process.env.JWT_SECRET_KEY
  },

  nodemailer: {
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASS
  }

};