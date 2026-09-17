export type Artist = {
  id: number;
  first_name: string;
  last_name: string;
  artist_type: string | null;
  birth_date: string | null;
  death_date: string | null;
  nationality: string | null;
  biography: string | null;
  bibliography: string | null;
  website_url: string | null;
  cv_url: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  profile_image_url: string | null;
  created_at: string;
  updated_at: string;
};

export type ArtistInput = {
  first_name: string;
  last_name: string;
  artist_type?: string;
  birth_date?: string;
  death_date?: string;
  nationality?: string;
  biography?: string;
  bibliography?: string;
  website_url?: string;
  cv_url?: string;
  instagram_url?: string;
  facebook_url?: string;
  profile_image_url?: string;
};