import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { showSuccess } from "@/utils/toast";

const MasterSetting: React.FC = () => {
  const [userName, setUserName] = useState<string>("");
  const [bankAccount, setBankAccount] = useState<string>("");

  useEffect(() => {
    // Load saved user name and bank account from localStorage on component mount
    const savedUserName = localStorage.getItem("userName");
    if (savedUserName) {
      setUserName(savedUserName);
    }
    const savedBankAccount = localStorage.getItem("bankAccount");
    if (savedBankAccount) {
      setBankAccount(savedBankAccount);
    }
  }, []);

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("userName", userName); // Save to localStorage
    console.log("Pengguna disimpan:", userName);
    showSuccess("Pengguna berhasil disimpan!");
    // Optionally, trigger a refresh or update context if needed for immediate display in Layout
    window.dispatchEvent(new Event('userNameUpdated')); // Custom event to notify Layout
  };

  const handleSaveBankAccount = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("bankAccount", bankAccount); // Save to localStorage
    console.log("Nomor Rekening Bank disimpan:", bankAccount);
    showSuccess("Nomor Rekening Bank berhasil disimpan!");
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Master Setting</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Pengaturan Pengguna */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Pengaturan Pengguna</h3>
            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <Label htmlFor="userName">Nama Pengguna</Label>
                <Input
                  id="userName"
                  type="text"
                  placeholder="Masukkan nama pengguna"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              <Button type="submit">Simpan Pengguna</Button>
            </form>
          </div>

          {/* Pengaturan Rekening Bank */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Pengaturan Rekening Bank</h3>
            <form onSubmit={handleSaveBankAccount} className="space-y-4">
              <div>
                <Label htmlFor="bankAccount">Nomor Rekening Bank</Label>
                <Input
                  id="bankAccount"
                  type="text"
                  placeholder="Masukkan nomor rekening bank"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                />
              </div>
              <Button type="submit">Simpan Rekening Bank</Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MasterSetting;