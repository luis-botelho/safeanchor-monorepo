import { Routes, Route } from "react-router-dom";

import VesselsPage from "./VesselsPage";
import CreateVesselPage from "./CreateVesselPage";
import VesselDetailsPage from "./VesselDetailsPage";
import EditVesselPage from "./EditVesselPage"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<VesselsPage />} />
      <Route path="/create" element={<CreateVesselPage />} />
      <Route path="/vessels/:id" element={<VesselDetailsPage />} />
      <Route path="/update/:id" element={<EditVesselPage/>}/>
    </Routes>
  );
}