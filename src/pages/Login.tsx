import React from "react";
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-red-50 dark:from-gray-900 dark:to-red-950">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Login Aplikasi Kas</CardTitle>
          <p className="text-muted-foreground">Masukkan kredensial Anda untuk melanjutkan</p>
        </CardHeader>
        <CardContent>
          <Auth
            supabaseClient={supabase}
            providers={['google', 'github']} // Menambahkan Google dan GitHub sebagai penyedia
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: 'hsl(var(--primary))',
                    brandAccent: 'hsl(var(--primary-foreground))',
                  },
                },
              },
            }}
            theme="light"
            redirectTo={window.location.origin} // Arahkan ke beranda setelah login
            view="sign_in" // Tampilan default, termasuk tautan ke pendaftaran
            showLinks={true} // Pastikan tautan seperti "Daftar" dan "Lupa kata sandi" terlihat
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Email Anda',
                  password_label: 'Kata Sandi Anda',
                  email_input_placeholder: 'nama@contoh.com',
                  password_input_placeholder: '••••••••',
                  button_label: 'Masuk',
                  social_provider_text: 'Atau masuk dengan',
                  link_text: 'Belum punya akun? Daftar',
                  forgotten_password: 'Lupa kata sandi?',
                },
                sign_up: {
                  email_label: 'Email Anda',
                  password_label: 'Buat Kata Sandi',
                  email_input_placeholder: 'nama@contoh.com',
                  password_input_placeholder: '••••••••',
                  button_label: 'Daftar',
                  social_provider_text: 'Atau daftar dengan',
                  link_text: 'Sudah punya akun? Masuk',
                },
                forgotten_password: {
                  email_label: 'Email Anda',
                  password_reset_button_label: 'Kirim instruksi reset',
                  email_input_placeholder: 'nama@contoh.com',
                  link_text: 'Sudah ingat kata sandi? Masuk',
                },
                update_password: {
                  password_label: 'Kata Sandi Baru',
                  password_input_placeholder: 'Kata Sandi Baru Anda',
                  button_label: 'Perbarui Kata Sandi',
                },
              },
            }}
          />
          <p className="text-center text-sm text-muted-foreground mt-4">
            Jika Anda mendaftar akun baru, silakan periksa email Anda untuk konfirmasi setelah pendaftaran.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;