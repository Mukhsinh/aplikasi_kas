import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // Import RadioGroup components
import { showSuccess } from "@/utils/toast";

const CashDisbursements: React.FC = () => {
  const [paymentType, setPaymentType] = useState<string>("tunai"); // State for payment type

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logika untuk menyimpan pengeluaran kas akan ditambahkan di sini
    console.log("Jenis Pembayaran:", paymentType);
    showSuccess("Pengeluaran kas berhasil dicatat (simulasi)");
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Pengeluaran Kas</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="transactionNumber">Nomor Transaksi</Label>
              <Input id="transactionNumber" type="text" placeholder="Masukkan nomor transaksi" />
            </div>
            <div>
              <Label htmlFor="date">Tanggal</Label>
              <Input id="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
            </div>
            <div>
              <Label htmlFor="amount">Jumlah (Rp)</Label>
              <Input id="amount" type="number" placeholder="Masukkan jumlah" />
            </div>
            <div>
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea id="description" placeholder="Deskripsi pengeluaran" />
            </div>
            <div>
              <Label>Jenis Pembayaran</Label>
              <RadioGroup defaultValue="tunai" onValueChange={setPaymentType} className="flex space-x-4 mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tunai" id="tunai" />
                  <Label htmlFor="tunai">Tunai</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bank" id="bank" />
                  <Label htmlFor="bank">Bank</Label>
                </div>
              </RadioGroup>
            </div>
            <Button type="submit">Catat Pengeluaran</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CashDisbursements;