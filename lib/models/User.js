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

  static async getUser(slack_id) {
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

  static async insert({ user }) {
    const { rows } = await pool.query(
      `
        INSERT INTO
          users (slack_id)
        VALUES
          ($1)
        RETURNING
          *
      `,
      [user]
    );
    if (!rows[0]) return null;
    return new User(rows[0]);
  }

  static async promoteAdmin(slack_id) {
    const existingUser = await User.getUser(slack_id);

    if (!existingUser) return null;

    const { rows } = await pool.query(
      `
      UPDATE
        users
      SET
        is_admin=$1
      WHERE
        slack_id=$2
      RETURNING
        *
      `,
      [true, slack_id]
    );

    if (!rows[0]) return null;
    return new User(rows[0]);
  }
};
