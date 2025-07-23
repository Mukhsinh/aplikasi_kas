import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { showLoading, dismissToast, showSuccess } from "@/utils/toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PrintReport: React.FC = () => {
  const [reportType, setReportType] = useState<"monthly" | "semester" | "yearly">("monthly");
  const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() + 1).toString());
  const [selectedSemester, setSelectedSemester] = useState<string>("1");
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [downloadFormat, setDownloadFormat] = useState<"excel" | "pdf">("excel");
  const [userName, setUserName] = useState<string>("");

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - 2 + i).toString()); // Current year +/- 2

  const months = [
    { value: "1", label: "Januari" }, { value: "2", label: "Februari" },
    { value: "3", label: "Maret" }, { value: "4", label: "April" },
    { value: "5", label: "Mei" }, { value: "6", label: "Juni" },
    { value: "7", label: "Juli" }, { value: "8", label: "Agustus" },
    { value: "9", label: "September" }, { value: "10", label: "Oktober" },
    { value: "11", label: "November" }, { value: "12", label: "Desember" },
  ];

  useEffect(() => {
    const savedUserName = localStorage.getItem("userName");
    if (savedUserName) {
      setUserName(savedUserName);
    } else {
      setUserName("Nama Pengguna"); // Default if not set
    }
  }, []);

  const handlePrint = () => {
    const loadingToastId = showLoading("Mempersiapkan laporan...");
    let reportPeriod = "";
    if (reportType === "monthly") {
      reportPeriod = `Bulan ${months.find(m => m.value === selectedMonth)?.label} ${selectedYear}`;
    } else if (reportType === "semester") {
      reportPeriod = `Semester ${selectedSemester} Tahun ${selectedYear}`;
    } else { // yearly
      reportPeriod = `Tahun ${selectedYear}`;
    }

    setTimeout(() => {
      dismissToast(loadingToastId);
      showSuccess(
        `Laporan ${reportPeriod} berhasil dibuat dalam format ${downloadFormat.toUpperCase()} (simulasi). ` +
        `Ditandatangani oleh: ${userName}. Fungsionalitas ekspor ke Excel/PDF memerlukan implementasi backend atau pustaka sisi klien.`
      );
    }, 2000);
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Cetak Laporan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Di halaman ini, Anda dapat menghasilkan laporan keuangan dalam format yang berbeda.
            Untuk tujuan demonstrasi, fungsionalitas ekspor ke Excel/PDF memerlukan integrasi backend atau pustaka sisi klien yang lebih kompleks.
          </p>

          {/* Filter Laporan */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Pilih Jenis Laporan</h3>
            <RadioGroup
              defaultValue="monthly"
              onValueChange={(value: "monthly" | "semester" | "yearly") => setReportType(value)}
              className="flex flex-wrap gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="monthly" id="report-monthly" />
                <Label htmlFor="report-monthly">Bulanan</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="semester" id="report-semester" />
                <Label htmlFor="report-semester">Semester</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yearly" id="report-yearly" />
                <Label htmlFor="report-yearly">Tahunan</Label>
              </div>
            </RadioGroup>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportType === "monthly" && (
                <div>
                  <Label htmlFor="select-month">Bulan</Label>
                  <Select onValueChange={setSelectedMonth} defaultValue={selectedMonth}>
                    <SelectTrigger id="select-month">
                      <SelectValue placeholder="Pilih Bulan" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month.value} value={month.value}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {reportType === "semester" && (
                <div>
                  <Label htmlFor="select-semester">Semester</Label>
                  <Select onValueChange={setSelectedSemester} defaultValue={selectedSemester}>
                    <SelectTrigger id="select-semester">
                      <SelectValue placeholder="Pilih Semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Semester 1</SelectItem>
                      <SelectItem value="2">Semester 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {(reportType === "monthly" || reportType === "semester" || reportType === "yearly") && (
                <div>
                  <Label htmlFor="select-year">Tahun</Label>
                  <Select onValueChange={setSelectedYear} defaultValue={selectedYear}>
                    <SelectTrigger id="select-year">
                      <SelectValue placeholder="Pilih Tahun" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          {/* Pilihan Format Unduhan */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Pilih Format Unduhan</h3>
            <RadioGroup
              defaultValue="excel"
              onValueChange={(value: "excel" | "pdf") => setDownloadFormat(value)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excel" id="format-excel" />
                <Label htmlFor="format-excel">Excel</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pdf" id="format-pdf" />
                <Label htmlFor="format-pdf">PDF</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Simulasi Tanda Tangan */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Ditandatangani Oleh:</h3>
            <p className="text-lg font-medium">{userName}</p>
            <p className="text-sm text-muted-foreground">
              (Nama ini diambil dari pengaturan Master Setting)
            </p>
          </div>

          <Button onClick={handlePrint} className="w-full md:w-auto">
            Unduh Laporan (Simulasi)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrintReport;