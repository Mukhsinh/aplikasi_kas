"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, ReceiptText, Wallet, FileText, Printer, Settings, LayoutDashboard } from "lucide-react"; // Import all necessary icons
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard }, // Added icon for Dashboard
  { name: "Penerimaan Kas", path: "/penerimaan-kas", icon: ReceiptText },
  { name: "Pengeluaran Kas", path: "/pengeluaran-kas", icon: Wallet },
  { name: "Laporan Saldo Kas", path: "/laporan-saldo-kas", icon: FileText },
  { name: "Master Setting", path: "/master-setting", icon: Settings },
  { name: "Cetak Laporan", path: "/cetak-laporan", icon: Printer },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  const SidebarContent = () => (
    <div className="flex flex-col h-full p-4 bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <h2 className="text-2xl font-bold mb-6 text-sidebar-primary-foreground">Aplikasi Kas</h2>
      <nav className="flex flex-col space-y-2">
        {navItems.map((item) => (
          <Button
            key={item.path}
            asChild
            // Changed variant to 'default' and added custom classes for contrast
            className="justify-start bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link to={item.path} className="flex items-center gap-2"> {/* Added flex and gap for icon */}
              <item.icon className="h-5 w-5" /> {/* Render icon */}
              {item.name}
            </Link>
          </Button>
        ))}
      </nav>
    </div>
  );

  return (
    <div className="flex min-h-screen"> {/* Removed bg-background as gradient is on body */}
      {isMobile ? (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      ) : (
        <aside className="w-64 flex-shrink-0">
          <SidebarContent />
        </aside>
      )}
      <main className={cn("flex-1 p-8", isMobile ? "mt-16" : "")}>
        {children}
      </main>
    </div>
  );
};

export default Layout;