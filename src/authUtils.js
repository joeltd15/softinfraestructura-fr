export const checkPermission = (requiredPermission) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.permissions) return false;
    return user.permissions.includes(requiredPermission);
  };