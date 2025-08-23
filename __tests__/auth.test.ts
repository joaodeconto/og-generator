import { authOptions } from '../lib/authOptions';

describe('authOptions', () => {
  it('includes at least one provider', () => {
    expect(authOptions.providers).toBeDefined();
    expect(authOptions.providers?.length).toBeGreaterThan(0);
  });

  it('uses jwt session strategy', () => {
    expect(authOptions.session?.strategy).toBe('jwt');
  });
});
