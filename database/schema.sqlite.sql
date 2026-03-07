-- EasyRent - نسخة SQLite للمطور المحلي (better-sqlite3)
-- الجداول الأساسية للمكاتب

-- الجدول الأساسي للمكاتب
create table if not exists offices (
  id text primary key default (lower(hex(randomblob(16)))),
  name text not null,
  owner_name text,
  phone text,
  email text unique,
  plan text default 'free',
  created_at text default (datetime('now'))
);

-- السيارات
create table if not exists cars (
  id text primary key default (lower(hex(randomblob(16)))),
  office_id text not null references offices(id) on delete cascade,
  name text not null,
  plate text,
  status text default 'Available',
  daily_price real default 0,
  image_url text,
  created_at text default (datetime('now'))
);

-- العملاء
create table if not exists customers (
  id text primary key default (lower(hex(randomblob(16)))),
  office_id text not null references offices(id) on delete cascade,
  full_name text not null,
  phone text,
  id_number text,
  status text default 'Regular',
  created_at text default (datetime('now'))
);

-- العقود
create table if not exists contracts (
  id text primary key default (lower(hex(randomblob(16)))),
  office_id text not null references offices(id) on delete cascade,
  car_id text references cars(id),
  customer_id text references customers(id),
  days integer default 1,
  daily_price real default 0,
  total real default 0,
  status text default 'نشط',
  start_date text default (date('now')),
  end_date text,
  created_at text default (datetime('now'))
);

-- المصاريف
create table if not exists expenses (
  id text primary key default (lower(hex(randomblob(16)))),
  office_id text not null references offices(id) on delete cascade,
  car_id text references cars(id),
  category text,
  amount real default 0,
  description text,
  date text default (date('now')),
  payment_method text default 'cash',
  created_at text default (datetime('now'))
);

-- القائمة السوداء
create table if not exists blacklist (
  id text primary key default (lower(hex(randomblob(16)))),
  office_id text not null references offices(id) on delete cascade,
  customer_name text not null,
  id_number text,
  reason text,
  created_at text default (datetime('now'))
);
