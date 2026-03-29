# Plan de Implementación — Frontend

## Sistema de Gestión para Clínica Dental

---

## Tecnologías

- React con TypeScript
- Tailwind CSS para estilos
- React Router DOM con HashRouter
- Context API para estado global (auth, tema)
- TanStack Query para estado del servidor y caché
- Recharts para gráficas del dashboard

---

## Arquitectura General

Organización modular por dominio funcional. Cada módulo es autocontenido con sus propias vistas, componentes, hooks, servicios y tipos.

**Patrón obligatorio:** View → Hook → Service → API

```
View (componente de página)
  └── Hook (useXxx — lógica y estado)
        └── Service (funciones de negocio)
              └── API (llamadas HTTP al backend)
```

- La **View** solo renderiza UI y delega lógica al hook
- El **Hook** maneja estado local, llamadas a TanStack Query y lógica de presentación
- El **Service** transforma datos y aplica lógica de negocio del frontend
- La **API** hace las llamadas HTTP con fetch/axios y retorna datos tipados

---

## Estructura del Proyecto

```
frontend/
  src/
    app/
      router/
        index.tsx              # Definición de rutas con HashRouter
        ProtectedRoute.tsx     # Wrapper para rutas protegidas
      providers/
        AppProviders.tsx       # Composición de providers
        AuthProvider.tsx       # Context de autenticación
        QueryProvider.tsx      # TanStack Query provider
      layouts/
        MainLayout.tsx         # Layout con sidebar y header
        AuthLayout.tsx         # Layout para login

    shared/
      components/
        ui/                    # Componentes base (Button, Input, Modal, Table, etc.)
        feedback/              # Toast, Alert, Spinner, Empty state
        navigation/            # Sidebar, Header, Breadcrumbs
      hooks/
        useAuth.ts
        useDebounce.ts
        usePagination.ts
      utils/
        http.ts                # Cliente HTTP configurado (interceptores, token)
        format.ts              # Formateo de fechas, moneda, etc.
        validators.ts          # Validaciones reutilizables
      constants/
        api.ts                 # Base URL, endpoints
        roles.ts               # Enum de roles
        statuses.ts            # Enums de estados
      types/
        common.ts              # Tipos compartidos (Pagination, ApiResponse, etc.)
      styles/
        globals.css            # Estilos globales y configuración Tailwind

    modules/
      auth/
      dashboard/
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

## Estructura Interna de Cada Módulo

```
modules/nombre-modulo/
  views/
    NombreListView.tsx
    NombreDetailView.tsx
    NombreCreateView.tsx
    NombreEditView.tsx
  components/
    NombreTable.tsx
    NombreForm.tsx
    NombreCard.tsx
    NombreFilters.tsx
  hooks/
    useNombreList.ts
    useNombreDetail.ts
    useNombreCreate.ts
    useNombreEdit.ts
  validations/
    nombre.validations.ts
  data/
    nombre.constants.ts
  types/
    nombre.types.ts
  utils/
    nombre.utils.ts
  services/
    nombre.service.ts
    nombre.api.ts
  routes/
    nombre.routes.tsx
