# Deploy Oracle + VPS

## Stack elegido para VPS chico

- Un solo proceso Node.js para API + frontend estatico
- `systemd` en vez de PM2
- Oracle Autonomous remoto con wallet local en el servidor
- Sin Docker ni PostgreSQL local para ahorrar RAM

## Variables necesarias

Usar [shared.env.example](/c:/Users/ll/Desktop/odontoSis/deploy/shared.env.example) como base.

## Flujo recomendado

1. Instalar Node.js en el VPS.
2. Crear `/opt/odontosis/shared/.env`
3. Subir la wallet a `/opt/odontosis/shared/oracle-wallet`
4. Ejecutar `npm run db:migrate`
5. Ejecutar `npm run db:seed`
6. Activar servicio `systemd`

## Actualizaciones futuras

Usar [deploy-vps.ps1](/c:/Users/ll/Desktop/odontoSis/scripts/deploy-vps.ps1) para subir un nuevo release y luego reiniciar el servicio.
