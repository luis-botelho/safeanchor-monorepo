import { Routes, Route } from "react-router-dom";

import VesselsPage from "./VesselsPage";
import CreateVesselPage from "./CreateVesselPage";
import VesselDetailsPage from "./VesselDetailsPage";
import EditVesselPage from "./EditVesselPage";

import MaintenancesPage from "./MaintenancesPage";
import MaintenanceHistoryPage from "./MaintenanceHistoryPage";
import CreateMaintenancePage from "./CreateMaintenancePage";

import PreventiveMaintenancesPage from "./PreventiveMaintenancesPage";
import CreatePreventiveMaintenancePage from "./CreatePreventiveMaintenancePage";
import MaintenanceDashboardPage from "./MaintenanceDashboardPage";

import CreateChecklistTemplatePage from "./CreateChecklistTemplatePage";
import ChecklistTemplatesPage from "./ChecklistTemplatesPage";
import CreateChecklistExecutionPage from "./CreateChecklistExecutionPage";
import ChecklistExecutionsPage from "./ChecklistExecutionsPage";

import InspectionHistoryPage from "./InspectionHistoryPage";

export default function App() {
  return (
    <Routes>
      {/* Vessels */}
      <Route path="/" element={<VesselsPage />} />
      <Route path="/create" element={<CreateVesselPage />} />
      <Route path="/vessels/:id" element={<VesselDetailsPage />} />
      <Route path="/update/:id" element={<EditVesselPage />} />

      {/* Maintenances */}
      <Route path="/maintenances" element={<MaintenancesPage />} />
      <Route path="/maintenances/create" element={<CreateMaintenancePage />} />
      <Route path="/vessels/:id/maintenances" element={<MaintenanceHistoryPage />} />

      {/* Preventive Maintenances */}
      <Route path="/preventive-maintenances" element={<PreventiveMaintenancesPage />} />
      <Route path="/preventive-maintenances/create" element={<CreatePreventiveMaintenancePage />} />
      <Route path="/maintenance-dashboard" element={<MaintenanceDashboardPage />} />

      {/* Checklist Templates */}
      <Route path="/checklist-templates" element={<ChecklistTemplatesPage />} />
      <Route path="/checklist-templates/new" element={<CreateChecklistTemplatePage />} />

      {/* Checklist Executions */}
      <Route path="/checklist-executions" element={<ChecklistExecutionsPage />} />
      <Route path="/checklist-executions/new" element={<CreateChecklistExecutionPage />} />

      {/* Inspections */}
      <Route path="/vessels/:id/inspections" element={<InspectionHistoryPage />} />
    </Routes>
  );
}
