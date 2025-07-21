# Microservices Backend API

## 🏗️ Arquitectura

Este proyecto implementa una arquitectura de microservicios con NestJS, organizando diferentes funcionalidades en servicios independientes.

### Servicios Disponibles

| Servicio                | Puerto | Descripción                     |
|-------------------------|--------|---------------------------------|
| **Client Gateway**      | 3000   | API Gateway principal           |
| **Auth Service**        | 3001   | Autenticación y autorización     |
| **User Service**        | 3002   | Gestión de usuarios y equipos   |
| **Project Service**     | 3003   | Gestión de proyectos            |
| **Task Service**        | 3004   | Gestión de tareas               |

### Estructura del Proyecto

```
Backend/
├── apps/                          # Microservicios
│   ├── client_gateway/            # 🚪 API Gateway
│   ├── auth_service/              # 🔐 Autenticación
│   ├── user_service/              # 👥 Usuarios
│   ├── project_service/           # 📋 Proyectos
│   └── task_service/              # ✅ Tareas
└── setup-databases.sql            # Scripts de base de datos
```

## 🚀 Configuración y Ejecución en Desarrollo

### Prerrequisitos

- Node.js 18+ y npm

### Instalación de Dependencias

```bash
# Desde la raíz del proyecto
npm run install:all
```

### Configuración de Variables de Entorno

Copia los archivos de plantilla y configura las variables:

```bash
# User Service
cp apps/user_service/.env.template apps/user_service/.env

# Client Gateway
cp apps/client_gateway/.env.template apps/client_gateway/.env
```

### Ejecución de los Servicios

#### Ejecución en Modo Desarrollo

```bash
# Gateway (requerido primero)
npm run start:dev:gateway

# Servicios individuales
npm run start:dev:auth
npm run start:dev:user
npm run start:dev:project
npm run start:dev:task
```

### Verificación

Accede a `http://localhost:3000` para probar el API Gateway.

## 📊 Base de Datos

Cada microservicio tiene su propia base de datos MySQL:

| Servicio | Base de Datos | Usuario | Descripción |
|----------|---------------|---------|-------------|
| Auth Service | `auth_service_db` | `auth_service` | Usuarios, roles, sesiones JWT |
| User Service | `user_service_db` | `user_service` | Perfiles de usuario, equipos |
| Project Service | `project_service_db` | `project_service` | Proyectos y miembros |
| Task Service | `task_service_db` | `task_service` | Tareas, asignaciones, historial |

### Configuración de Base de Datos

1. **Crear las bases de datos:**
   ```bash
   mysql -u root -p < setup-databases.sql
   ```

2. **Configurar las variables de entorno en cada servicio:**
   ```env
   DATABASE_URL="mysql://usuario:password@localhost:3306/nombre_db"
   ```

3. **Ejecutar migraciones de Prisma:**
   ```bash
   # Para cada servicio
   cd apps/[service_name]
   npx prisma migrate deploy
   npx prisma generate
   ```

## 🎯 Funcionalidades Principales

### 🔐 Autenticación (Auth Service)

- **Registro de usuarios:** `POST /api/auth/register`
- **Inicio de sesión:** `POST /api/auth/login`
- **Validación de token:** `POST /api/auth/validate-token`
- **Cierre de sesión:** `POST /api/auth/logout`

**Esquemas principales:**
- `User`: Datos básicos de autenticación
- `Role`: Roles y permisos del sistema
- `UserSession`: Gestión de sesiones JWT

### 👥 Usuarios (User Service)

- **Gestión de perfiles de usuario**
- **Administración de equipos**
- **Sincronización con Auth Service**

**Esquemas principales:**
- `UserProfile`: Perfiles completos de usuario
- `Team`: Equipos de trabajo
- `RoleCache`: Cache de roles

### 📋 Proyectos (Project Service)

- **Crear proyecto:** `POST /api/projects/create`
- **Listar proyectos:** `GET /api/projects/all`
- **Unirse a proyecto:** `POST /api/projects/:id/join`
- **Gestionar miembros:** `GET /api/projects/:id/members`

**Esquemas principales:**
- `Project`: Información del proyecto
- `ProjectMember`: Relación usuario-proyecto

