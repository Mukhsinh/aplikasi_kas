import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { showSuccess } from "@/utils/toast";

const MasterSetting: React.FC = () => {
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const savedUserName = localStorage.getItem("userName");
    if (savedUserName) {
      setUserName(savedUserName);
    }
  }, []);

  const handleSaveUserName = () => {
    localStorage.setItem("userName", userName);
    showSuccess("Nama pengguna berhasil disimpan!");
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Master Setting</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="userName">Nama Pengguna (untuk laporan)</Label>
            <Input
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Masukkan nama Anda"
            />
          </div>
          <Button onClick={handleSaveUserName} className="w-full">Simpan Nama Pengguna</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MasterSetting;