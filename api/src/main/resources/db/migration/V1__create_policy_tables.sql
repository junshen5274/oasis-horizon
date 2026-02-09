CREATE TABLE policy (
  id UUID PRIMARY KEY,
  policy_number VARCHAR(64) NOT NULL,
  insured_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE UNIQUE INDEX idx_policy_policy_number ON policy (policy_number);

CREATE TABLE policy_term (
  id UUID PRIMARY KEY,
  policy_id UUID NOT NULL REFERENCES policy(id),
  term_number INTEGER NOT NULL,
  state VARCHAR(10) NOT NULL,
  status VARCHAR(30) NOT NULL,
  effective_from_date DATE NOT NULL,
  effective_to_date DATE NOT NULL,
  balance_due NUMERIC(12, 2) NOT NULL,
  next_due_date DATE,
  last_payment_date DATE,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_policy_term_policy_id ON policy_term (policy_id);
CREATE INDEX idx_policy_term_effective_to_date ON policy_term (effective_to_date);
CREATE INDEX idx_policy_term_state ON policy_term (state);
CREATE INDEX idx_policy_term_status ON policy_term (status);
CREATE UNIQUE INDEX idx_policy_term_policy_term_number ON policy_term (policy_id, term_number);
