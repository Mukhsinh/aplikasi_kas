import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/components/SessionContextProvider";
import { showError, showSuccess } from "@/utils/toast";
import { Loader2 } from "lucide-react";
import { Navigate } from "react-router-dom";

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
}

const AdminRoleManagement: React.FC = () => {
  const { user, isLoading: isSessionLoading } = useSession();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null); // Stores the ID of the profile being updated

  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentUserRole = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error("Error fetching current user role:", error.message);
          showError("Gagal memuat peran pengguna Anda.");
          setCurrentUserRole(null);
        } else if (data) {
          setCurrentUserRole(data.role);
        }
      }
    };
    fetchCurrentUserRole();
  }, [user]);

  useEffect(() => {
    if (currentUserRole === 'admin') {
      fetchProfiles();
    } else if (currentUserRole !== null) { // If role is loaded and not admin
      setIsLoading(false);
    }
  }, [currentUserRole]);

  const fetchProfiles = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, role');

    if (error) {
      console.error("Error fetching profiles:", error.message);
      showError("Gagal memuat daftar pengguna.");
    } else if (data) {
      setProfiles(data);
    }
    setIsLoading(false);
  };

  const handleRoleChange = async (profileId: string, newRole: string) => {
    setIsUpdating(profileId);
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq('id', profileId);

    if (error) {
      console.error("Error updating role:", error.message);
      showError("Gagal memperbarui peran pengguna.");
    } else {
      showSuccess("Peran pengguna berhasil diperbarui!");
      fetchProfiles(); // Re-fetch profiles to show updated role
    }
    setIsUpdating(null);
  };

  if (isSessionLoading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Memuat...</span>
      </div>
    );
  }

  if (currentUserRole !== 'admin') {
    showError("Anda tidak memiliki izin untuk mengakses halaman ini.");
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Manajemen Peran Pengguna</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email (ID Pengguna)</TableHead>
                  <TableHead>Peran</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles.length > 0 ? (
                  profiles.map((profile) => (
                    <TableRow key={profile.id}>
                      <TableCell>{`${profile.first_name || ''} ${profile.last_name || ''}`.trim() || "N/A"}</TableCell>
                      <TableCell>{profile.id}</TableCell> {/* Displaying ID as a placeholder for email */}
                      <TableCell>
                        <Select
                          value={profile.role}
                          onValueChange={(value) => handleRoleChange(profile.id, value)}
                          disabled={isUpdating === profile.id || profile.id === user?.id} // Disable if currently updating or if it's the current user
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Pilih Peran" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-center">
                        {isUpdating === profile.id && <Loader2 className="h-4 w-4 animate-spin inline-block" />}
                        {profile.id === user?.id && <span className="text-muted-foreground text-sm">Anda</span>}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                      Tidak ada profil pengguna yang ditemukan.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRoleManagement;