# Plan de Implementación — Backend (API)

## Sistema de Gestión para Clínica Dental

---

## Tecnologías

- NestJS con TypeScript
- TypeORM como ORM
- PostgreSQL como base de datos
- JWT para autenticación
- Swagger para documentación de API
- s3-client-dtb (modo local) para manejo de archivos
- Docker para PostgreSQL

---

## Arquitectura General

Arquitectura modular por dominios funcionales con separación clara de capas:

- **Controller** → entrada HTTP, decoradores Swagger
- **Service** → lógica de negocio
- **Entity** → modelo de datos (TypeORM)
- **DTO** → validación de entrada (class-validator)
- **Guard** → control de acceso por rol

Cada módulo sigue esta estructura interna:

```
modules/
  nombre-modulo/
    controllers/
    services/
    dto/
    entities/
    guards/       (si aplica)
    strategies/   (si aplica)
```

---

## Estructura del Proyecto

```
backend/
  src/
    app.module.ts
    main.ts

    common/
      decorators/
        roles.decorator.ts
      guards/
        jwt-auth.guard.ts
        roles.guard.ts
      interceptors/
        audit.interceptor.ts
      filters/
        http-exception.filter.ts
      utils/
      enums/
        role.enum.ts
        appointment-status.enum.ts
        treatment-plan-status.enum.ts

    config/
      database/
        typeorm.config.ts
      env/
        env.validation.ts

    modules/
      auth/
      users/
      patients/
      doctors/
      appointments/
      clinical-records/
      clinical-evolutions/
      treatments/
      treatment-plans/
      performed-procedures/
      clinical-files/
      audit/
```

---

## Fases de Implementación

### Fase 0 — Infraestructura Base

**Objetivo:** tener el proyecto levantado y conectado a la base de datos.

**Tareas:**

1. Inicializar proyecto NestJS con TypeScript
2. Configurar docker-compose.yml con servicio PostgreSQL
3. Configurar TypeORM en NestJS (TypeOrmModule.forRootAsync)
4. Configurar variables de entorno con @nestjs/config y validación
5. Configurar Swagger en main.ts
6. Crear filtro global de excepciones HTTP
7. Crear estructura base de carpetas

**docker-compose.yml:**

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:16
    restart: always
    ports:
      - '5432:5432'
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

**Variables de entorno (.env):**

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dental_clinic
DB_USER=postgres
DB_PASSWORD=postgres

JWT_SECRET=secret_key
JWT_EXPIRATION=1d

UPLOAD_PATH=./uploads
```

---

### Fase 1 — Autenticación y Usuarios

**Entidades:**

```
users
├── id (UUID, PK)
├── username (VARCHAR, UNIQUE)
├── email (VARCHAR, UNIQUE)
├── password (VARCHAR, hashed)
├── full_name (VARCHAR)
├── role (ENUM: admin, doctor, receptionist)
├── is_active (BOOLEAN, default true)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

**Enum de roles:**

```typescript
export enum Role {
  ADMIN = 'admin',
  DOCTOR = 'doctor',
  RECEPTIONIST = 'receptionist',
}
```

**Endpoints — Auth:**

| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| POST | /auth/login | Login con username/email y contraseña | Público |
| POST | /auth/refresh | Renovar access token | Autenticado |
| GET | /auth/profile | Obtener perfil del usuario logueado | Autenticado |

**Endpoints — Users:**

| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| POST | /users | Crear usuario | Admin |
| GET | /users | Listar usuarios | Admin |
| GET | /users/:id | Obtener usuario | Admin |
| PATCH | /users/:id | Editar usuario | Admin |
| DELETE | /users/:id | Desactivar usuario | Admin |

**DTOs:**

- LoginDto: username o email + password
- CreateUserDto: username, email, password, full_name, role
- UpdateUserDto: campos parciales

**Lógica clave:**

- Hashear contraseña con bcrypt al crear/actualizar usuario
- Validar credenciales contra hash almacenado
- Generar JWT con payload: { sub: userId, role, username }
- JwtAuthGuard: valida token en cada petición protegida
- RolesGuard: valida rol del usuario contra roles permitidos
- Decorator @Roles(...) para marcar endpoints con roles requeridos

---

### Fase 2 — Pacientes

**Entidad:**

```
patients
├── id (UUID, PK)
├── first_name (VARCHAR)
├── last_name (VARCHAR)
├── sex (ENUM: male, female, other)
├── date_of_birth (DATE)
├── phone (VARCHAR)
├── email (VARCHAR, nullable)
├── address (TEXT, nullable)
├── medical_history (TEXT, nullable)
├── allergies (TEXT, nullable)
├── medications (TEXT, nullable)
├── observations (TEXT, nullable)
├── is_active (BOOLEAN, default true)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

**Endpoints:**

| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| POST | /patients | Crear paciente | Admin, Receptionist |
| GET | /patients | Listar pacientes (paginado, filtros) | Autenticado |
| GET | /patients/:id | Detalle de paciente | Autenticado |
| PATCH | /patients/:id | Editar paciente | Admin, Receptionist |
| DELETE | /patients/:id | Desactivar paciente | Admin |
| GET | /patients/:id/full-profile | Detalle completo con historial | Autenticado |

**Filtros de búsqueda:** nombre, teléfono, email, estado. Paginación con page y limit.

---

### Fase 3 — Doctores

**Entidad:**

```
doctors
├── id (UUID, PK)
├── user_id (UUID, FK → users, nullable)
├── first_name (VARCHAR)
├── last_name (VARCHAR)
├── specialty (VARCHAR)
├── phone (VARCHAR)
├── email (VARCHAR)
├── license_number (VARCHAR)
├── is_active (BOOLEAN, default true)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

**Endpoints:**

| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| POST | /doctors | Crear doctor | Admin |
| GET | /doctors | Listar doctores | Autenticado |
| GET | /doctors/:id | Detalle de doctor | Autenticado |
| PATCH | /doctors/:id | Editar doctor | Admin |
| DELETE | /doctors/:id | Desactivar doctor | Admin |

---

### Fase 4 — Citas

**Entidad:**

```
appointments
├── id (UUID, PK)
├── patient_id (UUID, FK → patients)
├── doctor_id (UUID, FK → doctors)
├── date_time (TIMESTAMP)
├── duration_minutes (INT, default 30)
├── status (ENUM: scheduled, confirmed, in_progress, attended, cancelled, no_show)
├── reason (TEXT, nullable)
├── notes (TEXT, nullable)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

**Enum de estados:**

```typescript
export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  ATTENDED = 'attended',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}
```

**Endpoints:**

| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| POST | /appointments | Crear cita | Admin, Receptionist |
| GET | /appointments | Listar citas (filtros) | Autenticado |
| GET | /appointments/:id | Detalle de cita | Autenticado |
| PATCH | /appointments/:id | Editar cita | Admin, Receptionist |
| PATCH | /appointments/:id/status | Cambiar estado | Autenticado |
| PATCH | /appointments/:id/reschedule | Reprogramar cita | Admin, Receptionist |
| DELETE | /appointments/:id | Cancelar cita | Admin, Receptionist |
| GET | /appointments/agenda | Agenda por día/semana/mes | Autenticado |

**Regla de negocio crítica:** validar que no exista otra cita para el mismo doctor en el rango de horario (date_time + duration_minutes). Implementar como validación en el service antes de crear o reprogramar.

**Filtros:** doctor_id, status, rango de fechas. Paginación con page y limit.

---

### Fase 5 — Expediente Clínico

**Entidad:**

```
clinical_records
├── id (UUID, PK)
├── patient_id (UUID, FK → patients, UNIQUE)
├── medical_background (TEXT, nullable)
├── dental_background (TEXT, nullable)
├── consultation_reason (TEXT, nullable)
├── diagnosis (TEXT, nullable)
├── observations (TEXT, nullable)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

**Endpoints:**

| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| POST | /clinical-records | Crear expediente | Doctor, Admin |
| GET | /clinical-records/patient/:patientId | Consultar expediente por paciente | Autenticado |
| PATCH | /clinical-records/:id | Actualizar expediente | Doctor, Admin |

