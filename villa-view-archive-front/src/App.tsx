
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { VideoProvider } from "./contexts/VideoContext";
import Homepage from "./pages/Homepage";
import AdminLogin from "./pages/AdminLogin";
import VisitorLogin from "./pages/VisitorLogin";
import AdminDashboard from "./pages/AdminDashboard";
import VisitorDashboard from "./pages/VisitorDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <VideoProvider>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/visitor/login" element={<VisitorLogin />} />
              <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
              <Route path="/visitor/dashboard/*" element={<VisitorDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </VideoProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
