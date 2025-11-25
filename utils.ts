export const haptic = (style: 'light' | 'medium' | 'heavy' = 'medium') => {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    const patterns = {
      light: 10,
      medium: 20,
      heavy: 50
    };
    navigator.vibrate(patterns[style]);
  }
};

export const playCompletionSound = () => {
  try {
    // Haptic feedback first
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }

    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  } catch (e) {
    console.error("Audio play failed", e);
  }
};

export const simpleConfetti = () => {
  const colors = ['#818CF8', '#F472B6', '#2DD4BF', '#FBBF24'];
  
  for (let i = 0; i < 50; i++) {
    const div = document.createElement('div');
    div.style.position = 'fixed';
    div.style.left = Math.random() * 100 + 'vw';
    div.style.top = '-10px';
    div.style.width = Math.random() * 10 + 5 + 'px';
    div.style.height = Math.random() * 10 + 5 + 'px';
    div.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    div.style.borderRadius = '50%';
    div.style.pointerEvents = 'none';
    div.style.zIndex = '9999';
    div.style.transition = 'transform 2s ease-out, opacity 2s ease-out';
    
    document.body.appendChild(div);

    setTimeout(() => {
      div.style.transform = `translate(${Math.random() * 100 - 50}px, ${Math.random() * 500 + 300}px) rotate(${Math.random() * 360}deg)`;
      div.style.opacity = '0';
    }, 50);

    setTimeout(() => {
      div.remove();
    }, 2000);
  }
};

export const shareResult = async (title: string, streak: number) => {
  const text = `Я выполнил практику "${title}" в Микро-отдых! 🌱\nСерия: ${streak} дней 🔥`;
  
  if (navigator.share) {
    try {
      await navigator.share({ text });
    } catch (e) {
      console.log('Share cancelled');
    }
  } else {
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(text);
      alert('Скопировано в буфер обмена!');
    } catch (err) {
      console.error('Failed to copy', err);
    }
  }
};