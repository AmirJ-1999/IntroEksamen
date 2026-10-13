-- One row per account: the password hash and the whole synced progress blob (JSON).
-- "rev" increases on every save so two devices can't silently overwrite each other.
CREATE TABLE users (
  username   TEXT PRIMARY KEY,
  salt       TEXT NOT NULL,
  hash       TEXT NOT NULL,
  data       TEXT NOT NULL DEFAULT '{}',
  rev        INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Login sessions: a random token per device.
CREATE TABLE sessions (
  token      TEXT PRIMARY KEY,
  username   TEXT NOT NULL REFERENCES users(username) ON DELETE CASCADE,
  created_at INTEGER NOT NULL
);
CREATE INDEX sessions_user ON sessions(username);
