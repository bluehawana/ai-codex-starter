export interface Profile {
  name: string;
  baseUrl: string;
  model?: string;
  envKeyName?: string; // Custom environment variable name (e.g., 'MINIMAX_API_KEY')
  modelProvider?: string; // Codex model provider name (e.g., 'minimax', 'openai')
}

export interface ProfileWithCredential extends Profile {
  credential?: string;
}

export interface Config {
  profiles: Profile[];
  defaultProfile?: string;
}

export const PRESETS: Record<string, Omit<Profile, 'name'>> = {
  'OpenAI ChatGPT': {
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4',
    envKeyName: 'OPENAI_API_KEY'
  },
  'Azure OpenAI': {
    baseUrl: 'https://YOUR_RESOURCE.openai.azure.com',
    model: 'gpt-4-32k',
    envKeyName: 'OPENAI_API_KEY'
  },
  'Any Router': {
    baseUrl: 'https://anyrouter.top/v1',
    model: 'gpt-5-codex',
    envKeyName: 'OPENAI_API_KEY',
    modelProvider: 'anyrouter'
  },
  'Kimi (Moonshot)': {
    baseUrl: 'https://api.moonshot.cn/v1',
    model: 'moonshot-v1-8k',
    envKeyName: 'OPENAI_API_KEY'
  },
  'Minimax': {
    baseUrl: 'https://api.minimax.io/v1',
    model: 'MiniMax-M2',
    envKeyName: 'MINIMAX_API_KEY',
    modelProvider: 'minimax'
  }
};

export const SERVICE_NAME = 'ai-codex-starter';
