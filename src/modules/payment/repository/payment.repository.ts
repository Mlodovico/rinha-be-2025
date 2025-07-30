import { Injectable } from '@nestjs/common';
import { MongoClient, Db, Collection } from 'mongodb';
import Payment from 'src/modules/payment/model/payment';
import { createCircuitBreaker } from '../hook/circuitBreaker';
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

    this.paymentBreaker = createCircuitBreaker(
      this.insertPayment.bind(this), // Bind to ensure 'this' context is correct
      {
        timeout: 5000, // 5 seconds
        errorThresholdPercentage: 50, // 50% of requests can fail before circuit opens
        resetTimeout: 30000, // 30 seconds before circuit resets
      },
      this.fallbackInsertPayment.bind(this), // Fallback function
    );
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
    try {
      await this.connect(); // Ensure the connection is established

      if (!payment) {
        throw new Error('Simulated failure: Payment is null or undefined');
      }

      const result = await this.paymentCollection.insertOne(payment);

      return {
        message: 'Payment created successfully',
        paymentId: result.insertedId,
      };
    } catch (error: unknown) {
      console.error('Error inserting payment:', error);
      throw new Error('Database operation failed: Unknown error occurred');
    }
  }

  async createPayment(payment: Payment): Promise<any> {
    try {
      return await this.paymentBreaker.fire(payment);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Payment creation failed: ${error.message}`);
      }
      throw new Error('Failed to create payment: Unknown error occurred');
    }
  }

  private fallbackInsertPayment(payment: Payment): any {
    console.warn(
      'Circuit breaker fallback: Payment creation failed, returning default response',
    );
    return {
      message: 'Payment creation failed, fallback response',
      paymentId: null,
    };
  }
}
