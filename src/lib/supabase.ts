import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Project {
  id: string;
  github_repo: string | null;
  title: string;
  description: string | null;
  image_path: string | null;
  tags: string[];
  url: string | null;
  visible: boolean;
  sort_order: number;
}

export function projectImageUrl(imagePath: string | null): string | null {
  if (!imagePath) return null;
  return supabase.storage.from("project-images").getPublicUrl(imagePath).data.publicUrl;
}
