import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { format, getMonth, getYear, startOfMonth, endOfMonth, startOfYear, endOfYear, addMonths } from "date-fns";
import { id } from "date-fns/locale"; // Import locale for Indonesian month names
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { showSuccess, showError } from "@/utils/toast";

interface Transaction {
  id: number;
  date: string;
  description: string;
  type: "Penerimaan" | "Pengeluaran" | "Saldo";
  amount: number;
  paymentType: "Tunai" | "Bank";
}

const allTransactions: Transaction[] = [
  { id: 1, date: "2023-01-01", description: "Saldo Awal", type: "Saldo", amount: 1000000, paymentType: "Tunai" },
  { id: 2, date: "2023-01-05", description: "Penjualan Produk A", type: "Penerimaan", amount: 500000, paymentType: "Tunai" },
  { id: 3, date: "2023-01-10", description: "Pembelian Bahan Baku", type: "Pengeluaran", amount: 200000, paymentType: "Bank" },
  { id: 4, date: "2023-01-15", description: "Pembayaran Gaji", type: "Pengeluaran", amount: 300000, paymentType: "Tunai" },
  { id: 5, date: "2023-01-20", description: "Pendapatan Jasa", type: "Penerimaan", amount: 700000, paymentType: "Bank" },
  { id: 6, date: "2023-01-25", description: "Penjualan Produk B", type: "Penerimaan", amount: 250000, paymentType: "Tunai" },
  { id: 7, date: "2023-01-28", description: "Pembayaran Listrik", type: "Pengeluaran", amount: 150000, paymentType: "Bank" },
  { id: 8, date: "2023-02-01", description: "Penerimaan Februari", type: "Penerimaan", amount: 100000, paymentType: "Tunai" },
  { id: 9, date: "2023-02-15", description: "Pengeluaran Februari", type: "Pengeluaran", amount: 50000, paymentType: "Bank" },
  { id: 10, date: "2024-01-01", description: "Saldo Awal 2024", type: "Saldo", amount: 1500000, paymentType: "Tunai" },
  { id: 11, date: "2024-03-10", description: "Penjualan Maret 2024", type: "Penerimaan", amount: 300000, paymentType: "Tunai" },
  { id: 12, date: "2024-04-05", description: "Pembelian April 2024", type: "Pengeluaran", amount: 100000, paymentType: "Bank" },
];

