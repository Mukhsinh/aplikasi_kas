import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { showSuccess, showError } from "@/utils/toast";

const CashOutflow: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [description, setDescription] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [paymentType, setPaymentType] = useState<"Tunai" | "Bank" | "">("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !description || !amount || !paymentType) {
      showError("Semua kolom harus diisi.");
      return;
    }

    const newTransaction = {
      date: format(date, "yyyy-MM-dd"),
      description,
      amount: parseFloat(amount),
      paymentType,
    };

    console.log("Pengeluaran Kas Baru:", newTransaction);
    showSuccess("Pengeluaran kas berhasil ditambahkan!");

    // Reset form
    setDate(new Date());
    setDescription("");
    setAmount("");
    setPaymentType("");
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Pengeluaran Kas</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="date">Tanggal</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pilih tanggal</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Contoh: Pembelian Bahan Baku"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Jumlah (Rp)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Contoh: 200000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment-type">Tipe Pembayaran</Label>
              <Select value={paymentType} onValueChange={(value: "Tunai" | "Bank") => setPaymentType(value)}>
                <SelectTrigger id="payment-type">
                  <SelectValue placeholder="Pilih Tipe Pembayaran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tunai">Tunai</SelectItem>
                  <SelectItem value="Bank">Bank</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full">Catat Pengeluaran</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CashOutflow;