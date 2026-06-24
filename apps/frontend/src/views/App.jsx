// import { useHomeViewModel } from "../viewmodels/useHomeViewModel";

// export function App() {
//   const viewModel = useHomeViewModel();

//   return (
//     <main className="home">
//       <section className="home__intro">
//         <p className="home__eyebrow">Projeto de estudo</p>
//         <h1 className="home__title">{viewModel.appName}</h1>
//         <p className="home__subtitle">{viewModel.subtitle}</p>
//       </section>

//       <section className="module-list" aria-label="Modulos iniciais">
//         {viewModel.isLoading ? (
//           <p className="module-list__loading">Carregando modulos...</p>
//         ) : (
//           viewModel.modules.map((module) => (
//             <article className="module-card" key={module.id}>
//               <p className="module-card__status">{module.status}</p>
//               <h2 className="module-card__title">{module.name}</h2>
//               <p className="module-card__description">{module.description}</p>
//             </article>
//           ))
//         )}
//       </section>
//     </main>
//   );
// }
// import { VesselsPage }
// from "./VesselsPage";

// export default function App() {
//   return <VesselsPage />;
// }
import CreateVesselPage  from "./CreateVesselPage";

export function App() {
  return <CreateVesselPage />;
}