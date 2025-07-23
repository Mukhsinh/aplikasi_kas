import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import { getTransactions, Transaction } from "@/data/transactions";
import { format, isSameMonth, isSameYear, endOfMonth, subMonths } from "date-fns";
import { id } from "date-fns/locale";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";

const chartConfig = {
  inflow: {
    label: "Penerimaan",
    color: "hsl(var(--primary))",
  },
  outflow: {
    label: "Pengeluaran",
    color: "hsl(var(--destructive))",
  },
} as const;

const Index = () => {
  const [userName, setUserName] = useState<string>("");
  const [allAppTransactions, setAllAppTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const savedUserName = localStorage.getItem("userName");
    if (savedUserName) {
      setUserName(savedUserName);
    } else {
      setUserName("Pengguna");
    }

    setAllAppTransactions(getTransactions());

    const handleStorageChange = () => {
      setAllAppTransactions(getTransactions());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const { totalBalance, currentMonthInflow, currentMonthOutflow, lastTransactionDate, chartData } = useMemo(() => {
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

    // Calculate current month inflow and outflow for top cards
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

    // Prepare data for the chart (last 6 months)
    const monthlyDataMap = new Map<string, { inflow: number; outflow: number }>();
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(today, i);
      const monthKey = format(monthDate, "yyyy-MM");
      monthlyDataMap.set(monthKey, { inflow: 0, outflow: 0 });
    }

    allAppTransactions.forEach(t => {
      const transactionDate = new Date(t.date);
      const monthKey = format(transactionDate, "yyyy-MM");

      if (monthlyDataMap.has(monthKey)) {
        const data = monthlyDataMap.get(monthKey)!;
        if (t.type === "Penerimaan") {
          data.inflow += t.amount;
        } else if (t.type === "Pengeluaran") {
          data.outflow += t.amount;
        }
        monthlyDataMap.set(monthKey, data);
      }
    });

    const chartData = Array.from(monthlyDataMap.entries())
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .map(([key, data]) => ({
        month: format(new Date(key), "MMM yyyy", { locale: id }),
        inflow: data.inflow,
        outflow: data.outflow,
      }));

    return {
      totalBalance: currentBalance,
      currentMonthInflow: inflow,
      currentMonthOutflow: outflow,
      lastTransactionDate: format(endOfMonth(dateToDisplay), "dd MMMM yyyy", { locale: id }),
      chartData,
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
            <div className="text-2xl font-bold">Rp {currentMonthInflow.toLocaleString('id-ID')}</div>
            <p className="text-xs text-muted-foreground">Bulan {format(new Date(), "MMMM yyyy", { locale: id })}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pengeluaran Bulan Ini</CardTitle>
            <ArrowDownCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {currentMonthOutflow.toLocaleString('id-ID')}</div>
            <p className="text-xs text-muted-foreground">Bulan {format(new Date(), "MMMM yyyy", { locale: id })}</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-center">Perbandingan Kas Bulanan</h2>
      <Card>
        <CardContent className="pt-6">
          <ChartContainer config={chartConfig} className="min-h-[250px] w-full"> {/* Reduced min-h from 300px to 250px */}
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="inflow" fill="var(--color-inflow)" radius={4} />
              <Bar dataKey="outflow" fill="var(--color-outflow)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;