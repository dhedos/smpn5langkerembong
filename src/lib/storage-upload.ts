import { FirebaseStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';

/**
 * Mengunggah string base64 ke Firebase Storage dan mengembalikan URL publik.
 */
export async function uploadOptimizedImage(
  storage: FirebaseStorage, 
  base64Data: string, 
  folder: string = 'uploads'
): Promise<string> {
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;
  const storageRef = ref(storage, fileName);

  try {
    // Unggah string data URL
    await uploadString(storageRef, base64Data, 'data_url');
    // Ambil URL publik
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Gagal mengunggah ke Storage:", error);
    throw new Error("Gagal menyimpan gambar ke cloud.");
  }
}
