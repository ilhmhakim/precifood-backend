import { Storage } from '@google-cloud/storage';
import dotenv from 'dotenv';

dotenv.config();

// Ambil JSON dari environment variable dan parse
const googleCredentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON || '{}');

// Buat instance Google Cloud Storage dengan credentials
export const storage = new Storage({
    credentials: googleCredentials,
    projectId: googleCredentials.project_id,
});

export default storage;
