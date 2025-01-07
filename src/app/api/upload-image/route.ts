import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.error('No file received in the request');
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    console.log('File received:', file.name); // ファイル名を確認

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${Date.now()}-${file.name}`;
    const filePath = join(process.cwd(), 'public/uploads', fileName);

    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/${fileName}`;
    console.log('File saved at:', filePath); // 保存先を確認

    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error) {
    console.error('Error handling upload:', error);
    return NextResponse.json({ success: false, message: 'Failed to process file upload' }, { status: 500 });
  }
}
