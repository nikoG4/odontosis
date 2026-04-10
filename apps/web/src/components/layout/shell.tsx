import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { CalendarDays, CreditCard, LayoutDashboard, Settings, Stethoscope, Users } from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "../../state/auth";
import { cn } from "../../lib/utils";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/patients", label: "Pacientes", icon: Users },
  { to: "/agenda", label: "Agenda", icon: CalendarDays },
  { to: "/treatments", label: "Tratamientos", icon: Stethoscope },
  { to: "/payments", label: "Pagos", icon: CreditCard },
  { to: "/settings", label: "Configuracion", icon: Settings },
];

export function Shell() {
  const { session, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(18,129,123,0.18),_transparent_25%),linear-gradient(180deg,#f8fafc_0%,#eef6f6_100%)] text-slate-900">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-4 px-3 py-3 sm:gap-6 sm:px-4 sm:py-4 lg:grid-cols-[260px_1fr] lg:px-4 lg:py-6">
        <aside className="rounded-[1.75rem] border border-white/60 bg-slate-950 p-4 text-white shadow-2xl shadow-slate-400/20 sm:p-5 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:overflow-hidden lg:rounded-[2rem] lg:p-6">
          <div className="flex items-start justify-between gap-4 lg:block">
            <Link to="/dashboard" className="block min-w-0">
              <p className="text-[11px] uppercase tracking-[0.28em] text-teal-300/80 sm:text-xs sm:tracking-[0.35em]">OdontoSis</p>
              <h1 className="mt-2 text-xl font-extrabold leading-tight sm:text-2xl">Gestion dental SaaS</h1>
            </Link>
            <div className="min-w-0 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-right text-xs sm:text-sm lg:hidden">
              <p className="truncate font-semibold">{session?.user.firstName} {session?.user.lastName}</p>
              <p className="truncate text-white/70">{session?.user.role}</p>
            </div>
          </div>

          <div className="mt-5 flex gap-2 overflow-x-auto pb-1 lg:mt-8 lg:block lg:space-y-2 lg:overflow-visible lg:pb-0">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    "flex min-w-fit shrink-0 items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition hover:bg-white/10 lg:min-w-0",
                    isActive && "bg-white text-slate-950 shadow-lg",
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </div>

          <div className="mt-5 hidden rounded-2xl border border-white/10 bg-white/5 p-4 text-sm lg:block">
            <p className="font-semibold">{session?.user.firstName} {session?.user.lastName}</p>
            <p className="mt-1 break-words text-white/70">{session?.user.email}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.25em] text-teal-300">{session?.user.role}</p>
            <Button
              variant="secondary"
              className="mt-4 w-full"
              onClick={async () => {
                await logout();
                navigate("/login");
              }}
            >
              Cerrar sesion
            </Button>
          </div>

          <Button
            variant="secondary"
            className="mt-4 w-full lg:hidden"
            onClick={async () => {
              await logout();
              navigate("/login");
            }}
          >
            Cerrar sesion
          </Button>
        </aside>

        <main className="min-w-0 space-y-4 py-1 sm:space-y-6 sm:py-2">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
