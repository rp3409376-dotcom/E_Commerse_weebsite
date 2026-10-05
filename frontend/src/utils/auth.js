function isObjectId(value) {
  return /^[a-f\d]{24}$/i.test(value || "");
}

export function getStoredUserId() {
  const storedUserId = localStorage.getItem("userId");
  if (isObjectId(storedUserId)) return storedUserId;
  if (storedUserId) localStorage.removeItem("userId");

  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const encodedPayload = token.split(".")[1];
    const paddedPayload = encodedPayload
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(encodedPayload.length / 4) * 4, "=");
    const payload = JSON.parse(atob(paddedPayload));
    const userId = payload.id || payload.userId || payload._id;

    if (isObjectId(userId)) {
      localStorage.setItem("userId", userId);
      return userId;
    }

    return null;
  } catch {
    return null;
  }
}
