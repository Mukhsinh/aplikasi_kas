import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDownCircle, ArrowUpCircle, ReceiptText, Wallet, FileText, Settings, Printer, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react"; // Import React and hooks

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

  useEffect(() => {
    const savedUserName = localStorage.getItem("userName");
    if (savedUserName) {
      setUserName(savedUserName);
    } else {
      setUserName("Pengguna"); // Default if not set
    }
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-2 text-center">Aplikasi Bendahara IBI Cab Kota Pekalongan</h1>
      <p className="text-xl text-center text-muted-foreground mb-8">Selamat Datang, {userName}!</p> {/* Display user name */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Saldo Kas</CardTitle>
            <span className="text-muted-foreground font-bold text-lg">Rp</span> {/* Replaced DollarSign with Rp */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp 1.500.000</div>
            <p className="text-xs text-muted-foreground">Per 31 Desember 2023</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Penerimaan Bulan Ini</CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp 750.000</div>
            <p className="text-xs text-muted-foreground">+15% dari bulan lalu</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pengeluaran Bulan Ini</CardTitle>
            <ArrowDownCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp 300.000</div>
            <p className="text-xs text-muted-foreground">-5% dari bulan lalu</p>
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

      {/* The MadeWithDyad component was here and has been removed */}
    </div>
  );
};

export default Index;