**Nota:** relación uno a uno con paciente (un paciente, un expediente).

---

### Fase 6 — Evolución Clínica

**Entidad:**

```
clinical_evolutions
├── id (UUID, PK)
├── clinical_record_id (UUID, FK → clinical_records)
├── doctor_id (UUID, FK → doctors)
├── date (TIMESTAMP)
├── consultation_reason (TEXT)
├── findings (TEXT)
├── diagnosis (TEXT)
├── procedure_performed (TEXT)
├── recommendations (TEXT, nullable)
├── observations (TEXT, nullable)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

**Endpoints:**

| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| POST | /clinical-evolutions | Registrar evolución | Doctor |
| GET | /clinical-evolutions | Listar evoluciones (filtros) | Autenticado |
| GET | /clinical-evolutions/:id | Detalle de evolución | Autenticado |
| GET | /clinical-evolutions/record/:recordId | Evoluciones por expediente | Autenticado |

---

### Fase 7 — Catálogo de Tratamientos

**Entidad:**

```
treatments
├── id (UUID, PK)
├── name (VARCHAR)
├── description (TEXT, nullable)
├── category (VARCHAR)
├── default_price (DECIMAL, nullable)
├── is_active (BOOLEAN, default true)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

**Endpoints:**

| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| POST | /treatments | Crear tratamiento | Admin |
| GET | /treatments | Listar tratamientos | Autenticado |
| GET | /treatments/:id | Detalle de tratamiento | Autenticado |
| PATCH | /treatments/:id | Editar tratamiento | Admin |
| PATCH | /treatments/:id/toggle | Activar/desactivar | Admin |

---

### Fase 8 — Planes de Tratamiento

**Entidades:**

```
treatment_plans
├── id (UUID, PK)
├── patient_id (UUID, FK → patients)
├── doctor_id (UUID, FK → doctors)
├── status (ENUM: pending, in_progress, completed, cancelled)
├── observations (TEXT, nullable)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

treatment_plan_items
├── id (UUID, PK)
├── treatment_plan_id (UUID, FK → treatment_plans)
├── treatment_id (UUID, FK → treatments)
├── tooth (VARCHAR, nullable)
├── notes (TEXT, nullable)
├── status (ENUM: pending, in_progress, completed, cancelled)
├── order (INT)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

**Endpoints:**

| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| POST | /treatment-plans | Crear plan | Doctor, Admin |
| GET | /treatment-plans | Listar planes | Autenticado |
| GET | /treatment-plans/:id | Detalle de plan con ítems | Autenticado |
| PATCH | /treatment-plans/:id | Editar plan | Doctor, Admin |
| PATCH | /treatment-plans/:id/status | Cambiar estado del plan | Doctor, Admin |
| POST | /treatment-plans/:id/items | Agregar procedimiento al plan | Doctor, Admin |
| PATCH | /treatment-plans/:id/items/:itemId | Editar ítem | Doctor, Admin |
| DELETE | /treatment-plans/:id/items/:itemId | Eliminar ítem | Doctor, Admin |

---

### Fase 9 — Procedimientos Realizados

**Entidad:**

```
performed_procedures
├── id (UUID, PK)
├── patient_id (UUID, FK → patients)
├── doctor_id (UUID, FK → doctors)
├── treatment_id (UUID, FK → treatments)
├── treatment_plan_item_id (UUID, FK → treatment_plan_items, nullable)
├── tooth (VARCHAR, nullable)
├── description (TEXT, nullable)
├── notes (TEXT, nullable)
├── performed_at (TIMESTAMP)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

**Endpoints:**

| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| POST | /performed-procedures | Registrar procedimiento | Doctor |
| GET | /performed-procedures | Listar procedimientos (filtros) | Autenticado |
| GET | /performed-procedures/:id | Detalle de procedimiento | Autenticado |

**Filtros:** patient_id, doctor_id, rango de fechas. Paginación.

---

### Fase 10 — Archivos Clínicos

**Entidad:**

