import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { showSuccess, showError } from "@/utils/toast";
import * as XLSX from "xlsx";
import { addTransaction, Transaction } from "@/data/transactions";
import { UploadCloud } from "lucide-react";

const ImportData: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const handleImport = async () => {
    if (!file) {
      showError("Silakan pilih file Excel atau CSV untuk diimpor.");
      return;
    }

    setIsLoading(true);
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json: any[] = XLSX.utils.sheet_to_json(worksheet);

        let importedCount = 0;
        let errorCount = 0;

        for (const row of json) {
          // Basic validation and mapping
          const transactionType = row.Jenis === "Penerimaan" ? "Penerimaan" : row.Jenis === "Pengeluaran" ? "Pengeluaran" : null;
          const paymentType = row["Tipe Pembayaran"] === "Tunai" ? "Tunai" : row["Tipe Pembayaran"] === "Bank" ? "Bank" : null;

          if (
            row.Tanggal &&
            row.Deskripsi &&
            transactionType &&
            row["Jumlah (Rp)"] !== undefined &&
            paymentType
          ) {
            const newTransaction: Omit<Transaction, "id"> = {
              date: new Date(row.Tanggal).toISOString().split('T')[0], // Ensure YYYY-MM-DD format
              description: String(row.Deskripsi),
              type: transactionType,
              amount: parseFloat(row["Jumlah (Rp)"]),
              paymentType: paymentType,
              transactionNumber: row["No. Transaksi"] ? String(row["No. Transaksi"]) : undefined,
            };
            addTransaction(newTransaction);
            importedCount++;
          } else {
            console.warn("Skipping invalid row:", row);
            errorCount++;
          }
        }

        showSuccess(`Berhasil mengimpor ${importedCount} transaksi. ${errorCount > 0 ? `${errorCount} baris dilewati karena tidak valid.` : ''}`);
        setFile(null); // Clear file input
        // Optionally, trigger a reload of transactions in other components if needed
        window.dispatchEvent(new Event('storage')); // Simulate storage event to trigger reloads
      } catch (error: any) {
        showError("Gagal memproses file: " + error.message);
        console.error("Error processing file:", error);
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = (error) => {
      showError("Gagal membaca file.");
      console.error("Error reading file:", error);
      setIsLoading(false);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Impor Data Transaksi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Unggah file Excel (.xlsx) atau CSV (.csv) Anda untuk mengimpor data transaksi.
            Pastikan file Anda memiliki kolom berikut: "Tanggal", "No. Transaksi", "Deskripsi", "Jenis" (Penerimaan/Pengeluaran), "Jumlah (Rp)", "Tipe Pembayaran" (Tunai/Bank).
          </p>
          <div className="space-y-2">
            <Label htmlFor="file-upload">Pilih File</Label>
            <Input
              id="file-upload"
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-primary file:text-primary-foreground
                hover:file:bg-primary/90"
            />
          </div>
          <Button onClick={handleImport} disabled={!file || isLoading} className="w-full">
            {isLoading ? "Mengimpor..." : (
              <>
                <UploadCloud className="mr-2 h-4 w-4" />
                Impor Data
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportData;