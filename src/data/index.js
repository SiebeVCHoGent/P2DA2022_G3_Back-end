const config = require("config");
const knex = require("knex");

const NODE_ENV = 'development';
const { getChildLogger, getLogger } = require("../core/logging");
const DATABASE_CLIENT = config.get("database.client");
const DATABASE_NAME = config.get("database.name");
const DATABASE_HOST = config.get("database.host");
const DATABASE_PORT = config.get("database.port");
const DATABASE_USERNAME = config.get("database.username");
const DATABASE_PASSWORD = config.get("database.password");

let knexInstance;

const getKnexLogger = (logger, level) => (message) => {
  if (message.sql) {
    logger.log(level, message.sql);
  } else if (message.length && message.forEach) {
    message.forEach((innerMessage) =>
      logger.log(
        level,
        innerMessage.sql ? innerMessage.sql : JSON.stringify(innerMessage)
      )
    );
  } else {
    logger.log(level, JSON.stringify(message));
  }
};

async function initializeData() {
  const logger = getChildLogger("database");
  const knexOptions = {
    client: DATABASE_CLIENT,
    connection: {
      host: DATABASE_HOST,
      port: DATABASE_PORT,
      database: DATABASE_NAME,
      user: DATABASE_USERNAME,
      password: DATABASE_PASSWORD,
      insecureAuth: false,
    },
    debug: false,
    log: {
      debug: getKnexLogger(logger, "debug"),
      error: getKnexLogger(logger, "error"),
      warn: getKnexLogger(logger, "warn"),
      deprecate: (method, alternative) =>
        logger.warn("Knex reported something deprecated", {
          method,
          alternative,
        }),
    },
  };
  knexInstance = knex(knexOptions);
  try {
    await knexInstance.raw("SELECT 1+1 AS result");
  } catch (error) {
    logger.error(error.message, { error });
    throw new Error("failed");
  }
  console.log("verbonden");
  return knexInstance;
}
function getKnex() {
  if (!knexInstance) throw new Error("Initialize connection first");
  return knexInstance;
}
const tables = Object.freeze({
  account: "lid",
});
async function shutDownData() {
  getLogger().info("Shutting down database connection");
  await knexInstance.destroy();
  knexInstance = null;

  getLogger().info("Database connection closed");
}
module.exports = {
  initializeData,
  getKnex,
  tables,
  shutDownData,
};
