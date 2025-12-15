# Swagger Documentation Guidelines

## ⚠️ PENTING: Swagger HARUS selalu diperbarui!

Setiap kali ada perubahan API (endpoint baru, update, atau hapus), **WAJIB** update dokumentasi Swagger.

## 📝 Cara Update Swagger

### 1. **Menambah/Update Endpoint**

Tambahkan JSDoc comment di atas route handler:

```typescript
/**
 * @openapi
 * /api/endpoint:
 *   post:
 *     tags:
 *       - Tag Name
 *     summary: Short description
 *     description: Detailed description
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - field1
 *             properties:
 *               field1:
 *                 type: string
 *                 example: "example value"
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Bad request
 */
router.post("/endpoint", handler);
```

### 2. **Menambah Schema Baru**

Edit `src/config/swagger.ts` di bagian `components.schemas`:

```typescript
NewSchema: {
  type: "object",
  properties: {
    field1: { type: "string" },
    field2: { type: "integer" },
  }
}
```

### 3. **Menghapus Endpoint**

Hapus JSDoc comment dari route yang dihapus.

### 4. **Verifikasi**

Setelah update:

```bash
# Restart app
docker compose restart app

# Buka browser
http://localhost:4000/docs

# Atau production
https://carbonquest-api.bintangap.my.id/docs
```

## ✅ Checklist Setiap Perubahan API

- [ ] Update JSDoc comment di route
- [ ] Update schema di `swagger.ts` (jika ada type baru)
- [ ] Test endpoint di Swagger UI
- [ ] Verify response format
- [ ] Update README jika perlu

## 🎯 Contoh Update Terbaru

### Perubahan yang Sudah Dilakukan:

1. **Hapus endpoints** - Questions & Answers manual CRUD

   - ✅ JSDoc dihapus otomatis dengan file
   - ✅ Schema lama tetap ada (untuk compatibility)

2. **Tambah endpoint** - `POST /quizzes/submit-answer`

   - ✅ JSDoc ditambahkan di `quiz.routes.ts`
   - ✅ Schema `SubmitQuizAnswer` & `QuizSubmissionResult` ditambahkan

3. **Update endpoint** - `POST /quizzes` support nested

   - ✅ JSDoc diupdate dengan example nested
   - ✅ Schema `CreateQuizWithQuestions` ditambahkan

4. **Tambah endpoint** - `GET /me/sessions/weekly-points`
   - ✅ JSDoc lengkap dengan query params
   - ✅ Schema `WeeklyPoints` ditambahkan

## 🔧 Auto-scan Configuration

Swagger otomatis scan dari:

```typescript
apis: [
  "./dist/modules/**/*.routes.js", // Production build
  "./dist/app.js",
  "./src/modules/**/*.routes.ts", // Development
  "./src/app.ts",
];
```

**Tidak perlu register manual!** Cukup tambah JSDoc di routes.

## 📚 Resources

- [Swagger/OpenAPI 3.0 Spec](https://swagger.io/specification/)
- [swagger-jsdoc Documentation](https://github.com/Surnet/swagger-jsdoc)
- Current docs: https://carbonquest-api.bintangap.my.id/docs
