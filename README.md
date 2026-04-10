# OdontoSis

Monorepo SaaS para gestion odontologica con:

- `apps/api`: NestJS + Oracle Database
- `apps/web`: React + Vite + Tailwind
- `packages/types`: tipos compartidos
- `packages/config`: configuracion compartida

## Desarrollo

1. Configurar `.env` y `apps/api/.env`
2. Completar credenciales Oracle reales
3. Asegurar wallet en `./oracle-wallet`
4. `npm install`
5. `npm run db:migrate`
6. `npm run db:seed`
7. `npm run dev:api`
8. `npm run dev:web`

Credenciales seed:

- Email: `admin@demo.com`
- Password: `Admin123!`

## Produccion liviana

- Un solo proceso Node sirve API + frontend estatico
- Oracle remoto evita consumo local de RAM
- Deploy y servicio listos en [DEPLOYMENT.md](/c:/Users/ll/Desktop/odontoSis/DEPLOYMENT.md)
