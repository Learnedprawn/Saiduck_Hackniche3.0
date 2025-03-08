import React, { useState, useEffect } from 'react';

const AddRaffel = () => {
  // State for inputs
  const [interval, setInterval] = useState(1000); // Default: 1 second (in ms)
  const [prizeMoney, setPrizeMoney] = useState(10000); // Default: $10,000
  
  // State for processing
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedAmount, setProcessedAmount] = useState(0);
  const [processHistory, setProcessHistory] = useState([]);
  const [timer, setTimer] = useState(null);
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isProcessing) {
      // Stop processing
      clearInterval(timer);
      setIsProcessing(false);
      setTimer(null);
    } else {
      // Start processing
      setProcessedAmount(0);
      setProcessHistory([]);
      startProcessing();
    }
  };
  
  // Start the processing interval
  const startProcessing = () => {
    const newTimer = setInterval(() => {
      // Calculate amount to process this interval
      // This is a simple example algorithm - you could make this more complex
      const amountThisInterval = prizeMoney * 0.1;
      
      setProcessedAmount(prev => {
        const newTotal = Math.min(prev + amountThisInterval, prizeMoney);
        
        // Add to history
        const timestamp = new Date().toLocaleTimeString();
        setProcessHistory(prev => [
          ...prev,
          { 
            timestamp,
            amount: amountThisInterval,
            total: newTotal,
            percentage: (newTotal / prizeMoney * 100).toFixed(1)
          }
        ]);
        
        // Check if processing is complete
        if (newTotal >= prizeMoney) {
          clearInterval(timer);
          setIsProcessing(false);
        }
        
        return newTotal;
      });
    }, interval);
    
    setTimer(newTimer);
    setIsProcessing(true);
  };
  
  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timer]);
  
  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Prize Money Processor</h1>
      
      {/* Input Form */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Interval (milliseconds):
            </label>
            <input
              type="number"
              min="100"
              step="100"
              value={interval}
              onChange={(e) => setInterval(Number(e.target.value))}
              disabled={isProcessing}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              {(interval / 1000).toFixed(1)} second(s) between each processing step
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prize Money ($):
            </label>
            <input
              type="number"
              min="100"
              step="100"
              value={prizeMoney}
              onChange={(e) => setPrizeMoney(Number(e.target.value))}
              disabled={isProcessing}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <button
          type="submit"
          className={`px-4 py-2 rounded-md text-white font-medium ${
            isProcessing 
              ? 'bg-red-600 hover:bg-red-700' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isProcessing ? 'Stop Processing' : 'Start Processing'}
        </button>
      </form>
      
      {/* Progress Display */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">Processing Progress</h2>
        <div className="w-full bg-gray-200 rounded-full h-6 mb-2">
          <div 
            className="bg-green-600 h-6 rounded-full transition-all duration-500"
            style={{ width: `${(processedAmount / prizeMoney) * 100}%` }}
          >
          </div>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>${processedAmount.toLocaleString()}</span>
          <span>{((processedAmount / prizeMoney) * 100).toFixed(1)}%</span>
          <span>${prizeMoney.toLocaleString()}</span>
        </div>
      </div>
      
      {/* Processing History */}
      <div>
        <h2 className="text-xl font-semibold mb-2 text-gray-700">Processing History</h2>
        {processHistory.length === 0 ? (
          <p className="text-gray-500 italic">No processing history yet.</p>
        ) : (
          <div className="border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {processHistory.map((record, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">{record.timestamp}</td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">${record.amount.toLocaleString()}</td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">${record.total.toLocaleString()}</td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-green-600">{record.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddRaffel;