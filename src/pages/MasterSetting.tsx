import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { showSuccess } from "@/utils/toast";
import { getTransactions, updateTransaction, Transaction } from "@/data/transactions";

const MasterSetting: React.FC = () => {
  const [userName, setUserName] = useState<string>("");
  const [bankAccountName, setBankAccountName] = useState<string>("");
  const [bankAccountNumber, setBankAccountNumber] = useState<string>("");
  const [bankName, setBankName] = useState<string>("");
  const [initialBalance, setInitialBalance] = useState<string>("");
  const [initialBalancePaymentType, setInitialBalancePaymentType] = useState<"Tunai" | "Bank" | "">("");
  const [password, setPassword] = useState<string>(""); // New state for password

  useEffect(() => {
    const savedUserName = localStorage.getItem("userName");
    const savedBankAccountName = localStorage.getItem("bankAccountName");
    const savedBankAccountNumber = localStorage.getItem("bankAccountNumber");
    const savedBankName = localStorage.getItem("bankName");
    const savedPassword = localStorage.getItem("appPassword"); // Load saved password

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
    if (savedPassword) {
      setPassword(savedPassword); // Set password from localStorage
    }

    // Load initial saldo from transactions
    const transactions = getTransactions();
    const saldoEntry = transactions.find(t => t.id === 1 && t.type === "Saldo");
    if (saldoEntry) {
      setInitialBalance(saldoEntry.amount.toString());
      setInitialBalancePaymentType(saldoEntry.paymentType);
    }
  }, []);

  const handleSaveSettings = () => {
    localStorage.setItem("userName", userName);
    localStorage.setItem("bankAccountName", bankAccountName);
    localStorage.setItem("bankAccountNumber", bankAccountNumber);
    localStorage.setItem("bankName", bankName);
    localStorage.setItem("appPassword", password); // Save the password

    // Update the initial saldo transaction
    const currentTransactions = getTransactions();
    const existingSaldoIndex = currentTransactions.findIndex(t => t.id === 1 && t.type === "Saldo");

    const updatedSaldo: Transaction = {
      id: 1,
      date: "2023-01-01", // Keep the fixed date for initial saldo
      description: "Saldo Awal",
      type: "Saldo",
      amount: parseFloat(initialBalance),
      paymentType: initialBalancePaymentType as "Tunai" | "Bank",
    };

    if (existingSaldoIndex !== -1) {
      updateTransaction(updatedSaldo);
    } else {
      // This case should ideally not happen if getTransactions always ensures initialSaldo exists
      // But as a fallback, add it if it's somehow missing
      const newTransactions = [updatedSaldo, ...currentTransactions];
      localStorage.setItem("cash_transactions", JSON.stringify(newTransactions));
    }

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
            <Label htmlFor="password">Password Aplikasi</Label>
            <Input
              id="password"
              type="password" // Set type to password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
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
          <div className="space-y-2">
            <Label htmlFor="initialBalance">Saldo Awal (Rp)</Label>
            <Input
              id="initialBalance"
              type="number"
              value={initialBalance}
              onChange={(e) => setInitialBalance(e.target.value)}
              placeholder="Contoh: 1000000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="initialBalancePaymentType">Tipe Pembayaran Saldo Awal</Label>
            <Select
              value={initialBalancePaymentType}
              onValueChange={(value: "Tunai" | "Bank") => setInitialBalancePaymentType(value)}
            >
              <SelectTrigger id="initialBalancePaymentType">
                <SelectValue placeholder="Pilih Tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tunai">Tunai</SelectItem>
                <SelectItem value="Bank">Bank</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSaveSettings} className="w-full">Simpan Pengaturan</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MasterSetting;