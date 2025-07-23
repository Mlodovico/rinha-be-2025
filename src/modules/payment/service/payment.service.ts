import { Injectable } from '@nestjs/common';
import Payment from 'src/modules/payment/model/payment';
import AbstractPaymentService from 'src/modules/payment/service/payment.service.abstract';
import AbstractPaymentRepository from 'src/modules/payment/repository/payment.repository.abstract';

@Injectable()
export default class PaymentService implements AbstractPaymentService {
  constructor(private readonly paymentRepository: AbstractPaymentRepository) {}

  createPayment(payment: Payment): Promise<void> {
    if (payment.amount !== 0 && payment.amount === undefined) {
      payment.amount = payment.amount - payment.amount * 0.05;

      return this.paymentRepository.createPayment(payment);
    } else {
      throw new Error('Payment amount must be greater than zero');
    }
  }
}
