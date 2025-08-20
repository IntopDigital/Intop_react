import React, { Suspense } from "react";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import routesConfig from "./routes"; // Loads both client + admin routes

// --- Common Components ---
import ScrollAndTitleHandler from "./common/title/ScrollAndTitleHandler";
import ErrorBoundary from "./error/ErrorBoundary";

// 🧠 AppContent contains useRoutes logic
const AppContent = () => {
  const element = useRoutes(routesConfig);

  return (
    <>
      <ScrollAndTitleHandler routes={routesConfig} />
      <ErrorBoundary>{element}</ErrorBoundary>
    </>
  );
};

// 🌐 Main App with Router wrapper
const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
