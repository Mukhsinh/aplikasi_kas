"use client";

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, ReceiptText, Wallet, FileText, Printer, Settings, LayoutDashboard, LogOut, UploadCloud, Users } from "lucide-react"; // Import Users icon
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useSession } from "@/components/SessionContextProvider"; // Import useSession
import { supabase } from "@/integrations/supabase/client"; // Import supabase client

interface LayoutProps {
  children: React.ReactNode;
  onLogout: () => void; // New prop for logout
}

const navItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard, roles: ["user", "admin"] },
  { name: "Penerimaan Kas", path: "/penerimaan-kas", icon: ReceiptText, roles: ["user", "admin"] },
  { name: "Pengeluaran Kas", path: "/pengeluaran-kas", icon: Wallet, roles: ["user", "admin"] },
  { name: "Laporan Saldo Kas", path: "/laporan-saldo-kas", icon: FileText, roles: ["user", "admin"] },
  { name: "Cetak Laporan", path: "/cetak-laporan", icon: Printer, roles: ["user", "admin"] },
  { name: "Impor Data", path: "/import-data", icon: UploadCloud, roles: ["user", "admin"] },
  { name: "Master Setting", path: "/master-setting", icon: Settings, roles: ["user", "admin"] },
  { name: "Manajemen Peran Admin", path: "/admin/role-management", icon: Users, roles: ["admin"] }, // New admin-only menu item
];

const Layout: React.FC<LayoutProps> = ({ children, onLogout }) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { user, isLoading: isSessionLoading } = useSession();
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        if (error) {
          console.error("Error fetching user role for layout:", error.message);
          setCurrentUserRole(null);
        } else if (data) {
          setCurrentUserRole(data.role);
        }
      } else {
        setCurrentUserRole(null);
      }
    };
    if (!isSessionLoading) {
      fetchUserRole();
    }
  }, [user, isSessionLoading]);

  const handleLogoutClick = () => {
    onLogout();
    navigate("/login"); // Redirect to login page after logout
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full p-4 bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <h2 className="text-2xl font-bold mb-6 text-sidebar-primary-foreground">Aplikasi Kas</h2>
      <nav className="flex flex-col space-y-2 flex-grow">
        {navItems.map((item) => {
          // Only render if the user's role is included in the item's allowed roles
          if (currentUserRole && item.roles.includes(currentUserRole)) {
            return (
              <Button
                key={item.path}
                asChild
                className="justify-start bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Link to={item.path} className="flex items-center gap-2">
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              </Button>
            );
          }
          return null;
        })}
      </nav>
      <div className="mt-auto pt-4">
        <Button
          variant="destructive"
          className="w-full justify-start"
          onClick={handleLogoutClick}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Logout
        </Button>
        <div className="text-center text-xs text-muted-foreground pt-4">
          Developed by : MukhsinHadi (copyright)
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
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
      <main className={cn("flex-1 p-8 flex flex-col", isMobile ? "mt-16" : "")}>
        <div className="flex-grow">
          {/* Clone children to pass onLogout prop */}
          {React.isValidElement(children)
            ? React.cloneElement(children as React.ReactElement<any>, { onLogout })
            : children}
        </div>
      </main>
    </div>
  );
};

export default Layout;