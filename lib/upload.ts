import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function saveUploadedFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Generate unique filename
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const extension = file.name.split('.').pop();
  const filename = `${uniqueSuffix}.${extension}`;

  // Save to public/uploads
  const path = join(process.cwd(), 'public', 'uploads', filename);
  await writeFile(path, buffer);

  // Return public URL
  return `/uploads/${filename}`;
}

export function isValidImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  return validTypes.includes(file.type);
}

export function isValidVideoFile(file: File): boolean {
  const validTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
  return validTypes.includes(file.type);
}

export function isValidMediaFile(file: File): boolean {
  return isValidImageFile(file) || isValidVideoFile(file);
}

export function getMediaType(file: File): 'IMAGE' | 'VIDEO' {
  return isValidImageFile(file) ? 'IMAGE' : 'VIDEO';
}
