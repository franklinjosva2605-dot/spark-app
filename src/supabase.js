import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jpbkynodbytbpgixzxtn.supabase.co';
const supabaseAnonKey = 'sb_publishable_CoQU0NiEL0bPV7D_4s25ig_WCZNfz7f';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);