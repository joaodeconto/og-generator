import { fireEvent, render, screen } from '@testing-library/react';
import Toolbar from '../components/editor/Toolbar';

describe('Toolbar shortcuts', () => {
  let logSpy: jest.SpyInstance;
  let writeText: jest.Mock;

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    writeText = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
  });

  afterEach(() => {
    logSpy.mockRestore();
    writeText.mockReset();
  });

  it('handles undo via click and shortcut', () => {
    render(<Toolbar />);
    fireEvent.click(screen.getByRole('button', { name: 'Undo' }));
    expect(logSpy).toHaveBeenLastCalledWith('undo');
    fireEvent.keyDown(window, { key: 'z', ctrlKey: true });
    expect(logSpy).toHaveBeenLastCalledWith('undo');
  });

  it('handles redo via click and shortcut', () => {
    render(<Toolbar />);
    fireEvent.click(screen.getByRole('button', { name: 'Redo' }));
    expect(logSpy).toHaveBeenLastCalledWith('redo');
    fireEvent.keyDown(window, { key: 'Z', ctrlKey: true, shiftKey: true });
    expect(logSpy).toHaveBeenLastCalledWith('redo');
  });

  it('handles copy meta via click and shortcut', () => {
    render(<Toolbar />);
    fireEvent.click(screen.getByRole('button', { name: 'Copy Meta' }));
    expect(writeText).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(window, { key: 'c', ctrlKey: true });
    expect(writeText).toHaveBeenCalledTimes(2);
  });

  it('handles save via click and shortcut', () => {
    render(<Toolbar />);
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(logSpy).toHaveBeenLastCalledWith('save');
    fireEvent.keyDown(window, { key: 's', ctrlKey: true });
    expect(logSpy).toHaveBeenLastCalledWith('save');
  });
});
