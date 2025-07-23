import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button"; // Import Button component
import { getTransactions, Transaction } from "@/data/transactions"; // Import getTransactions
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils"; // Import cn for conditional class names

const CashBalanceReport: React.FC = () => {
  const [filterPaymentType, setFilterPaymentType] = useState<"All" | "Tunai" | "Bank">("All");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Default rows per page

  useEffect(() => {
    setTransactions(getTransactions());
  }, []); // Load transactions on component mount

  // Re-fetch transactions when a new one is added (e.g., from other pages)
  // This is a simple way to react to localStorage changes. For a more robust solution,
  // you might use a custom hook that listens to 'storage' events or a global state manager.
  useEffect(() => {
    const handleStorageChange = () => {
      setTransactions(getTransactions());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const filteredTransactions = useMemo(() => {
    let currentBalance = 0;
    const initialSaldoEntry = transactions.find(t => t.type === "Saldo");
    let initialBalance = initialSaldoEntry?.amount || 0;
    currentBalance = initialBalance;

    const nonSaldoTransactions = transactions
      .filter(t => t.type !== "Saldo")
      .filter(t => filterPaymentType === "All" || t.paymentType === filterPaymentType)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let transactionsWithBalance: (Transaction & { balance: number })[] = [];

    // Add initial saldo as the first entry if it exists
    if (initialSaldoEntry) {
      transactionsWithBalance.push({ ...initialSaldoEntry, balance: initialBalance });
    }

    nonSaldoTransactions.forEach(t => {
      if (t.type === "Penerimaan") {
        currentBalance += t.amount;
      } else if (t.type === "Pengeluaran") {
        currentBalance -= t.amount;
      }
      transactionsWithBalance.push({ ...t, balance: currentBalance });
    });

    return transactionsWithBalance;
  }, [filterPaymentType, transactions]);

  const totalBalance = useMemo(() => {
    if (filteredTransactions.length === 0) return 0;
    return filteredTransactions[filteredTransactions.length - 1].balance;
  }, [filteredTransactions]);

  // Pagination logic
  const totalPages = Math.ceil(filteredTransactions.length / rowsPerPage);
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredTransactions.slice(startIndex, endIndex);
  }, [filteredTransactions, currentPage, rowsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(parseInt(value));
    setCurrentPage(1); // Reset to first page when rows per page changes
  };

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
                {paginatedTransactions.length > 0 ? (
                  paginatedTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{format(new Date(transaction.date), "dd MMM yyyy", { locale: id })}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell>{transaction.paymentType}</TableCell>
                      <TableCell className={cn(
                        "text-right",
                        transaction.type === "Penerimaan" && "text-green-600",
                        transaction.type === "Pengeluaran" && "text-red-600"
                      )}>
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

          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <Label htmlFor="rows-per-page">Baris per halaman:</Label>
              <Select value={String(rowsPerPage)} onValueChange={handleRowsPerPageChange}>
                <SelectTrigger id="rows-per-page" className="w-[80px]">
                  <SelectValue placeholder={rowsPerPage} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Sebelumnya
              </Button>
              <span className="text-sm font-medium">
                Halaman {currentPage} dari {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Berikutnya
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CashBalanceReport;