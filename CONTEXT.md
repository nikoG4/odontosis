# OdontoSis Context

## Estado actual
- Monorepo listo con backend NestJS, web React/Vite y app Expo/React Native Web.
- Base de datos principal en Oracle con wallet.
- Despliegue en VPS con `systemd` y `nginx`.
- Dominio público activo configurado para producción.

## Piezas clave
- Backend: `apps/api`
- Web comercial/panel: `apps/web`
- App móvil/web compartida: `apps/app`
- SDK compartido: `packages/sdk`
- Tipos compartidos: `packages/types`
- Config compartida: `packages/config`

## Producción
- Servicio gestionado con `systemd`.
- Nginx + SSL configurados.
- Oracle Wallet desplegado fuera del repositorio.
- La IP del servidor, rutas internas y credenciales de infraestructura no deben documentarse en archivos públicos.

## Google Login
- Web debe usar el dominio productivo autorizado como origen OAuth.
- Android usa el package `com.nikoovelar.odontosis`.
- Las huellas SHA de debug/release deben mantenerse en la consola del proveedor OAuth o en documentación privada, no en archivos públicos.

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
3. Generar build release/AAB para distribución.
4. Seguir consolidando la app Expo como frontend principal.

## Notas de seguridad
- Evitar commitear archivos generados: `dist`, `android`, `node_modules`, logs y tarballs.
- Mantener secretos, wallets, claves, tokens, IPs administrativas y huellas de firma fuera del repositorio público.
- Usar `.env.example` únicamente con valores ficticios o placeholders.
