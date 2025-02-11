
export const setupAuthListener = (callback) => {
    const handleStorageChange = (event) => {
      if (event.key === 'user' || event.key === 'permissions' || event.key === 'token') {
        callback();
      }
    };
  
    window.addEventListener('storage', handleStorageChange);
  
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  };