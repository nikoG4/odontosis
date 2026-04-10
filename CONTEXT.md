# OdontoSis Context

## Estado actual
- Monorepo listo con backend NestJS, web React/Vite y app Expo/React Native Web.
- Base de datos principal en Oracle con wallet.
- VPS en Oracle Cloud funcionando con `systemd` y `nginx`.
- Dominio publico activo: `https://odontosis.online`.

## Piezas clave
- Backend: `apps/api`
- Web comercial/panel: `apps/web`
- App movil/web compartida: `apps/app`
- SDK compartido: `packages/sdk`
- Tipos compartidos: `packages/types`
- Config compartida: `packages/config`

## Produccion
- VPS: `204.216.157.94`
- Servicio: `odontosis.service`
- Nginx + SSL configurados
- Oracle wallet desplegada en el VPS

## Google Login
- Web debe usar `https://odontosis.online` como origen OAuth.
- Android usa el package `com.nikoovelar.odontosis`.
- SHA-1 de la build debug actual:
  - `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25`

## Archivos importantes
- `apps/api/src/services/auth.service.ts`
- `apps/api/src/controllers/auth.controller.ts`
- `apps/api/src/services/database.service.ts`
- `apps/app/app/(public)/login.tsx`
- `apps/app/src/state/auth.tsx`
- `apps/web/src/main.tsx`
- `apps/web/src/views/login-page.tsx`

## Pendientes recomendados
1. Terminar de estabilizar Google Login en web con el client ID final del dominio.
2. Confirmar el OAuth Android correcto para la APK release firmada.
3. Generar build release/AAB para distribucion.
4. Seguir consolidando la app Expo como frontend principal.

## Notas
- Evitar commitear archivos generados: `dist`, `android`, `node_modules`, logs y tarballs.
- Mantener el dominio y SSL ya configurados en el VPS.
