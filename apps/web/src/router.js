import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Navigate, Route, Routes } from "react-router-dom";
import { Shell } from "./components/layout/shell";
import { useAuth } from "./state/auth";
import { AgendaPage } from "./views/agenda-page";
import { DashboardPage } from "./views/dashboard-page";
import { LoginPage } from "./views/login-page";
import { LandingPage } from "./views/landing-page";
import { PatientDetailPage } from "./views/patient-detail-page";
import { PatientsPage } from "./views/patients-page";
import { PaymentsPage } from "./views/payments-page";
import { SettingsPage } from "./views/settings-page";
import { SignupPage } from "./views/signup-page";
import { TreatmentsPage } from "./views/treatments-page";
import { NewPatientPage } from "./views/new-patient-page";
import { NewAppointmentPage } from "./views/new-appointment-page";
import { NewTreatmentPage } from "./views/new-treatment-page";
function Protected() {
    const { session } = useAuth();
    return session ? _jsx(Shell, {}) : _jsx(Navigate, { to: "/login", replace: true });
}
export function AppRouter() {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(LandingPage, {}) }), _jsx(Route, { path: "/signup", element: _jsx(SignupPage, {}) }), _jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsxs(Route, { element: _jsx(Protected, {}), children: [_jsx(Route, { path: "/dashboard", element: _jsx(DashboardPage, {}) }), _jsx(Route, { path: "/patients", element: _jsx(PatientsPage, {}) }), _jsx(Route, { path: "/patients/new", element: _jsx(NewPatientPage, {}) }), _jsx(Route, { path: "/patients/:id", element: _jsx(PatientDetailPage, {}) }), _jsx(Route, { path: "/agenda", element: _jsx(AgendaPage, {}) }), _jsx(Route, { path: "/agenda/new", element: _jsx(NewAppointmentPage, {}) }), _jsx(Route, { path: "/treatments", element: _jsx(TreatmentsPage, {}) }), _jsx(Route, { path: "/treatments/new", element: _jsx(NewTreatmentPage, {}) }), _jsx(Route, { path: "/payments", element: _jsx(PaymentsPage, {}) }), _jsx(Route, { path: "/settings", element: _jsx(SettingsPage, {}) })] }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }));
}
