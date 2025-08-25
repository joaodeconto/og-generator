describe('authOptions', () => {
  const originalEnv = process.env;
  const validEnv = {
    GOOGLE_CLIENT_ID: 'id',
    GOOGLE_CLIENT_SECRET: 'secret',
    GITHUB_CLIENT_ID: 'id',
    GITHUB_CLIENT_SECRET: 'secret',
    LINKEDIN_CLIENT_ID: 'id',
    LINKEDIN_CLIENT_SECRET: 'secret',
    TWITTER_CONSUMER_KEY: 'key',
    TWITTER_CONSUMER_SECRET: 'secret',
    FACEBOOK_CLIENT_ID: 'id',
    FACEBOOK_CLIENT_SECRET: 'secret',
    INSTAGRAM_CLIENT_ID: 'id',
    INSTAGRAM_CLIENT_SECRET: 'secret',
    NEXTAUTH_SECRET: 'secret',
  };

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv, ...validEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('includes at least one provider', () => {
    const { authOptions } = require('../lib/authOptions');
    expect(authOptions.providers).toBeDefined();
    expect(authOptions.providers?.length).toBeGreaterThan(0);
  });

  it('uses jwt session strategy', () => {
    const { authOptions } = require('../lib/authOptions');
    expect(authOptions.session?.strategy).toBe('jwt');
  });

  it('jwt callback stores provider and user id', async () => {
    const { authOptions } = require('../lib/authOptions');
    const token = await authOptions.callbacks?.jwt?.({
      token: {},
      account: { provider: 'google' } as any,
      user: { id: '123' } as any,
    } as any);
    expect(token).toEqual(expect.objectContaining({ provider: 'google', id: '123' }));
  });

  it('jwt callback leaves token untouched when account and user missing', async () => {
    const { authOptions } = require('../lib/authOptions');
    const token = await authOptions.callbacks?.jwt?.({ token: {} } as any);
    expect(token).toEqual({});
  });

  it('session callback adds id and provider', async () => {
    const { authOptions } = require('../lib/authOptions');
    const session = await authOptions.callbacks?.session?.({
      session: { user: {} } as any,
      token: { id: '123', provider: 'google' } as any,
    } as any);
    expect(session.user).toEqual(expect.objectContaining({ id: '123', provider: 'google' }));
  });

  it('session callback returns session if user missing', async () => {
    const { authOptions } = require('../lib/authOptions');
    const session = await authOptions.callbacks?.session?.({
      session: {} as any,
      token: { id: '123', provider: 'google' } as any,
    } as any);
    expect(session).toEqual({});
  });

  it('throws when required env vars are missing', () => {
    const { GOOGLE_CLIENT_ID, ...rest } = validEnv;
    process.env = { ...originalEnv, ...rest };
    jest.resetModules();
    expect(() => require('../lib/authOptions')).toThrow();
  });
});
