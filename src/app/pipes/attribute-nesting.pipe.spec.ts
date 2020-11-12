import { AttributeNestingPipe } from './attribute-nesting.pipe';

describe('AttributeNestingPipe', () => {
  it('create an instance', () => {
    const pipe = new AttributeNestingPipe();
    expect(pipe).toBeTruthy();
  });
});
