"use server"

import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import crypto from 'crypto'

export async function uploadLogo(formData: FormData): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const file = formData.get('file') as File | null
    if (!file) {
      return { success: false, error: 'No file provided' }
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Ensure the uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'logos')
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (e) {
      // Ignore if it already exists
    }

    // Generate unique filename
    const ext = file.name.split('.').pop() || 'png'
    const fileName = `${crypto.randomUUID()}.${ext}`
    const filePath = path.join(uploadsDir, fileName)

    // Write file to public directory
    await writeFile(filePath, buffer)

    // Return the public URL
    return { success: true, url: `/uploads/logos/${fileName}` }
  } catch (error: any) {
    console.error("Error uploading logo:", error)
    return { success: false, error: error.message }
  }
}
