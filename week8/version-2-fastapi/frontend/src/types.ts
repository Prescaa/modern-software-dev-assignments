export interface Category {
  id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category_id: string | null;
  created_at: string;
  updated_at: string;
  category?: Category | null;
  action_items?: string[];
}

export interface NoteCreatePayload {
  title: string;
  content: string;
  category_id: string | null;
}

export interface NoteUpdatePayload {
  title?: string;
  content?: string;
  category_id?: string | null;
}

