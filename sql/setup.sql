-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS violations;
DROP TABLE IF EXISTS insults;

CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    slack_id TEXT NOT NULL,
    is_admin BOOLEAN NOT NULL
);

CREATE TABLE violations (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id),
    comment TEXT NOT NULL,
    identity_attack BOOLEAN NOT NULL,
    insult BOOLEAN NOT NULL,
    obscene BOOLEAN NOT NULL,
    severe_toxicity BOOLEAN NOT NULL,
    sexually_explicit BOOLEAN NOT NULL,
    threat BOOLEAN NOT NULL,
    toxicity BOOLEAN NOT NULL,
);

CREATE TABLE insults (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    adjective_1 TEXT NOT NULL,
    adjective_2 TEXT NOT NULL,
    noun TEXT NOT NULL
);
