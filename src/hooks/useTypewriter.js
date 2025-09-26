import { useState, useEffect, useRef  } from 'react';

export function useTypewriter(text, speed = 50) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayText('');
    setCurrentIndex(0);
    setIsComplete(false);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      
      return () => clearTimeout(timer);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, text, speed]);

  return { displayText, isComplete };
}

export function useTypewriterSound() {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio('/sounds/typewriter-sound.mp3');
    audio.preload = 'auto';
    audioRef.current = audio;
  }, []);

  const playSound = () => {
    const audio = audioRef.current;

    if (!audio) {
      console.log('Аудіо не завантажено.');
      return;
    }

    try {
      const audioClone = audio.cloneNode();

      const playbackRate = 0.8 + Math.random() * 0.4;
      audioClone.playbackRate = playbackRate;
      audioClone.volume = 0.4 + Math.random() * 0.2;

      audioClone.onended = () => {
        // У більшості сучасних браузерів це допомагає GC.
        audioClone.src = '';
        audioClone.remove();
      };

      audioClone.play().catch(error => {
        // Це часто буває, якщо користувач ще не взаємодіяв зі сторінкою
        console.warn('Помилка відтворення аудіо (ймовірно, через політику авто-відтворення):', error);
      });

    } catch (error) {
      console.error('Помилка під час відтворення звуку:', error);
    }
  };

  return playSound;
}