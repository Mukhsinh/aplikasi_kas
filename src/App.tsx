import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import CashBalanceReport from "./pages/CashBalanceReport";
import MasterSetting from "./pages/MasterSetting";
import PrintReport from "./pages/PrintReport";
import CashInflow from "./pages/CashInflow";
import CashOutflow from "./pages/CashOutflow";
import Login from "./pages/Login";
import { SessionContextProvider, useSession } from "./components/SessionContextProvider";
import { supabase } from "./integrations/supabase/client";
import { showError } from "./utils/toast";
import ImportData from "./pages/ImportData";
import AdminRoleManagement from "./pages/AdminRoleManagement"; // Import the new AdminRoleManagement component

const queryClient = new QueryClient();

// ProtectedRoute component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return <div>Loading authentication...</div>; // Or a proper loading spinner
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const AppContent = () => {
  const { session } = useSession();
  
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      showError("Gagal logout: " + error.message);
    }
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout onLogout={handleLogout}>
              <Index />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/penerimaan-kas"
        element={
          <ProtectedRoute>
            <Layout onLogout={handleLogout}>
              <CashInflow />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/pengeluaran-kas"
        element={
          <ProtectedRoute>
            <Layout onLogout={handleLogout}>
              <CashOutflow />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/laporan-saldo-kas"
        element={
          <ProtectedRoute>
            <Layout onLogout={handleLogout}>
              <CashBalanceReport />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/master-setting"
        element={
          <ProtectedRoute>
            <Layout onLogout={handleLogout}>
              <MasterSetting />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/cetak-laporan"
        element={
          <ProtectedRoute>
            <Layout onLogout={handleLogout}>
              <PrintReport />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/import-data"
        element={
          <ProtectedRoute>
            <Layout onLogout={handleLogout}>
              <ImportData />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/role-management"
        element={
          <ProtectedRoute>
            <Layout onLogout={handleLogout}>
              <AdminRoleManagement />
            </Layout>
          </ProtectedRoute>
        }
      />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SessionContextProvider>
            <AppContent />
          </SessionContextProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;