```

---

## Fases de Implementación

### Fase 0 — Infraestructura Base

**Objetivo:** proyecto React funcionando con enrutamiento, providers y cliente HTTP configurado.

**Tareas:**

1. Crear proyecto con Vite + React + TypeScript
2. Instalar y configurar Tailwind CSS
3. Instalar dependencias: react-router-dom, @tanstack/react-query, recharts, axios
4. Configurar HashRouter con rutas base
5. Crear AppProviders (QueryProvider + AuthProvider)
6. Crear MainLayout con sidebar y header
7. Crear AuthLayout para pantalla de login
8. Configurar cliente HTTP (axios) con interceptor para JWT
9. Crear componentes UI base: Button, Input, Select, Modal, Table, Spinner, Toast
10. Definir tipos compartidos: ApiResponse, PaginatedResponse, etc.
11. Definir constantes: API_BASE_URL, endpoints

**Cliente HTTP (http.ts):**

```typescript
const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.hash = '#/login';
    }
    return Promise.reject(error);
  }
);
```

---

### Fase 1 — Módulo Auth

**Vistas:**

- LoginView: formulario de login con username/email y contraseña

**AuthProvider (Context API):**

```typescript
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginDto) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}
```

**Flujo:**

1. Usuario ingresa credenciales en LoginView
2. Hook `useLogin` llama al service
3. Service llama a POST /auth/login
4. Si es exitoso, guarda token y actualiza AuthContext
5. Redirige al dashboard
6. ProtectedRoute valida que haya sesión activa y rol permitido

**ProtectedRoute:**

```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}
```

Si no hay token, redirige a login. Si el rol no está permitido, muestra vista de acceso denegado.

---

### Fase 2 — Módulo Pacientes

**Vistas:**

- PatientsListView: tabla paginada con búsqueda, filtro de estado (activo/inactivo/todos) y modal de creación/edición (`PatientFormModal`)
- PatientDetailView: detalle completo con tabs (datos, expediente, evoluciones, archivos, citas) y modal de edición
- Rutas de compatibilidad: `#/patients/new` y `#/patients/:id/edit` redirigen a la lista o al detalle con `location.state` para abrir el modal

**Componentes:**

- PatientsTable: tabla con columnas (nombre, teléfono, email, estado, acciones)
- PatientForm: formulario reutilizable para crear y editar
- PatientFilters: barra de filtros (búsqueda por nombre, estado)
- PatientCard: card de resumen para el detalle

**Hooks (con TanStack Query):**

- usePatientsList: query paginada con filtros
- usePatientDetail: query de detalle por ID
- useCreatePatient: mutation de creación
- useUpdatePatient: mutation de edición

**Campos del formulario:**

- Nombre (first_name)
- Apellido (last_name)
- Sexo (select: masculino, femenino, otro)
- Fecha de nacimiento (date picker)
- Teléfono
- Correo electrónico
- Dirección
- Antecedentes médicos (textarea)
- Alergias (textarea)
- Medicamentos (textarea)
- Observaciones (textarea)

**Validaciones:**

- Nombre y apellido obligatorios, mínimo 2 caracteres
- Teléfono obligatorio, formato válido
- Email opcional, formato válido si se ingresa
- Fecha de nacimiento obligatoria, no futura

---

### Fase 3 — Módulo Doctores

**Vistas:**

- DoctorsListView: tabla paginada
- DoctorCreateView: formulario de creación
- DoctorEditView: formulario de edición
- DoctorDetailView: detalle con agenda y estadísticas

**Campos del formulario:**

- Nombre, apellido
- Especialidad
- Teléfono, email
- Número de licencia
- Estado (activo/inactivo)

---

### Fase 4 — Módulo Citas

**Vistas:**

- AppointmentsListView: lista con filtros
- AppointmentCreateView: formulario de creación
- AppointmentDetailView: detalle de cita
- AppointmentAgendaView: vista de agenda (día, semana, mes)

**Componentes:**

- AppointmentCalendar: componente de calendario con vistas día/semana/mes
- AppointmentForm: formulario con selección de paciente, doctor, fecha y hora
- AppointmentStatusBadge: badge con color según estado
- AppointmentFilters: filtros por doctor, estado, rango de fechas

**Estados y colores sugeridos:**

| Estado | Color | Etiqueta |
|--------|-------|----------|
| scheduled | Azul | Programada |
| confirmed | Verde | Confirmada |
| in_progress | Amarillo | En curso |
| attended | Gris | Atendida |
| cancelled | Rojo | Cancelada |
| no_show | Naranja | No asistió |

**Funcionalidades clave:**

- Selector de fecha y hora con slots disponibles
- Validación visual de conflictos de horario
- Cambio de estado con confirmación
- Reprogramación con selección de nueva fecha

---

### Fase 5 — Módulo Expediente Clínico

**Vistas:**

- ClinicalRecordView: vista del expediente asociado a un paciente

**Nota:** este módulo se accede principalmente desde el detalle del paciente. No tiene listado propio independiente, el expediente es uno por paciente.

**Secciones del expediente:**

- Antecedentes médicos
- Antecedentes odontológicos
- Motivo de consulta
- Diagnóstico
- Observaciones

