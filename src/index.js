import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import "./styles/globals.css";
import appRouter from "./app/routes";
import { initWebVitals } from "./utils/reportWebVitals";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error(
    'Unable to start the application: no element with id "root".'
  );
}

createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={appRouter} />
  </StrictMode>
);

initWebVitals();
