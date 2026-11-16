import { lazy, Suspense, useEffect, useState } from "react";
import App from "./App";

const BeltGuide = lazy(() => import("./BeltGuide"));
const isBeltPage = () => location.hash.startsWith("#/droga-po-pas");

export default function SiteRouter() {
  const [belts, setBelts] = useState(isBeltPage);
  useEffect(() => {
    const update = () => {
      setBelts(isBeltPage());
      if (isBeltPage()) window.scrollTo({ top: 0, behavior: "instant" });
    };
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);
  return belts ? (
    <Suspense
      fallback={
        <main className="shell section">
          <p role="status">Otwieram Drogę po pas…</p>
        </main>
      }
    >
      <BeltGuide />
    </Suspense>
  ) : (
    <App />
  );
}
