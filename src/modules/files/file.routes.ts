import { Router } from "express";
import path from "path";
import fs from "fs";

const router = Router();

/**
 * @openapi
 * /files/{filename}:
 *   get:
 *     tags:
 *       - Files
 *     summary: Get uploaded file
 *     description: Retrieve an uploaded file (images for missions, articles, profiles)
 *     security: []
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: The filename to retrieve
 *     responses:
 *       200:
 *         description: File retrieved successfully
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *           image/gif:
 *             schema:
 *               type: string
 *               format: binary
 *           image/webp:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: File not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "File not found"
 */
router.get("/:filename", (req, res) => {
  const filename = req.params.filename;

  // Validasi filename untuk mencegah path traversal attack
  if (
    filename.includes("..") ||
    filename.includes("/") ||
    filename.includes("\\")
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid filename",
    });
  }

  const filepath = path.join(process.cwd(), "uploads", filename);

  // Check if file exists
  if (!fs.existsSync(filepath)) {
    return res.status(404).json({
      success: false,
      message: "File not found",
    });
  }

  // Validasi bahwa file adalah gambar
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
  const ext = path.extname(filename).toLowerCase();

  if (!allowedExtensions.includes(ext)) {
    return res.status(400).json({
      success: false,
      message: "Invalid file type",
    });
  }

  // Set appropriate content type
  const contentTypes: { [key: string]: string } = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
  };

  res.setHeader("Content-Type", contentTypes[ext]);
  res.setHeader("Cache-Control", "public, max-age=31536000"); // Cache for 1 year
  return res.sendFile(filepath);
});

export default router;
