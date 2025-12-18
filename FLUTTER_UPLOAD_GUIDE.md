# 📸 Flutter Image Upload Fix Guide

## Problem

Error saat upload profile image dari Flutter app:

```
Error: Only image files are allowed!
```

## Root Cause

Backend middleware upload menggunakan validasi **AND** (`mimetype && extname`) yang terlalu ketat. Flutter sering mengirim file tanpa proper extension atau dengan MIME type yang berbeda.

## ✅ Solution Applied

### Backend Changes

Updated `upload.middleware.ts` untuk:

- ✅ Menggunakan validasi **OR** (`mimetype || extname`) instead of AND
- ✅ Menambahkan debug logging untuk troubleshooting
- ✅ Lebih prioritas ke MIME type checking (lebih reliable untuk mobile apps)
- ✅ Better error messages dengan info MIME type yang diterima

### Updated Validation Logic

```typescript
// BEFORE (❌ Too strict)
if (mimetype && extname) {
  return cb(null, true);
}

// AFTER (✅ More lenient)
if (mimetypeValid || extname) {
  return cb(null, true);
}
```

---

## 🔧 Flutter Implementation

### Correct Way to Upload Image in Flutter

#### 1. Using `http` package with MultipartRequest

```dart
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:image_picker/image_picker.dart';

Future<void> uploadProfileImage(File imageFile, int userId, String token) async {
  try {
    var uri = Uri.parse('http://your-domain.com/users/$userId/profile-image');
    var request = http.MultipartRequest('PUT', uri);

    // Add authorization header
    request.headers['Authorization'] = 'Bearer $token';

    // Add file dengan field name yang benar
    var multipartFile = await http.MultipartFile.fromPath(
      'profile_image',  // ⚠️ HARUS match dengan backend field name!
      imageFile.path,
      filename: 'profile.jpg', // Tambahkan filename dengan extension
    );

    request.files.add(multipartFile);

    // Send request
    var response = await request.send();
    var responseBody = await response.stream.bytesToString();

    if (response.statusCode == 200) {
      print('✅ Upload successful: $responseBody');
    } else {
      print('❌ Upload failed: ${response.statusCode} - $responseBody');
    }
  } catch (e) {
    print('❌ Upload error: $e');
  }
}
```

#### 2. Using `dio` package (Recommended)

```dart
import 'dart:io';
import 'package:dio/dio.dart';
import 'package:image_picker/image_picker.dart';

Future<void> uploadProfileImage(File imageFile, int userId, String token) async {
  try {
    var dio = Dio();

    // Prepare form data
    FormData formData = FormData.fromMap({
      'profile_image': await MultipartFile.fromFile(
        imageFile.path,
        filename: 'profile.jpg', // Specify extension
      ),
    });

    // Send request
    var response = await dio.put(
      'http://your-domain.com/users/$userId/profile-image',
      data: formData,
      options: Options(
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'multipart/form-data',
        },
      ),
    );

    print('✅ Upload successful: ${response.data}');
  } on DioException catch (e) {
    print('❌ Upload failed: ${e.response?.data}');
  }
}
```

#### 3. Complete Example with Image Picker

```dart
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:dio/dio.dart';

class ProfileImageUploader extends StatefulWidget {
  final int userId;
  final String token;

  const ProfileImageUploader({
    required this.userId,
    required this.token,
  });

  @override
  _ProfileImageUploaderState createState() => _ProfileImageUploaderState();
}

class _ProfileImageUploaderState extends State<ProfileImageUploader> {
  final ImagePicker _picker = ImagePicker();
  File? _selectedImage;
  bool _isUploading = false;

  Future<void> _pickImage() async {
    try {
      final XFile? image = await _picker.pickImage(
        source: ImageSource.gallery,
        maxWidth: 1024,
        maxHeight: 1024,
        imageQuality: 85, // Compress image
      );

      if (image != null) {
        setState(() {
          _selectedImage = File(image.path);
        });
      }
    } catch (e) {
      print('Error picking image: $e');
    }
  }

  Future<void> _uploadImage() async {
    if (_selectedImage == null) return;

    setState(() {
      _isUploading = true;
    });

    try {
      var dio = Dio();

      // Get file extension
      String ext = _selectedImage!.path.split('.').last;

      FormData formData = FormData.fromMap({
        'profile_image': await MultipartFile.fromFile(
          _selectedImage!.path,
          filename: 'profile.$ext', // ✅ Include extension
        ),
      });

      var response = await dio.put(
        'http://your-domain.com/users/${widget.userId}/profile-image',
        data: formData,
        options: Options(
          headers: {
            'Authorization': 'Bearer ${widget.token}',
          },
        ),
      );

      print('✅ Upload successful: ${response.data}');

      // Show success message
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Profile image updated!')),
      );
    } on DioException catch (e) {
      print('❌ Upload failed: ${e.response?.data}');

      // Show error message
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Upload failed: ${e.message}')),
      );
    } finally {
      setState(() {
        _isUploading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        if (_selectedImage != null)
          CircleAvatar(
            radius: 60,
            backgroundImage: FileImage(_selectedImage!),
          ),

        SizedBox(height: 16),

        ElevatedButton(
          onPressed: _pickImage,
          child: Text('Choose Image'),
        ),

        SizedBox(height: 8),

        if (_selectedImage != null)
          ElevatedButton(
            onPressed: _isUploading ? null : _uploadImage,
            child: _isUploading
                ? CircularProgressIndicator()
                : Text('Upload'),
          ),
      ],
    );
  }
}
```

