const pool = require('../utils/pool');

module.exports = class Insult {
  adjective_1;
  adjective_2;
  noun;

  constructor(row) {
    this.adjective_1 = row.adjective_1;
    this.adjective_2 = row.adjective_2;
    this.noun = row.noun;
  }

  static async getInsult() {
    const { rows } = await pool.query(
      `
        SELECT
          adjective_1, adjective_2, noun
        FROM
          insults
        ORDER BY RANDOM()
        LIMIT 3
      `
    );
    const insult = {
      adjective_1: rows[0].adjective_1, 
      adjective_2: rows[1].adjective_2, 
      noun: rows[2].noun
    };
    return new Insult(insult);
  }
};
