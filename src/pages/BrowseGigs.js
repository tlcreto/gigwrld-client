import Test from '../components/Test';
import BookingModal from '../pages/BookingModal';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';


const BrowseGigs = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    search: ''
  });

  useEffect(() => {
    fetchGigs();
  }, [filters]);

  const fetchGigs = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
      if (filters.search) queryParams.append('search', filters.search);

      const response = await fetch(`http://localhost:5000/api/gigs?${queryParams}`);
      const data = await response.json();
      setGigs(data);
    } catch (error) {
      console.error('Error fetching gigs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading gigs...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-4">Find Perfect Gigs</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search gigs..."
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
            className="px-4 py-2 border rounded-lg"
          />
          <select
            value={filters.category}
            onChange={(e) => setFilters({...filters, category: e.target.value})}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">All Categories</option>
            <option value="design">Design</option>
            <option value="development">Development</option>
            <option value="writing">Writing</option>
            <option value="marketing">Marketing</option>
          </select>
          <input
            type="number"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
            className="px-4 py-2 border rounded-lg"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
            className="px-4 py-2 border rounded-lg"
          />
        </div>
      </div>

      {/* Gigs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gigs.map((gig) => (
          <GigCard key={gig.id} gig={gig} />
        ))}
      </div>
    </div>
  );
};

const GigCard = ({ gig }) => {
  const [showBookingModal, setShowBookingModal] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{gig.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{gig.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-green-600">P{gig.price}</span>
          <span className="text-sm text-gray-500">{gig.delivery_time} days delivery</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
              <span className="text-sm font-bold text-blue-600">
                {gig.user?.full_name?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <span className="text-sm text-gray-600">{gig.user?.full_name}</span>
          </div>
          
          <button
            onClick={() => setShowBookingModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Book Now
          </button>
        </div>
      </div>

      {showBookingModal && (
        <BookingModal gig={gig} onClose={() => setShowBookingModal(false)} />
      )}
    </div>
  );
};

export default BrowseGigs;