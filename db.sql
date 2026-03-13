-- Roles
create table roles (
  id          uuid primary key default gen_random_uuid(),
  name        text unique not null,
  description text,
  is_system   boolean not null default false,
  created_at  timestamptz default now()
);

-- Permissions (atomic actions)
create table permissions (
  id          uuid primary key default gen_random_uuid(),
  key         text unique not null,  -- e.g. 'orders:read'
  label       text not null,
  "group"     text not null,         -- e.g. 'orders'
  description text
);

-- Junction: which role has which permissions
create table role_permissions (
  role_id       uuid references roles(id) on delete cascade,
  permission_id uuid references permissions(id) on delete cascade,
  granted_at    timestamptz default now(),
  primary key (role_id, permission_id)
);


create table dashboard_users (
  id         uuid primary key references auth.users on delete cascade,
  role_id    uuid not null references roles(id),
  email      text unique not null,
  full_name  text,
  is_active  boolean not null default true,
  created_at timestamptz default now()
);

create table categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text unique not null,
  image_url  text,
  created_at timestamptz default now()
);

create table products (
  id            uuid primary key default gen_random_uuid(),
  category_id   uuid references categories(id) on delete set null,
  name          text not null,
  slug          text unique not null,
  description   text,
  thumbnail_url text,
  is_active     boolean not null default true,
  created_at    timestamptz default now()
);

-- images column removed: use product_images table instead
create table product_variations (
  id             uuid primary key default gen_random_uuid(),
  product_id     uuid not null references products(id) on delete cascade,
  sku            text unique not null,
  color          text,
  size           text,
  price          numeric(10,2) not null,
  price_display  numeric(10,2),        -- crossed-out original price
  discount_label text,                 -- e.g. '30% OFF'
  stock          int not null default 0 check (stock >= 0),
  is_active      boolean not null default true
);

create table product_images (
  id           uuid primary key default gen_random_uuid(),
  product_id   uuid not null references products(id) on delete cascade,
  -- if set, this image is tied to a specific variation (e.g. red colorway)
  -- if null, it belongs to the product generally
  variation_id uuid references product_variations(id) on delete cascade,
  url          text not null,          -- Supabase Storage public URL
  alt_text     text,                   -- accessibility / SEO
  sort_order   int not null default 0, -- lower = shown first
  is_primary   bool not null default false  -- true = used as thumbnail
);

-- Only one primary image per product
create unique index one_primary_per_product
  on product_images (product_id)
  where is_primary = true and variation_id is null;

-- Only one primary image per variation
create unique index one_primary_per_variation
  on product_images (variation_id)
  where is_primary = true and variation_id is not null;

create type order_status as enum ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
create table orders (
  id           uuid primary key default gen_random_uuid(),
  order_number text unique not null
               default 'ORD-' || upper(substr(gen_random_uuid()::text, 1, 8)),
  full_name    text not null,
  city         text not null,
  address      text not null,
  phone        text,
  email        text,
  status       order_status not null default 'pending',
  total_amount numeric(10,2) not null,
  notes        text,
  created_at   timestamptz default now()
);


create table order_items (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references orders(id) on delete cascade,
  variation_id uuid not null references product_variations(id),
  quantity     int not null check (quantity > 0),
  unit_price   numeric(10,2) not null   -- price snapshot at time of order
);


create table reviews (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references products(id) on delete cascade,
  full_name   text not null,
  email       text not null,
  stars       smallint not null check (stars between 1 and 5),
  comment     text,
  image_url   text,
  is_approved boolean not null default false,
  created_at  timestamptz default now()
);



-- Returns true if the calling user has the given permission key
create or replace function has_permission(perm_key text)
returns boolean language sql security definer stable as $$
  select exists (
    select 1
    from dashboard_users du
    join role_permissions rp on rp.role_id = du.role_id
    join permissions p on p.id = rp.permission_id
    where du.id = auth.uid()
      and du.is_active = true
      and p.key = perm_key
  )
$$;
create table announcements (
  id          uuid primary key default gen_random_uuid(),
  created_by  uuid references dashboard_users(id) on delete set null,
  title       text not null,
  body        text,
  image_url   text,
  cta_label   text,
  cta_url     text,
  starts_at   timestamptz not null,
  ends_at     timestamptz not null,
  is_active   boolean not null default true,
  created_at  timestamptz default now(),
  constraint  ends_after_starts check (ends_at > starts_at)
);

-- Enable RLS everywhere
alter table roles              enable row level security;
alter table permissions        enable row level security;
alter table role_permissions   enable row level security;
alter table dashboard_users    enable row level security;
alter table categories         enable row level security;
alter table products           enable row level security;
alter table product_variations enable row level security;
alter table product_images     enable row level security;
alter table orders             enable row level security;
alter table order_items        enable row level security;
alter table reviews            enable row level security;
alter table announcements      enable row level security;

-- categories
create policy "public_read_categories" on categories
  for select using (true);
create policy "admin_write_categories" on categories
  for all using (has_permission('products:write'));

-- products
create policy "public_read_products" on products
  for select using (is_active = true);
create policy "admin_insert_products" on products
  for insert with check (has_permission('products:write'));
create policy "admin_update_products" on products
  for update using (has_permission('products:write'));
create policy "admin_delete_products" on products
  for delete using (has_permission('products:delete'));

-- product_variations
create policy "public_read_variations" on product_variations
  for select using (is_active = true);
create policy "admin_write_variations" on product_variations
  for all using (has_permission('products:write'));

-- product_images (public can read, admins manage)
create policy "public_read_images" on product_images
  for select using (true);
