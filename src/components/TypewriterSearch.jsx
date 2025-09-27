import { useState, useRef, useEffect } from 'react';
import { useTypewriterSound } from '../hooks/useTypewriter';

export default function TypewriterSearch({ value, onChange, placeholder }) {
  const [isFocused, setIsFocused] = useState(false);
  const [leverActive, setLeverActive] = useState(false);
  const [lastValue, setLastValue] = useState('');
  const [displayText, setDisplayText] = useState('');
  const inputRef = useRef(null);
  const playSound = useTypewriterSound();

  useEffect(() => {
    if (value.length > lastValue.length) {
      animateLever();
      playSound();
      const newChar = value.slice(-1);
      setTimeout(() => {
        setDisplayText(prev => prev + newChar);
      }, 100);
    } else if (value.length < lastValue.length) {
      setDisplayText(value);
    }
    setLastValue(value);
  }, [value]);

  useEffect(() => {
    setDisplayText(value);
  }, []);

  const animateLever = () => {
    setLeverActive(true);
    setTimeout(() => setLeverActive(false), 200);
  };

  const handleChange = (e) => {
    onChange(e);
  };

  const handleFocus = () => {
    setIsFocused(true);
    inputRef.current?.select();
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className="relative w-120 max-w-2xl mx-auto" onClick={() => inputRef.current?.focus()}>
      {/* Друкарська машинка */}
      <div className="relative">
        
        {/* Листок паперу */}
        <div className="absolute bottom-63 left-25 right-25 bg-white border-1 rounded-s p-4 shadow-lg z-10">
          <div className="relative min-h-[50px]">
            {/* Прихований інпут для введення */}
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="absolute inset-0 w-full h-full opacity-0 cursor-text"
              style={{ zIndex: 10 }}
            />
            
            {/* Відображення тексту з ефектом набору */}
            <div
              className="courier-prime-bold text-lg p-2 pointer-events-none relative"
              style={{
                letterSpacing: '1.5px',
                minHeight: '40px'
              }}
            >
              {/* Відображення тексту */}
              <span style={{ visibility: value ? 'visible' : 'hidden' }}>
                {displayText}
              </span>
              
              {/* Курсор */}
                {isFocused && (
                  <span className="inline-block w-2 h-5 bg-gray-800 ml-1 animate-pulse"></span>
                )}
            </div>
            
            {/* Плейсхолдер */}
            {!value && !isFocused && (
              <div
                className="courier-prime-bold text-stone-600 pointer-events-none text-lg absolute top-1 left-2"
                style={{ letterSpacing: '1.5px' }}
              >
                {placeholder}
              </div>
            )}
          </div>
        </div>

        {/* Корпус машинки (текстура) */}
        <div className="mt-16 relative">
          <img
            src="/textures/typewriter-texture.png"
            alt="Typewriter Body"
            className="w-120 h-auto mx-auto select-none pointer-events-none"
          />

          {/* Ричажок */}
          <div className="absolute z-10 left-1/2 top-15 transform -translate-x-1/2">
            <div
              className={`relative w-6 h-11 bg-stone-600 rounded-md transition-all duration-100 origin-bottom`}
              style={{
                transform: `translateY(${leverActive ? -20 : 0}px)`,
                boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
              }}
            >
              <div className="absolute -bottom-2 left-1/2 w-5 h-3 bg-stone-800 transform -translate-x-1/2 rounded-sm"></div>
              <div className="absolute top-2 left-1/2 w-1 h-6 bg-stone-400 transform -translate-x-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
