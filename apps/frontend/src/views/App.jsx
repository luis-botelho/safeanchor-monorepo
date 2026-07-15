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

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<VesselsPage />} />
      <Route path="/create" element={<CreateVesselPage />} />
      <Route path="/vessels/:id" element={<VesselDetailsPage />} />
      <Route path="/update/:id" element={<EditVesselPage />} />

      <Route path="/maintenances" element={<MaintenancesPage />} />
      <Route path="/maintenances/create" element={<CreateMaintenancePage />} />
      <Route path="/vessels/:id/maintenances" element={<MaintenanceHistoryPage />} />

      <Route path="/preventive-maintenances" element={<PreventiveMaintenancesPage />} />
      <Route path="/preventive-maintenances/create" element={<CreatePreventiveMaintenancePage />} />

    </Routes>
  );
}
