import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:8000" });

// ── Notes ──────────────────────────────────────────────
export const fetchNotes = (params) => API.get("/notes/", { params });
export const fetchNote = (id) => API.get(`/notes/${id}`);
export const createNote = (data) => API.post("/notes/", data);
export const updateNote = (id, data) => API.put(`/notes/${id}`, data);
export const deleteNote = (id) => API.delete(`/notes/${id}`);

// ── Categories ─────────────────────────────────────────
export const fetchCategories = () => API.get("/categories/");
export const createCategory = (data) => API.post("/categories/", data);
export const updateCategory = (id, data) => API.put(`/categories/${id}`, data);
export const deleteCategory = (id) => API.delete(`/categories/${id}`);
