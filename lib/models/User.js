const pool = require('../utils/pool');

module.exports = class User {
  id;
  slack_id;
  is_admin;

  constructor(row) {
    this.id = row.id;
    this.slack_id = row.slack_id;
    this.is_admin = row.is_admin ?? false;
  }

  static async getUser(
    slack_id
  ) {
    const { rows } = await pool.query(
      `
        SELECT
          *
        FROM
          users
        WHERE
          slack_id = $1
      `,
      [slack_id]
    );
    if (!rows[0]) return null;
    return new User(rows[0]);
  }

  static async insert(
    { slack_id }
  ) {
    const { rows } = await pool.query(
      `
        INSERT INTO
          users (slack_id)
        VALUES
          ($1)
        RETURNING
          *
      `,
      [slack_id]
    );
    if (!rows[0]) return null;
    return new User(rows[0]);
  }
};
