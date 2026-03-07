# قاعدة بيانات EasyRent

## الملفات

| الملف | الاستخدام |
|-------|-----------|
| `schema.sql` | PostgreSQL (Supabase، Railway، إلخ) |
| `schema.sqlite.sql` | SQLite المحلي مع better-sqlite3 |

## الجداول

- **offices** — المكاتب
- **cars** — السيارات (مرتبطة بالمكتب)
- **customers** — العملاء
- **contracts** — العقود (ربط السيارة بالعميل)
- **expenses** — المصاريف
- **blacklist** — القائمة السوداء للعملاء

## التنفيذ

**PostgreSQL:**
```bash
psql -U user -d dbname -f schema.sql
```

**SQLite:**
```bash
sqlite3 easyrent.db < schema.sqlite.sql
```
