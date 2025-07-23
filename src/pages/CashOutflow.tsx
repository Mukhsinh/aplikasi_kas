import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CashOutflow: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Pengeluaran Kas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Halaman ini akan digunakan untuk mencatat pengeluaran kas.</p>
          {/* Future content for cash outflow form/list */}
        </CardContent>
      </Card>
    </div>
  );
};

export default CashOutflow;