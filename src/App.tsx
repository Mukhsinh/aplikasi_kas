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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Index /></Layout>} />
          <Route path="/penerimaan-kas" element={<Layout><CashInflow /></Layout>} />
          <Route path="/pengeluaran-kas" element={<Layout><CashOutflow /></Layout>} />
          <Route path="/laporan-saldo-kas" element={<Layout><CashBalanceReport /></Layout>} />
          <Route path="/master-setting" element={<Layout><MasterSetting /></Layout>} />
          <Route path="/cetak-laporan" element={<Layout><PrintReport /></Layout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;