```
clinical_files
├── id (UUID, PK)
├── patient_id (UUID, FK → patients)
├── clinical_evolution_id (UUID, FK → clinical_evolutions, nullable)
├── file_name (VARCHAR)
├── file_key (VARCHAR)
├── file_type (VARCHAR)
├── mime_type (VARCHAR)
├── file_size (INT)
├── uploaded_by (UUID, FK → users)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

**Integración con s3-client-dtb:**

Se creará un `FileStorageService` que encapsule el paquete en modo local:

```typescript
@Injectable()
export class FileStorageService {
  private client: S3ClientDtb;

  constructor(private configService: ConfigService) {
    this.client = new S3ClientDtb({
      mode: 'local',
      localPath: configService.get('UPLOAD_PATH'),
    });
  }

  async upload(file: Express.Multer.File): Promise<UploadResult> { ... }
  async delete(fileKey: string): Promise<void> { ... }
  async getUrl(fileKey: string): Promise<string> { ... }
}
```

**Endpoints:**

| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| POST | /clinical-files/upload | Subir archivo | Doctor, Admin |
| GET | /clinical-files | Listar archivos (filtros) | Autenticado |
| GET | /clinical-files/:id | Detalle de archivo | Autenticado |
| GET | /clinical-files/:id/download | Descargar archivo | Autenticado |
| DELETE | /clinical-files/:id | Eliminar archivo | Admin |

**Tipos permitidos:** imágenes (jpg, png), PDF, documentos clínicos.

---

### Fase 11 — Auditoría

**Entidad:**

```
audit_logs
├── id (UUID, PK)
├── user_id (UUID, FK → users)
├── action (VARCHAR)
├── module (VARCHAR)
├── entity_id (VARCHAR, nullable)
├── detail (JSONB, nullable)
├── ip_address (VARCHAR, nullable)
├── created_at (TIMESTAMP)
```

**Implementación:** interceptor global de NestJS que registre automáticamente las acciones de escritura (POST, PATCH, DELETE) en todos los módulos.

**Endpoints:**

| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| GET | /audit-logs | Listar eventos (filtros) | Admin |
| GET | /audit-logs/:id | Detalle de evento | Admin |

**Filtros:** user_id, action, module, rango de fechas. Paginación.

---

### Fase 12 — Dashboard

**Endpoints:**

| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| GET | /dashboard/summary | Métricas generales del día | Autenticado |
| GET | /dashboard/appointments-by-status | Citas agrupadas por estado | Autenticado |
| GET | /dashboard/doctor-workload | Carga por doctor | Autenticado |
| GET | /dashboard/treatments-summary | Resumen de tratamientos | Autenticado |
| GET | /dashboard/recent-activity | Actividad reciente | Autenticado |

**Métricas del summary:**

- Citas del día
- Pacientes atendidos (hoy)
- Pacientes nuevos (últimos 30 días)
- Tratamientos en proceso
- Tratamientos terminados
- Cancelaciones (últimos 30 días)

---

## Diagrama de Relaciones (Resumen)

```
users ──────────────── doctors (user_id, nullable)
                            │
patients ──── clinical_records ──── clinical_evolutions
    │              │                       │
    │              │                  clinical_files
    │              │
    ├── appointments (patient_id + doctor_id)
    │
    ├── treatment_plans ──── treatment_plan_items ──── treatments
    │
    ├── performed_procedures (patient_id + doctor_id + treatment_id)
    │
    └── clinical_files (patient_id)

audit_logs ──── users (user_id)
```

---

## Configuración de Swagger

Swagger se configura en `main.ts` con agrupación por tags (uno por módulo). Cada controller usa `@ApiTags('nombre-modulo')` y cada endpoint se documenta con `@ApiOperation`, `@ApiResponse`, `@ApiBearerAuth`.

---

## Convenciones

- Nombres de tablas: snake_case en plural
- Nombres de columnas: snake_case
- IDs: UUID v4 generados por la base de datos
- Timestamps: created_at y updated_at en todas las entidades
- Soft delete: campo is_active (no se borran registros)
- Paginación: query params `page` y `limit` con valores por defecto
- Respuestas: formato consistente `{ data, meta? }` donde meta incluye paginación
- Errores: formato consistente `{ statusCode, message, error }`
