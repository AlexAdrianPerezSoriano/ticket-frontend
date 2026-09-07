# 🎟️ Ticket Reservation System - Frontend

## 📌 Descripción
Interfaz de usuario para el sistema de reserva de tickets. Permite ver eventos, reservar tickets y gestionar eventos (solo admin). Desarrollado con React, Vite y TailwindCSS.

## 🚀 Tecnologías
- React (v18)
- Vite (v8)
- TailwindCSS (v4)
- Axios (Consumo de API)
- React Router (Navegación)
- Docker (Contenerización)

---

## 📦 Instalación y Ejecución

### Opción 1: Con Docker (Recomendado)
git clone https://github.com/AlexAdrianPerezSoriano/ticket-frontend.git
cd ticket-frontend
docker compose up --build

### Opción 2: Desarrollo local
npm install
npm run dev      # Desarrollo
npm run build    # Construir para producción
npm run preview  # Vista previa de producción

---

## 🔧 Variables de Entorno (.env)
VITE_API_URL=http://localhost:5000

En producción: Cambiar por URL del backend desplegado.

---

## 👥 Roles y Permisos

Acción                  | Usuario Estándar | Administrador
------------------------|------------------|---------------
Ver eventos             | ✅               | ✅
Ver detalles            | ✅               | ✅
Reservar tickets        | ✅               | ✅
Crear eventos           | ❌               | ✅
Editar eventos          | ❌               | ✅
Eliminar eventos        | ❌               | ✅

---

## 👥 Credenciales de Prueba

### Administrador
Email: admin@example.com
Contraseña: admin123

### Usuario Estándar
Email: user@example.com
Contraseña: user123

---

## 🖥️ Funcionalidades

### Usuario no autenticado
- Registrarse
- Iniciar sesión

### Usuario autenticado
- Ver lista de eventos
- Filtrar eventos (ciudad, fecha, disponibilidad)
- Ver detalles de evento
- Reservar tickets
- Ver confirmación de reserva
- Cerrar sesión

### Administrador (adicional)
- Crear eventos
- Editar eventos
- Eliminar eventos

---

## 🗂️ Estructura del Proyecto

frontend/
├── src/
│   ├── api/
│   │   └── axiosConfig.js     # Configuración de Axios
│   ├── components/
│   │   ├── EventList.jsx      # Lista de eventos con filtros
│   │   ├── EventDetail.jsx    # Detalle de evento
│   │   ├── ReservationForm.jsx # Formulario de reserva
│   │   ├── ReservationConfirmation.jsx # Confirmación
│   │   └── ProtectedRoute.jsx # Protección de rutas
│   ├── context/
│   │   └── AuthContext.jsx    # Contexto de autenticación
│   ├── pages/
│   │   ├── Home.jsx           # Página principal
│   │   ├── Login.jsx          # Inicio de sesión
│   │   ├── Register.jsx       # Registro de usuario
│   │   └── EventPage.jsx      # Página de evento
│   ├── App.jsx
│   └── main.jsx
├── public/
├── Dockerfile
├── docker-compose.yml
└── package.json

---

## 🐳 Dockerización
docker compose up --build

Servicios:
- frontend: React + Nginx
- backend: Node.js + Express
- db: MySQL 8.4

---

## 🌐 Despliegue en Producción
Frontend: https://ticket-frontend-app.vercel.app
Backend API: https://ticket-backend-7eva.onrender.com

---

## 📸 Capturas de Pantalla
(Pendiente de agregar)

---

## 📝 Autor
Alex Pérez Soriano
https://www.linkedin.com/in/alexperezsoriano/

## 📅 Fecha
Septiembre 2026

## 📄 Licencia
Este proyecto fue desarrollado como prueba técnica para el Centro Tecnológico Guayaquil.