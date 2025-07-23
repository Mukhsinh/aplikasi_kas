import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { allTransactions, Transaction } from "@/data/transactions"; // Import from shared data
import { format } from "date-fns";
import { id } from "date-fns/locale";

const CashBalanceReport: React.FC = () => {
  const [filterPaymentType, setFilterPaymentType] = useState<"All" | "Tunai" | "Bank">("All");

  const filteredTransactions = useMemo(() => {
    let currentBalance = 0;
    const filtered = allTransactions
      .filter(t => t.type !== "Saldo") // Exclude initial saldo from filtering by payment type
      .filter(t => filterPaymentType === "All" || t.paymentType === filterPaymentType)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Ensure chronological order

    // Re-calculate cumulative balance including initial saldo
    let transactionsWithBalance: (Transaction & { balance: number })[] = [];
    let initialBalance = allTransactions.find(t => t.type === "Saldo")?.amount || 0;
    currentBalance = initialBalance;

    // Add initial saldo as the first entry if it exists
    const initialSaldoEntry = allTransactions.find(t => t.type === "Saldo");
    if (initialSaldoEntry) {
      transactionsWithBalance.push({ ...initialSaldoEntry, balance: initialBalance });
    }

    filtered.forEach(t => {
      if (t.type === "Penerimaan") {
        currentBalance += t.amount;
      } else if (t.type === "Pengeluaran") {
        currentBalance -= t.amount;
      }
      transactionsWithBalance.push({ ...t, balance: currentBalance });
    });

    return transactionsWithBalance;
  }, [filterPaymentType]);

  const totalBalance = useMemo(() => {
    if (filteredTransactions.length === 0) return 0;
    return filteredTransactions[filteredTransactions.length - 1].balance;
  }, [filteredTransactions]);

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Laporan Saldo Kas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2 flex-1">
              <Label htmlFor="filter-payment-type">Filter Tipe Pembayaran</Label>
              <Select
                value={filterPaymentType}
                onValueChange={(value: "All" | "Tunai" | "Bank") => setFilterPaymentType(value)}
              >
                <SelectTrigger id="filter-payment-type">
                  <SelectValue placeholder="Semua Tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">Semua Tipe</SelectItem>
                  <SelectItem value="Tunai">Tunai</SelectItem>
                  <SelectItem value="Bank">Bank</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 text-right sm:text-left">
              <h3 className="text-lg font-semibold">Total Saldo:</h3>
              <p className="text-2xl font-bold text-primary">
                Rp {totalBalance.toLocaleString('id-ID')}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Tipe Pembayaran</TableHead>
                  <TableHead className="text-right">Jumlah (Rp)</TableHead>
                  <TableHead className="text-right">Saldo (Rp)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{format(new Date(transaction.date), "dd MMM yyyy", { locale: id })}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell>{transaction.paymentType}</TableCell>
                      <TableCell className="text-right">
                        {transaction.type === "Pengeluaran" ? "-" : ""}Rp {transaction.amount.toLocaleString('id-ID')}
                      </TableCell>
                      <TableCell className="text-right">Rp {transaction.balance.toLocaleString('id-ID')}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                      Tidak ada data transaksi untuk filter yang dipilih.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CashBalanceReport;