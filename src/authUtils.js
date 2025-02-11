export const checkPermission = (requiredPermission) => {
  try {
    const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");
    return permissions.includes(requiredPermission);
  } catch (error) {
    console.error("Error checking permission:", error);
    return false;
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  return !!(token && user);
};