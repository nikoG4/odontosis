# OdontoSis Deployment

Guía resumida para desplegar OdontoSis sin publicar detalles administrativos de la infraestructura.

## Componentes

- Backend NestJS (`apps/api`)
- Frontend web (`apps/web`)
- App Expo/React Native (`apps/app`)
- Oracle Database
- Nginx como reverse proxy
- Servicio `systemd` para el backend

## Preparación

1. Configura las variables de entorno fuera del repositorio.
2. Copia el Oracle Wallet al servidor por un canal seguro si la conexión lo requiere.
3. Instala dependencias y genera los builds necesarios.
4. Configura el servicio del backend mediante `systemd`.
5. Configura Nginx para servir el frontend y redirigir la API.
6. Habilita TLS con el mecanismo de certificados elegido para el dominio.

## Build

```bash
npm install
npm run build
```

## Base de datos

```bash
npm run db:migrate
npm run db:seed
```

El seed debe usarse únicamente en entornos de desarrollo o pruebas controladas.

## Seguridad

No documentar ni commitear en este repositorio:

- IPs administrativas del servidor;
- contraseñas;
- secretos JWT;
- client secrets OAuth;
- Oracle Wallets;
- claves privadas;
- service accounts;
- tokens de despliegue;
- rutas privadas innecesarias;
- huellas o material de firma que no sea imprescindible para usuarios del proyecto.

Usa variables de entorno o un gestor de secretos para producción.
