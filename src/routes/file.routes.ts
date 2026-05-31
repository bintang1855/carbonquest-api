import { Router } from "express";
import path from "path";
import fs from "fs";

const router = Router();

const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
const CONTENT_TYPES: { [key: string]: string } = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
};

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
  const { filename } = req.params;

  if (hasPathTraversal(filename)) {
    return res.status(400).json({ success: false, message: "Invalid filename" });
  }

  const filepath = path.join(process.cwd(), "uploads", filename);

  if (!fs.existsSync(filepath)) {
    return res.status(404).json({ success: false, message: "File not found" });
  }

  const ext = path.extname(filename).toLowerCase();

  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return res.status(400).json({ success: false, message: "Invalid file type" });
  }

  res.setHeader("Content-Type", CONTENT_TYPES[ext]);
  res.setHeader("Cache-Control", "public, max-age=31536000");
  return res.sendFile(filepath);
});

function hasPathTraversal(filename: string): boolean {
  return filename.includes("..") || filename.includes("/") || filename.includes("\\");
}

export default router;
