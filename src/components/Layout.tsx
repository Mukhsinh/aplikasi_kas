import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Home, ArrowDownCircle, ArrowUpCircle, BarChart2, Printer } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar dark:bg-sidebar-background text-sidebar-foreground dark:text-sidebar-foreground p-4 flex flex-col shadow-lg">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-sidebar-primary dark:text-sidebar-primary-foreground">Aplikasi Keuangan</h2>
        </div>
        <nav className="flex-grow">
          <ul className="space-y-2">
            <li>
              <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" asChild>
                <Link to="/">
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" asChild>
                <Link to="/penerimaan-kas">
                  <ArrowDownCircle className="mr-2 h-4 w-4" />
                  Penerimaan Kas
                </Link>
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" asChild>
                <Link to="/pengeluaran-kas">
                  <ArrowUpCircle className="mr-2 h-4 w-4" />
                  Pengeluaran Kas
                </Link>
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" asChild>
                <Link to="/laporan-saldo-kas">
                  <BarChart2 className="mr-2 h-4 w-4" />
                  Laporan Saldo Kas
                </Link>
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" asChild>
                <Link to="/cetak-laporan">
                  <Printer className="mr-2 h-4 w-4" />
                  Cetak Laporan
                </Link>
              </Button>
            </li>
          </ul>
        </nav>
        <MadeWithDyad />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;