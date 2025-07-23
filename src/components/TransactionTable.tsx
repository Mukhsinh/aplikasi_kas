import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Edit, Trash2 } from "lucide-react";
import { Transaction } from "@/data/transactions";
import { cn } from "@/lib/utils";

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: number) => void;
  typeFilter?: "Penerimaan" | "Pengeluaran";
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, onEdit, onDelete, typeFilter }) => {
  const filteredAndSortedTransactions = transactions
    .filter(t => t.type !== "Saldo") // Exclude initial saldo from this table
    .filter(t => typeFilter ? t.type === typeFilter : true)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date, newest first

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tanggal</TableHead>
            <TableHead>No. Transaksi</TableHead>
            <TableHead>Deskripsi</TableHead>
            <TableHead>Jumlah (Rp)</TableHead>
            <TableHead>Tipe Pembayaran</TableHead>
            <TableHead className="text-center">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedTransactions.length > 0 ? (
            filteredAndSortedTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{format(new Date(transaction.date), "dd MMM yyyy", { locale: id })}</TableCell>
                <TableCell>{transaction.transactionNumber}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell className={cn(
                  "font-medium",
                  transaction.type === "Penerimaan" && "text-green-600",
                  transaction.type === "Pengeluaran" && "text-red-600"
                )}>
                  {transaction.type === "Pengeluaran" ? "-" : ""}Rp {transaction.amount.toLocaleString('id-ID')}
                </TableCell>
                <TableCell>{transaction.paymentType}</TableCell>
                <TableCell className="flex justify-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(transaction)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => onDelete(transaction.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                Belum ada transaksi {typeFilter ? typeFilter.toLowerCase() : ""}.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionTable;