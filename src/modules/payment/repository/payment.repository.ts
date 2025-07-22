import { Injectable } from '@nestjs/common';
import { MongoClient, Db, Collection } from 'mongodb';
import Payment from 'src/modules/payment/model/payment';
import CircuitBreaker from 'opossum';

@Injectable()
export default class PaymentRepository {
  private readonly uri = 'mongodb://localhost:27017/payment-database';
  private client = new MongoClient(this.uri);
  private db: Db;
  private paymentCollection: Collection<Payment>;
  private paymentBreaker: CircuitBreaker;

  constructor() {
    this.client = new MongoClient(this.uri);
  }

  async connect() {
    if (!this.client.isConnected()) {
      await this.client.connect();
      this.db = this.client.db('payment-database');
      this.paymentCollection = this.db.collection<Payment>('payments');
    }
  }

  private async insertPayment(payment: Payment): Promise<any> {
    await this.connect(); // Ensure the connection is established

    // Simulate a failure for testing
    if (!payment) {
      throw new Error('Simulated failure: Payment is null or undefined');
    }

    const result = await this.paymentCollection.insertOne(payment);
    return {
      message: 'Payment created successfully',
      paymentId: result.insertedId,
    };
  }

  async createPayment(payment: Payment): Promise<any> {
    try {
      return await this.paymentBreaker.fire(payment); // Use the circuit breaker
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to create payment: ${error.message}`);
      }
      throw new Error('Failed to create payment: Unknown error occurred');
    }
  }
}
