import { Module } from '@nestjs/common';
import { PaymentController } from './controller/payment.controller';
import PaymentService from './service/payment.service';
import PaymentRepository from './repository/payment.repository';
import AbstractPaymentRepository from './repository/payment.repository.abstract';

@Module({
  imports: [],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    {
      provide: AbstractPaymentRepository,
      useClass: PaymentRepository, // Bind abstract repository to concrete implementation
    },
  ],
})
export class PaymentModule {}
