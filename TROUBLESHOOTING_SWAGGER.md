# 🔧 Troubleshooting - Swagger Tidak Update di Container

## ❌ Masalah

Setelah build container di server, Swagger documentation tidak menampilkan endpoint baru (image upload, field baru, dll) - masih menampilkan API lama.

## 🔍 Root Cause

1. **OpenAPI comments di TypeScript tidak ter-compile ke JavaScript**

   - JSDoc `@openapi` comments ada di `.ts` files
   - Setelah compile ke `.js`, comments hilang
   - Swagger hanya bisa baca dari source `.ts` files

2. **Dockerfile hanya copy sebagian files**
   - Old: `COPY src ./src` - tidak lengkap
   - Swagger butuh akses ke `.ts` files untuk baca OpenAPI docs

## ✅ Solution

### 1. Update `Dockerfile` - Copy Semua Files

```dockerfile
# OLD (WRONG)
COPY prisma ./prisma
COPY src ./src
COPY tsconfig.json ./

# NEW (CORRECT)
COPY . .
```

Dengan `COPY . .`, semua files ter-copy (kecuali yang di `.dockerignore`):

- ✅ `src/**/*.ts` - untuk Swagger baca OpenAPI docs
- ✅ `prisma/` - untuk Prisma schema
- ✅ `tsconfig.json` - untuk TypeScript compile
- ✅ `package.json` - untuk npm scripts

### 2. Update `swagger.ts` - Prioritaskan Dist

```typescript
// Swagger config
apis: [
  "./dist/modules/**/*.routes.js", // Coba dist dulu
  "./dist/app.js",
  "./src/modules/**/*.routes.ts", // Fallback ke src (untuk OpenAPI docs)
  "./src/app.ts",
];
```

### 3. Rebuild Container di Server

```bash
# Pull latest code
git pull origin test-api

# Rebuild dengan --no-cache
docker compose down
docker compose build --no-cache
docker compose up -d

# Check logs
docker compose logs -f app
```

## 🎯 Verification

### 1. Check Swagger UI

```bash
# Buka browser
http://your-server:4000/docs

# Should see:
- POST /articles dengan multipart/form-data
- POST /missions dengan multipart/form-data
- Field: coverImage, tags, photoCaption, dll
```

### 2. Check Container Files

```bash
# Verify src files ada di container
docker compose exec app ls -la src/modules/articles/

# Should see:
# article.routes.ts (dengan OpenAPI docs)
# article.service.ts
# article.repository.ts
```

### 3. Check Swagger Spec Generation

```bash
# Check if swagger can read routes
docker compose exec app node -e "
const { swaggerSpec } = require('./dist/config/swagger.js');
console.log(Object.keys(swaggerSpec.paths));
"

# Should output:
# [ '/articles', '/missions', '/auth/register', ... ]
```

## 📋 Checklist Debugging

- [ ] Git pull latest code di server
- [ ] Dockerfile menggunakan `COPY . .`
- [ ] `swagger.ts` prioritaskan `./dist/` tapi include `./src/`
- [ ] Build dengan `--no-cache`
- [ ] Restart container
- [ ] Clear browser cache / hard refresh (Ctrl+F5)
- [ ] Check `/docs` endpoint
- [ ] Verify POST /articles dan POST /missions ada field baru

## 💡 Why This Works

```
┌─────────────────────────────────────────┐
│  Container Structure (After Fix)        │
├─────────────────────────────────────────┤
│  /app/                                  │
│    ├── src/                             │
│    │   └── modules/                     │
│    │       ├── articles/                │
│    │       │   └── article.routes.ts ◄── OpenAPI docs here
│    │       └── missions/                │
│    │           └── mission.routes.ts ◄── OpenAPI docs here
│    │                                     │
│    ├── dist/                            │
│    │   └── modules/                     │
│    │       ├── articles/                │
│    │       │   └── article.routes.js ◄── Executable code
│    │       └── missions/                │
│    │           └── mission.routes.js ◄── Executable code
│    │                                     │
│    └── node_modules/                    │
│        └── swagger-jsdoc/ ◄── Reads from src/*.ts
└─────────────────────────────────────────┘

Runtime Flow:
1. Node runs: dist/server.js
2. Server loads: dist/config/swagger.js
3. Swagger-jsdoc reads: src/**/*.routes.ts (for @openapi docs)
4. Swagger UI shows: Complete API documentation ✅
```

## 🚨 Common Mistakes

### ❌ Don't Do This

```dockerfile
# Hanya copy sebagian - Swagger tidak bisa baca OpenAPI docs
COPY src ./src
COPY prisma ./prisma
```

### ❌ Don't Do This

```typescript
// Hanya baca dari dist - OpenAPI docs hilang setelah compile
apis: ["./dist/modules/**/*.routes.js"];
```

### ✅ Do This Instead

```dockerfile
# Copy semua (respect .dockerignore)
COPY . .
```

```typescript
// Baca dari src untuk OpenAPI docs
apis: [
  "./dist/modules/**/*.routes.js",
  "./src/modules/**/*.routes.ts", // ← Important!
];
```

## 📝 Notes

- **OpenAPI decorators** (`@openapi`) tetap di `.ts` files
- **TypeScript compiler** tidak preserve JSDoc comments di output
- **Swagger-jsdoc** butuh akses ke source `.ts` files
- **Container size** sedikit lebih besar (tapi worth it untuk Swagger works)

## 🎉 Expected Result

Setelah fix, Swagger UI (`/docs`) akan menampilkan:

### POST /articles

```yaml
Content-Type: multipart/form-data
Fields:
  - title (string, required)
  - topic (string)
  - description (string)
  - content (string)
  - coverImage (file) ← NEW!
  - photoCaption (string) ← NEW!
  - photoCredit (string) ← NEW!
  - authorName (string) ← NEW!
  - authorRole (string) ← NEW!
  - place (string) ← NEW!
  - highlights (string) ← NEW!
```

### POST /missions

```yaml
Content-Type: multipart/form-data
Fields:
  - title (string, required)
  - tags (string) ← NEW!
  - desc (string)
  - coverImage (file) ← NEW!
  - photoCaption (string) ← NEW!
  - authorName (string) ← NEW!
  - authorRole (string) ← NEW!
  - points (integer)
  - highlights (string) ← NEW!
```

---

**TL;DR:**

1. Update `Dockerfile` → `COPY . .`
2. Rebuild dengan `--no-cache`
3. Swagger sekarang bisa baca OpenAPI docs dari `src/*.ts` files ✅
