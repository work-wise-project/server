import fs from 'fs';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export async function extractTextFromPDF(filePath: string): Promise<string> {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
}

export async function extractTextFromDocx(filePath: string): Promise<string> {
    const dataBuffer = fs.readFileSync(filePath);
    const { value } = await mammoth.extractRawText({ buffer: dataBuffer });
    return value;
}

export async function extractTextFromTxt(filePath: string): Promise<string> {
    const data = fs.readFileSync(filePath, 'utf8');
    return data;
}
