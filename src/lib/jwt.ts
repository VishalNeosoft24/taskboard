export const decodeToken = (token: string | null) => {
  if (!token) return null;

  try {
    const base64Url = token.split(".")[1];
    const decodedPayload = JSON.parse(window.atob(base64Url));
    return decodedPayload;
  } catch (e) {
    return null;
  }
};
