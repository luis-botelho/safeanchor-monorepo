import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "../components/ProtectedRoute";
import LoginPage from "../views/LoginPage";
import RegisterPage from "../views/RegisterPage";

import VesselsPage from "../views/VesselsPage";
import CreateVesselPage from "../views/CreateVesselPage";
import VesselDetailsPage from "../views/VesselDetailsPage";
import EditVesselPage from "../views/EditVesselPage";

import MaintenancesPage from "../views/MaintenancesPage";
import MaintenanceHistoryPage from "../views/MaintenanceHistoryPage";
import CreateMaintenancePage from "../views/CreateMaintenancePage";

import PreventiveMaintenancesPage from "../views/PreventiveMaintenancesPage";
import CreatePreventiveMaintenancePage from "../views/CreatePreventiveMaintenancePage";
import MaintenanceDashboardPage from "../views/MaintenanceDashboardPage";

import CreateChecklistTemplatePage from "../views/CreateChecklistTemplatePage";
import ChecklistTemplatesPage from "../views/ChecklistTemplatesPage";
import CreateChecklistExecutionPage from "../views/CreateChecklistExecutionPage";
import ChecklistExecutionsPage from "../views/ChecklistExecutionsPage";

import InspectionHistoryPage from "../views/InspectionHistoryPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        {/* Vessels */}
        <Route path="/" element={<VesselsPage />} />
        <Route path="/create" element={<CreateVesselPage />} />
        <Route path="/vessels/:id" element={<VesselDetailsPage />} />
        <Route path="/update/:id" element={<EditVesselPage />} />

        {/* Maintenances */}
        <Route path="/maintenances" element={<MaintenancesPage />} />
        <Route path="/maintenances/create" element={<CreateMaintenancePage />} />
        <Route
          path="/vessels/:id/maintenances"
          element={<MaintenanceHistoryPage />}
        />

        {/* Preventive Maintenances */}
        <Route
          path="/preventive-maintenances"
          element={<PreventiveMaintenancesPage />}
        />
        <Route
          path="/preventive-maintenances/create"
          element={<CreatePreventiveMaintenancePage />}
        />
        <Route
          path="/maintenance-dashboard"
          element={<MaintenanceDashboardPage />}
        />

        {/* Checklist Templates */}
        <Route path="/checklist-templates" element={<ChecklistTemplatesPage />} />
        <Route
          path="/checklist-templates/new"
          element={<CreateChecklistTemplatePage />}
        />

        {/* Checklist Executions */}
        <Route
          path="/checklist-executions"
          element={<ChecklistExecutionsPage />}
        />
        <Route
          path="/checklist-executions/new"
          element={<CreateChecklistExecutionPage />}
        />

        {/* Inspections */}
        <Route
          path="/vessels/:id/inspections"
          element={<InspectionHistoryPage />}
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}