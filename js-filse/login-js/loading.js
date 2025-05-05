function updateCartCount() {
  const selectedProducts = JSON.parse(localStorage.getItem('selectedProducts')) || [];
  const cartCount = selectedProducts.reduce((total, product) => total + product.quantity, 0);
  document.querySelector('#cart-count').textContent = cartCount;
}
updateCartCount();

//def
document.getElementById('createheader').style.color = '#000';
document.getElementById('createmain').style.display = 'none';
document.getElementById('loginheader').style.color = '#790000';
document.getElementById('loginmain').style.display = 'block';
document.getElementById('forgetheader').style.color = '#000';
document.getElementById('forgetmain').style.display = 'none';


const imageUpload = document.getElementById('imageUpload');
const loadingText = document.getElementById('loading');
const output = document.getElementById('output');
const progressBar = document.getElementById('progressBar');

// عناصر الجدول
const odSp = document.getElementById('odSp');
const odCy = document.getElementById('odCy');
const odAx = document.getElementById('odAx');
const osSp = document.getElementById('osSp');
const osCy = document.getElementById('osCy');
const osAx = document.getElementById('osAx');

imageUpload.addEventListener('change', async () => {
  const file = imageUpload.files[0];
  if (file) {
    loadingText.style.display = "block"; // Show loading text
    progressBar.value = 0; // Reset progress bar
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        // تحميل الصورة
        const img = new Image();
        img.src = reader.result;

        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        // تحسين جودة الصورة باستخدام pica
        const canvas = document.createElement('canvas');
        canvas.width = img.width * 2; // زيادة حجم الصورة
        canvas.height = img.height * 2;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // استخدام pica لتحسين جودة الصورة
        const resizedCanvas = document.createElement('canvas');
        resizedCanvas.width = img.width * 2;
        resizedCanvas.height = img.height * 2;

        await pica().resize(img, resizedCanvas, {
          quality: 3, // تحسين الجودة
          unsharpAmount: 100, // زيادة الحدة
          unsharpThreshold: 1,
        });

        const base64Image = resizedCanvas.toDataURL('image/png');

        const { data: { text } } = await Tesseract.recognize(
          base64Image,
          'eng',
          {
            logger: info => {
              if (info.status === 'recognizing text') {
                progressBar.value = info.progress * 100;
              }
            },
            tessedit_char_whitelist: '-+.٠١٢٣٤٥٦٧٨٩ODOSSPHCYLAXIS',
            tessedit_pageseg_mode: '7',
          }
        );

        loadingText.style.display = "none"; // Hide loading text
        output.textContent = text; // Display extracted text

        // معالجة النص المستخرج
        processAndSavePrescription(text);
      } catch (error) {
        loadingText.style.display = "none";
        output.textContent = "Error processing image or extracting text: " + error.message;
        console.error(error);
      }
    };
    reader.readAsDataURL(file);
  }
});

function processAndSavePrescription(text) {
  // تنظيف النص: إزالة المسافات الزائدة والأحرف غير الضرورية
  const cleanedText = text.replace(/\s+/g, ' ').trim();

  // Improved regex to extract SPH, CYL, and Axis values (تجاهل ADD)
  const odRegex = /O\.?D\.?\s*([-+]?\d*\.?\d+)\s*([-+]?\d*\.?\d+)\s*(\d+)/i;
  const osRegex = /O\.?S\.?\s*([-+]?\d*\.?\d+)\s*([-+]?\d*\.?\d+)\s*(\d+)/i;

  const odMatch = cleanedText.match(odRegex);
  const osMatch = cleanedText.match(osRegex);

  if (odMatch) {
    odSp.value = odMatch[1]; // SPH
    odCy.value = odMatch[2]; // CYL
    odAx.value = odMatch[3]; // Axis
  }

  if (osMatch) {
    osSp.value = osMatch[1]; // SPH
    osCy.value = osMatch[2]; // CYL
    osAx.value = osMatch[3]; // Axis
  }
}