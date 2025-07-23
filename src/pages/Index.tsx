import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDownCircle, ArrowUpCircle, ReceiptText, Wallet, FileText, Settings, Printer, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import React, { useState, useEffect, useMemo } from "react"; // Import React and hooks, useMemo
import { getTransactions, Transaction } from "@/data/transactions"; // Import getTransactions and Transaction type
import { format, isSameMonth, isSameYear, endOfMonth } from "date-fns"; // Import date-fns functions
import { id } from "date-fns/locale"; // Import locale for Indonesian month names

const navItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Penerimaan Kas", path: "/penerimaan-kas", icon: ReceiptText },
  { name: "Pengeluaran Kas", path: "/pengeluaran-kas", icon: Wallet },
  { name: "Laporan Saldo Kas", path: "/laporan-saldo-kas", icon: FileText },
  { name: "Cetak Laporan", path: "/cetak-laporan", icon: Printer },
  { name: "Master Setting", path: "/master-setting", icon: Settings },
];

const Index = () => {
  const [userName, setUserName] = useState<string>("");
  const [allAppTransactions, setAllAppTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const savedUserName = localStorage.getItem("userName");
    if (savedUserName) {
      setUserName(savedUserName);
    } else {
      setUserName("Pengguna"); // Default if not set
    }

    // Load transactions initially
    setAllAppTransactions(getTransactions());

    // Listen for storage changes to update transactions in real-time
    const handleStorageChange = () => {
      setAllAppTransactions(getTransactions());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const { totalBalance, monthlyInflow, monthlyOutflow, lastTransactionDate } = useMemo(() => {
    let currentBalance = 0;
    const initialSaldoEntry = allAppTransactions.find(t => t.type === "Saldo");
    let initialBalance = initialSaldoEntry?.amount || 0;
    currentBalance = initialBalance;

    const nonSaldoTransactions = allAppTransactions
      .filter(t => t.type !== "Saldo")
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Calculate total balance
    nonSaldoTransactions.forEach(t => {
      if (t.type === "Penerimaan") {
        currentBalance += t.amount;
      } else if (t.type === "Pengeluaran") {
        currentBalance -= t.amount;
      }
    });

    // Calculate monthly inflow and outflow
    const today = new Date();
    let inflow = 0;
    let outflow = 0;

    nonSaldoTransactions.forEach(t => {
      const transactionDate = new Date(t.date);
      if (isSameMonth(transactionDate, today) && isSameYear(transactionDate, today)) {
        if (t.type === "Penerimaan") {
          inflow += t.amount;
        } else if (t.type === "Pengeluaran") {
          outflow += t.amount;
        }
      }
    });

    const latestTransaction = allAppTransactions
      .filter(t => t.type !== "Saldo")
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    
    const dateToDisplay = latestTransaction ? new Date(latestTransaction.date) : new Date();

    return {
      totalBalance: currentBalance,
      monthlyInflow: inflow,
      monthlyOutflow: outflow,
      lastTransactionDate: format(endOfMonth(dateToDisplay), "dd MMMM yyyy", { locale: id })
    };
  }, [allAppTransactions]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-2 text-center">Aplikasi Bendahara IBI Cab Kota Pekalongan</h1>
      <p className="text-xl text-center text-muted-foreground mb-8">Selamat Datang, {userName}!</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Saldo Kas</CardTitle>
            <span className="text-muted-foreground font-bold text-lg">Rp</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {totalBalance.toLocaleString('id-ID')}</div>
            <p className="text-xs text-muted-foreground">Per {lastTransactionDate}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Penerimaan Bulan Ini</CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {monthlyInflow.toLocaleString('id-ID')}</div>
            <p className="text-xs text-muted-foreground">Bulan {format(new Date(), "MMMM yyyy", { locale: id })}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pengeluaran Bulan Ini</CardTitle>
            <ArrowDownCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {monthlyOutflow.toLocaleString('id-ID')}</div>
            <p className="text-xs text-muted-foreground">Bulan {format(new Date(), "MMMM yyyy", { locale: id })}</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-center">Menu Aplikasi</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {navItems.map((item) => (
          <Card key={item.path} className="flex flex-col items-center justify-center p-6 text-center">
            <CardContent className="p-0 flex flex-col items-center">
              <item.icon className="h-12 w-12 text-primary mb-4" />
              <Link to={item.path} className="w-full">
                <Button variant="ghost" className="text-lg font-semibold w-full h-auto py-2">
                  {item.name}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Index;