---

## 🐛 Debugging Tips

### Check Backend Logs

Sekarang backend akan menampilkan log setiap upload attempt:

```
Upload attempt: {
  originalname: 'profile.jpg',
  mimetype: 'image/jpeg',
  fieldname: 'profile_image'
}
✅ File accepted
```

Atau jika ditolak:

```
Upload attempt: {
  originalname: 'image_picker123.tmp',
  mimetype: 'application/octet-stream',  // ❌ Bukan image MIME type
  fieldname: 'profile_image'
}
❌ File rejected: { mimetype: 'application/octet-stream', ... }
```

### Common Issues & Solutions

#### Issue 1: Wrong MIME Type

**Problem:** File dikirim dengan `application/octet-stream`
**Solution:** Specify filename dengan extension saat create MultipartFile

```dart
// ❌ Wrong
MultipartFile.fromFile(imagePath)

// ✅ Correct
MultipartFile.fromFile(
  imagePath,
  filename: 'profile.jpg'  // Specify extension
)
```

#### Issue 2: Wrong Field Name

**Problem:** Backend expect `profile_image` tapi Flutter send `image`
**Solution:** Pastikan field name match

```dart
FormData.fromMap({
  'profile_image': multipartFile,  // ✅ Match dengan backend
})
```

#### Issue 3: File Too Large

**Problem:** File > 5MB
**Solution:** Compress image sebelum upload

```dart
final XFile? image = await _picker.pickImage(
  source: ImageSource.gallery,
  maxWidth: 1024,
  maxHeight: 1024,
  imageQuality: 85,  // Compress to 85%
);
```

---

## 📋 Checklist

Sebelum upload, pastikan:

- [ ] Field name adalah `profile_image`
- [ ] Authorization header dengan Bearer token included
- [ ] File memiliki extension (`.jpg`, `.png`, dll)
- [ ] File size < 5MB
- [ ] MIME type adalah `image/*`
- [ ] Endpoint adalah `PUT /users/:id/profile-image`

---

## 🎯 Expected Behavior

### Success Response (200)

```json
{
  "success": true,
  "message": "Profile image uploaded successfully",
  "data": {
    "id_user": 5,
    "name": "John Doe",
    "profile_image": "/files/1734524400000-123456789.jpg"
  }
}
```

### Error Response (400)

```json
{
  "success": false,
  "message": "Only image files are allowed! Received mimetype: application/octet-stream"
}
```

### Error Response (429) - Rate Limit

```json
{
  "success": false,
  "message": "Too many requests, please try again later."
}
```

> **Note:** Upload dibatasi 10 requests per 15 menit

---

## 🔗 Related Documentation

- [API_USAGE_EXAMPLES.md](./API_USAGE_EXAMPLES.md#2-get-user-profile--update) - Complete user endpoints
- [upload.middleware.ts](./src/middleware/upload.middleware.ts) - Upload configuration

---

## 📞 Still Having Issues?

Jika masih error setelah mengikuti guide ini:

1. **Check backend logs** - Lihat MIME type dan originalname yang diterima
2. **Test dengan Postman** - Pastikan endpoint works dengan Postman
3. **Compare request** - Bandingkan request dari Postman vs Flutter
4. **Check network** - Pastikan tidak ada proxy/firewall yang modify request
