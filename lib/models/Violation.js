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
    this.identity_attack = row.identity_attack ?? false;
    this.insult = row.insult ?? false;
    this.obscene = row.obscene ?? false;
    this.severe_toxicity = row.severe_toxicity ?? false;
    this.sexually_explicit = row.sexually_explicit ?? false;
    this.threat = row.threat ?? false;
    this.toxicity = row.toxicity ?? false;
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
    toxicity,
  }) {
    const { rows } = await pool.query(
      `
      INSERT INTO
        violations (user_id, comment, identity_attack, insult, obscene, severe_toxicity, sexually_explicit, threat, toxicity)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING 
            *
      `,
      [
        user_id,
        comment,
        identity_attack,
        insult,
        obscene,
        severe_toxicity,
        sexually_explicit,
        threat,
        toxicity,
      ]
    );
    if (!rows[0]) return null;
    return new Violation(rows[0]);
  }

  static async getLeaderboard() {
    const { rows } = await pool.query(
      `
      SELECT
        slack_id,
        COUNT (user_id) AS violations_count,
        RANK() OVER(ORDER BY COUNT(user_id) DESC)
      FROM
	      violations
      INNER JOIN
	      users
      ON
	      users.id = violations.user_id
      GROUP BY slack_id
      LIMIT 5
      `
    );
    if (!rows[0]) return null;
    return rows.map((row) => {
      return {
        slack_id: row.slack_id,
        violations_count: row.violations_count,
      };
    });
  }

  static async getByUserId(slack_id) {
    const { rows } = await pool.query(
      `
      SELECT
        violations.id,
        user_id,
        comment,
        identity_attack,
        insult,
        obscene,
        severe_toxicity,
        sexually_explicit,
        threat,
        toxicity
      FROM
	      violations
      FULL JOIN
	      users
      ON
	      users.id = violations.user_id
      WHERE
	      users.slack_id = $1
      `,
      [slack_id]
    );
    if (!rows[0]) return null;
    return rows.map((row) => new Violation(row));
  }
};
