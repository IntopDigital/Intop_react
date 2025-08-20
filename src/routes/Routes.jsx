import React from "react";
import {
  HomePage,
  AboutPage,
  ContactPage,
  ServicePage,
  NotFoundPage,
} from "../pages/index";

import Layout from "../common/layout/Layout";

const routesConfig = [
  {
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage />, meta: { title: "Home | Intop" } },
      {
        path: "about",
        element: <AboutPage />,
        meta: { title: "About Us | Intop" },
      },
      {
        path: "contact",
        element: <ContactPage />,
        meta: { title: "Contact | Intop" },
      },
      {
        path: "services", // Parent route for all services
        element: <ServicePage />, // This component (Service.jsx) renders an <Outlet/>
        meta: { title: "Our Services | Intop" },
        children: [
          //   {
          //     path: "comming-soon",
          //     element: <CommingSoon />,
          //     meta: { title: "cooming soon page| Services | Intop" },
          //   },
          //   {
          //     path: "web-development", // Child route: /services/web-development
          //     element: <WebDevelopment />,
          //     meta: { title: "Web Development | Services | Intop" },
          //   },
          //   {
          //     path: "app-development", // Child route: /services/web-development
          //     element: <AppDevelopment />,
          //     meta: { title: "app-development | Services | Intop" },
          //   },
        ],
      },
      {
        path: "*",
        element: <NotFoundPage />,
        meta: { title: "Page Not Found | Intop" },
      },
    ],
  },
];

export default routesConfig;
