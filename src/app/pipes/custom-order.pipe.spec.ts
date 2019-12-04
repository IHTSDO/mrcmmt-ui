import { CustomOrderPipe } from './custom-order.pipe';

describe('CustomOrderPipe', () => {
  it('create an instance', () => {
    const pipe = new CustomOrderPipe();
    expect(pipe).toBeTruthy();
  });
});
