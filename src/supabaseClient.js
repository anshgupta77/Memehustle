import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oetbuyigmfdvnbizpxuc.supabase.co'; // 🔁 replace with yours
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ldGJ1eWlnbWZkdm5iaXpweHVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwNzcwNDYsImV4cCI6MjA2NTY1MzA0Nn0.dF6TkcufPx-XV5q2qNqlotCGldjxWcaOiojMGDcrbt4'; // 🔁 replace with yours

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
