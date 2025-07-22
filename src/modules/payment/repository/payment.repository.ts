import { Injectable } from '@nestjs/common';
import { MongoClient, Db, Collection } from 'mongodb';
import Payment from 'src/modules/payment/model/payment';
import { createCircuitBreaker } from '../hook/circuitBreaker';

@Injectable()
export default class PaymentRepository {
  private readonly uri = 'mongodb://localhost:27017/payment-database';
  private client = new MongoClient(this.uri);
  private db: Db;
  private paymentCollection: Collection<Payment>;
  private paymentBreaker = createCircuitBreaker(this.insertPayment.bind(this), {
    timeout: 5000,
    errorThresholdPercentage: 50,
    resetTimeout: 10000,
  });

  constructor() {
    this.client = new MongoClient(this.uri);

    this.paymentBreaker = createCircuitBreaker(this.insertPayment.bind(this), {
      timeout: 5000, // 5 seconds
      errorThresholdPercentage: 50, // Open the circuit if 50% of requests fail
      resetTimeout: 10000, // Wait 10 seconds before trying again
    });
  }

  async connect() {
    if (!this.db) {
      try {
        await this.client.connect();
        this.db = this.client.db('payment-database');
        this.paymentCollection = this.db.collection<Payment>('payments');
      } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw new Error('Database connection failed');
      }
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
