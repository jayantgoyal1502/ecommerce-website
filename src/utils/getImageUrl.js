// src/utils/getImageUrl.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

console.log("API_BASE_URL:", API_BASE_URL);
export default function getImageUrl(image) {
  console.log("getImageUrl input:", image);
  if (!image) return "";
  if (image.startsWith("http")) return image;
  // Remove all leading slashes and any leading 'uploads/'
  let clean = image.replace(/^\/*(uploads[\\/]+)?/, "");
  // Always prefix with single /uploads/
  const url = `${API_BASE_URL}/uploads/${clean}`;
  console.log("getImageUrl output:", url);
  return url;
}
