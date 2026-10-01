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

Copia los archivos de ejemplo de entorno y completa únicamente valores locales/privados fuera de Git:

```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
```

Luego:

```bash
npm run db:migrate
npm run db:seed
npm run dev:api
npm run dev:web
```

Para la app compartida:

```bash
npm run dev:app
```

O para ejecutarla en web:

```bash
npm run dev:app:web
```

## Scripts principales

```text
npm run dev:api       Backend NestJS
npm run dev:web       Frontend React/Vite
npm run dev:app       App Expo
npm run dev:app:web   App Expo en navegador
npm run build         Build de los workspaces
npm run db:migrate    Inicializa/migra la base de datos
npm run db:seed       Carga datos de desarrollo
```

## Base de datos

La aplicación utiliza Oracle como base principal. La configuración y el wallet deben permanecer fuera del repositorio cuando contengan material sensible.

## Autenticación

El proyecto soporta autenticación tradicional y Google Login. Los Client IDs, secretos OAuth, huellas de firma y configuraciones específicas de producción deben gestionarse desde variables de entorno y las consolas de los proveedores.

## Producción

El proyecto incluye documentación y recursos para despliegue detrás de Nginx con SSL y ejecución del backend como servicio.

Consulta [DEPLOYMENT.md](DEPLOYMENT.md) para el flujo de despliegue. La documentación pública evita publicar IPs administrativas, claves, wallets, tokens o huellas de firma.

## Seguridad

- No versionar `.env` reales.
- No subir Oracle Wallets, claves privadas, service accounts o tokens.
- Mantener secretos JWT/OAuth en variables de entorno o un gestor de secretos.
- Mantener huellas SHA de builds y detalles administrativos de infraestructura en documentación privada cuando no sean necesarios para compilar el proyecto.
- Si una credencial estuvo alguna vez en un repositorio público, debe rotarse; eliminarla del último commit no invalida el historial anterior.

## Estado del proyecto

OdontoSis continúa en desarrollo activo. Las principales áreas pendientes son la estabilización final de OAuth en builds release, el empaquetado móvil de producción y la consolidación de la app Expo como frontend compartido.