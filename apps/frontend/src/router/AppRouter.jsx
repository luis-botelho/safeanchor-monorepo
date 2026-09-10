import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "../components/ProtectedRoute";

import LoginPage from "../views/LoginPage";
import RegisterPage from "../views/RegisterPage";

import DashboardPage from "../views/PersonaDashboardPage";
import FleetPage from "../views/FleetPage";
import VesselDetailPage from "../views/VesselDetailPage";
import MaintenancePage from "../views/MaintenancePage";
import DocumentsPage from "../views/DocumentsPage";
import ServiceProvidersPage from "../views/ServiceProvidersPage";
import ProviderProfilePage from "../views/ProviderProfilePage";
import ServiceRequestsPage from "../views/ServiceRequestsPage";
import NewServiceRequestPage from "../views/NewServiceRequestPage";
import MarinasPage from "../views/MarinasPage";
import MarinaDetailPage from "../views/MarinaDetailPage";
import MarinaDashboardPage from "../views/MarinaDashboardPage";
import MarinaFleetPage from "../views/MarinaFleetPage";
import MarinaTeamPage from "../views/MarinaTeamPage";
import MarinaServicesPage from "../views/MarinaServicesPage";
import MarinaServiceCatalogPage from "../views/MarinaServiceCatalogPage";
import MarketplacePage from "../views/MarketplacePage";
import EventsPage from "../views/EventsPage";
import CommunityPage from "../views/CommunityPage";
import ProfilePage from "../views/ProfilePage";
import TripsPage from "../views/TripsPage";
import TripPlannerPage from "../views/TripPlannerPage";
import TripDetailPage from "../views/TripDetailPage";
import BoatRentalsPage from "../views/BoatRentalsPage";
import BoatRentalDetailPage from "../views/BoatRentalDetailPage";
import JobsPage from "../views/JobsPage";
import ProviderAcademyPage from "../views/ProviderAcademyPage";
import ProviderAIPage from "../views/ProviderAIPage";
import MarinaReservationsPage from "../views/MarinaReservationsPage";
import MarinaAIPage from "../views/MarinaAIPage";
import MarinaPlanPage from "../views/MarinaPlanPage";
import EcosystemPage from "../views/EcosystemPage";
import ServiceRequestDetailPage from "../views/ServiceRequestDetailPage";
import ComingSoonPage from "../views/ComingSoonPage";
import InspectionsPage from "../views/InspectionsPage";
import InspectionDetailPage from "../views/InspectionDetailPage";
import NewInspectionPage from "../views/NewInspectionPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />

        <Route path="/fleet" element={<FleetPage />} />
        <Route path="/fleet/:id" element={<VesselDetailPage />} />
        <Route
          path="/fleet/new"
          element={
            <ComingSoonPage
              title="Cadastro de embarcação em breve"
              description="Nesta demonstração a frota de exemplo já está carregada. Explore os detalhes de cada embarcação."
            />
          }
        />

        <Route path="/maintenance" element={<MaintenancePage />} />
        <Route
          path="/maintenance/new"
          element={
            <ComingSoonPage
              title="Agendar manutenção em breve"
              description="A agenda de manutenção já mostra as próximas manutenções preventivas e corretivas da frota."
            />
          }
        />

        <Route path="/documents" element={<DocumentsPage />} />

        <Route path="/service-providers" element={<ServiceProvidersPage />} />
        <Route path="/service-providers/:id" element={<ProviderProfilePage />} />
        <Route path="/service-requests" element={<ServiceRequestsPage />} />
        <Route path="/service-requests/new" element={<NewServiceRequestPage />} />
        <Route path="/service-requests/:id" element={<ServiceRequestDetailPage />} />

        <Route path="/trips" element={<TripsPage />} />
        <Route path="/trips/new" element={<TripPlannerPage />} />
        <Route path="/trips/:id" element={<TripDetailPage />} />

        <Route path="/boat-rentals" element={<BoatRentalsPage />} />
        <Route path="/boat-rentals/:id" element={<BoatRentalDetailPage />} />

        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/provider/academy" element={<ProviderAcademyPage />} />
        <Route path="/provider/ai" element={<ProviderAIPage />} />

        <Route path="/inspections" element={<InspectionsPage />} />
        <Route path="/inspections/new" element={<NewInspectionPage />} />
        <Route path="/inspections/:id" element={<InspectionDetailPage />} />

        <Route path="/marina/reservations" element={<MarinaReservationsPage />} />
        <Route path="/marina/ai" element={<MarinaAIPage />} />
        <Route path="/marina/plan" element={<MarinaPlanPage />} />

        <Route path="/ecosystem" element={<EcosystemPage />} />

        <Route path="/marinas" element={<MarinasPage />} />
        <Route path="/marinas/:id" element={<MarinaDetailPage />} />

        <Route path="/marina/dashboard" element={<MarinaDashboardPage />} />
        <Route path="/marina/fleet" element={<MarinaFleetPage />} />
        <Route path="/marina/team" element={<MarinaTeamPage />} />
        <Route path="/marina/services" element={<MarinaServicesPage />} />
        <Route
          path="/marina/services/catalog"
          element={<MarinaServiceCatalogPage />}
        />

        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}