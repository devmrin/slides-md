import { createRootRoute, createRoute, createRouter, Outlet } from "@tanstack/react-router";
import { HomePage } from "./pages/HomePage";
import { PresentationPage } from "./pages/PresentationPage";

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const presentationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/presentation/$id",
  component: PresentationPage,
});

const routeTree = rootRoute.addChildren([indexRoute, presentationRoute]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

