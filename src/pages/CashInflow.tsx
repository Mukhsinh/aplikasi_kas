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
import { addTransaction } from "@/data/transactions"; // Import addTransaction

const CashInflow: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [transactionNumber, setTransactionNumber] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [receiptType, setReceiptType] = useState<"Tunai" | "Bank" | "">("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !transactionNumber || !description || !amount || !receiptType) {
      showError("Semua kolom harus diisi.");
      return;
    }

    const newTransaction = {
      date: format(date, "yyyy-MM-dd"),
      transactionNumber,
      description,
      amount: parseFloat(amount),
      paymentType: receiptType, // Use paymentType as per Transaction interface
      type: "Penerimaan" as "Penerimaan", // Explicitly set type
    };

    addTransaction(newTransaction); // Save to local storage
    showSuccess("Penerimaan kas berhasil ditambahkan!");

    // Reset form
    setDate(new Date());
    setTransactionNumber("");
    setDescription("");
    setAmount("");
    setReceiptType("");
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Penerimaan Kas</CardTitle>
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
              <Label htmlFor="transactionNumber">Nomor Transaksi</Label>
              <Input
                id="transactionNumber"
                value={transactionNumber}
                onChange={(e) => setTransactionNumber(e.target.value)}
                placeholder="Contoh: TRN001"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Contoh: Penjualan Produk A"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Jumlah (Rp)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Contoh: 500000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="receipt-type">Tipe Penerimaan</Label>
              <Select value={receiptType} onValueChange={(value: "Tunai" | "Bank") => setReceiptType(value)}>
                <SelectTrigger id="receipt-type">
                  <SelectValue placeholder="Pilih Tipe Penerimaan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tunai">Tunai</SelectItem>
                  <SelectItem value="Bank">Bank</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full">Catat Penerimaan</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CashInflow;