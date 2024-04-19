import { helloEntityPlugin } from './plugin';

describe('hello-entity', () => {
  it('should export plugin', () => {
    expect(helloEntityPlugin).toBeDefined();
  });
});
