import React, { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';
import { Link } from 'react-router-dom';

function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/events');
        setEvents(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los eventos. Asegúrate de que el backend esté corriendo.');
        setLoading(false);
        console.error('Error fetching events:', err);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <div className="text-center py-8">Cargando eventos...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">🎫 Eventos Disponibles</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <div key={event.id} className="border rounded-lg p-4 shadow-md hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2">{event.name}</h2>
            <p className="text-gray-600 mb-1">📅 {new Date(event.date).toLocaleDateString()}</p>
            <p className="text-gray-600 mb-1">📍 {event.place}</p>
            <p className="text-sm mb-3">
              🎟️ Disponibles: <span className="font-bold">{event.available_tickets}</span> / {event.total_tickets}
            </p>
            <Link
              to={`/event/${event.id}`}
              className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Ver detalles
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventList;
