import * as randomStyle from '../lib/randomStyle';

const colors = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#a855f7', '#ec4899'];

describe('random style utilities', () => {
  it('generates style values within expected sets', () => {
    const randomSpy = jest
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.5)
      .mockReturnValueOnce(0.999);

    const style = randomStyle.generateRandomStyle();

    expect(style).toEqual({ theme: 'light', layout: 'center', accentColor: colors[5] });

    randomSpy.mockRestore();
  });

  it('generates preset using random style generator', () => {
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.3);
    const preset = randomStyle.generateRandomPreset();
    expect(preset).toEqual({ theme: 'light', layout: 'left', accentColor: colors[1] });
    randomSpy.mockRestore();
  });
});
