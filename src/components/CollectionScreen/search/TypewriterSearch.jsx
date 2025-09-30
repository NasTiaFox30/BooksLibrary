import { useState, useRef, useEffect } from 'react';
import { useTypewriterSound } from '../../../hooks/useTypewriter';

export default function TypewriterSearch({ value, onChange, placeholder, isMobile }) {
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

  // Mobile adaptive
  const getContainerWidth = () => isMobile ? 'w-80' : 'w-120';
  const getPaperPosition = () => isMobile ? 'bottom-43 left-15 right-15' : 'bottom-63 left-25 right-25';
  const getTypewriterSize = () => isMobile ? 'w-80 h-auto' : 'w-120 h-auto';
  const getLeverPosition = () => isMobile ? 'top-10' : 'top-15';
  const getFontSize = () => isMobile ? 'text-base' : 'text-lg';
  const getPaperPadding = () => isMobile ? 'p-3' : 'p-4';
  const getMinHeight = () => isMobile ? 'min-h-[40px]' : 'min-h-[50px]';

  return (
    <div 
      className={`relative ${getContainerWidth()} max-w-2xl mx-auto`} 
      onClick={() => inputRef.current?.focus()}
    >
      {/* Друкарська машинка */}
      <div className="relative">
        
        {/* Листок паперу */}
        <div className={`absolute ${getPaperPosition()} bg-white border-1 rounded-s ${getPaperPadding()} shadow-lg z-10`}>
          <div className={`relative ${getMinHeight()}`}>
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
              placeholder={placeholder}
            />
            
            {/* Відображення тексту з ефектом набору */}
            <div
              className={`courier-prime-bold ${getFontSize()} p-2 pointer-events-none relative`}
              style={{
                letterSpacing: isMobile ? '1px' : '1.5px',
                minHeight: isMobile ? '32px' : '40px'
              }}
            >
              {/* Відображення тексту */}
              <span 
                className="break-words"
                style={{ visibility: value ? 'visible' : 'hidden' }}
              >
                {displayText}
              </span>
              
              {/* Курсор */}
              {isFocused && (
                <span 
                  className={`inline-block bg-gray-800 ml-1 animate-pulse ${
                    isMobile ? 'w-1 h-4' : 'w-2 h-5'
                  }`}
                ></span>
              )}
            </div>
            
            {/* Плейсхолдер */}
            {!value && !isFocused && (
              <div
                className={`courier-prime-bold text-stone-600 pointer-events-none ${getFontSize()} absolute top-1 left-2`}
                style={{ letterSpacing: isMobile ? '1px' : '1.5px' }}
              >
                {placeholder}
              </div>
            )}
          </div>
        </div>

        {/* Корпус машинки (текстура) */}
        <div className={isMobile ? "mt-12 relative" : "mt-16 relative"}>
          <img
            src="/textures/typewriter-texture.png"
            alt="Typewriter Body"
            className={`${getTypewriterSize()} mx-auto select-none pointer-events-none`}
          />

          {/* Ричажок */}
          <div className={`absolute z-10 left-1/2 ${getLeverPosition()} transform -translate-x-1/2`}>
            <div
              className={`relative bg-stone-600 rounded-md transition-all duration-100 origin-bottom ${
                isMobile ? 'w-4 h-8' : 'w-6 h-11'
              }`}
              style={{
                transform: `translateY(${leverActive ? (isMobile ? -15 : -20) : 0}px)`,
                boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
              }}
            >
              <div 
                className={`absolute -bottom-1 left-1/2 bg-stone-800 transform -translate-x-1/2 rounded-sm ${
                  isMobile ? 'w-4 h-2' : 'w-5 h-3'
                }`}
              ></div>
              <div 
                className={`absolute top-1 left-1/2 w-1 bg-stone-400 transform -translate-x-1/2 ${
                  isMobile ? 'h-4' : 'h-6'
                }`}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-2">
        <p className="text-xs text-stone-500 courier-prime">
          надрукуйте текст для пошуку
        </p>
      </div>
    </div>
  );
}
