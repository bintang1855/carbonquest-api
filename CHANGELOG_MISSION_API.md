# 📝 Mission API Updates - Change Log

## Overview

Updated Mission API to support rich mission creation with image uploads and additional metadata fields to match Vue.js frontend requirements.

## ✅ Changes Made

### 1. Database Schema Updates (`prisma/schema.prisma`)

**New fields added to Missions model:**

- `tags` - VARCHAR(255) - Mission tags/categories
- `cover_image` - VARCHAR(255) - Cover image URL path
- `photo_caption` - VARCHAR(255) - Image caption
- `author_name` - VARCHAR(100) - Author name
- `author_role` - VARCHAR(50) - Author role (Admin, Editor, etc.)
- `highlights` - TEXT - Mission highlights
- `date_created` - DateTime with @default(now())
- Updated `title` from VARCHAR(100) to VARCHAR(255)

### 2. TypeScript Types (`src/types/index.ts`)

**Updated interfaces:**

```typescript
export interface MissionDTO {
  id_mission: number;
  title: string;
  tags?: string | null;
  desc?: string | null;
  cover_image?: string | null;
  photo_caption?: string | null;
  author_name?: string | null;
  author_role?: string | null;
  points?: number | null;
  highlights?: string | null;
  date_created?: Date | null;
  id_creator: number;
}

export interface CreateMissionDTO {
  title: string;
  tags?: string;
  desc?: string;
  cover_image?: string;
  photo_caption?: string;
  author_name?: string;
  author_role?: string;
  points?: number;
  highlights?: string;
}
```

### 3. Mission Routes (`src/modules/missions/mission.routes.ts`)

**Updated POST /missions endpoint:**

- Now accepts `multipart/form-data` instead of `application/json`
- Added `upload.single("coverImage")` middleware for image upload
- Maps camelCase fields from frontend to snake_case for database
- Auto-generates cover_image URL: `/uploads/filename.jpg`
- Handles both `desc` and `description` field names
- Auto-converts `points` string to integer

## 🔄 Migration Required

After pulling these changes, run:

```bash
# Generate Prisma Client
npx prisma generate

# Create and apply migration
npx prisma migrate dev --name add_mission_fields
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
POST /missions
Content-Type: application/json

{
  "title": "Mission Title",
  "desc": "Mission description",
  "points": 100
}
```

### After:

```bash
POST /missions
Content-Type: multipart/form-data

Fields:
- title (required)
- tags
- desc (or description)
- coverImage (file)
- photoCaption
- authorName
- authorRole
- points
- highlights
```

## 🎯 Frontend Integration

### Vue.js Example:

```javascript
const formData = new FormData();
formData.append("title", "My Mission");
formData.append("tags", "education, sustainability");
formData.append("desc", "Mission description");
formData.append("points", "100");
formData.append("coverImage", fileObject); // File object
formData.append("authorName", "John Doe");
formData.append("authorRole", "Admin");
formData.append("highlights", "Key mission objectives");

await axios.post("/missions", formData, {
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${token}`,
  },
});
```

### Update Vue Store (missions.js):

```javascript
async createMission(missionData) {
  try {
    this.loading = true;

    const formData = new FormData();
    formData.append('title', missionData.title || '');
    formData.append('tags', missionData.tags || '');
    formData.append('desc', missionData.desc || '');
    formData.append('points', missionData.points?.toString() || '0');
    formData.append('photoCaption', missionData.photoCaption || '');
    formData.append('authorName', missionData.authorName || '');
    formData.append('authorRole', missionData.authorRole || '');
    formData.append('highlights', missionData.highlights || '');

    if (missionData.coverImageFile instanceof File) {
      formData.append('coverImage', missionData.coverImageFile);
    }

    const response = await axios.post('/missions', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    this.error = error.response?.data?.message || 'Failed to create mission';
    throw error;
  } finally {
    this.loading = false;
  }
}
```

### Update Vue Component:

```javascript
function handleImageSelect(event) {
  const file = event.target.files[0];
  if (file) {
    // Simpan File object untuk upload
    form.value.coverImageFile = file;

    // Buat preview
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

async function handleSubmit() {
  try {
    const missionData = {
      title: form.value.title || "Untitled",
      tags: form.value.tags,
      desc: form.value.description,
      points: parseInt(form.value.points) || 0,
      photoCaption: form.value.photoCaption,
      authorName: form.value.authorName,
      authorRole: form.value.authorRole,
      highlights: form.value.highlights,
      coverImageFile: form.value.coverImageFile, // File object
    };

    await missionsStore.createMission(missionData);
    router.push("/");
  } catch (error) {
    console.error("Failed to create mission:", error);
  }
}
```

## 🔍 Testing

### Test with curl:

```bash
curl -X POST http://localhost:4000/missions \
  -H "Authorization: Bearer YOUR_ORG_TOKEN" \
  -F "title=Reduce Plastic Usage" \
  -F "tags=education,sustainability" \
  -F "desc=Complete tasks to reduce single-use plastics" \
  -F "points=100" \
  -F "coverImage=@./mission-image.jpg" \
  -F "authorName=Jane Doe" \
  -F "authorRole=Admin" \
  -F "highlights=Reduce waste, Save environment"
```

### Access uploaded image:

```
http://localhost:4000/uploads/1702345678901-123456789.jpg
```

## 📊 Database Migration SQL Preview

```sql
-- Add new columns to Missions table
ALTER TABLE "Missions"
  ADD COLUMN "tags" VARCHAR(255),
  ADD COLUMN "cover_image" VARCHAR(255),
  ADD COLUMN "photo_caption" VARCHAR(255),
  ADD COLUMN "author_name" VARCHAR(100),
  ADD COLUMN "author_role" VARCHAR(50),
  ADD COLUMN "highlights" TEXT,
  ADD COLUMN "date_created" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ALTER COLUMN "title" TYPE VARCHAR(255);
```

## 📦 No Additional Dependencies

Uses existing multer middleware from Article API updates.

## 🔐 Security Features

- File type validation (images only)
- File size limit (5MB)
- Rate limiting applied (1000 req/min)
- Unique filename generation
- Organization-only access

## ✨ Breaking Changes

- **Mission creation endpoint** now requires `multipart/form-data`
- **Frontend must be updated** to use FormData instead of JSON
- **Database migration required** before use

## 🎯 Summary

Mission API sekarang konsisten dengan Article API dan mendukung:

- ✅ Cover image upload
- ✅ Rich metadata (tags, author info, highlights)
- ✅ Persistent image storage
- ✅ Better content organization
- ✅ Enhanced user experience
