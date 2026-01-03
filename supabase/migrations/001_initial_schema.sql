-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  native_language TEXT DEFAULT 'Hindi',
  subscription_tier TEXT DEFAULT 'free', -- free, premium
  minutes_remaining INTEGER DEFAULT 30,
  total_practice_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Practice sessions
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  mode TEXT NOT NULL, -- english_practice, interview, language_learning, roleplay
  domain TEXT, -- tech, finance, upsc, ssc, etc.
  target_language TEXT DEFAULT 'en',
  native_language TEXT DEFAULT 'Hindi',
  duration_seconds INTEGER DEFAULT 0,
  errors_count INTEGER DEFAULT 0,
  corrections_count INTEGER DEFAULT 0,
  grammar_score DECIMAL(5,2),
  fluency_score DECIMAL(5,2),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE
);

-- Error tracking for analytics
CREATE TABLE errors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  original_text TEXT NOT NULL,
  corrected_text TEXT NOT NULL,
  error_type TEXT, -- grammar, tense, vocabulary, filler, pronunciation
  explanation TEXT,
  explanation_native TEXT, -- Explanation in native language
  detection_method TEXT, -- rule, groq, gpt, gemini
  detection_latency_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL, -- monthly, yearly
  amount INTEGER NOT NULL, -- in paise (99*100 = 9900)
  currency TEXT DEFAULT 'INR',
  razorpay_subscription_id TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'active' -- active, cancelled, expired
);

-- Ad rewards (watch ads for free minutes)
CREATE TABLE ad_rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  minutes_earned INTEGER DEFAULT 5,
  ad_provider TEXT,
  watched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_started_at ON sessions(started_at);
CREATE INDEX idx_errors_user_id ON errors(user_id);
CREATE INDEX idx_errors_session_id ON errors(session_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_ad_rewards_user_id ON ad_rewards(user_id);
