import sql from 'mssql';

const tempConfig = {
  server: process.env.DB_SERVER,
  database: process.env.DB_TEMP_DB,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    trustServerCertificate: false,
    encrypt: true
  }
};

const pollutionConfig = {
  ...tempConfig,
  database:  process.env.DB_POLLUTION_DB
};

const precipitationConfig = {
  ...tempConfig,
  database:  process.env.DB_PRECIPITATION_DB
};

// Pools de connexions
let tempPool, pollutionPool, precipitationPool;

export const getTempConnection = async () => {
  if (!tempPool) {
    tempPool = await new sql.ConnectionPool(tempConfig).connect();
  }
  return tempPool;
};

export const getPollutionConnection = async () => {
  if (!pollutionPool) {
    pollutionPool = await new sql.ConnectionPool(pollutionConfig).connect();
  }
  return pollutionPool;
};

export const getPrecipitationConnection = async () => {
  if (!precipitationPool) {
    precipitationPool = await new sql.ConnectionPool(precipitationConfig).connect();
  }
  return precipitationPool;
};

export { sql };
