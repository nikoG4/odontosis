# OdontoSis

OdontoSis es un **SaaS de gestión odontológica** organizado como monorepo TypeScript. Reúne backend, panel web y aplicación móvil/web compartida, con Oracle como base de datos principal y paquetes comunes para tipos, configuración y acceso a la API.

> **Estado:** proyecto funcional en evolución. El backend y los frontends principales están implementados; la app Expo continúa consolidándose como cliente compartido y el flujo OAuth/Google Login requiere validación final para builds release.

## Funcionalidades

El backend ya incluye módulos para:

- autenticación y usuarios;
- clínicas;
- pacientes;
- citas;
- tratamientos;
- notas clínicas;
- pagos;
- dashboard;
- control de acceso por roles.

El proyecto también incluye integración con Google Login y una capa compartida para reutilizar contratos y acceso a la API entre los distintos clientes.

## Stack

### Backend

- Node.js
- TypeScript
- NestJS
- Oracle Database
- JWT / Passport
- Zod

### Web

- React
- Vite
- Tailwind CSS

### App

- Expo
- React Native
- React Native Web

### Infraestructura

- Oracle Cloud
- Nginx
- systemd
- SSL/TLS

## Estructura

```text
odontosis/
├── apps/
│   ├── api/          # Backend NestJS
│   ├── web/          # Panel / frontend web
│   └── app/          # App Expo + React Native Web
├── packages/
│   ├── sdk/          # Acceso compartido a la API
│   ├── types/        # Tipos compartidos
│   └── config/       # Configuración compartida
├── deploy/           # Archivos de despliegue
├── scripts/          # Scripts auxiliares
├── DEPLOYMENT.md
└── CONTEXT.md
```

## Requisitos

- Node.js + npm
- Acceso a una instancia Oracle compatible
- Oracle Wallet cuando la conexión configurada lo requiera

## Instalación

```bash
npm install
```

Copia y completa los archivos de ejemplo de entorno antes de ejecutar el proyecto:

```text
.env.example
apps/api/.env.example
```

No subas al repositorio wallets, credenciales reales, tokens OAuth ni secretos JWT.

## Base de datos

Inicializar/migrar la base configurada:

```bash
npm run db:migrate
```

Cargar datos de desarrollo:

```bash
npm run db:seed
```

Los datos seed están pensados exclusivamente para desarrollo y deben reemplazarse antes de cualquier despliegue real.

## Desarrollo

### API

```bash
npm run dev:api
```

### Web

```bash
npm run dev:web
```

### App Expo

```bash
npm run dev:app
```

### App en navegador

```bash
npm run dev:app:web
```

## Build

```bash
npm run build
```

El monorepo usa npm workspaces para construir las aplicaciones y paquetes compartidos.

## Autenticación

OdontoSis combina autenticación propia mediante JWT con integración de Google Login. Los clientes comparten contratos y lógica de acceso mediante los paquetes comunes del monorepo.

Para OAuth en producción deben utilizarse credenciales y orígenes autorizados específicos del entorno final; no reutilices credenciales de desarrollo en builds públicas.

## Arquitectura

```text
React Web ─────────────┐
                      │
Expo / React Native ──┼──> SDK compartido ──> NestJS API ──> Oracle
                      │
React Native Web ─────┘
```

La separación en workspaces permite compartir tipos y configuración sin duplicar contratos entre backend y clientes.

## Despliegue

El repositorio contiene configuración para un despliegue liviano con:

- servicio Node administrado por `systemd`;
- Nginx como reverse proxy;
- SSL/TLS;
- Oracle remoto;
- frontend estático servido junto a la aplicación productiva.

Consulta [`DEPLOYMENT.md`](DEPLOYMENT.md) para los pasos específicos de despliegue.

## Estado actual / próximos pasos

- estabilizar Google Login con credenciales definitivas de producción;
- validar OAuth Android con la firma release;
- generar builds release/AAB;
- continuar consolidando la app Expo como frontend principal;
- ampliar pruebas automatizadas y documentación funcional.

## Documentación adicional

- [`CONTEXT.md`](CONTEXT.md): estado técnico y piezas principales del proyecto.
- [`DEPLOYMENT.md`](DEPLOYMENT.md): guía de despliegue.
