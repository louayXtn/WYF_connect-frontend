// import { apiClient } from './api-client';
// import { getToken } from './auth';

// const URL_ENDPOINT = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || '';
// const PUBLIC_KEY = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '';

// interface ImageKitAuthParams {
//   token: string;
//   expire: number;
//   signature: string;
// }

// export async function uploadImageToImageKit(file: File): Promise<string> {
//   // 1. خد توكن مؤقت من الباك اند
//   const authParams = await apiClient<ImageKitAuthParams>('/imagekit/auth', {
//     headers: {
//       Authorization: `Bearer ${getToken()}`
//     }
//   });

//   // 2. جهّز الفورم داتا للرفع المباشر لـ ImageKit
//   const formData = new FormData();
//   formData.append('file', file);
//   formData.append('fileName', file.name);
//   formData.append('publicKey', PUBLIC_KEY);
//   formData.append('signature', authParams.signature);
//   formData.append('expire', String(authParams.expire));
//   formData.append('token', authParams.token);
//   formData.append('folder', '/wyf-projects');

//   // 3. ابعت الصورة مباشرة لـ ImageKit (مش عبر الباك اند تبعنا)
//   const res = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
//     method: 'POST',
//     body: formData
//   });

//   if (!res.ok) {
//     throw new Error('Image upload failed');
//   }

//   const data = await res.json();
//   return data.url as string; // الرابط النهائي للصورة
// }


import { apiClient } from './api-client';
import { getToken } from './auth';

const PUBLIC_KEY = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '';

interface ImageKitAuthParams {
  token: string;
  expire: number;
  signature: string;
}

export async function uploadFileToImageKit(file: File, folder = '/wyf-projects'): Promise<string> {
  // 1. خد توكن مؤقت من الباك اند
  const authParams = await apiClient<ImageKitAuthParams>('/imagekit/auth', {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  // 2. جهّز الفورم داتا للرفع المباشر لـ ImageKit
  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileName', file.name);
  formData.append('publicKey', PUBLIC_KEY);
  formData.append('signature', authParams.signature);
  formData.append('expire', String(authParams.expire));
  formData.append('token', authParams.token);
  formData.append('folder', folder);

  // 3. ابعت الملف مباشرة لـ ImageKit (مش عبر الباك اند تبعنا)
  const res = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
    method: 'POST',
    body: formData
  });

  if (!res.ok) {
    throw new Error('File upload failed');
  }

  const data = await res.json();
  return data.url as string; // الرابط النهائي للملف
}

// اسم قديم محفوظ للتوافق مع الكود الموجود
export const uploadImageToImageKit = uploadFileToImageKit;