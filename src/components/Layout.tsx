"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { name: "Home", path: "/" },
  { name: "Laporan Saldo Kas", path: "/laporan-saldo-kas" },
  { name: "Master Setting", path: "/master-setting" },
  { name: "Cetak Laporan", path: "/cetak-laporan" },
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
            variant="ghost"
            className="justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <Link to={item.path}>{item.name}</Link>
          </Button>
        ))}
      </nav>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
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