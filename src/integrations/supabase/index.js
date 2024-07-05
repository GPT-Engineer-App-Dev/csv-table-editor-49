import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Types for Supabase tables and columns
 * 
 * ### event
 * 
 * | name       | type        | format | required |
 * |------------|-------------|--------|----------|
 * | id         | int8        | number | true     |
 * | name       | text        | string | true     |
 * | created_at | timestamptz | string | true     |
 * | date       | date        | string | true     |
 * 
 */

// Example hooks for Supabase tables

// Fetch all events
export const fetchEvents = async () => {
  const { data, error } = await supabase.from('event').select('*');
  if (error) throw error;
  return data;
};

// Fetch a single event by ID
export const fetchEventById = async (id) => {
  const { data, error } = await supabase.from('event').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};

// Create a new event
export const createEvent = async (event) => {
  const { data, error } = await supabase.from('event').insert([event]);
  if (error) throw error;
  return data;
};

// Update an event by ID
export const updateEvent = async (id, event) => {
  const { data, error } = await supabase.from('event').update(event).eq('id', id);
  if (error) throw error;
  return data;
};

// Delete an event by ID
export const deleteEvent = async (id) => {
  const { data, error } = await supabase.from('event').delete().eq('id', id);
  if (error) throw error;
  return data;
};