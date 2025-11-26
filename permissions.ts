
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support desktop notification');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const scheduleNotification = (title: string, body: string, delaySeconds: number = 0) => {
  if (Notification.permission === 'granted') {
    setTimeout(() => {
      new Notification(title, {
        body,
        icon: '/icon-192.png' // Assuming PWA icon exists
      });
    }, delaySeconds * 1000);
  }
};
