-- EasyRent - نظام إدارة مكاتب تأجير السيارات
-- الجداول الأساسية للمكاتب

-- الجدول الأساسي للمكاتب
create table offices (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  owner_name text,
  phone text,
  email text unique,
  plan text default 'free',
  created_at timestamp default now()
);

-- السيارات
create table cars (
  id uuid default gen_random_uuid() primary key,
  office_id uuid references offices(id) on delete cascade,
  name text not null,
  plate text,
  status text default 'Available',
  daily_price numeric default 0,
  image_url text,
  created_at timestamp default now()
);

-- العملاء
create table customers (
  id uuid default gen_random_uuid() primary key,
  office_id uuid references offices(id) on delete cascade,
  full_name text not null,
  phone text,
  id_number text,
  status text default 'Regular',
  created_at timestamp default now()
);

-- العقود
create table contracts (
  id uuid default gen_random_uuid() primary key,
  office_id uuid references offices(id) on delete cascade,
  car_id uuid references cars(id),
  customer_id uuid references customers(id),
  days integer default 1,
  daily_price numeric default 0,
  total numeric default 0,
  status text default 'نشط',
  start_date date default current_date,
  end_date date,
  created_at timestamp default now()
);

-- المصاريف
create table expenses (
  id uuid default gen_random_uuid() primary key,
  office_id uuid references offices(id) on delete cascade,
  car_id uuid references cars(id),
  category text,
  amount numeric default 0,
  description text,
  date date default current_date,
  payment_method text default 'cash',
  created_at timestamp default now()
);

-- القائمة السوداء
create table blacklist (
  id uuid default gen_random_uuid() primary key,
  office_id uuid references offices(id) on delete cascade,
  customer_name text not null,
  id_number text,
  reason text,
  created_at timestamp default now()
);
