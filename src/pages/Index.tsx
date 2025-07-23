import { MadeWithDyad } from "@/components/made-with-dyad";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowDownCircle, ArrowUpCircle, BarChart2, Printer } from "lucide-react";

const Index = () => {
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
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold mb-4 text-gray-900 dark:text-gray-100">Selamat Datang di Aplikasi Keuangan Anda</h1>
        <p className="text-xl text-gray-700 dark:text-gray-300">
          Kelola keuangan Anda dengan mudah dan efisien.
        </p>
      </div>

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
  );
};

export default Index;