create policy "admin_write_images" on product_images
  for all using (has_permission('products:write'));

-- orders
create policy "anon_insert_orders" on orders
  for insert to anon with check (true);
create policy "admin_read_orders" on orders
  for select using (has_permission('orders:read'));
create policy "admin_update_orders" on orders
  for update using (has_permission('orders:update_status'));
create policy "admin_delete_orders" on orders
  for delete using (has_permission('orders:delete'));

-- order_items
create policy "anon_insert_order_items" on order_items
  for insert to anon with check (true);
create policy "admin_read_order_items" on order_items
  for select using (has_permission('orders:read'));

-- reviews
create policy "anon_insert_reviews" on reviews
  for insert to anon with check (true);
create policy "public_read_approved_reviews" on reviews
  for select using (is_approved = true);
create policy "admin_read_all_reviews" on reviews
  for select using (has_permission('reviews:read'));
create policy "admin_update_reviews" on reviews
  for update using (has_permission('reviews:approve'));
create policy "admin_delete_reviews" on reviews
  for delete using (has_permission('reviews:delete'));

-- announcements
create policy "public_active_announcements" on announcements
  for select using (
    is_active = true and starts_at <= now() and ends_at >= now()
  );
create policy "admin_read_announcements" on announcements
  for select using (has_permission('announcements:read'));
create policy "admin_write_announcements" on announcements
  for insert with check (has_permission('announcements:write'));
create policy "admin_update_announcements" on announcements
  for update using (has_permission('announcements:write'));
create policy "admin_delete_announcements" on announcements
  for delete using (has_permission('announcements:delete'));

-- dashboard_users
create policy "self_read" on dashboard_users
  for select using (id = auth.uid());
create policy "admin_read_users" on dashboard_users
  for select using (has_permission('users:read'));
create policy "admin_write_users" on dashboard_users
  for all using (has_permission('users:write'));

-- roles & permissions (super_admin only)
create policy "admin_read_roles" on roles
  for select using (has_permission('roles:manage'));
create policy "admin_write_roles" on roles
  for all using (has_permission('roles:manage') and is_system = false);
create policy "admin_read_permissions" on permissions
  for select using (has_permission('roles:manage'));
create policy "admin_write_role_permissions" on role_permissions
  for all using (has_permission('roles:manage'));


  insert into roles (name, description, is_system) values
  ('super_admin', 'Full access to everything',              true),
  ('admin',       'Manage products, orders, announcements', true),
  ('moderator',   'Review moderation only',                 true);

insert into permissions (key, label, "group") values
  ('products:read',          'View Products',               'products'),
  ('products:write',         'Create / Edit Products',      'products'),
  ('products:delete',        'Delete Products',             'products'),
  ('orders:read',            'View Orders',                 'orders'),
  ('orders:update_status',   'Update Order Status',         'orders'),
  ('orders:delete',          'Delete Orders',               'orders'),
  ('reviews:read',           'View Reviews',                'reviews'),
  ('reviews:approve',        'Approve / Reject Reviews',    'reviews'),
  ('reviews:delete',         'Delete Reviews',              'reviews'),
  ('announcements:read',     'View Announcements',          'announcements'),
  ('announcements:write',    'Create / Edit Announcements', 'announcements'),
  ('announcements:delete',   'Delete Announcements',        'announcements'),
  ('users:read',             'View Dashboard Users',        'users'),
  ('users:write',            'Create / Edit Users',         'users'),
  ('users:delete',           'Delete Users',                'users'),
  ('roles:manage',           'Manage Roles & Permissions',  'roles');

-- super_admin gets everything
insert into role_permissions (role_id, permission_id)
select r.id, p.id from roles r, permissions p
where r.name = 'super_admin';

-- admin subset
insert into role_permissions (role_id, permission_id)
select r.id, p.id from roles r
join permissions p on p.key in (
  'products:read','products:write',
  'orders:read','orders:update_status',
  'reviews:read','reviews:approve',
  'announcements:read','announcements:write',
  'users:read'
) where r.name = 'admin';

-- moderator subset
insert into role_permissions (role_id, permission_id)
select r.id, p.id from roles r
join permissions p on p.key in (
  'products:read','orders:read',
  'reviews:read','reviews:approve','reviews:delete',
  'announcements:read'
) where r.name = 'moderator';

ALTER TABLE public.products 
ADD COLUMN is_featured boolean NOT NULL DEFAULT false,
ADD COLUMN is_best_seller boolean NOT NULL DEFAULT false;

-- Creating the ENUM type for notification types
CREATE TYPE public.notification_type AS ENUM ('new_order', 'new_review');

-- Create Notifications Table
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  type public.notification_type NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  reference_id uuid, -- Can link to order_id or review_id
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT notifications_pkey PRIMARY KEY (id)
);

-- Function to handle new orders
CREATE OR REPLACE FUNCTION public.handle_new_order()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.notifications (type, title, message, reference_id)
  VALUES (
    'new_order',
    'New Order Received',
    'Order ' || NEW.order_number || ' placed by ' || NEW.full_name || ' for ' || NEW.total_amount || ' DH.',
    NEW.id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new orders
CREATE TRIGGER on_new_order_created
  AFTER INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_order();

-- Function to handle new reviews
CREATE OR REPLACE FUNCTION public.handle_new_review()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.notifications (type, title, message, reference_id)
  VALUES (
    'new_review',
    'New Product Review',
    NEW.full_name || ' rated the product ' || NEW.stars || ' stars.',
    NEW.id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new reviews
CREATE TRIGGER on_new_review_created
  AFTER INSERT ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_review();