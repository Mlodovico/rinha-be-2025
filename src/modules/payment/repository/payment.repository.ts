import { Injectable } from '@nestjs/common';
import { MongoClient, Db, Collection } from 'mongodb';
import Payment from 'src/modules/payment/model/payment';

@Injectable()
export default class PaymentRepository {
  private readonly uri = 'mongodb://localhost:27017/payment-database';
  private client = new MongoClient(this.uri);
  private db: Db;
  private paymentCollection: Collection<Payment>;

  constructor() {
    this.client = new MongoClient(this.uri);
  }

  async connect() {
    if (!this.db) {
      await this.client.connect();
      this.db = this.client.db('payment-database');
      this.paymentCollection = this.db.collection<Payment>('payments');
    }
  }

  async createPayment(payment: Payment): Promise<any> {
    try {
      await this.connect();

      const result = await this.paymentCollection.insertOne(payment);
      return {
        message: 'Payment created successfully',
        paymentId: result.insertedId,
      };
    } catch (error) {
      throw new Error(`Failed to create payment: ${error}`);
    }
  }
}
