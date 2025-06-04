import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders correctly with default props', () => {
    render(<Button>Test Button</Button>);
    const button = screen.getByText('Test Button');
    
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary-600');
    expect(button).not.toBeDisabled();
  });

  it('applies variant classes correctly', () => {
    render(<Button variant="outline">Outline Button</Button>);
    const button = screen.getByText('Outline Button');
    
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('border-primary-600');
    expect(button).not.toHaveClass('bg-primary-600');
  });

  it('applies size classes correctly', () => {
    render(<Button size="sm">Small Button</Button>);
    const button = screen.getByText('Small Button');
    
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('text-sm');
    expect(button).toHaveClass('px-3');
  });

  it('disables the button when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByText('Disabled Button');
    
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-50');
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    
    const button = screen.getByText('Click Me');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick} disabled>Cannot Click</Button>);
    
    const button = screen.getByText('Cannot Click');
    fireEvent.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders with custom class name', () => {
    render(<Button className="custom-class">Custom Button</Button>);
    const button = screen.getByText('Custom Button');
    
    expect(button).toHaveClass('custom-class');
    expect(button).toHaveClass('bg-primary-600');
  });
}); 