import { executeCustomCommand } from '../src/utils/commands';
import { formatTargetDir, writeTemplate } from '../src/utils/files';
import { pkgFromUserAgent } from '../src/utils/helpers';

// Mock cross-spawn
jest.mock('cross-spawn');

describe('Commands', () => {
  describe('executeCustomCommand', () => {
    it('should replace TARGET_DIR placeholder', async () => {
      const spawn = require('cross-spawn');
      const mockChild = {
        on: jest.fn((event, callback) => {
          if (event === 'close') {
            setTimeout(() => callback(0), 10);
          }
        })
      };
      spawn.mockReturnValue(mockChild);

      await executeCustomCommand('npm create test TARGET_DIR', 'my-project');
      
      expect(spawn).toHaveBeenCalledWith(
        'npm',
        ['create', 'test', 'my-project'],
        expect.any(Object)
      );
    });
  });
});

describe('Integration Tests', () => {
  describe('Template Creation Flow', () => {
    it('should format target directory correctly', () => {
      expect(formatTargetDir('my-project')).toBe('my-project');
      expect(formatTargetDir('my-project/')).toBe('my-project');
    });

    it('should parse package manager from user agent', () => {
      const result = pkgFromUserAgent('npm/8.19.2 node/v18.12.1');
      expect(result).toEqual({
        name: 'npm',
        version: '8.19.2'
      });
    });
  });
});