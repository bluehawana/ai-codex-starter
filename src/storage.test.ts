import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

// Mock config path for testing
const TEST_CONFIG_PATH = join(homedir(), '.ai-codex-profiles-test.json');
process.env.AI_CODEX_CONFIG_PATH = TEST_CONFIG_PATH;

// Import after setting env var
const { readConfig, writeConfig, isKeytarAvailable } = await import('./storage.js');

describe('Storage Layer', () => {
  beforeEach(() => {
    // Clean up test config file before each test
    if (existsSync(TEST_CONFIG_PATH)) {
      unlinkSync(TEST_CONFIG_PATH);
    }
  });

  afterEach(() => {
    // Clean up test config file after each test
    if (existsSync(TEST_CONFIG_PATH)) {
      unlinkSync(TEST_CONFIG_PATH);
    }
  });

  describe('readConfig', () => {
    it('should return empty config when file does not exist', () => {
      const config = readConfig();
      expect(config).toEqual({ profiles: [] });
    });

    it('should read existing config from file', () => {
      const testConfig = {
        config: {
          profiles: [
            { name: 'test', baseUrl: 'https://api.test.com', model: 'test-model' }
          ],
          defaultProfile: 'test'
        }
      };
      writeFileSync(TEST_CONFIG_PATH, JSON.stringify(testConfig));

      const config = readConfig();
      expect(config.profiles).toHaveLength(1);
      expect(config.profiles[0].name).toBe('test');
      expect(config.defaultProfile).toBe('test');
    });
  });

  describe('writeConfig', () => {
    it('should write config to file', () => {
      const config = {
        profiles: [
          { name: 'test', baseUrl: 'https://api.test.com', model: 'test-model' }
        ],
        defaultProfile: 'test'
      };

      writeConfig(config);

      expect(existsSync(TEST_CONFIG_PATH)).toBe(true);
      const data = JSON.parse(readFileSync(TEST_CONFIG_PATH, 'utf-8'));
      expect(data.config.profiles).toHaveLength(1);
      expect(data.config.profiles[0].name).toBe('test');
    });

    it('should preserve credentials when updating config', () => {
      const initialData = {
        config: { profiles: [], defaultProfile: undefined },
        credentials: { test: 'secret-key' }
      };
      writeFileSync(TEST_CONFIG_PATH, JSON.stringify(initialData));

      const newConfig = {
        profiles: [{ name: 'test', baseUrl: 'https://api.test.com' }]
      };
      writeConfig(newConfig);

      const data = JSON.parse(readFileSync(TEST_CONFIG_PATH, 'utf-8'));
      expect(data.credentials).toEqual({ test: 'secret-key' });
    });
  });

  describe('isKeytarAvailable', () => {
    it('should return a boolean', () => {
      const available = isKeytarAvailable();
      expect(typeof available).toBe('boolean');
    });
  });
});
