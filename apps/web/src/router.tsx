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
  return session ? <Shell /> : <Navigate to="/login" replace />;
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route element={<Protected />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/patients" element={<PatientsPage />} />
        <Route path="/patients/new" element={<NewPatientPage />} />
        <Route path="/patients/:id" element={<PatientDetailPage />} />
        <Route path="/agenda" element={<AgendaPage />} />
        <Route path="/agenda/new" element={<NewAppointmentPage />} />
        <Route path="/treatments" element={<TreatmentsPage />} />
        <Route path="/treatments/new" element={<NewTreatmentPage />} />
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
