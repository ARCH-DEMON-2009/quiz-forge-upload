
// Generate a unique device ID based on browser fingerprinting
export const generateDeviceId = (): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx!.textBaseline = 'top';
  ctx!.font = '14px Arial';
  ctx!.fillText('Device fingerprint', 2, 2);
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL()
  ].join('|');
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return 'device_' + Math.abs(hash).toString(36) + '_' + Date.now().toString(36);
};

export const getOrCreateDeviceId = (): string => {
  let deviceId = localStorage.getItem('test_sagar_device_id');
  if (!deviceId) {
    deviceId = generateDeviceId();
    localStorage.setItem('test_sagar_device_id', deviceId);
  }
  return deviceId;
};
