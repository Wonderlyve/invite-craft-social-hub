
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import useScrollToTop from "./hooks/useScrollToTop"; // Fixed import

// Pages
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import AuthPage from "@/pages/AuthPage";
import AboutPage from "@/pages/AboutPage";
import EventsPage from "@/pages/EventsPage";
import CreateEventPage from "@/pages/CreateEventPage";
import GuestsPage from "@/pages/GuestsPage";
import DesignsPage from "@/pages/DesignsPage";
import EditorPage from "@/pages/EditorPage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Initialisation du client de requête
const queryClient = new QueryClient();

// Composant pour appliquer le scroll top
const ScrollToTop = () => {
  useScrollToTop();
  return null;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="invitecraft-theme">
        <TooltipProvider>
          <Router>
            <AuthProvider>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route
                  path="/events"
                  element={
                    <ProtectedRoute>
                      <EventsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/events/create"
                  element={
                    <ProtectedRoute>
                      <CreateEventPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/events/:eventId/guests"
                  element={
                    <ProtectedRoute>
                      <GuestsPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/designs" element={<DesignsPage />} />
                <Route
                  path="/editor"
                  element={
                    <ProtectedRoute>
                      <EditorPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
              <Toaster position="top-center" />
            </AuthProvider>
          </Router>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
