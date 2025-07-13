import { Schema, Document } from 'mongoose';

export interface PaymentDocument extends Document {
  id: string;
  amount: number;
  currency: string;
  date: Date;
  method: 'credit_card' | 'paypal' | 'bank_transfer';
  status: 'pending' | 'completed' | 'failed';
  description?: string; // Optional field for additional details
}

export const PaymentSchema = new Schema<PaymentDocument>({
  id: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  date: { type: Date, required: true },
  method: {
    type: String,
    enum: ['credit_card', 'paypal', 'bank_transfer'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    required: true,
  },
  description: { type: String, optional: true }, // Optional field for additional details
});
