import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { showSuccess } from "@/utils/toast";

const MasterSetting: React.FC = () => {
  const [userName, setUserName] = useState<string>("");
  const [bankAccountName, setBankAccountName] = useState<string>("");
  const [bankAccountNumber, setBankAccountNumber] = useState<string>("");
  const [bankName, setBankName] = useState<string>("");

  useEffect(() => {
    const savedUserName = localStorage.getItem("userName");
    const savedBankAccountName = localStorage.getItem("bankAccountName");
    const savedBankAccountNumber = localStorage.getItem("bankAccountNumber");
    const savedBankName = localStorage.getItem("bankName");

    if (savedUserName) {
      setUserName(savedUserName);
    }
    if (savedBankAccountName) {
      setBankAccountName(savedBankAccountName);
    }
    if (savedBankAccountNumber) {
      setBankAccountNumber(savedBankAccountNumber);
    }
    if (savedBankName) {
      setBankName(savedBankName);
    }
  }, []);

  const handleSaveSettings = () => {
    localStorage.setItem("userName", userName);
    localStorage.setItem("bankAccountName", bankAccountName);
    localStorage.setItem("bankAccountNumber", bankAccountNumber);
    localStorage.setItem("bankName", bankName);
    showSuccess("Pengaturan berhasil disimpan!");
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
          <div className="space-y-2">
            <Label htmlFor="bankAccountName">Nama Pemilik Rekening Bank</Label>
            <Input
              id="bankAccountName"
              value={bankAccountName}
              onChange={(e) => setBankAccountName(e.target.value)}
              placeholder="Contoh: John Doe"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bankAccountNumber">Nomor Rekening Bank</Label>
            <Input
              id="bankAccountNumber"
              value={bankAccountNumber}
              onChange={(e) => setBankAccountNumber(e.target.value)}
              placeholder="Contoh: 1234567890"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bankName">Nama Bank</Label>
            <Input
              id="bankName"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="Contoh: Bank Central Asia (BCA)"
            />
          </div>
          <Button onClick={handleSaveSettings} className="w-full">Simpan Pengaturan</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MasterSetting;