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
  const audioContextRef = useRef(null);
  const sourceNodesRef = useRef([]);

  //download audio
  useEffect(() => {
    audioRef.current = new Audio('/sounds/typewriter-sound.mp3');
    audioRef.current.preload = 'auto';
    
    // Create AudioContext 
    try {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
      console.log('Web Audio API not supported');
    }

    return () => {
      if (sourceNodesRef.current.length > 0) {
        sourceNodesRef.current.forEach(source => {
          if (source) source.stop();
        });
      }
    };
  }, []);

  return ;
}