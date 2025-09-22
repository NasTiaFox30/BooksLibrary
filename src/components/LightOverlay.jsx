// VERSION 1
export default function LightOverlay({ isLightOn, currentScreen }) {
  if (!isLightOn) return null;

  // Розміри світлового кола для різних екранів
  const getLightSize = () => {
    switch (currentScreen) {
      case 'home': return '1200px 600px';  // ширина висота
      case 'book': return '1000px 700px';
      default: return '1000px 500px';
    }
  };

  const lightSize = getLightSize();

  return (
    <div 
        className="fixed inset-0 pointer-events-none z-40"
        style={{
        background: `
        radial-gradient(
            ellipse ${lightSize} at 50% 53%,
            transparent 0%,
            rgba(0, 0, 0, 0.3) 30%,
            rgba(0, 0, 0, 0.5) 40%,
            rgba(0, 0, 0, 0.8) 70%,
            rgba(0, 0, 0, 0.9) 100%
        )`
      }}
    />
  );
}



// VERSION 2

// import { useState, useEffect } from 'react';

// export default function LightOverlay({ isLightOn, currentScreen }) {
//   if (!isLightOn) return null;

//   // Визначаємо розміри та позицію світлового кола в залежності від екрану
//   const getLightConfig = () => {
//     switch (currentScreen) {
//       case 'home':
//         return {
//           size: 'min(80vw, 1200px)',
//           height: '70vh',
//           top: '60%'
//         };
//       case 'book':
//         return {
//           size: 'min(90vw, 1000px)',
//           height: '80vh',
//           top: '50%'
//         };
//       default:
//         return {
//           size: 'min(80vw, 1000px)',
//           height: '70vh',
//           top: '50%'
//         };
//     }
//   };

//   const lightConfig = getLightConfig();

//   return (
//     <div className="fixed inset-0 pointer-events-none z-40">
//       <div
//         className="absolute inset-0"
//         style={{
//           background: `radial-gradient(ellipse ${lightConfig.size} ${lightConfig.height} at 50% ${lightConfig.top},
//                       rgba(255, 255, 255, 0.1) 0%,
//                       rgba(0, 0, 0, 0.8) 70%)`,
//           mixBlendMode: 'multiply'
//         }}
//       />
      
//       <div
//         className="absolute inset-0"
//         style={{
//           background: `radial-gradient(ellipse ${lightConfig.size} ${lightConfig.height} at 50% ${lightConfig.top},
//                       transparent 0%,
//                       rgba(0, 0, 0, 0.9) 100%)`,
//           opacity: 0.7
//         }}
//       />
//     </div>
//   );