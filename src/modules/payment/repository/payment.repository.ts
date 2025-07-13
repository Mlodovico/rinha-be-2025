import Payment from 'src/modules/payment/model/payment';

export default class PaymentRepository {
  private payments: any[] = [];

  createPayment(payment: Payment): Promise<any> {
    this.payments.push(payment);
    return Promise.resolve({
      message: 'Payment created successfully',
      payment,
    });
  }
}
