import Payment from 'src/modules/payment/model/payment';

export default abstract class PaymentService {
  abstract createPayment(payment: Payment): Promise<void>;
}
