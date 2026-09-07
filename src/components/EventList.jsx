import React, { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function EventList() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estados para los filtros
  const [filters, setFilters] = useState({
    place: '',
    startDate: '',
    endDate: '',
    onlyAvailable: false
  });

  // Estados para el CRUD de eventos (solo admin)
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    place: '',
    total_tickets: 100,
    available_tickets: 100
  });

  // Cargar eventos al montar el componente
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/events');
        setEvents(response.data);
        setFilteredEvents(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los eventos. Asegúrate de que el backend esté corriendo.');
        setLoading(false);
        console.error('Error fetching events:', err);
      }
    };

    fetchEvents();
  }, []);

  // Aplicar filtros cada vez que cambian los filtros o los eventos
  useEffect(() => {
    let result = [...events];

    // Filtrar por lugar (búsqueda por texto)
    if (filters.place.trim()) {
      const searchTerm = filters.place.toLowerCase().trim();
      result = result.filter(event => 
        event.place.toLowerCase().includes(searchTerm)
      );
    }

    // Filtrar por fecha de inicio
    if (filters.startDate) {
      const start = new Date(filters.startDate);
      result = result.filter(event => new Date(event.date) >= start);
    }

    // Filtrar por fecha de fin
    if (filters.endDate) {
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59);
      result = result.filter(event => new Date(event.date) <= end);
    }

    // Filtrar por disponibilidad (solo eventos con tickets disponibles)
    if (filters.onlyAvailable) {
      result = result.filter(event => event.available_tickets > 0);
    }

    setFilteredEvents(result);
  }, [events, filters]);

  // Manejar cambio en los filtros
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Limpiar filtros
  const clearFilters = () => {
    setFilters({
      place: '',
      startDate: '',
      endDate: '',
      onlyAvailable: false
    });
  };

  // 🔥 FUNCIONES CRUD PARA ADMINISTRADORES

  // Abrir formulario de edición
  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      name: event.name,
      date: event.date.split('T')[0],
      place: event.place,
      total_tickets: event.total_tickets,
      available_tickets: event.available_tickets
    });
    setShowCreateForm(true);
  };

  // Eliminar evento
  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este evento?')) return;
    try {
      await axios.delete(`/events/${id}`);
      setEvents(events.filter(e => e.id !== id));
      setFilteredEvents(filteredEvents.filter(e => e.id !== id));
      alert('✅ Evento eliminado correctamente');
    } catch (error) {
      alert('❌ Error al eliminar el evento');
      console.error(error);
    }
  };

  // Crear o actualizar evento
  const handleSubmitEvent = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        // Editar evento
        const response = await axios.put(`/events/${editingEvent.id}`, formData);
        setEvents(events.map(e => e.id === editingEvent.id ? response.data : e));
        setFilteredEvents(filteredEvents.map(e => e.id === editingEvent.id ? response.data : e));
        alert('✅ Evento actualizado correctamente');
      } else {
        // Crear evento
        const response = await axios.post('/events', formData);
        setEvents([...events, response.data]);
        setFilteredEvents([...filteredEvents, response.data]);
        alert('✅ Evento creado correctamente');
      }
      setShowCreateForm(false);
      setEditingEvent(null);
      setFormData({ name: '', date: '', place: '', total_tickets: 100, available_tickets: 100 });
    } catch (error) {
      alert('❌ Error al guardar el evento');
      console.error(error);
    }
  };

  // Estados de carga y error
  if (loading) return <div className="text-center py-8">Cargando eventos...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">🎫 Eventos Disponibles</h1>

      {/* 🔥 BOTÓN CREAR EVENTO (SOLO ADMIN) */}
      {user?.role === 'admin' && (
        <div className="text-center mb-4">
          <button
            onClick={() => {
              setShowCreateForm(true);
              setEditingEvent(null);
              setFormData({ name: '', date: '', place: '', total_tickets: 100, available_tickets: 100 });
            }}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition"
          >
            ➕ Crear Nuevo Evento
          </button>
        </div>
      )}

      {/* SECCIÓN DE FILTROS */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Filtro por lugar */}
          <div>
            <label className="block text-sm font-medium mb-1">📍 Ingrese Nombre de la Ciudad</label>
            <input
              type="text"
              name="place"
              value={filters.place}
              onChange={handleFilterChange}
              placeholder="Ej: Guayaquil"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filtro por fecha de inicio */}
          <div>
            <label className="block text-sm font-medium mb-1">📅 Fecha desde</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filtro por fecha de fin */}
          <div>
            <label className="block text-sm font-medium mb-1">📅 Fecha Hasta</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filtro por disponibilidad + botón limpiar */}
          <div className="flex flex-col">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="onlyAvailable"
                checked={filters.onlyAvailable}
                onChange={handleFilterChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium">🎟️ Solo disponibles</span>
            </label>
            <button
              onClick={clearFilters}
              className="mt-2 text-sm text-blue-500 hover:text-blue-700 hover:underline"
            >
              Limpiar filtros
            </button>
          </div>
        </div>

        {/* Contador de eventos */}
        <div className="mt-3 text-sm text-gray-500">
          Mostrando {filteredEvents.length} de {events.length} eventos
        </div>
      </div>

      {/* LISTA DE EVENTOS FILTRADOS */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No hay eventos que coincidan con los filtros seleccionados.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <div key={event.id} className="border rounded-lg p-4 shadow-md hover:shadow-lg transition relative">
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

              {/* 🔥 BOTONES DE ADMIN (SOLO VISIBLES PARA ADMIN) */}
              {user?.role === 'admin' && (
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(event)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition text-sm"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 🔥 MODAL DE CREACIÓN/EDICIÓN DE EVENTOS (SOLO ADMIN) */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">
              {editingEvent ? '✏️ Editar Evento' : '➕ Crear Evento'}
            </h2>
            <form onSubmit={handleSubmitEvent}>
              <div className="mb-3">
                <label className="block text-sm font-medium">Nombre del Evento</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium">Fecha</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium">Lugar</label>
                <input
                  type="text"
                  value={formData.place}
                  onChange={(e) => setFormData({...formData, place: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium">Total de Tickets</label>
                <input
                  type="number"
                  value={formData.total_tickets}
                  onChange={(e) => setFormData({
                    ...formData,
                    total_tickets: parseInt(e.target.value),
                    available_tickets: parseInt(e.target.value)
                  })}
                  className="w-full px-3 py-2 border rounded"
                  required
                  min="1"
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingEvent(null);
                  }}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  {editingEvent ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventList;