import React, { useState, useEffect, useRef } from 'react';

const MoneyWaterfall = ({ money, currency = 'ETH' , number, price}) => {
  const [moneyBundles, setMoneyBundles] = useState([]);
  const [collectedBundles, setCollectedBundles] = useState([]);
  const containerRef = useRef(null);
  
  // Calculate how many bundles to show based on the money amount
  // Each bundle represents $500
//   const bundleCount = Math.max(5, Math.min(Math.floor(money ), 60));
  const bundleCount = money*100;
  
  useEffect(() => {
    // Clear existing bundles when money amount changes
    setMoneyBundles([]);
    setCollectedBundles([]);
    
    // Generate new money bundles when the money prop changes
    const newBundles = [];
    for (let i = 0; i < bundleCount; i++) {
      newBundles.push({
        id: i,
        left: Math.random() * 80 + 10, // Random horizontal position (10-90%)
        delay: Math.random() * 4, // Random delay for natural effect
        rotation: Math.random() * 360, // Random rotation
        scale: 0.7 + Math.random() * 0.5, // Random size variation
        waveFactor: 0.3 + Math.random() * 0.7, // Random wave intensity (reduced)
        waveSpeed: 1 + Math.random() * 0.5, // Random wave speed
        fallSpeed: 2.5 + Math.random() * 0.5, // Random fall speed
        landingSpot: Math.random() * 80 + 10, // Where it will land (might differ slightly from starting position)
      });
    }
    setMoneyBundles(newBundles);
    
    // Setup animation end listener to collect bundles at the bottom
    const handleAnimationEnd = (e) => {
      const bundleId = e.target.dataset.id;
      if (bundleId && e.animationName.includes('fall')) {
        // Find the bundle
        const bundle = newBundles.find(b => b.id.toString() === bundleId);
        if (bundle) {
          // Add to collected bundles (with fixed position)
          setCollectedBundles(prev => {
            const newBundle = {
              id: bundle.id,
              left: bundle.landingSpot,
              rotation: bundle.rotation + (Math.random() * 20 - 10),
              scale: bundle.scale,
              bottom: Math.random() * 10,
              zIndex: Math.floor(Math.random() * 30) + prev.length,
              collected: true
            };
            
            return [...prev, newBundle];
          });
          
          // Remove from falling bundles
          setMoneyBundles(prev => prev.filter(b => b.id.toString() !== bundleId));
        }
      }
    };
    
    // Add event listener
    document.addEventListener('animationend', handleAnimationEnd);
    
    return () => {
      document.removeEventListener('animationend', handleAnimationEnd);
    };
  }, [money, bundleCount]);

  return (
    <div ref={containerRef} className="relative w-full h-96 bg-gradient-to-b from-blue-100 to-blue-200 overflow-hidden rounded-lg shadow-xl">
      {/* Price display in the background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-6xl font-bold text-green-800 opacity-30">
          {money.toLocaleString()}  {currency}
        </div>
      </div>
      
      {/* Ground/floor */}
      <div className="absolute bottom-0 w-full h-20 bg-gradient-to-t from-green-800 to-green-700 border-t-4 border-green-900"></div>
      
      {/* Falling money bundles */}
      {moneyBundles.map((bundle) => (
        <div
          key={`falling-${bundle.id}`}
          className="absolute"
          data-id={bundle.id}
          style={{
            left: `${bundle.left}%`,
            top: '-50px',
            animation: `
              fall-${bundle.id} ${bundle.fallSpeed}s ease-in ${bundle.delay}s forwards,
              wave-${bundle.id} ${bundle.waveSpeed}s ease-in-out ${bundle.delay}s infinite alternate
            `,
            transform: `rotate(${bundle.rotation}deg) scale(${bundle.scale})`,
            zIndex: Math.floor(bundle.scale * 10),
          }}
        >
          {/* Money image instead of CSS-styled bundle */}
          <img 
            src="https://freepngimg.com/save/webp/135380-currency-bundle-banknote-free-transparent-image-hq" 
            alt="Money bundle" 
            className="w-20 h-12 object-contain"
            // In a real app, you would use:
            // src="/src/money.jpg" 
          />
          
          {/* Add keyframes dynamically for each bundle */}
          <style>
            {`
              @keyframes fall-${bundle.id} {
                0% { top: -50px; }
                100% { top: calc(100% - 40px); left: ${bundle.landingSpot}%; }
              }
              
              @keyframes wave-${bundle.id} {
                0% { 
                  transform: translateX(-${bundle.waveFactor * 20}px) rotate(${bundle.rotation}deg) scale(${bundle.scale});
                }
                50% {
                  transform: translateX(${bundle.waveFactor * 15}px) rotate(${bundle.rotation + 5}deg) scale(${bundle.scale});
                }
                100% { 
                  transform: translateX(-${bundle.waveFactor * 10}px) rotate(${bundle.rotation - 3}deg) scale(${bundle.scale});
                }
              }
            `}
          </style>
        </div>
      ))}
      
      {/* Collected bundles on the ground (static, no animation) */}
      <div className="absolute bottom-0 left-0 right-0 h-20 overflow-hidden">
        {collectedBundles.map((bundle) => (
          <div
            key={`collected-${bundle.id}`}
            className="absolute"
            style={{
              left: `${bundle.left}%`,
              bottom: `${bundle.bottom}px`,
              transform: `rotate(${bundle.rotation}deg) scale(${bundle.scale})`,
              zIndex: bundle.zIndex,
            }}
          >
            {/* Money image for collected bundles */}
            <img 
              src='https://freepngimg.com/save/webp/135380-currency-bundle-banknote-free-transparent-image-hq' 
              alt="Money bundle" 
              className="w-20 h-12 object-contain"
              // In a real app, you would use:
              // src="/src/money.jpg"
            />
          </div>
        ))}
      </div>
      
      {/* Stats display */}
      <div className="absolute top-4 right-4 bg-white bg-opacity-80 p-3 rounded-lg shadow-md">
        <div className="text-sm font-semibold text-gray-700">Total Amount</div>
        <div className="text-2xl font-bold text-green-600">{money.toLocaleString()} {currency}</div>
        <div className="text-xs text-gray-500">Collected: {collectedBundles.length}/{money}</div>
      </div>
    </div>
  );
};

export default MoneyWaterfall;