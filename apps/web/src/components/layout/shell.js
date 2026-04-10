import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsx("div", { className: "min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(18,129,123,0.18),_transparent_25%),linear-gradient(180deg,#f8fafc_0%,#eef6f6_100%)] text-slate-900", children: _jsxs("div", { className: "mx-auto grid min-h-screen max-w-7xl gap-4 px-3 py-3 sm:gap-6 sm:px-4 sm:py-4 lg:grid-cols-[260px_1fr] lg:px-4 lg:py-6", children: [_jsxs("aside", { className: "rounded-[1.75rem] border border-white/60 bg-slate-950 p-4 text-white shadow-2xl shadow-slate-400/20 sm:p-5 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:overflow-hidden lg:rounded-[2rem] lg:p-6", children: [_jsxs("div", { className: "flex items-start justify-between gap-4 lg:block", children: [_jsxs(Link, { to: "/dashboard", className: "block min-w-0", children: [_jsx("p", { className: "text-[11px] uppercase tracking-[0.28em] text-teal-300/80 sm:text-xs sm:tracking-[0.35em]", children: "OdontoSis" }), _jsx("h1", { className: "mt-2 text-xl font-extrabold leading-tight sm:text-2xl", children: "Gestion dental SaaS" })] }), _jsxs("div", { className: "min-w-0 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-right text-xs sm:text-sm lg:hidden", children: [_jsxs("p", { className: "truncate font-semibold", children: [session?.user.firstName, " ", session?.user.lastName] }), _jsx("p", { className: "truncate text-white/70", children: session?.user.role })] })] }), _jsx("div", { className: "mt-5 flex gap-2 overflow-x-auto pb-1 lg:mt-8 lg:block lg:space-y-2 lg:overflow-visible lg:pb-0", children: links.map(({ to, label, icon: Icon }) => (_jsxs(NavLink, { to: to, className: ({ isActive }) => cn("flex min-w-fit shrink-0 items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition hover:bg-white/10 lg:min-w-0", isActive && "bg-white text-slate-950 shadow-lg"), children: [_jsx(Icon, { className: "h-4 w-4" }), label] }, to))) }), _jsxs("div", { className: "mt-5 hidden rounded-2xl border border-white/10 bg-white/5 p-4 text-sm lg:block", children: [_jsxs("p", { className: "font-semibold", children: [session?.user.firstName, " ", session?.user.lastName] }), _jsx("p", { className: "mt-1 break-words text-white/70", children: session?.user.email }), _jsx("p", { className: "mt-1 text-xs uppercase tracking-[0.25em] text-teal-300", children: session?.user.role }), _jsx(Button, { variant: "secondary", className: "mt-4 w-full", onClick: async () => {
                                        await logout();
                                        navigate("/login");
                                    }, children: "Cerrar sesion" })] }), _jsx(Button, { variant: "secondary", className: "mt-4 w-full lg:hidden", onClick: async () => {
                                await logout();
                                navigate("/login");
                            }, children: "Cerrar sesion" })] }), _jsx("main", { className: "min-w-0 space-y-4 py-1 sm:space-y-6 sm:py-2", children: _jsx(Outlet, {}) })] }) }));
}
