const pool = require('../utils/pool');

module.exports = class Violation {
  id;
  user_id;
  comment;
  identity_attack;
  insult;
  obscene;
  severe_toxicity;
  sexually_explicit;
  threat;
  toxicity;
   
  constructor(row) {
    this.id = row.id;
    this.user_id = row.user_id;
    this.comment = row.comment;
    this.identity_attack = row.identity_attack;
    this.insult = row.insult;
    this.obscene = row.obscene;
    this.severe_toxicity = row.severe_toxicity;
    this.sexually_explicit = row.sexually_explicit;
    this.threat = row.threat;
    this.toxicity = row.toxicity;
  }
    
  static async insert({
    user_id,
    comment,
    identity_attack,
    insult,
    obscene,
    severe_toxicity,
    sexually_explicit,
    threat,
    toxicity }) {
    const { rows } = await pool.query(
      `
      INSERT INTO
        violations (user_id, comment, identity_attack, insult, obscene, severe_toxicity, sexually_explicit, threat, toxicity)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING 
            *
      `,
      [user_id, comment, identity_attack, insult, obscene, severe_toxicity, sexually_explicit, threat, toxicity]
    );
    if (!rows[0]) return null;
    return new Violation(rows[0]);
  }
};
