import { useState ,useEffect} from "react";
import  VesselsPage from "./VesselsPage";
import CreateVesselPage from "./CreateVesselPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState("list");
  
  if (currentPage === "create") {
    return (
      <CreateVesselPage
        onSuccess={() => setCurrentPage("list")}
      />
    );
  }

  return (
    <VesselsPage
      onCreate={() => setCurrentPage("create")}
    />
  );
}