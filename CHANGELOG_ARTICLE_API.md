# 📝 Article API Updates - Change Log

## Overview

Updated Article API to support rich article creation with image uploads and additional metadata fields to match Vue.js frontend requirements.

## ✅ Changes Made

### 1. Database Schema Updates (`prisma/schema.prisma`)

**New fields added to Articles model:**

- `topic` - VARCHAR(100) - Article topic/category
- `description` - TEXT - Short description
- `cover_image` - VARCHAR(255) - Cover image URL path
- `photo_caption` - VARCHAR(255) - Image caption
- `photo_credit` - VARCHAR(100) - Photographer credit
- `author_name` - VARCHAR(100) - Author name
- `author_role` - VARCHAR(50) - Author role (Admin, Editor, etc.)
- `place` - VARCHAR(100) - Location/place
- `highlights` - TEXT - Article highlights
- `date_created` - Now has @default(now())

### 2. TypeScript Types (`src/types/index.ts`)

**Updated interfaces:**

```typescript
export interface ArticleDTO {
  id_article: number;
  title: string;
  topic?: string | null;
  description?: string | null;
  content?: string | null;
  cover_image?: string | null;
  photo_caption?: string | null;
  photo_credit?: string | null;
  author_name?: string | null;
  author_role?: string | null;
  place?: string | null;
  highlights?: string | null;
  date_created?: Date | null;
  id_author: number;
}

export interface CreateArticleDTO {
  title: string;
  topic?: string;
  description?: string;
  content?: string;
  cover_image?: string;
  photo_caption?: string;
  photo_credit?: string;
  author_name?: string;
  author_role?: string;
  place?: string;
  highlights?: string;
}
```

### 3. Upload Middleware (`src/middleware/upload.middleware.ts`)

**New file created** with Multer configuration:

- Accepts: jpeg, jpg, png, gif, webp
- Max file size: 5MB
- Storage: `./uploads` directory
- Unique filename generation: `timestamp-random.ext`

### 4. Article Routes (`src/modules/articles/article.routes.ts`)

**Updated POST /articles endpoint:**

- Now accepts `multipart/form-data` instead of `application/json`
- Added `upload.single("coverImage")` middleware
- Maps camelCase fields from frontend to snake_case for database
- Auto-generates cover_image URL: `/uploads/filename.jpg`

### 5. App Configuration (`src/app.ts`)

**Added:**

- Static file serving for `/uploads` directory
- Import path for multer middleware

### 6. Docker Configuration

**Updated `docker-compose.yml`:**

- Added `uploads_data` volume for persistent image storage
- Volume mapping: `/app/uploads` inside container

**Created `.dockerignore`:**

- Excludes unnecessary files from Docker build
- Improves build performance

**Created `deploy.sh`:**

- Helper script for common deployment tasks
- Commands: build, start, stop, restart, logs, migrate, rebuild, status, clean

### 7. Documentation

**Created `DEPLOYMENT_GUIDE.md`:**

- Complete deployment instructions for Ubuntu Server 24 LTS
- Docker commands and troubleshooting
- Security checklist
- API testing examples

**Updated `.env.example`:**

- Added proper DATABASE_URL for Docker
- Added upload configuration options

**Updated `README.md`:**

- Added File Upload and Rate Limiting to features
- Added Docker Support mention

## 🔄 Migration Required

After pulling these changes, run:

```bash
# Generate Prisma Client
npx prisma generate

# Create and apply migration
npx prisma migrate dev --name add_article_fields
```

**For Docker deployment:**

```bash
# Rebuild container
docker compose down
docker compose build --no-cache
docker compose up -d

# Run migration
docker compose exec app npx prisma migrate deploy
```

## 📡 API Changes

### Before:

```json
POST /articles
Content-Type: application/json

{
  "title": "Article Title",
  "content": "Article content..."
}
```

### After:

```bash
POST /articles
Content-Type: multipart/form-data

Fields:
- title (required)
- topic
- description
- content
- coverImage (file)
- photoCaption
- photoCredit
- authorName
- authorRole
- place
- highlights
```

## 🎯 Frontend Integration

### Vue.js Example:

```javascript
const formData = new FormData();
formData.append("title", "My Article");
formData.append("topic", "climate");
formData.append("description", "Article description");
formData.append("coverImage", fileObject); // File object, not base64!

await axios.post("/articles", formData, {
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${token}`,
  },
});
```

## 🔍 Testing

### Test with curl:

```bash
curl -X POST http://localhost:4000/articles \
  -H "Authorization: Bearer YOUR_ORG_TOKEN" \
  -F "title=Climate Change Article" \
  -F "topic=climate" \
  -F "description=Understanding climate impact" \
  -F "coverImage=@./image.jpg" \
  -F "authorName=John Doe" \
  -F "authorRole=Editor"
```

### Access uploaded image:

```
http://localhost:4000/uploads/1702345678901-123456789.jpg
```

## 📦 Dependencies Added

- `multer@^2.0.2` - File upload middleware
- `@types/multer@^2.0.0` - TypeScript types

## 🔐 Security Notes

- File type validation (images only)
- File size limit (5MB)
- Rate limiting applied (1000 req/min)
- Unique filename generation prevents overwrite
- Static file serving from dedicated `/uploads` route

## 📊 Breaking Changes

- **Article creation endpoint** now requires `multipart/form-data`
- **Frontend must be updated** to use FormData instead of JSON
- **Database migration required** before use

## ✨ New Features Enabled

- Cover image upload for articles
- Rich metadata for articles (author, place, highlights)
- Persistent image storage with Docker volumes
- Static file serving for uploaded images