Cada sección es editable inline o mediante modal.

---

### Fase 6 — Módulo Evolución Clínica

**Vistas:**

- ClinicalEvolutionsListView: lista de evoluciones (filtrada por expediente)
- ClinicalEvolutionCreateView: formulario de registro
- ClinicalEvolutionDetailView: detalle completo

**Campos del formulario:**

- Fecha
- Doctor (select)
- Motivo de consulta
- Hallazgos
- Diagnóstico
- Procedimiento realizado
- Recomendaciones
- Observaciones

**Nota:** se accede desde el expediente del paciente. La lista muestra el historial cronológico de evoluciones.

---

### Fase 7 — Módulo Catálogo de Tratamientos

**Vistas:**

- TreatmentsListView: tabla paginada con filtro por categoría y estado
- TreatmentCreateView: formulario de creación
- TreatmentEditView: formulario de edición

**Campos:**

- Nombre
- Descripción
- Categoría (select)
- Precio por defecto
- Estado (activo/inactivo con toggle)

---

### Fase 8 — Módulo Planes de Tratamiento

**Vistas:**

- TreatmentPlansListView: lista de planes con filtros
- TreatmentPlanCreateView: creación de plan con selección de procedimientos
- TreatmentPlanDetailView: detalle con lista de ítems y estados

**Componentes:**

- TreatmentPlanItemsList: lista de procedimientos del plan con estado individual
- AddTreatmentItemModal: modal para agregar tratamiento del catálogo al plan

**Estados del plan:**

| Estado | Color |
|--------|-------|
| pending | Azul |
| in_progress | Amarillo |
| completed | Verde |
| cancelled | Rojo |

---

### Fase 9 — Módulo Procedimientos Realizados

**Vistas:**

- PerformedProceduresListView: lista con filtros por paciente, doctor, fecha
- PerformedProcedureCreateView: registro de procedimiento
- PerformedProcedureDetailView: detalle

**Nota:** al registrar un procedimiento vinculado a un plan de tratamiento, se actualiza automáticamente el estado del ítem correspondiente.

---

### Fase 10 — Módulo Archivos Clínicos

**Vistas:**

- ClinicalFilesListView: galería/lista de archivos por paciente
- ClinicalFileUploadView: formulario de subida

**Componentes:**

- FileUploader: componente de drag & drop para subir archivos
- FilePreview: previsualizador de imágenes y PDFs
- FileCard: card con miniatura, nombre, tipo y acciones

**Tipos permitidos:** jpg, png, pdf, documentos clínicos.

**Funcionalidades:**

- Subida de archivos con barra de progreso
- Previsualización de imágenes inline
- Descarga de archivos
- Eliminación con confirmación

---

### Fase 11 — Módulo Auditoría

**Vistas:**

- AuditLogsListView: tabla paginada con filtros

**Acceso:** solo administradores.

**Columnas de la tabla:**

- Fecha y hora
- Usuario
- Acción
- Módulo
- Detalle

**Filtros:** usuario, acción, módulo, rango de fechas.

---

### Fase 12 — Módulo Dashboard

**Vistas:**

- DashboardView: vista principal con métricas

**Componentes:**

- StatCard: card con ícono, título, valor y tendencia
- AppointmentsChart: gráfica de citas por estado (Recharts - PieChart o BarChart)
- DoctorWorkloadChart: gráfica de carga por doctor (BarChart)
- TreatmentsSummaryChart: gráfica de tratamientos (PieChart)
- RecentActivityTable: tabla de actividad reciente

**Cards de métricas:**

- Citas del día (número)
- Pacientes atendidos hoy (número)
- Pacientes nuevos (últimos 30 días)
- Tratamientos en proceso (número)
- Tratamientos terminados (número)
- Cancelaciones (últimos 30 días)

**Gráficas (Recharts):**

- Distribución de citas por estado (PieChart)
- Carga de trabajo por doctor (BarChart horizontal)
- Tendencia de citas por semana (LineChart)
- Tratamientos por categoría (BarChart)

---

## Enrutamiento (HashRouter)

