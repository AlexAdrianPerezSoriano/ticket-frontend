import React, { useState } from 'react';
import axios from '../api/axiosConfig';

function ReservationForm({ eventId, eventName, availableTickets, onReservationSuccess }) {
  const [userName, setUserName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userName.trim()) {
      setError('Por favor ingresa tu nombre');
      return;
    }

    if (quantity < 1) {
      setError('La cantidad debe ser al menos 1');
      return;
    }

    if (quantity > availableTickets) {
      setError(`Solo hay ${availableTickets} tickets disponibles`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/reservations', {
        event_id: eventId,
        user_name: userName,
        quantity: parseInt(quantity),
      });

      onReservationSuccess(response.data);
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error al crear la reserva';
      setError(errorMsg);
      console.error('Reservation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">🎟️ Reservar Tickets</h2>
      <p className="text-gray-600 mb-4">
        Evento: <span className="font-semibold">{eventName}</span>
        <br />
        Disponibles: <span className="font-bold">{availableTickets}</span>
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="userName">
            Tu nombre:
          </label>
          <input
            type="text"
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: Juan Pérez"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="quantity">
            Cantidad de tickets:
          </label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="1"
            max={availableTickets}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Reservando...' : 'Confirmar Reserva'}
        </button>
      </form>
    </div>
  );
}

export default ReservationForm;
