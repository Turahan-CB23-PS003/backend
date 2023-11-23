const pool = require("../../helpers/DatabasePool");

const testConnection = async (request, h) => {
  const result = await _executeQuery({
    sql: "SELECT * FROM tes",
  });

  return h.response({
    status: "success",
    data: {
      result,
    },
  });
};

const _executeQuery = (query) => {
  return new Promise((resolve, reject) => {
    pool.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = { testConnection };
