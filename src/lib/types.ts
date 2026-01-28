export type Paste = {
  id: string;
  content: string;

  created_at: number; // ms since epoch
  expires_at: number | null;

  max_views: number | null;
  views: number;
};
