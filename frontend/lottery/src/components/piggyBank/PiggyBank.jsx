import React, { useState, useEffect } from 'react';

const PiggyBankVisualization = (props) => {
  // These would be props in a real application
  const [totalPricePool, setTotalPricePool] = useState(props.price);
  const [numberOfParticipants, setNumberOfParticipants] = useState(props.number);
  const [animationComplete, setAnimationComplete] = useState(false);
  
  // For demo purposes, add controls to change values
  const handlePoolChange = (e) => {
    setTotalPricePool(Number(e.target.value));
    setAnimationComplete(false);
  };
  
  const handleParticipantsChange = (e) => {
    setNumberOfParticipants(Number(e.target.value));
    setAnimationComplete(false);
  };
  
  // Animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [totalPricePool, numberOfParticipants]);
  
  // Calculate amount per participant
  const amountPerParticipant = totalPricePool / (numberOfParticipants || 1);
  
  // Generate coins (limited to a reasonable number for visualization)
  const maxVisibleCoins = Math.min(numberOfParticipants, 50);
  const coins = Array.from({ length: maxVisibleCoins }, (_, i) => i);

  return (
    <div className="flex flex-col items-center p-6 max-w-lg mx-auto bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-pink-600 mb-6">Piggy Bank Prize Pool</h2>
      
      
      
      <div className="flex justify-center items-center mb-8 w-full">
        <div className="relative w-64 h-64">
          {/* Piggy Bank */}
          <div className="absolute w-full h-full">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {/* Body */}
              <ellipse cx="100" cy="120" rx="70" ry="55" fill="#ffb6c1" />
              {/* Head */}
              <ellipse cx="160" cy="95" rx="25" ry="30" fill="#ffb6c1" />
              {/* Ears */}
              <ellipse cx="175" cy="75" rx="10" ry="12" fill="#ffb6c1" />
              {/* Nose */}
              <ellipse cx="185" cy="95" rx="8" ry="6" fill="#ff69b4" />
              {/* Legs */}
              <rect x="70" y="165" width="12" height="20" rx="6" fill="#ffb6c1" />
              <rect x="120" y="165" width="12" height="20" rx="6" fill="#ffb6c1" />
              {/* Slot */}
              <rect x="90" y="85" width="30" height="5" rx="2" fill="#7d4b4b" />
              {/* Eye */}
              <circle cx="165" cy="85" r="5" fill="#000" />
            </svg>
          </div>
          
          {/* Coins */}
          <div className="absolute w-full h-full overflow-hidden">
            {coins.map((coin, index) => {
              // Calculate positions for coins to appear to fill the piggy bank
              const delay = (index * 50) % 1000;
              const xPos = 60 + (index % 7) * 12;
              const yPos = animationComplete 
                ? 140 - Math.floor(index / 7) * 10 
                : -20;
              const size = 12 + Math.random() * 8;
              
              return (
                <div 
                  key={index}
                  className="absolute bg-yellow-400 rounded-full border-2 border-yellow-500 shadow-md z-10"
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    left: `${xPos}px`,
                    top: animationComplete ? `${yPos}px` : '-20px',
                    transition: `top 1s ease-in ${delay}ms`,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
      
 
    </div>
  );
};

export default PiggyBankVisualization;