import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UrlInputForm } from '../../src/components/UrlInputForm/UrlInputForm';

describe('UrlInputForm', () => {
  it('should render input and button', () => {
    render(<UrlInputForm onSubmit={vi.fn()} isLoading={false} />);

    expect(screen.getByPlaceholderText(/enter app store or google play url/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /fetch info/i })).toBeInTheDocument();
  });

  it('should call onSubmit with URL when form is submitted', () => {
    const onSubmit = vi.fn();
    render(<UrlInputForm onSubmit={onSubmit} isLoading={false} />);

    const input = screen.getByPlaceholderText(/enter app store or google play url/i);
    const button = screen.getByRole('button', { name: /fetch info/i });

    fireEvent.change(input, { target: { value: 'https://apps.apple.com/us/app/test/id123' } });
    fireEvent.click(button);

    expect(onSubmit).toHaveBeenCalledWith('https://apps.apple.com/us/app/test/id123');
  });

  it('should disable input and button when loading', () => {
    render(<UrlInputForm onSubmit={vi.fn()} isLoading={true} />);

    expect(screen.getByPlaceholderText(/enter app store or google play url/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /loading/i })).toBeDisabled();
  });

  it('should show loading text on button when loading', () => {
    render(<UrlInputForm onSubmit={vi.fn()} isLoading={true} />);

    expect(screen.getByRole('button')).toHaveTextContent('Loading...');
  });

  it('should not submit empty URL', () => {
    const onSubmit = vi.fn();
    render(<UrlInputForm onSubmit={onSubmit} isLoading={false} />);

    const button = screen.getByRole('button', { name: /fetch info/i });
    fireEvent.click(button);

    expect(onSubmit).not.toHaveBeenCalled();
  });
});
