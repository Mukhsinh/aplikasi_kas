export interface Transaction {
  id: number;
  date: string;
  description: string;
  type: "Penerimaan" | "Pengeluaran" | "Saldo";
  amount: number;
  paymentType: "Tunai" | "Bank";
}

export const allTransactions: Transaction[] = [
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