import { TopLevelDomainPipe } from './top-level-domain.pipe';

describe('TopLevelDomainPipe', () => {
  it('create an instance', () => {
    const pipe = new TopLevelDomainPipe();
    expect(pipe).toBeTruthy();
  });
});
