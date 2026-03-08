import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

export const supabase = createClient<Database>(
  'https://ylqehynxhlcoebepfsoy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlscWVoeW54aGxjb2ViZXBmc295Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MjI4NDMsImV4cCI6MjA4ODM5ODg0M30.SmD1JkpqX1tMUILhEqLu7YqsLB9_frVWfQuzQtXXTWc'
)