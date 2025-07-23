import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/utils/toast";

const PrintReport: React.FC = () => {
  const handlePrint = () => {
    toast.showLoading("Mempersiapkan laporan...");
    setTimeout(() => {
      toast.dismissToast("loading"); // Dismiss the loading toast
      toast.success("Laporan berhasil dibuat (simulasi). Fungsionalitas ekspor ke Excel/PDF memerlukan implementasi backend atau pustaka sisi klien.");
    }, 2000);
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Cetak Laporan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Di halaman ini, Anda dapat menghasilkan laporan keuangan dalam format yang berbeda.
            Untuk tujuan demonstrasi, fungsionalitas ekspor ke Excel/PDF memerlukan integrasi backend atau pustaka sisi klien yang lebih kompleks.
          </p>
          <Button onClick={handlePrint} className="w-full md:w-auto">
            Generate Laporan (Simulasi)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrintReport;