describe('authOptions', () => {
  const originalEnv = process.env;
  const requiredEnv = {
    GOOGLE_CLIENT_ID: 'id',
    GOOGLE_CLIENT_SECRET: 'secret',
    GITHUB_CLIENT_ID: 'id',
    GITHUB_CLIENT_SECRET: 'secret',
    LINKEDIN_CLIENT_ID: 'id',
    LINKEDIN_CLIENT_SECRET: 'secret',
    NEXTAUTH_SECRET: 'secret',
  };

  const optionalEnv = {
    TWITTER_CONSUMER_KEY: 'key',
    TWITTER_CONSUMER_SECRET: 'secret',
    FACEBOOK_CLIENT_ID: 'id',
    FACEBOOK_CLIENT_SECRET: 'secret',
    INSTAGRAM_CLIENT_ID: 'id',
    INSTAGRAM_CLIENT_SECRET: 'secret',
  };

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv, ...requiredEnv, ...optionalEnv };
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
    const { GOOGLE_CLIENT_ID, ...rest } = { ...requiredEnv, ...optionalEnv };
    process.env = { ...originalEnv, ...rest };
    delete (process.env as any).GOOGLE_CLIENT_ID;
    jest.resetModules();
    expect(() => require('../lib/authOptions')).toThrow();
  });

  it('omits optional providers when credentials are missing', () => {
    process.env = { ...originalEnv, ...requiredEnv };
    jest.resetModules();
    const { authOptions } = require('../lib/authOptions');
    const providerIds = authOptions.providers.map((p: any) => p.id);
    expect(providerIds).not.toContain('twitter');
    expect(providerIds).not.toContain('facebook');
    expect(providerIds).not.toContain('instagram');
  });
});
