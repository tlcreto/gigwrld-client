import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const BookingModal = ({ gig, onClose }) => {
  const [requirements, setRequirements] = useState('');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBooking = async () => {
    setLoading(true);
    try {
      const token = await getToken(); // From your AuthContext
      
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          gig_id: gig.id,
          requirements,
          deadline
        })
      });

      if (response.ok) {
        alert('Booking request sent successfully!');
        onClose();
      } else {
        throw new Error('Booking failed');
      }
    } catch (error) {
      alert('Error creating booking: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Book: {gig.title}</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Your Requirements</label>
          <textarea
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            rows={4}
            placeholder="Describe what you need..."
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Deadline</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleBooking}
            disabled={loading || !requirements || !deadline}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Booking...' : 'Confirm Booking'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default BookingModal;