```
#/login                                    → LoginView
#/                                         → DashboardView
#/patients                                 → PatientsListView
#/patients/new                             → redirección a `#/patients` (state: abrir modal crear)
#/patients/:id                             → PatientDetailView
#/patients/:id/edit                        → redirección a `#/patients/:id` (state: abrir modal editar)
#/patients/:id/clinical-record             → ClinicalRecordView
#/patients/:id/evolutions                  → ClinicalEvolutionsListView
#/patients/:id/evolutions/new              → ClinicalEvolutionCreateView
#/patients/:id/evolutions/:evoId           → ClinicalEvolutionDetailView
#/patients/:id/files                       → ClinicalFilesListView
#/patients/:id/treatment-plans             → TreatmentPlansListView (filtrado)
#/doctors                                  → DoctorsListView
#/doctors/new                              → DoctorCreateView
#/doctors/:id                              → DoctorDetailView
#/doctors/:id/edit                         → DoctorEditView
#/appointments                             → AppointmentsListView
#/appointments/new                         → AppointmentCreateView
#/appointments/:id                         → AppointmentDetailView
#/appointments/agenda                      → AppointmentAgendaView
#/treatments                               → TreatmentsListView
#/treatments/new                           → TreatmentCreateView
#/treatments/:id/edit                      → TreatmentEditView
#/treatment-plans                          → TreatmentPlansListView
#/treatment-plans/new                      → TreatmentPlanCreateView
#/treatment-plans/:id                      → TreatmentPlanDetailView
#/performed-procedures                     → PerformedProceduresListView
#/performed-procedures/new                 → PerformedProcedureCreateView
#/performed-procedures/:id                 → PerformedProcedureDetailView
#/audit                                    → AuditLogsListView
```

---

## Manejo de Estado

**Context API (estado global):**

- AuthContext: usuario, token, login/logout
- Solo para estado verdaderamente global y poco cambiante

**TanStack Query (estado del servidor):**

- Toda la data que viene de la API se maneja con TanStack Query
- Cada módulo define sus query keys de forma consistente: `['patients']`, `['patients', id]`, `['appointments', filters]`
- Invalidación automática de queries después de mutations
- Configuración de staleTime y cacheTime por tipo de dato

**Ejemplo de patrón en hook:**

```typescript
// hooks/usePatientsList.ts
export function usePatientsList(filters: PatientFilters) {
  return useQuery({
    queryKey: ['patients', filters],
    queryFn: () => patientService.getAll(filters),
  });
}

// hooks/useCreatePatient.ts
export function useCreatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: patientService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
}
```

---

## Componentes Compartidos (shared/components/ui)

Componentes base que se reutilizan en todos los módulos:

- **Button**: variantes primary, secondary, danger, ghost. Tamaños sm, md, lg.
- **Input**: con label, error, helper text. Tipos text, email, password, number.
- **Select**: con opciones, placeholder, error.
- **Textarea**: con label, error, character count.
- **Modal**: con header, body, footer. Tamaños sm, md, lg.
- **Table**: con sorting, paginación integrada, empty state.
- **Pagination**: controles de página con info de registros.
- **Badge**: variantes por color para estados.
- **Card**: contenedor con header opcional y acciones.
- **Tabs**: navegación por tabs dentro de vistas.
- **DatePicker**: selector de fecha.
- **SearchInput**: input con debounce para búsquedas.
- **ConfirmDialog**: modal de confirmación para acciones destructivas.
- **Toast**: notificaciones temporales de éxito, error, warning.
- **Spinner**: indicador de carga.
- **EmptyState**: mensaje cuando no hay datos.

---

## Convenciones

- Nombres de archivos: kebab-case (patient-form.tsx)
- Nombres de componentes: PascalCase (PatientForm)
- Nombres de hooks: camelCase con prefijo use (usePatientsList)
- Nombres de tipos: PascalCase (Patient, CreatePatientDto)
- Queries keys: arrays consistentes por módulo
- Estilos: exclusivamente Tailwind CSS, sin CSS personalizado salvo globals.css
- Formularios: validación en el frontend antes de enviar, errores inline por campo
- Feedback: toast para acciones exitosas, alert inline para errores de formulario
- Loading states: skeleton o spinner mientras carga la data
- Error states: mensaje con opción de reintentar
