import fs from 'fs';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export async function extractTextFromPDF(fileBuffer: Buffer): Promise<string> {
    const data = await pdfParse(fileBuffer);
    return data.text;
}

export async function extractTextFromDocx(fileBuffer: Buffer): Promise<string> {
    const { value } = await mammoth.extractRawText({ buffer: fileBuffer });
    return value;
}

export async function extractTextFromTxt(fileBuffer: Buffer): Promise<string> {
    return fileBuffer.toString('utf-8');
}
