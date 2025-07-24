import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import CashBalanceReport from "./pages/CashBalanceReport";
import MasterSetting from "./pages/MasterSetting";
import PrintReport from "./pages/PrintReport";
import CashInflow from "./pages/CashInflow";
import CashOutflow from "./pages/CashOutflow";
import Login from "./pages/Login"; // Import Login component
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider> {/* Wrap BrowserRouter with AuthProvider */}
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} /> {/* Login route */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout><Index /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/penerimaan-kas"
              element={
                <ProtectedRoute>
                  <Layout><CashInflow /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/pengeluaran-kas"
              element={
                <ProtectedRoute>
                  <Layout><CashOutflow /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/laporan-saldo-kas"
              element={
                <ProtectedRoute>
                  <Layout><CashBalanceReport /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/master-setting"
              element={
                <ProtectedRoute>
                  <Layout><MasterSetting /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/cetak-laporan"
              element={
                <ProtectedRoute>
                  <Layout><PrintReport /></Layout>
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;