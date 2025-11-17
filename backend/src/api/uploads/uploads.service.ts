import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOADS_DIR = path.join(__dirname, "../../../uploads");
const TEMP_DIR = path.join(UPLOADS_DIR, "temp");
const PERMANENT_DIR = path.join(UPLOADS_DIR, "images");

// 디렉토리 생성
async function ensureDirectories() {
  await fs.mkdir(TEMP_DIR, { recursive: true });
  await fs.mkdir(PERMANENT_DIR, { recursive: true });
}

export async function uploadImage(file: Express.Multer.File): Promise<string> {
  await ensureDirectories();

  const filename = file.filename;
  const tempPath = path.join(TEMP_DIR, filename);

  // 파일이 이미 multer에 의해 저장되어 있으므로 URL만 반환
  return `/api/uploads/temp/${filename}`;
}

export async function moveImageToPermanent(filename: string): Promise<string> {
  await ensureDirectories();

  const tempPath = path.join(TEMP_DIR, filename);
  const permanentPath = path.join(PERMANENT_DIR, filename);

  try {
    await fs.rename(tempPath, permanentPath);
    return `/api/uploads/images/${filename}`;
  } catch (error) {
    console.error("Failed to move image:", error);
    throw error;
  }
}

export async function deleteUnusedImages(): Promise<number> {
  await ensureDirectories();

  const now = Date.now();
  const ONE_DAY = 24 * 60 * 60 * 1000;
  let deletedCount = 0;

  try {
    const files = await fs.readdir(TEMP_DIR);

    for (const file of files) {
      const filePath = path.join(TEMP_DIR, file);
      const stats = await fs.stat(filePath);

      if (now - stats.mtimeMs > ONE_DAY) {
        await fs.unlink(filePath);
        deletedCount++;
      }
    }
  } catch (error) {
    console.error("Failed to cleanup images:", error);
  }

  return deletedCount;
}
