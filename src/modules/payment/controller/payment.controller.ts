import { Body, Controller, Post } from '@nestjs/common';
import PaymentService from '../service/payment.service';
import Payment from '../model/payment';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('/api/payment')
  createPayment(@Body() payment: Payment): Promise<void> {
    // Validate the payment object here if necessary
    if (!payment) {
      throw new Error('Payment object cannot be empty');
    }

    return this.paymentService.createPayment(payment);
  }
}
