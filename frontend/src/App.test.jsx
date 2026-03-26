import { render, screen } from '@testing-library/react';
import App from './App';
import { describe, it, expect } from 'vitest';

describe('App Component', () => {
  it('renders the premium header correctly', () => {
    render(<App />);

    // Match the nav brand — "CodeNova" is always visible in the nav
    // Use getAllByText since "CodeNova" appears in both the nav and the hero badge,
    // then just assert at least one element is in the document.
    const brandElements = screen.getAllByText(/CodeNova/i);
    expect(brandElements.length).toBeGreaterThan(0);

    // Verify the auth button renders
    expect(screen.getByText(/Sign In \/ Sign Up/i)).toBeInTheDocument();
  });

  it('renders the landing page hero section', () => {
    render(<App />);

    // "Open Editor" button should always be present in the nav
    expect(screen.getByText(/Open Editor/i)).toBeInTheDocument();

    // The Vercel-style live badge on the home screen
    expect(screen.getByText(/CodeNova 2\.0 is Live/i)).toBeInTheDocument();
  });
});