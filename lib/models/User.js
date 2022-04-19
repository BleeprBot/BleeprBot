const pool = require('../utils/pool');

module.exports = class User {
  id;
  slack_id;
  is_admin;

  constructor(row) {
    this.id = row.id;
    this.slack_id = row.slack_id;
    this.is_admin = row.is_admin;
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
};
