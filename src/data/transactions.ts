export interface Transaction {
  id: number;
  date: string;
  description: string;
  type: "Penerimaan" | "Pengeluaran" | "Saldo";
  amount: number;
  paymentType: "Tunai" | "Bank";
  transactionNumber?: string; // Added for consistency with input forms
}

const LOCAL_STORAGE_KEY = "cash_transactions";

// Initial saldo entry - this will always be present as the starting point
const initialSaldo: Transaction = {
  id: 1,
  date: "2023-01-01", // A fixed historical date for initial saldo
  description: "Saldo Awal",
  type: "Saldo",
  amount: 1000000,
  paymentType: "Tunai",
};

export const getTransactions = (): Transaction[] => {
  if (typeof window === "undefined") {
    return [initialSaldo]; // Return initial saldo for SSR or build time
  }
  const storedTransactions = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (storedTransactions) {
    const parsedTransactions: Transaction[] = JSON.parse(storedTransactions);
    // Ensure initial saldo is always the first entry if not already present
    if (!parsedTransactions.some(t => t.id === initialSaldo.id && t.type === "Saldo")) {
      return [initialSaldo, ...parsedTransactions];
    }
    return parsedTransactions;
  }
  // If no transactions are stored, initialize with the initial saldo
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([initialSaldo]));
  return [initialSaldo];
};

export const addTransaction = (newTransaction: Omit<Transaction, "id">): void => {
  if (typeof window === "undefined") {
    console.warn("Cannot add transaction: window is undefined (SSR context).");
    return;
  }
  const transactions = getTransactions().filter(t => t.type !== "Saldo" || t.id === initialSaldo.id); // Get current transactions, ensuring initial saldo is not duplicated if it was added by getTransactions
  const newId = Date.now() + Math.floor(Math.random() * 1000); // Simple unique ID
  const transactionToAdd: Transaction = { ...newTransaction, id: newId };
  
  // If the initial saldo was just added by getTransactions and it's the only item,
  // we should ensure it's not duplicated when saving.
  let finalTransactions = transactions;
  if (transactions.length === 1 && transactions[0].id === initialSaldo.id && transactions[0].type === "Saldo") {
    finalTransactions = [initialSaldo, transactionToAdd];
  } else {
    finalTransactions = [...transactions, transactionToAdd];
  }

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(finalTransactions));
};

export const clearAllUserTransactions = (): void => {
  if (typeof window === "undefined") {
    console.warn("Cannot clear transactions: window is undefined (SSR context).");
    return;
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([initialSaldo]));
};