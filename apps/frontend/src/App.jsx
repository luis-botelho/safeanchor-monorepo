import AppRouter from "./router/AppRouter";
import CookieNotice from "./components/CookieNotice";
import WhatsAppButton from "./components/WhatsAppButton";

export default function App() {
  return (
    <>
      <AppRouter />
      <WhatsAppButton />
      <CookieNotice />
    </>
  );
}
