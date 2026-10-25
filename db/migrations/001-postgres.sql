-- StagePeek schema v1. Run under a migration role, never the application role.
-- The provisioning script sets search_path to the project's own schema.
CREATE TABLE IF NOT EXISTS schema_migrations(version integer PRIMARY KEY, installed_at timestamptz NOT NULL DEFAULT now());
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, google_id TEXT UNIQUE,
      created_at BIGINT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS login_tokens (
      token_hash TEXT PRIMARY KEY, email TEXT NOT NULL, expires_at BIGINT NOT NULL,
      browser_hash TEXT, consumed_at BIGINT
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id),
      expires_at BIGINT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS oauth_attempts (
      state_hash TEXT PRIMARY KEY, browser_hash TEXT NOT NULL, verifier TEXT NOT NULL,
      user_id TEXT REFERENCES users(id), expires_at BIGINT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS billing_customers (
      user_id TEXT PRIMARY KEY REFERENCES users(id), customer_id TEXT NOT NULL UNIQUE
    );
    CREATE TABLE IF NOT EXISTS checkout_attempts (
      user_id TEXT PRIMARY KEY REFERENCES users(id), request_key TEXT NOT NULL,
      session_id TEXT, price_id TEXT NOT NULL, created_at BIGINT NOT NULL,
      expires_at BIGINT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS local_billing_tokens (
      token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id),
      expires_at BIGINT NOT NULL, consumed_at BIGINT
    );
    CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id),
      status TEXT NOT NULL, period_end BIGINT NOT NULL, cancel_at_period_end BIGINT NOT NULL,
      price_id TEXT NOT NULL, updated_at BIGINT NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS webhook_events (
      id TEXT PRIMARY KEY, received_at BIGINT NOT NULL, processed_at BIGINT
    );
    CREATE TABLE IF NOT EXISTS saved_positions (
      id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), venue_id TEXT NOT NULL,
      section TEXT NOT NULL, row_token TEXT NOT NULL, seat_token TEXT NOT NULL,
      event_id TEXT, label TEXT NOT NULL, created_at BIGINT NOT NULL, layout TEXT
    );
    CREATE TABLE IF NOT EXISTS rate_limits (
      key TEXT PRIMARY KEY, count BIGINT NOT NULL, reset_at BIGINT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS access_settings (
      key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at BIGINT NOT NULL,
      updated_by TEXT NOT NULL DEFAULT ''
    );

CREATE INDEX IF NOT EXISTS sessions_user_idx ON sessions(user_id);
CREATE INDEX IF NOT EXISTS subscriptions_user_idx ON subscriptions(user_id,period_end);
CREATE INDEX IF NOT EXISTS saved_positions_user_idx ON saved_positions(user_id,created_at);
INSERT INTO schema_migrations(version) VALUES(1) ON CONFLICT DO NOTHING;
