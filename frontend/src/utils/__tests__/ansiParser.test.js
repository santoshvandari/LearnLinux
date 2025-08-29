// Unit tests for ANSI parser utilities
import {
  parseAnsi,
  stripAnsi,
  ansiToCSS,
  hasAnsiSequences,
  parseCursorAnsi,
  parseClearAnsi
} from '../ansiParser';

describe('ansiParser', () => {
  describe('parseAnsi', () => {
    test('should parse basic color codes', () => {
      const input = '\x1b[31mRed text\x1b[0m';
      const result = parseAnsi(input);
      
      expect(result.segments).toHaveLength(2);
      expect(result.segments[0].text).toBe('Red text');
      expect(result.segments[0].color).toBe('red');
      expect(result.segments[1].text).toBe('');
      expect(result.segments[1].color).toBe(null);
    });

    test('should parse multiple colors in sequence', () => {
      const input = '\x1b[31mRed\x1b[32mGreen\x1b[34mBlue\x1b[0m';
      const result = parseAnsi(input);
      
      expect(result.segments).toHaveLength(4);
      expect(result.segments[0].color).toBe('red');
      expect(result.segments[1].color).toBe('green');
      expect(result.segments[2].color).toBe('blue');
      expect(result.segments[3].color).toBe(null);
    });

    test('should parse background colors', () => {
      const input = '\x1b[41mRed background\x1b[0m';
      const result = parseAnsi(input);
      
      expect(result.segments[0].backgroundColor).toBe('red');
      expect(result.segments[0].text).toBe('Red background');
    });

    test('should parse formatting codes', () => {
      const input = '\x1b[1mBold\x1b[3mItalic\x1b[4mUnderline\x1b[0m';
      const result = parseAnsi(input);
      
      expect(result.segments[0].bold).toBe(true);
      expect(result.segments[1].italic).toBe(true);
      expect(result.segments[2].underline).toBe(true);
    });

    test('should handle combined codes', () => {
      const input = '\x1b[1;31;42mBold red text on green background\x1b[0m';
      const result = parseAnsi(input);
      
      expect(result.segments[0].bold).toBe(true);
      expect(result.segments[0].color).toBe('red');
      expect(result.segments[0].backgroundColor).toBe('green');
    });

    test('should handle bright colors', () => {
      const input = '\x1b[91mBright red\x1b[0m';
      const result = parseAnsi(input);
      
      expect(result.segments[0].color).toBe('bright-red');
    });

    test('should handle text without ANSI codes', () => {
      const input = 'Plain text';
      const result = parseAnsi(input);
      
      expect(result.segments).toHaveLength(1);
      expect(result.segments[0].text).toBe('Plain text');
      expect(result.segments[0].color).toBe(null);
    });

    test('should handle empty input', () => {
      expect(parseAnsi('')).toEqual({ segments: [] });
      expect(parseAnsi(null)).toEqual({ segments: [] });
      expect(parseAnsi(undefined)).toEqual({ segments: [] });
    });

    test('should handle reset codes', () => {
      const input = '\x1b[1;31mBold red\x1b[22mNot bold\x1b[39mDefault color\x1b[0m';
      const result = parseAnsi(input);
      
      expect(result.segments[0].bold).toBe(true);
      expect(result.segments[0].color).toBe('red');
      expect(result.segments[1].bold).toBe(false);
      expect(result.segments[1].color).toBe('red');
      expect(result.segments[2].color).toBe(null);
    });
  });

  describe('stripAnsi', () => {
    test('should remove ANSI color codes', () => {
      const input = '\x1b[31mRed text\x1b[0m';
      const result = stripAnsi(input);
      
      expect(result).toBe('Red text');
    });

    test('should remove multiple ANSI codes', () => {
      const input = '\x1b[1m\x1b[31mBold red\x1b[0m\x1b[32mGreen\x1b[0m';
      const result = stripAnsi(input);
      
      expect(result).toBe('Bold redGreen');
    });

    test('should handle text without ANSI codes', () => {
      const input = 'Plain text';
      const result = stripAnsi(input);
      
      expect(result).toBe('Plain text');
    });

    test('should handle cursor positioning codes', () => {
      const input = '\x1b[2;5HPositioned text\x1b[A';
      const result = stripAnsi(input);
      
      expect(result).toBe('Positioned text');
    });

    test('should handle empty input', () => {
      expect(stripAnsi('')).toBe('');
      expect(stripAnsi(null)).toBe('');
      expect(stripAnsi(undefined)).toBe('');
    });
  });

  describe('ansiToCSS', () => {
    test('should convert color to CSS class', () => {
      const style = { color: 'red' };
      const result = ansiToCSS(style);
      
      expect(result).toBe('ansi-red');
    });

    test('should convert background color to CSS class', () => {
      const style = { backgroundColor: 'blue' };
      const result = ansiToCSS(style);
      
      expect(result).toBe('ansi-bg-blue');
    });

    test('should convert formatting to CSS classes', () => {
      const style = { bold: true, italic: true, underline: true };
      const result = ansiToCSS(style);
      
      expect(result).toBe('ansi-bold ansi-italic ansi-underline');
    });

    test('should combine multiple styles', () => {
      const style = {
        color: 'green',
        backgroundColor: 'black',
        bold: true,
        italic: true
      };
      const result = ansiToCSS(style);
      
      expect(result).toBe('ansi-green ansi-bg-black ansi-bold ansi-italic');
    });

    test('should handle empty style object', () => {
      expect(ansiToCSS({})).toBe('');
      expect(ansiToCSS(null)).toBe('');
      expect(ansiToCSS(undefined)).toBe('');
    });

    test('should handle bright colors', () => {
      const style = { color: 'bright-red', backgroundColor: 'bright-blue' };
      const result = ansiToCSS(style);
      
      expect(result).toBe('ansi-bright-red ansi-bg-bright-blue');
    });
  });

  describe('hasAnsiSequences', () => {
    test('should detect ANSI color codes', () => {
      expect(hasAnsiSequences('\x1b[31mRed text\x1b[0m')).toBe(true);
    });

    test('should detect cursor positioning codes', () => {
      expect(hasAnsiSequences('\x1b[2;5H')).toBe(true);
    });

    test('should detect clear screen codes', () => {
      expect(hasAnsiSequences('\x1b[2J')).toBe(true);
    });

    test('should return false for plain text', () => {
      expect(hasAnsiSequences('Plain text')).toBe(false);
    });

    test('should handle empty input', () => {
      expect(hasAnsiSequences('')).toBe(false);
      expect(hasAnsiSequences(null)).toBe(false);
      expect(hasAnsiSequences(undefined)).toBe(false);
    });
  });

  describe('parseCursorAnsi', () => {
    test('should parse cursor position commands', () => {
      const input = '\x1b[2;5HText here';
      const result = parseCursorAnsi(input);
      
      expect(result.commands).toHaveLength(1);
      expect(result.commands[0]).toEqual({
        type: 'cursor_position',
        row: 2,
        col: 5
      });
      expect(result.text).toBe('Text here');
    });

    test('should parse cursor movement commands', () => {
      const input = '\x1b[3AUp\x1b[2BDown\x1b[4CRight\x1b[1DLeft';
      const result = parseCursorAnsi(input);
      
      expect(result.commands).toHaveLength(4);
      expect(result.commands[0]).toEqual({ type: 'cursor_up', count: 3 });
      expect(result.commands[1]).toEqual({ type: 'cursor_down', count: 2 });
      expect(result.commands[2]).toEqual({ type: 'cursor_forward', count: 4 });
      expect(result.commands[3]).toEqual({ type: 'cursor_backward', count: 1 });
    });

    test('should handle default parameters', () => {
      const input = '\x1b[HHome\x1b[AUp one';
      const result = parseCursorAnsi(input);
      
      expect(result.commands[0]).toEqual({
        type: 'cursor_position',
        row: 1,
        col: 1
      });
      expect(result.commands[1]).toEqual({ type: 'cursor_up', count: 1 });
    });

    test('should handle text without cursor codes', () => {
      const input = 'Plain text';
      const result = parseCursorAnsi(input);
      
      expect(result.commands).toHaveLength(0);
      expect(result.text).toBe('Plain text');
    });
  });

  describe('parseClearAnsi', () => {
    test('should parse clear screen commands', () => {
      const input = '\x1b[2JClear screen\x1b[0JClear to end';
      const result = parseClearAnsi(input);
      
      expect(result.commands).toHaveLength(2);
      expect(result.commands[0]).toEqual({ type: 'clear_screen' });
      expect(result.commands[1]).toEqual({ type: 'clear_to_end' });
      expect(result.text).toBe('Clear screenClear to end');
    });

    test('should parse all clear command types', () => {
      const input = '\x1b[0J\x1b[1J\x1b[2J\x1b[3J';
      const result = parseClearAnsi(input);
      
      expect(result.commands).toHaveLength(4);
      expect(result.commands[0]).toEqual({ type: 'clear_to_end' });
      expect(result.commands[1]).toEqual({ type: 'clear_to_beginning' });
      expect(result.commands[2]).toEqual({ type: 'clear_screen' });
      expect(result.commands[3]).toEqual({ type: 'clear_all' });
    });

    test('should handle default parameter', () => {
      const input = '\x1b[JDefault clear';
      const result = parseClearAnsi(input);
      
      expect(result.commands[0]).toEqual({ type: 'clear_to_end' });
    });

    test('should handle text without clear codes', () => {
      const input = 'Plain text';
      const result = parseClearAnsi(input);
      
      expect(result.commands).toHaveLength(0);
      expect(result.text).toBe('Plain text');
    });
  });
});