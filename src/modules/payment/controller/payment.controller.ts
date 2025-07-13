import { Controller, Post } from '@nestjs/common';
import PaymentService from '../service/payment.service';
import Payment from '../model/payment';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('/api/payment')
  createPayment(payment: Payment): Promise<void> {
    return this.paymentService.createPayment(payment);
  }
}