const PrintReport: React.FC = () => {
  const [reportPeriodType, setReportPeriodType] = useState<"monthly" | "semester" | "yearly">("monthly");
  const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), "MM"));
  const [selectedYear, setSelectedYear] = useState<string>(format(new Date(), "yyyy"));
  const [selectedSemester, setSelectedSemester] = useState<"1" | "2">("1");
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const savedUserName = localStorage.getItem("userName");
    if (savedUserName) {
      setUserName(savedUserName);
    } else {
      setUserName("Bendahara"); // Default if not set
    }
  }, []);

  const availableYears = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => (currentYear - 2 + i).toString());
  }, []);

  const months = useMemo(() => [
    { value: "01", label: "Januari" }, { value: "02", label: "Februari" },
    { value: "03", label: "Maret" }, { value: "04", label: "April" },
    { value: "05", label: "Mei" }, { value: "06", label: "Juni" },
    { value: "07", label: "Juli" }, { value: "08", label: "Agustus" },
    { value: "09", label: "September" }, { value: "10", label: "Oktober" },
    { value: "11", label: "November" }, { value: "12", label: "Desember" },
  ], []);

  const getFilteredReportData = useMemo(() => {
    let startDate: Date | null = null;
    let endDate: Date | null = null;
    let reportTitle = "Laporan Saldo Kas";

    if (reportPeriodType === "monthly") {
      const year = parseInt(selectedYear);
      const month = parseInt(selectedMonth) - 1; // Month is 0-indexed
      startDate = startOfMonth(new Date(year, month, 1));
      endDate = endOfMonth(new Date(year, month, 1));
      reportTitle += ` Bulan ${months.find(m => m.value === selectedMonth)?.label} ${selectedYear}`;
    } else if (reportPeriodType === "semester") {
      const year = parseInt(selectedYear);
      if (selectedSemester === "1") {
        startDate = startOfMonth(new Date(year, 0, 1)); // Jan 1
        endDate = endOfMonth(new Date(year, 5, 1)); // Jun 30
        reportTitle += ` Semester 1 Tahun ${selectedYear}`;
      } else {
        startDate = startOfMonth(new Date(year, 6, 1)); // Jul 1
        endDate = endOfMonth(new Date(year, 11, 1)); // Dec 31
        reportTitle += ` Semester 2 Tahun ${selectedYear}`;
      }
    } else if (reportPeriodType === "yearly") {
      const year = parseInt(selectedYear);
      startDate = startOfYear(new Date(year, 0, 1));
      endDate = endOfYear(new Date(year, 0, 1));
      reportTitle += ` Tahun ${selectedYear}`;
    }

    const filtered = allTransactions.filter(t => {
      const transactionDate = new Date(t.date);
      return startDate && endDate && transactionDate >= startDate && transactionDate <= endDate;
    });

    // Calculate cumulative balance
    let currentBalance = 0;
    const transactionsWithBalance = filtered.map(t => {
      if (t.type === "Penerimaan" || t.type === "Saldo") {
        currentBalance += t.amount;
      } else if (t.type === "Pengeluaran") {
        currentBalance -= t.amount;
      }
      return { ...t, balance: currentBalance };
    });

    return { data: transactionsWithBalance, title: reportTitle };
  }, [reportPeriodType, selectedMonth, selectedYear, selectedSemester, months]);

  const handleDownloadPdf = () => {
    const { data, title } = getFilteredReportData;

    if (data.length === 0) {
      showError("Tidak ada data untuk periode yang dipilih.");
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(title, 14, 22);

    doc.setFontSize(11);
    doc.text(`Tanggal Cetak: ${format(new Date(), "dd MMMM yyyy", { locale: id })}`, 14, 30);

    const tableColumn = ["Tanggal", "Deskripsi", "Jenis", "Tipe Pembayaran", "Jumlah (Rp)", "Saldo (Rp)"];
    const tableRows = data.map(t => [
      t.date,
      t.description,
      t.type,
      t.paymentType,
      `${t.type === "Pengeluaran" ? "-" : ""}Rp ${t.amount.toLocaleString('id-ID')}`,
      `Rp ${t.balance.toLocaleString('id-ID')}`,
    ]);

    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2, overflow: 'linebreak' },
      headStyles: { fillColor: [22, 160, 133], textColor: 255, fontStyle: 'bold' },
      columnStyles: {
        4: { halign: 'right' },
        5: { halign: 'right' },
      },
    });

    const finalY = (doc as any).autoTable.previous.finalY;
    doc.setFontSize(10);
    doc.text(`Pekalongan, ${format(new Date(), "dd MMMM yyyy", { locale: id })}`, 14, finalY + 20);
    doc.text("Mengetahui,", 14, finalY + 30);
    doc.text("Bendahara", 14, finalY + 35);
    doc.text("____________________", 14, finalY + 60);
    doc.text(`( ${userName} )`, 14, finalY + 65);

    doc.save(`${title.replace(/ /g, '_')}.pdf`);
    showSuccess("Laporan PDF berhasil diunduh!");
  };

  const handleDownloadExcel = () => {
    const { data, title } = getFilteredReportData;

    if (data.length === 0) {
      showError("Tidak ada data untuk periode yang dipilih.");
      return;
    }

    const excelData = data.map(t => ({
      Tanggal: t.date,
      Deskripsi: t.description,
      Jenis: t.type,
      "Tipe Pembayaran": t.paymentType,
      "Jumlah (Rp)": t.amount,
      "Saldo (Rp)": t.balance,
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan Saldo Kas");

    // Add signature info
    const signatureRow = [
      "", "", "", "", "",
      `Pekalongan, ${format(new Date(), "dd MMMM yyyy", { locale: id })}`,
    ];
    const signatureRow2 = ["", "", "", "", "", "Mengetahui,"];
    const signatureRow3 = ["", "", "", "", "", "Bendahara"];
    const signatureRow4 = ["", "", "", "", "", ""]; // Spacer
    const signatureRow5 = ["", "", "", "", "", "____________________"];
    const signatureRow6 = ["", "", "", "", "", `( ${userName} )`];

    XLSX.utils.sheet_add_aoa(ws, [signatureRow, signatureRow2, signatureRow3, signatureRow4, signatureRow5, signatureRow6], { origin: -1 });

    XLSX.writeFile(wb, `${title.replace(/ /g, '_')}.xlsx`);
    showSuccess("Laporan Excel berhasil diunduh!");
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Cetak Laporan Saldo Kas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label htmlFor="report-period-type">Pilih Periode Laporan</Label>
            <Select
              value={reportPeriodType}
              onValueChange={(value: "monthly" | "semester" | "yearly") => setReportPeriodType(value)}
            >
              <SelectTrigger id="report-period-type">
                <SelectValue placeholder="Pilih periode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Bulanan</SelectItem>
                <SelectItem value="semester">Semester</SelectItem>
                <SelectItem value="yearly">Tahunan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {reportPeriodType === "monthly" && (
            <div className="flex space-x-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="month-select">Bulan</Label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger id="month-select">
                    <SelectValue placeholder="Pilih Bulan" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map(month => (
                      <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="year-select-monthly">Tahun</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger id="year-select-monthly">
                    <SelectValue placeholder="Pilih Tahun" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableYears.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {reportPeriodType === "semester" && (
            <div className="flex space-x-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="semester-select">Semester</Label>
                <Select value={selectedSemester} onValueChange={(value: "1" | "2") => setSelectedSemester(value)}>
                  <SelectTrigger id="semester-select">
                    <SelectValue placeholder="Pilih Semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Semester 1 (Jan - Jun)</SelectItem>
                    <SelectItem value="2">Semester 2 (Jul - Des)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="year-select-semester">Tahun</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger id="year-select-semester">
                    <SelectValue placeholder="Pilih Tahun" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableYears.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {reportPeriodType === "yearly" && (
            <div className="space-y-2">
              <Label htmlFor="year-select-yearly">Tahun</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger id="year-select-yearly">
                  <SelectValue placeholder="Pilih Tahun" />
                </SelectTrigger>
                <SelectContent>
                  {availableYears.map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex space-x-4 mt-6">
            <Button onClick={handleDownloadPdf} className="flex-1">Unduh PDF</Button>
            <Button onClick={handleDownloadExcel} className="flex-1" variant="outline">Unduh Excel</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrintReport;