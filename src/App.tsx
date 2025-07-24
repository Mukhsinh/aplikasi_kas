import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import CashBalanceReport from "./pages/CashBalanceReport";
import MasterSetting from "./pages/MasterSetting";
import PrintReport from "./pages/PrintReport";
import CashInflow from "./pages/CashInflow";
import CashOutflow from "./pages/CashOutflow";
import Login from "./pages/Login";

const queryClient = new QueryClient();

// ProtectedRoute component
const ProtectedRoute: React.FC<{ children: React.ReactNode; isLoggedIn: boolean }> = ({ children, isLoggedIn }) => {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    // Check login status from localStorage on app load
    const loggedInStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedInStatus);
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.setItem("isLoggedIn", "false");
    setIsLoggedIn(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
            <Route
              path="/"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <Layout onLogout={handleLogout}>
                    <Index />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/penerimaan-kas"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <Layout onLogout={handleLogout}>
                    <CashInflow />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/pengeluaran-kas"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <Layout onLogout={handleLogout}>
                    <CashOutflow />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/laporan-saldo-kas"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <Layout onLogout={handleLogout}>
                    <CashBalanceReport />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/master-setting"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <Layout onLogout={handleLogout}>
                    <MasterSetting />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/cetak-laporan"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <Layout onLogout={handleLogout}>
                    <PrintReport />
                  </Layout>
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;