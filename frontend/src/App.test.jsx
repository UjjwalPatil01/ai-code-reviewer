import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';
import React from 'react';

// Mock Monaco Editor since it doesn't render cleanly natively in JSDOM environments
vi.mock('@monaco-editor/react', () => ({
  default: () => <div data-testid="monaco-editor-mock">Monaco Editor Mock</div>
}));

describe('App Component', () => {
  it('renders the header correctly', () => {
    render(<App />);
    expect(screen.getByText(/Code Review/i)).toBeInTheDocument();
  });
  
  it('renders the editor and results pane', () => {
    render(<App />);
    expect(screen.getByText('Editor')).toBeInTheDocument();
    expect(screen.getByText('Analysis Results')).toBeInTheDocument();
  });
});
