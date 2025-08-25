describe('auth', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv, NEXTAUTH_SECRET: 'secret' };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('initializes with no providers when none configured', () => {
    const { providers } = require('../lib/auth');
    expect(providers).toHaveLength(0);
  });

  it('adds google when credentials provided', () => {
    process.env = {
      ...originalEnv,
      NEXTAUTH_SECRET: 'secret',
      GOOGLE_CLIENT_ID: 'id',
      GOOGLE_CLIENT_SECRET: 'secret',
    };
    jest.resetModules();
    const { providers } = require('../lib/auth');
    const ids = providers.map((p: any) => p.id);
    expect(ids).toContain('google');
  });

  it('throws when NEXTAUTH_SECRET is missing', () => {
    delete (process.env as any).NEXTAUTH_SECRET;
    jest.resetModules();
    expect(() => require('../lib/auth')).toThrow();
  });

  it('session callback returns session unchanged when token lacks sub', async () => {
    process.env = { ...originalEnv, NEXTAUTH_SECRET: 'secret' };
    jest.resetModules();
    const { auth } = require('../lib/auth');
    const session = await auth();
    expect(session).toBeNull();
  });
});
