import React from 'react';
import { Link } from 'react-router-dom';

function ReservationConfirmation({ reservation }) {
  return (
    <div className="max-w-md mx-auto p-6 border-2 border-green-500 rounded-lg bg-green-50 text-center">
      <div className="text-5xl mb-4">✅</div>
      <h2 className="text-2xl font-bold text-green-700 mb-3">¡Reserva Exitosa!</h2>
      <div className="text-left space-y-2">
        <p><span className="font-semibold">Nombre:</span> {reservation.user_name}</p>
        <p><span className="font-semibold">Cantidad:</span> {reservation.quantity}</p>
        <p><span className="font-semibold">Fecha:</span> {new Date(reservation.reservation_date).toLocaleString()}</p>
      </div>
      <div className="mt-6">
        <Link
          to="/"
          className="inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
        >
          Volver al listado
        </Link>
      </div>
    </div>
  );
}

export default ReservationConfirmation;
