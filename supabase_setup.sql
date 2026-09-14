-- 1. Create the experiences table
CREATE TABLE IF NOT EXISTS public.experiences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    occasion TEXT NOT NULL,
    recipient_name TEXT NOT NULL,
    sender_name TEXT NOT NULL,
    question TEXT NOT NULL,
    yes_text TEXT NOT NULL,
    no_text TEXT NOT NULL,
    message TEXT NOT NULL,
    photos TEXT[] DEFAULT '{}',
    music_track TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    view_count INTEGER DEFAULT 0 NOT NULL,
    yes_count INTEGER DEFAULT 0 NOT NULL
);

-- 2. Enable Row Level Security (RLS) on the table
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

-- 3. Create policies to allow public access (since the app uses anon key without auth)
CREATE POLICY "Allow public read access to experiences" ON public.experiences
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to experiences" ON public.experiences
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access to experiences" ON public.experiences
    FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access to experiences" ON public.experiences
    FOR DELETE USING (true);

-- 4. Create the storage bucket for photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('lumora_photos', 'lumora_photos', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Create storage policies for the bucket (allowing public read/write)
CREATE POLICY "Allow public read access to lumora_photos" ON storage.objects
    FOR SELECT USING (bucket_id = 'lumora_photos');

CREATE POLICY "Allow public insert access to lumora_photos" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'lumora_photos');

CREATE POLICY "Allow public update access to lumora_photos" ON storage.objects
    FOR UPDATE USING (bucket_id = 'lumora_photos');

CREATE POLICY "Allow public delete access to lumora_photos" ON storage.objects
    FOR DELETE USING (bucket_id = 'lumora_photos');
