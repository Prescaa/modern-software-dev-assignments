/*
  # Developer Control Center Database Schema

  ## Overview
  This migration creates the complete database schema for a Developer Control Center app
  that manages notes with categorization and automatic action item extraction.

  ## New Tables
  
  ### 1. `categories`
  - `id` (uuid, primary key) - Unique identifier for each category
  - `name` (text, unique, not null) - Category name
  - `color` (text, default '#3b82f6') - Display color for the category
  - `created_at` (timestamptz) - Timestamp when category was created
  
  ### 2. `notes`
  - `id` (uuid, primary key) - Unique identifier for each note
  - `title` (text, not null) - Note title
  - `content` (text, default '') - Note content/body
  - `category_id` (uuid, foreign key) - Reference to categories table
  - `created_at` (timestamptz) - Timestamp when note was created
  - `updated_at` (timestamptz) - Timestamp when note was last updated
  
  ### 3. `action_items`
  - `id` (uuid, primary key) - Unique identifier for each action item
  - `note_id` (uuid, foreign key, not null) - Reference to parent note
  - `content` (text, not null) - Action item text
  - `completed` (boolean, default false) - Completion status
  - `created_at` (timestamptz) - Timestamp when extracted

  ## Security
  
  1. Enable Row Level Security (RLS) on all tables
  2. Create policies for public access (since no auth is specified):
     - Allow all operations (SELECT, INSERT, UPDATE, DELETE) for all users
  
  ## Notes
  - All tables use UUID primary keys with automatic generation
  - Timestamps are automatically set using `now()`
  - Foreign key constraints ensure referential integrity
  - ON DELETE CASCADE ensures cleanup when parent records are deleted
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  color text DEFAULT '#3b82f6',
  created_at timestamptz DEFAULT now()
);

-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text DEFAULT '',
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create action_items table
CREATE TABLE IF NOT EXISTS action_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id uuid REFERENCES notes(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_items ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no authentication required)
CREATE POLICY "Public can view categories"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Public can insert categories"
  ON categories FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can update categories"
  ON categories FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete categories"
  ON categories FOR DELETE
  USING (true);

CREATE POLICY "Public can view notes"
  ON notes FOR SELECT
  USING (true);

CREATE POLICY "Public can insert notes"
  ON notes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can update notes"
  ON notes FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete notes"
  ON notes FOR DELETE
  USING (true);

CREATE POLICY "Public can view action items"
  ON action_items FOR SELECT
  USING (true);

CREATE POLICY "Public can insert action items"
  ON action_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can update action items"
  ON action_items FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete action items"
  ON action_items FOR DELETE
  USING (true);

-- Insert some default categories
INSERT INTO categories (name, color) VALUES
  ('Development', '#3b82f6'),
  ('Design', '#8b5cf6'),
  ('Meeting Notes', '#10b981'),
  ('Ideas', '#f59e0b'),
  ('Personal', '#ef4444')
ON CONFLICT (name) DO NOTHING;
