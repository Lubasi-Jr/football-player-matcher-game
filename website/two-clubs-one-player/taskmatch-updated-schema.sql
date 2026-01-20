-- EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ENUMS
CREATE TYPE task_category AS ENUM ('Indoor', 'Outdoor');
CREATE TYPE recipient_type AS ENUM ('self', 'someone_else');

-- 1. USERS
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clerk_user_id TEXT UNIQUE NOT NULL, -- Bridge to Clerk Auth
    full_name TEXT,
    phone TEXT,
    email TEXT UNIQUE,
    role TEXT CHECK (role IN ('worker', 'client')),
    home_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CATALOG TABLES (Tasks and Packages)
CREATE TABLE public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category task_category NOT NULL,
    name TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    discounted_price DECIMAL(10, 2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.package_tasks (
    package_id UUID REFERENCES public.packages(id) ON DELETE CASCADE,
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
    PRIMARY KEY (package_id, task_id)
);

-- 3. PROFILES (Specialized Tables)
CREATE TABLE public.client_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    household_name TEXT
);

CREATE TABLE public.worker_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    bio TEXT,
    skills TEXT,
    rating_avg DECIMAL(3, 2) DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE
);

-- 4. JOBS
CREATE TABLE public.jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_user_id UUID NOT NULL REFERENCES public.users(id),
    title TEXT NOT NULL,
    description TEXT,
    address TEXT, -- Fallback to users.home_address handled in app logic
    booking_for recipient_type DEFAULT 'self',
    is_recurring BOOLEAN DEFAULT FALSE,
    recurring_schedule TEXT[], 
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'assigned', 'completed', 'cancelled')),
    scheduled_start TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Junction table connecting Jobs to their selected Tasks
CREATE TABLE public.job_tasks (
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
    PRIMARY KEY (job_id, task_id)
);

-- 5. BOOKINGS
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES public.jobs(id),
    worker_user_id UUID NOT NULL REFERENCES public.users(id),
    status TEXT DEFAULT 'pending',
    booked_at TIMESTAMPTZ DEFAULT NOW(),
    -- Explicit requested constraint
    CONSTRAINT bookings_status_check 
    CHECK (status = ANY (ARRAY['pending'::text, 'confirmed'::text, 'completed'::text, 'cancelled'::text]))
);

-- 6. PAYMENTS & REVIEWS
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID UNIQUE NOT NULL REFERENCES public.bookings(id),
    provider TEXT,
    amount DECIMAL(10, 2),
    status TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id),
    reviewer_user_id UUID NOT NULL REFERENCES public.users(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);