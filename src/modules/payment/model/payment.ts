export default interface Payment {
  id: string;
  amount: number;
  currency: string;
  date: Date;
  method: 'credit_card' | 'paypal' | 'bank_transfer';
  status: 'pending' | 'completed' | 'failed';
  description?: string; // Optional field for additional details
}