### ✅ Tareas (Task Service)

- **Crear tarea:** `POST /api/tasks/create`
- **Asignar tarea:** `POST /api/tasks/:id/assign`
- **Completar tarea:** `PATCH /api/tasks/:id/complete`
- **Historial de cambios:** `GET /api/tasks/:id/history`

**Esquemas principales:**
- `Task`: Información de la tarea
- `TaskAssignment`: Asignaciones de tareas
- `TaskHistory`: Historial de cambios


## 🛠️ Variables de Entorno

### Client Gateway (.env)
```env
PORT=3000
AUTH_MS_HOST=localhost
AUTH_MS_PORT=3001
USER_MS_HOST=localhost
USER_MS_PORT=3002
PROJECTS_MS_HOST=localhost
PROJECTS_MS_PORT=3003
TASKS_MS_HOST=localhost
TASKS_MS_PORT=3004
```

### Servicios individuales (.env)
```env
PORT=[puerto_del_servicio]
DATABASE_URL="mysql://usuario:password@localhost:3306/base_de_datos"
```
## 🔧 Comandos Útiles para Desarrollo

### Manejo de Servicios
```bash
# Iniciar servicio específico en modo desarrollo
cd apps/[service_name]
npm run start:dev

# Construir todos los servicios
npm run build:all

# Instalar dependencias en todos los servicios
npm run install:all
```

### Manejo de Base de Datos (Prisma)
```bash
# Generar cliente de Prisma
cd apps/[service_name]
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev

# Ver base de datos en el navegador
npx prisma studio

# Resetear base de datos
npx prisma migrate reset
```

## 🤝 Desarrollo

### Agregar Nuevas Funcionalidades

1. **Entra al directorio del servicio:**
   ```bash
   cd apps/[service_name]
   ```

2. **Usa NestJS CLI para generar componentes:**
   ```bash
   # Crear un controlador
   nest generate controller [name]
   
   # Crear un servicio
   nest generate service [name]
   
   # Crear un módulo
   nest generate module [name]
   
   # Crear un DTO
   nest generate class dto/[name].dto
   ```

3. **Importa interfaces compartidas:**
   ```typescript
   import { ResponseDto } from '@libs/interfaces';
   ```

### Estructura de un Servicio

```
service_name/
├── src/
│   ├── [feature]/
│   │   ├── dto/                   # Data Transfer Objects
│   │   ├── entities/              # Entidades del dominio
│   │   ├── [feature].controller.ts
│   │   ├── [feature].service.ts
│   │   └── [feature].module.ts
│   ├── config/                    # Configuración
│   ├── common/                    # Utilidades compartidas
│   ├── generated/                 # Cliente de Prisma generado
│   └── main.ts                    # Punto de entrada
├── prisma/
│   ├── schema.prisma             # Esquema de base de datos
│   └── migrations/               # Migraciones
└── package.json
```

### Comunicación entre Microservicios

Los servicios se comunican mediante TCP usando `@nestjs/microservices`:

```typescript
// En el gateway
this.authClient.send({ cmd: 'authLogin' }, loginDto)

// En el microservicio
@MessagePattern({ cmd: 'authLogin' })
async login(loginDto: LoginDto) {
  return this.authService.login(loginDto);
}
```

## 🔒 Autenticación y Autorización

El sistema usa JWT tokens manejados por el Auth Service:

1. **Login:** Usuario envía credenciales
2. **Token:** Auth Service genera JWT
3. **Validación:** Gateway valida token en cada request
4. **Autorización:** Decoradores `@UseGuards(JwtAuthGuard)` protegen rutas

## 🐛 Troubleshooting

### Problemas Comunes

1. **Error de conexión entre servicios:**
   - Verificar que todos los servicios estén ejecutándose
   - Revisar puertos en variables de entorno

2. **Error de base de datos:**
   - Verificar `DATABASE_URL` en .env
   - Ejecutar migraciones: `npx prisma migrate dev`

3. **Error de imports:**
   - Verificar path mapping en `tsconfig.json`
   - Regenerar cliente Prisma: `npx prisma generate`
