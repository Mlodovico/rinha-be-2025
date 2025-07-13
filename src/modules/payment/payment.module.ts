import { Module } from '@nestjs/common';
import { PaymentController } from './controller/payment.controller';
import PaymentService from './service/payment.service';
import PaymentRepository from './repository/payment.repository';
import AbstractPaymentRepository from './repository/payment.repository.abstract';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/payment-database'),
  ],
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
