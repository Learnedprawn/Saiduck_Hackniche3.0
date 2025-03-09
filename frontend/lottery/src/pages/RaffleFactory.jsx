import React, { useState } from 'react';
import { Calendar, Clock, Tag, Users, Award } from 'lucide-react';
import { Link, useParams, Routes, Route } from 'react-router-dom';
import Winner from '../components/winner/winner';
import Aww from '../components/aww/aww';
// import InteractiveBackground from '../components/InteractiveBackground/InteractiveBackground';
const RaffleFactory = () => {
  // Sample lottery data - replace with your actual data
  const [lotteries, setLotteries] = useState([
    {
      id: 'RF-2025-001',
      //   id: 'Spring Jackpot',
      timeremaining: '2025-03-15T18:00:00',
      prizepool: '$10,000',
      entries: 245,
      fee: '$5.00',
      status: 'Close'
    },
    {
      id: 'RF-2025-002',
      //   id: 'Tech Gadget Giveaway',
      timeremaining: '2025-03-20T15:30:00',
      prizepool: 'Latest Smartphone',
      entries: 189,
      fee: '$2.50',
      status: 'Close'
    },
    {
      id: 'RF-2025-003',
      //   id: 'Vacation Getaway',
      timeremaining: '2025-04-01T12:00:00',
      prizepool: 'Trip to Hawaii',
      entries: 312,
      fee: '$10.00',
      status: 'Open'
    },
    {
      id: 'RF-2025-004',
      //   id: 'Weekly Cash Draw',
      timeremaining: '2025-03-10T20:00:00',
      prizepool: '$2,500',
      entries: 128,
      fee: '$1.00',
      status: 'Calculating'
    }
  ]);

  const [filter, setFilter] = useState('all');

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to handle joining a lottery
  const handleJoinLottery = (id) => {
    // Logic to handle joining would go here
    alert(`Joining lottery ${id}`);
  };

  // Filter lotteries by status
  const filteredLotteries = filter === 'all'
    ? lotteries
    : lotteries.filter(lottery => lottery.status === filter);

  // Get unique categories for filter
  const categories = ['all', ...new Set(lotteries.map(lottery => lottery.status))];

  return (

    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="w-full flex justify-center">
        <div className="w-full max-w-4xl h-[40vh] md:h-[50vh] lg:h-[60vh]">
          
        </div>
      </div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Available Lotteries</h1>
        <p className="text-gray-600">Join exciting raffles and win amazing prizes!</p>
      </header>
      {/* <InteractiveBackground/> */}
      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        <span className="text-gray-700 font-medium mr-2">Filter by:</span>
        {categories.map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1 rounded-full text-sm ${filter === status ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            {status === 'all' ? 'All Categories' : status}
          </button>
        ))}
      </div>

      {/* Lottery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLotteries.map((lottery) => (
          <div key={lottery.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-5">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{lottery.id}</h2>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
                  <Tag size={12} className="mr-1" />
                  {lottery.status}
                </span>
              </div>

              <div className="flex items-center text-gray-600 mb-2">
                <Clock size={16} className="mr-2" />
                {formatDate(lottery.timeremaining)}
              </div>

              <div className="flex items-center text-gray-600 mb-2">
                <Users size={16} className="mr-2" />
                {lottery.entries} entries
              </div>

              <div className="flex items-center font-medium text-gray-800 mb-4">
                <Award size={16} className="mr-2" />
                Prize: {lottery.prizepool}
              </div>

              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-blue-600">{lottery.fee}</span>
                <button
                  onClick={() => handleJoinLottery(lottery.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  <Link
                    to={`/${lottery.id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    Join Now</Link>
                </button>
              </div>
            </div>

            <div className="bg-gray-50 px-5 py-2 border-t border-gray-100">
              <div className="flex items-center text-gray-500 text-sm">
                <span>Raffle ID: {lottery.id}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredLotteries.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No lotteries found in this status.</p>
        </div>
      )}
    </div>
  );
};

export default RaffleFactory;