# SmileCare - Sistema de Gestion para Clinicas Dentales

Sistema completo para la gestion de clinicas dentales que incluye agenda de citas, historias clinicas, planes de tratamiento y mas.

## Requisitos

- Node.js 18+
- PostgreSQL 16
- npm o yarn

## Estructura del Proyecto

```
dental-clinic/
├── backend/          # API NestJS
├── frontend/         # Aplicacion React + Vite
└── docs/             # Documentacion
```

## Instalacion y Configuracion

### 1. Clonar el repositorio

```bash
git clone <url-del-repo>
cd dental-clinic
```

### 2. Base de Datos

**Opcion A: Usar Docker (recomendado)**

```bash
cd backend
docker-compose up -d
```

**Opcion B: PostgreSQL local**

Crear una base de datos llamada `dental_clinic`:

```sql
CREATE DATABASE dental_clinic;
```

### 3. Configuracion del Backend

```bash
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno (opcional, ya tiene valores por defecto)
# El archivo .env ya esta configurado con:
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=dental_clinic
# DB_USER=postgres
# DB_PASSWORD=postgres

# Ejecutar en modo desarrollo
npm run start:dev

# En otra terminal, crear el usuario administrador inicial
npm run seed:admin
```

El backend estara disponible en: `http://localhost:3000`

### 4. Configuracion del Frontend

En una nueva terminal:

```bash
cd frontend

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

El frontend estara disponible en: `http://localhost:5173`

## Scripts Disponibles

### Backend

| Comando | Descripcion |
|---------|-------------|
| `npm run start:dev` | Inicia el servidor en modo desarrollo con hot-reload |
| `npm run start:prod` | Inicia el servidor en modo produccion |
| `npm run build` | Compila el proyecto |
| `npm run lint` | Ejecuta el linter |
| `npm run seed:admin` | Crea el usuario administrador inicial |

### Frontend

| Comando | Descripcion |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Compila para produccion |
| `npm run preview` | Vista previa de la build |
| `npm run lint` | Ejecuta el linter |

## Usuario por Defecto

Despues de ejecutar `npm run seed:admin` en el backend:

- **Usuario:** `admin`
- **Contrasena:** `admin123`

## Tecnologias

### Backend
- NestJS 10
- TypeScript
- TypeORM
- PostgreSQL
- JWT Authentication
- Swagger (documentacion API)

### Frontend
- React 19
- TypeScript
- Vite 8
- Tailwind CSS 4
- TanStack Query
- React Router v7

## API Documentation

Con el backend corriendo, acceder a: `http://localhost:3000/api`

## Licencia

Privado - Todos los derechos reservados
