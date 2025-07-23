import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Transaction {
  id: number;
  date: string;
  description: string;
  type: "Penerimaan" | "Pengeluaran" | "Saldo";
  amount: number;
  paymentType?: "Tunai" | "Bank"; // Tambahkan jenis pembayaran
}

const CashBalanceReport: React.FC = () => {
  // Data simulasi untuk laporan dengan jenis pembayaran
  const allTransactions: Transaction[] = [
    { id: 1, date: "2023-01-01", description: "Saldo Awal", type: "Saldo", amount: 1000000, paymentType: "Tunai" },
    { id: 2, date: "2023-01-05", description: "Penjualan Produk A", type: "Penerimaan", amount: 500000, paymentType: "Tunai" },
    { id: 3, date: "2023-01-10", description: "Pembelian Bahan Baku", type: "Pengeluaran", amount: 200000, paymentType: "Bank" },
    { id: 4, date: "2023-01-15", description: "Pembayaran Gaji", type: "Pengeluaran", amount: 300000, paymentType: "Tunai" },
    { id: 5, date: "2023-01-20", description: "Pendapatan Jasa", type: "Penerimaan", amount: 700000, paymentType: "Bank" },
    { id: 6, date: "2023-01-25", description: "Penjualan Produk B", type: "Penerimaan", amount: 250000, paymentType: "Tunai" },
    { id: 7, date: "2023-01-28", description: "Pembayaran Listrik", type: "Pengeluaran", amount: 150000, paymentType: "Bank" },
  ];

  const [filterType, setFilterType] = useState<"all" | "tunai" | "bank">("all");

  const filteredTransactions = useMemo(() => {
    if (filterType === "all") {
      return allTransactions;
    }
    return allTransactions.filter(t => t.paymentType === filterType.charAt(0).toUpperCase() + filterType.slice(1));
  }, [filterType, allTransactions]);

  const calculateBalance = (transactionsToCalculate: Transaction[]) => {
    let balance = 0;
    transactionsToCalculate.forEach(t => {
      if (t.type === "Penerimaan" || t.type === "Saldo") {
        balance += t.amount;
      } else if (t.type === "Pengeluaran") {
        balance -= t.amount;
      }
    });
    return balance;
  };

  const currentBalance = calculateBalance(filteredTransactions);

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Laporan Saldo Kas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Filter Berdasarkan Jenis Pembayaran</h3>
            <RadioGroup
              defaultValue="all"
              onValueChange={(value: "all" | "tunai" | "bank") => setFilterType(value)}
              className="flex space-x-4 mb-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="filter-all" />
                <Label htmlFor="filter-all">Gabungan</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="tunai" id="filter-tunai" />
                <Label htmlFor="filter-tunai">Tunai</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bank" id="filter-bank" />
                <Label htmlFor="filter-bank">Bank</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold">Ringkasan Saldo</h3>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              Saldo Saat Ini: Rp {currentBalance.toLocaleString('id-ID')}
            </p>
          </div>

          <h3 className="text-xl font-semibold mb-4">Detail Transaksi</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Tipe Pembayaran</TableHead> {/* New column */}
                  <TableHead className="text-right">Jumlah (Rp)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.type === "Penerimaan" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" :
                        transaction.type === "Pengeluaran" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" :
                        "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                      }`}>
                        {transaction.type}
                      </span>
                    </TableCell>
                    <TableCell>{transaction.paymentType || '-'}</TableCell> {/* Display payment type */}
                    <TableCell className={`text-right ${
                      transaction.type === "Penerimaan" ? "text-green-600 dark:text-green-400" :
                      transaction.type === "Pengeluaran" ? "text-red-600 dark:text-red-400" :
                      "text-foreground"
                    }`}>
                      {transaction.type === "Pengeluaran" ? "-" : ""}Rp {transaction.amount.toLocaleString('id-ID')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CashBalanceReport;