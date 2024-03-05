import { createClient } from "@supabase/supabase-js";

const projectUrl = "https://qnpaxdvwmaovefvvlhyd.supabase.co";
const publicAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFucGF4ZHZ3bWFvdmVmdnZsaHlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk0ODEzNjQsImV4cCI6MjAyNTA1NzM2NH0.-E2jGecRltKjkOlHgu_fSmTaAtozNOGeqvqTrqFfP6k";
const supabase = createClient(projectUrl, publicAnonKey);

export default supabase;
