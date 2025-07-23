import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MasterSetting: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Master Setting</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Halaman ini akan digunakan untuk pengaturan master data.</p>
          {/* Future content for master settings */}
        </CardContent>
      </Card>
    </div>
  );
};

export default MasterSetting;