import { MadeWithDyad } from "@/components/made-with-dyad";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowDownCircle, ArrowUpCircle, BarChart2, Printer, Wallet } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Index = () => {
  // Data simulasi untuk total penerimaan dan pengeluaran
  const totalReceipts = 15000000; // Contoh nilai
  const totalDisbursements = 8000000; // Contoh nilai
  const currentBalance = totalReceipts - totalDisbursements; // Hitung saldo saat ini

  const chartData = [
    { name: 'Penerimaan', amount: totalReceipts },
    { name: 'Pengeluaran', amount: totalDisbursements },
  ];

  const financialModules = [
    {
      title: "Penerimaan Kas",
      description: "Catat semua pemasukan uang ke dalam kas.",
      icon: <ArrowDownCircle className="h-8 w-8 text-green-500" />,
      link: "/penerimaan-kas",
    },
    {
      title: "Pengeluaran Kas",
      description: "Catat semua pengeluaran uang dari kas.",
      icon: <ArrowUpCircle className="h-8 w-8 text-red-500" />,
      link: "/pengeluaran-kas",
    },
    {
      title: "Laporan Saldo Kas",
      description: "Lihat ringkasan dan detail saldo kas Anda.",
      icon: <BarChart2 className="h-8 w-8 text-blue-500" />,
      link: "/laporan-saldo-kas",
    },
    {
      title: "Cetak Laporan",
      description: "Hasilkan laporan keuangan dalam berbagai format.",
      icon: <Printer className="h-8 w-8 text-purple-500" />,
      link: "/cetak-laporan",
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950 rounded-lg p-8 shadow-lg">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold mb-4 text-gray-900 dark:text-gray-100">Aplikasi Bendahara IBI Cab Kota Pekalongan</h1>
          <p className="text-xl text-gray-700 dark:text-gray-300">
            Kelola keuangan Anda dengan mudah dan efisien.
          </p>
        </div>

        {/* Bagian Total Nominal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white dark:bg-gray-800 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Penerimaan</CardTitle>
              <ArrowDownCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Rp {totalReceipts.toLocaleString('id-ID')}</div>
              <p className="text-xs text-muted-foreground">Total uang masuk</p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pengeluaran</CardTitle>
              <ArrowUpCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">Rp {totalDisbursements.toLocaleString('id-ID')}</div>
              <p className="text-xs text-muted-foreground">Total uang keluar</p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo Kas Saat Ini</CardTitle>
              <Wallet className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">Rp {currentBalance.toLocaleString('id-ID')}</div>
              <p className="text-xs text-muted-foreground">Saldo bersih</p>
            </CardContent>
          </Card>
        </div>

        {/* Bagian Grafik */}
        <Card className="bg-white dark:bg-gray-800 shadow-md mb-8">
          <CardHeader>
            <CardTitle>Perbandingan Penerimaan dan Pengeluaran</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `Rp ${value.toLocaleString('id-ID')}`} />
                <Tooltip formatter={(value: number) => `Rp ${value.toLocaleString('id-ID')}`} />
                <Legend />
                <Bar dataKey="amount" fill="#8884d8" name="Jumlah" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bagian Modul Keuangan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {financialModules.map((module, index) => (
            <Link to={module.link} key={index} className="block">
              <Card className="h-full flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                  {module.icon}
                  <CardTitle className="text-2xl font-semibold">{module.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    {module.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;