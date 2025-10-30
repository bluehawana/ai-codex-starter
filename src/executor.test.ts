import { describe, it, expect, beforeEach } from 'vitest';
import { sanitizeEnvironment, prepareEnvironment } from './executor.js';
import type { Profile } from './types.js';

describe('Executor Layer', () => {
  describe('sanitizeEnvironment', () => {
    beforeEach(() => {
      // Set some test environment variables
      process.env.OPENAI_API_KEY = 'test-key';
      process.env.OPENAI_BASE_URL = 'https://test.com';
      process.env.OTHER_VAR = 'keep-this';
    });

    it('should remove all OPENAI_* environment variables', () => {
      const clean = sanitizeEnvironment();
      
      expect(clean.OPENAI_API_KEY).toBeUndefined();
      expect(clean.OPENAI_BASE_URL).toBeUndefined();
    });

    it('should preserve non-OPENAI environment variables', () => {
      const clean = sanitizeEnvironment();
      
      expect(clean.OTHER_VAR).toBe('keep-this');
      expect(clean.PATH).toBeDefined();
    });
  });

  describe('prepareEnvironment', () => {
    it('should inject OPENAI_API_KEY', async () => {
      const profile: Profile = {
        name: 'test',
        baseUrl: 'https://api.openai.com/v1',
        model: 'gpt-4'
      };
      const credential = 'sk-test-key';

      const env = await prepareEnvironment(profile, credential);

      expect(env.OPENAI_API_KEY).toBe('sk-test-key');
    });

    it('should inject OPENAI_BASE_URL for non-default URLs', async () => {
      const profile: Profile = {
        name: 'test',
        baseUrl: 'https://custom.api.com/v1',
        model: 'gpt-4'
      };
      const credential = 'sk-test-key';

      const env = await prepareEnvironment(profile, credential);

      expect(env.OPENAI_BASE_URL).toBe('https://custom.api.com/v1');
    });

    it('should not inject OPENAI_BASE_URL for default OpenAI URL', async () => {
      const profile: Profile = {
        name: 'test',
        baseUrl: 'https://api.openai.com/v1',
        model: 'gpt-4'
      };
      const credential = 'sk-test-key';

      const env = await prepareEnvironment(profile, credential);

      expect(env.OPENAI_BASE_URL).toBeUndefined();
    });

    it('should sanitize existing OPENAI_* variables', async () => {
      process.env.OPENAI_API_KEY = 'old-key';
      process.env.OPENAI_BASE_URL = 'https://old.com';

      const profile: Profile = {
        name: 'test',
        baseUrl: 'https://api.openai.com/v1',
        model: 'gpt-4'
      };
      const credential = 'sk-new-key';

      const env = await prepareEnvironment(profile, credential);

      expect(env.OPENAI_API_KEY).toBe('sk-new-key');
      expect(env.OPENAI_BASE_URL).toBeUndefined();
    });
  });
});
