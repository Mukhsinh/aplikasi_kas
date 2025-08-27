import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { showSuccess, showError } from "@/utils/toast";
import { getTransactions, updateTransaction, Transaction } from "@/data/transactions";
import { supabase } from "@/integrations/supabase/client"; // Import supabase client
import { useSession } from "@/components/SessionContextProvider"; // Import useSession

const MasterSetting: React.FC = () => {
  const { user } = useSession(); // Get current user from session
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [bankAccountName, setBankAccountName] = useState<string>("");
  const [bankAccountNumber, setBankAccountNumber] = useState<string>("");
  const [bankName, setBankName] = useState<string>("");
  const [initialBalance, setInitialBalance] = useState<string>("");
  const [initialBalancePaymentType, setInitialBalancePaymentType] = useState<"Tunai" | "Bank" | "">("");
  const [userRole, setUserRole] = useState<string>(""); // State for user role

  useEffect(() => {
    const loadSettings = async () => {
      if (user) {
        // Fetch user profile from Supabase
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('first_name, last_name, role')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError.message);
          showError("Gagal memuat profil pengguna.");
        } else if (profile) {
          setFirstName(profile.first_name || "");
          setLastName(profile.last_name || "");
          setUserRole(profile.role || "user");
        }
      }

      const savedBankAccountName = localStorage.getItem("bankAccountName");
      const savedBankAccountNumber = localStorage.getItem("bankAccountNumber");
      const savedBankName = localStorage.getItem("bankName");

      setBankAccountName(savedBankAccountName || "");
      setBankAccountNumber(savedBankAccountNumber || "");
      setBankName(savedBankName || "");

      // Load initial saldo from transactions
      const transactions = getTransactions();
      const saldoEntry = transactions.find(t => t.id === 1 && t.type === "Saldo");
      if (saldoEntry) {
        setInitialBalance(saldoEntry.amount.toString());
        setInitialBalancePaymentType(saldoEntry.paymentType);
      }
    };

    loadSettings();
  }, [user]);

  const handleSaveSettings = async () => {
    if (!user) {
      showError("Anda harus login untuk menyimpan pengaturan.");
      return;
    }

    // Update user profile in Supabase
    const { error: updateProfileError } = await supabase
      .from('profiles')
      .update({ first_name: firstName, last_name: lastName, role: userRole, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (updateProfileError) {
      console.error("Error updating profile:", updateProfileError.message);
      showError("Gagal memperbarui profil pengguna.");
      return;
    }

    localStorage.setItem("bankAccountName", bankAccountName);
    localStorage.setItem("bankAccountNumber", bankAccountNumber);
    localStorage.setItem("bankName", bankName);

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
            <Label htmlFor="firstName">Nama Depan</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Masukkan nama depan Anda"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Nama Belakang</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Masukkan nama belakang Anda"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="userRole">Peran Pengguna</Label>
            <Select
              value={userRole}
              onValueChange={(value: string) => setUserRole(value)}
              disabled={userRole !== 'admin'} // Only admin can change roles
            >
              <SelectTrigger id="userRole">
                <SelectValue placeholder="Pilih Peran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
            {userRole !== 'admin' && (
              <p className="text-sm text-muted-foreground">Hanya admin yang dapat mengubah peran.</p>
            )}
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