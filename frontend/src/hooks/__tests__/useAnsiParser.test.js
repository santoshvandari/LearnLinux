// Unit tests for useAnsiParser hook
import { renderHook } from '@testing-library/react';
import useAnsiParser from '../useAnsiParser';

describe('useAnsiParser', () => {
  test('should provide parseAnsi function', () => {
    const { result } = renderHook(() => useAnsiParser());
    
    expect(typeof result.current.parseAnsi).toBe('function');
  });

  test('should parse ANSI sequences correctly', () => {
    const { result } = renderHook(() => useAnsiParser());
    
    const input = '\x1b[31mRed text\x1b[0m';
    const parsed = result.current.parseAnsi(input);
    
    expect(parsed.segments).toHaveLength(2);
    expect(parsed.segments[0].text).toBe('Red text');
    expect(parsed.segments[0].color).toBe('red');
  });

  test('should provide stripAnsi function', () => {
    const { result } = renderHook(() => useAnsiParser());
    
    const input = '\x1b[31mRed text\x1b[0m';
    const stripped = result.current.stripAnsi(input);
    
    expect(stripped).toBe('Red text');
  });

  test('should provide ansiToCSS function', () => {
    const { result } = renderHook(() => useAnsiParser());
    
    const style = { color: 'red', bold: true };
    const cssClasses = result.current.ansiToCSS(style);
    
    expect(cssClasses).toBe('ansi-red ansi-bold');
  });

  test('should provide hasAnsiSequences function', () => {
    const { result } = renderHook(() => useAnsiParser());
    
    expect(result.current.hasAnsiSequences('\x1b[31mRed\x1b[0m')).toBe(true);
    expect(result.current.hasAnsiSequences('Plain text')).toBe(false);
  });

  test('should provide parseCursorAnsi function', () => {
    const { result } = renderHook(() => useAnsiParser());
    
    const input = '\x1b[2;5HPositioned text';
    const parsed = result.current.parseCursorAnsi(input);
    
    expect(parsed.commands).toHaveLength(1);
    expect(parsed.commands[0]).toEqual({
      type: 'cursor_position',
      row: 2,
      col: 5
    });
    expect(parsed.text).toBe('Positioned text');
  });

  test('should provide parseClearAnsi function', () => {
    const { result } = renderHook(() => useAnsiParser());
    
    const input = '\x1b[2JClear screen';
    const parsed = result.current.parseClearAnsi(input);
    
    expect(parsed.commands).toHaveLength(1);
    expect(parsed.commands[0]).toEqual({ type: 'clear_screen' });
    expect(parsed.text).toBe('Clear screen');
  });

  test('should provide processTerminalOutput function', () => {
    const { result } = renderHook(() => useAnsiParser());
    
    const input = '\x1b[2J\x1b[2;5H\x1b[31mRed text\x1b[0m';
    const processed = result.current.processTerminalOutput(input);
    
    expect(processed.clearCommands).toHaveLength(1);
    expect(processed.cursorCommands).toHaveLength(1);
    expect(processed.segments).toHaveLength(2);
    expect(processed.cleanText).toBe('Red text');
  });

  test('should handle empty input gracefully', () => {
    const { result } = renderHook(() => useAnsiParser());
    
    const processed = result.current.processTerminalOutput('');
    
    expect(processed.segments).toHaveLength(0);
    expect(processed.cursorCommands).toHaveLength(0);
    expect(processed.clearCommands).toHaveLength(0);
    expect(processed.cleanText).toBe('');
  });

  test('should memoize functions properly', () => {
    const { result, rerender } = renderHook(() => useAnsiParser());
    
    const firstParseAnsi = result.current.parseAnsi;
    const firstStripAnsi = result.current.stripAnsi;
    
    rerender();
    
    expect(result.current.parseAnsi).toBe(firstParseAnsi);
    expect(result.current.stripAnsi).toBe(firstStripAnsi);
  });

  test('should handle complex terminal output', () => {
    const { result } = renderHook(() => useAnsiParser());
    
    const complexInput = '\x1b[2J\x1b[H\x1b[1;32muser@host\x1b[0m:\x1b[1;34m~\x1b[0m$ \x1b[31mls -la\x1b[0m\n\x1b[1;36mtotal 8\x1b[0m';
    const processed = result.current.processTerminalOutput(complexInput);
    
    expect(processed.clearCommands.length).toBeGreaterThan(0);
    expect(processed.cursorCommands.length).toBeGreaterThan(0);
    expect(processed.segments.length).toBeGreaterThan(0);
    expect(processed.cleanText).toContain('user@host');
    expect(processed.cleanText).toContain('ls -la');
  });
});