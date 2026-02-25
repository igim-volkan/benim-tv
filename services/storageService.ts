import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

export const storageService = {
    /**
     * Uploads a base64 string to Firebase Storage and returns the download URL.
     * @param base64String The full base64 string (including data URL prefix if present)
     * @param path Optional folder path (e.g., 'posters')
     * @returns The public download URL
     */
    async uploadBase64Image(base64String: string, path: string = 'posters'): Promise<string> {
        if (!base64String) return '';

        try {
            // Create a unique filename
            const filename = `${crypto.randomUUID()}.jpg`;
            const storageRef = ref(storage, `${path}/${filename}`);

            // Firebase expects the base64 string format.
            // If the string contains the data URI prefix (e.g., "data:image/jpeg;base64,..."),
            // we must use the 'data_url' format option.
            const format = base64String.includes('data:image') ? 'data_url' : 'base64';

            const snapshot = await uploadString(storageRef, base64String, format);
            const downloadURL = await getDownloadURL(snapshot.ref);

            return downloadURL;
        } catch (error) {
            console.error("Error uploading image to Storage:", error);
            throw error;
        }
    }
};
