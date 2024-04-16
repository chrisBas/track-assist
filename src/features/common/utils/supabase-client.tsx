import { createClient } from '@supabase/supabase-js';

import props from './props';

const projectUrl = 'https://qnpaxdvwmaovefvvlhyd.supabase.co';
const publicAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFucGF4ZHZ3bWFvdmVmdnZsaHlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk0ODEzNjQsImV4cCI6MjAyNTA1NzM2NH0.-E2jGecRltKjkOlHgu_fSmTaAtozNOGeqvqTrqFfP6k';
const supabase = createClient(projectUrl, publicAnonKey);

export const login = () => {
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: props.authRedirect,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });
};

export const logout = () => {
  return supabase.auth.signOut();
};

export default supabase;
