import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CashBalanceReport: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Laporan Saldo Kas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Halaman ini akan menampilkan laporan saldo kas.</p>
          {/* Future content for cash balance report */}
        </CardContent>
      </Card>
    </div>
  );
};

export default CashBalanceReport;