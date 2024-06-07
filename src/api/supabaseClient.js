import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eqldiylnpfriitiycqga.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxbGRpeWxucGZyaWl0aXljcWdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc2NzMzMDAsImV4cCI6MjAzMzI0OTMwMH0.iwi8hYF2M6_U2azNuJfW5F0DzbCDo2toYzab_i1hF_Y';
const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };

