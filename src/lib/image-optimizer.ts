/**
 * @fileOverview Utility to optimize images on the client side.
 * - optimizeImage: Resizes, compresses, and converts an image to WebP format.
 */

export async function optimizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // Validasi tipe file
    if (!file.type.startsWith('image/')) {
      return reject(new Error('File yang diunggah bukan gambar.'));
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Maksimal lebar 1920px (Full HD)
        const MAX_WIDTH = 1920;
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Gagal mendapatkan konteks canvas.'));
        }

        // Gambar ulang di canvas untuk resize
        ctx.drawImage(img, 0, 0, width, height);

        /**
         * Konversi ke WebP dengan kualitas 0.8
         * Biasanya menghasilkan file 200-300 KB untuk resolusi 1920px
         */
        const optimizedDataUrl = canvas.toDataURL('image/webp', 0.8);
        resolve(optimizedDataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}
