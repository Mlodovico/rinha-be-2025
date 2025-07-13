import Payment from 'src/modules/payment/model/payment';

export default abstract class PaymentRepository {
  abstract createPayment(payment: Payment): Promise<void>;
}
