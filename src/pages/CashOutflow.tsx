import React, { useState, useEffect } from "react";
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
import { addTransaction, getTransactions, updateTransaction, deleteTransaction, Transaction } from "@/data/transactions"; // Import all necessary functions
import TransactionTable from "@/components/TransactionTable"; // Import the new component

const CashOutflow: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [transactionNumber, setTransactionNumber] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [paymentType, setPaymentType] = useState<"Tunai" | "Bank" | "">("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    loadTransactions();
    const handleStorageChange = () => {
      loadTransactions();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const loadTransactions = () => {
    setTransactions(getTransactions());
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !transactionNumber || !description || !amount || !paymentType) {
      showError("Semua kolom harus diisi.");
      return;
    }

    const transactionData = {
      date: format(date, "yyyy-MM-dd"),
      transactionNumber,
      description,
      amount: parseFloat(amount),
      paymentType,
      type: "Pengeluaran" as "Pengeluaran",
    };

    if (editingTransaction) {
      updateTransaction({ ...editingTransaction, ...transactionData });
      showSuccess("Pengeluaran kas berhasil diperbarui!");
      setEditingTransaction(null); // Exit edit mode
    } else {
      addTransaction(transactionData);
      showSuccess("Pengeluaran kas berhasil ditambahkan!");
    }

    resetForm();
    loadTransactions(); // Reload transactions to update the table
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setDate(new Date(transaction.date));
    setTransactionNumber(transaction.transactionNumber || "");
    setDescription(transaction.description);
    setAmount(transaction.amount.toString());
    setPaymentType(transaction.paymentType);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
      deleteTransaction(id);
      showSuccess("Transaksi berhasil dihapus!");
      loadTransactions(); // Reload transactions to update the table
      if (editingTransaction && editingTransaction.id === id) {
        resetForm(); // Clear form if the deleted item was being edited
      }
    }
  };

  const resetForm = () => {
    setDate(new Date());
    setTransactionNumber("");
    setDescription("");
    setAmount("");
    setPaymentType("");
    setEditingTransaction(null); // Clear editing state
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{editingTransaction ? "Edit Pengeluaran Kas" : "Pengeluaran Kas Baru"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFormSubmit} className="space-y-6">
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
                placeholder="Contoh: TRN002"
              />
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

            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                {editingTransaction ? "Perbarui Transaksi" : "Catat Pengeluaran"}
              </Button>
              {editingTransaction && (
                <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                  Batal Edit
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Pratinjau Pengeluaran Kas</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionTable
            transactions={transactions}
            onEdit={handleEdit}
            onDelete={handleDelete}
            typeFilter="Pengeluaran"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CashOutflow;