import { useEffect } from "react";
import { useLocation, matchRoutes } from "react-router-dom";

const ScrollAndTitleHandler = ({ routes }) => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to the top of the page on every route change
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    // `matchRoutes` helps find the current route object(s) from your config
    // based on the current location. It's suitable for object-based route configurations.
    const matchedRoutes = matchRoutes(routes, location.pathname);

    let title = "Intop Digital"; // Default title

    if (matchedRoutes && matchedRoutes.length > 0) {
      // The last match is the most specific one
      const currentRoute = matchedRoutes[matchedRoutes.length - 1].route;
      if (currentRoute.meta && currentRoute.meta.title) {
        title = currentRoute.meta.title;
      }
    }
    document.title = title;
  }, [location.pathname, routes]); // Rerun when location or routes change

  return null; // This component does not render any UI elements
};

export default ScrollAndTitleHandler;
