import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axiosConfig';
import ReservationForm from './ReservationForm';
import ReservationConfirmation from './ReservationConfirmation';

function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reservationSuccess, setReservationSuccess] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`/events/${id}`);
        setEvent(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los detalles del evento');
        setLoading(false);
        console.error('Error fetching event:', err);
      }
    };

    fetchEvent();
  }, [id]);

  const handleReservationSuccess = (data) => {
    setReservationSuccess(data);
    // Actualizar la disponibilidad del evento (restar los tickets reservados)
    setEvent(prev => ({
      ...prev,
      available_tickets: prev.available_tickets - data.reservation.quantity
    }));
  };

  if (loading) return <div className="text-center py-8">Cargando detalles...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!event) return <div className="text-center py-8">Evento no encontrado</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Link to="/" className="text-blue-500 hover:underline mb-4 inline-block">
        ← Volver al listado
      </Link>

      <div className="border rounded-lg p-6 shadow-lg mb-6">
        <h1 className="text-3xl font-bold mb-2">{event.name}</h1>
        <p className="text-gray-600 mb-2">📅 {new Date(event.date).toLocaleDateString()}</p>
        <p className="text-gray-600 mb-2">📍 {event.place}</p>
        <p className="text-sm">
          🎟️ Disponibles: <span className="font-bold">{event.available_tickets}</span> / {event.total_tickets}
        </p>
      </div>

      {reservationSuccess ? (
        <ReservationConfirmation reservation={reservationSuccess.reservation} />
      ) : (
        <ReservationForm
          eventId={event.id}
          eventName={event.name}
          availableTickets={event.available_tickets}
          onReservationSuccess={handleReservationSuccess}
        />
      )}
    </div>
  );
}

export default EventDetail;
