import { render, screen } from '@testing-library/react';
import App from './App';
import { describe, it, expect } from 'vitest';

describe('App Component', () => {
  it('renders the premium header correctly', () => {
    render(<App />);
    
    // Looks for the brand name instead of the generic "Code Review" text
    expect(screen.getByText(/CodeNova/i)).toBeInTheDocument();
    
    // Verifies the new "Sign In / Sign Up" button is rendering
    expect(screen.getByText(/Sign In \/ Sign Up/i)).toBeInTheDocument();
  });

  it('renders the landing page hero section', () => {
    render(<App />);
    
    // Checks for the new fancy "Open Editor" button instead of the old "Editor" text
    expect(screen.getByText(/Open Editor/i)).toBeInTheDocument();
    
    // Checks for your new Vercel-style 2.0 badge
    expect(screen.getByText(/CodeNova 2.0 is Live/i)).toBeInTheDocument();
  });
});