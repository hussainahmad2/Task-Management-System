import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

try {
    const content = fs.readFileSync('f:/OMS/oms_schema.txt', 'utf16le');
    fs.writeFileSync('f:/OMS/oms_schema_clean.txt', content, 'utf8');
    console.log("Converted file to oms_schema_clean.txt");
} catch (e) {
    console.error("Failed to convert", e);
}
