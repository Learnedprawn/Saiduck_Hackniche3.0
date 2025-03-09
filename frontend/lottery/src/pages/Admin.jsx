import React, { useState } from 'react';

const AddRaffle = () => {
  const [interval, setInterval] = useState(1000);
  const [money, setMoney] = useState(10000);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Processing with:', { interval, money });
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Interval (ms):</label>
          <input
            type="number"
            value={interval}
            onChange={(e) => setInterval(Number(e.target.value))}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Prize Money ($):</label>
          <input
            type="number"
            value={money}
            onChange={(e) => setMoney(Number(e.target.value))}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button type="submit" className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddRaffle;