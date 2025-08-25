import { render, screen } from '@testing-library/react';

jest.mock('../state/editorStore', () => ({
  useEditorStore: () => ({}),
}), { virtual: true });

import Page from '../app/(editor)/page';

describe('Editor page', () => {
  it('renders toolbar actions', () => {
    render(<Page />);
    expect(screen.getByRole('button', { name: /undo/i })).toBeInTheDocument();
  });
});
