export interface Profile {
  name: string;
  baseUrl: string;
  model?: string;
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
    model: 'gpt-4'
  },
  'Azure OpenAI': {
    baseUrl: 'https://YOUR_RESOURCE.openai.azure.com',
    model: 'gpt-4-32k'
  },
  'Kimi (Moonshot)': {
    baseUrl: 'https://api.moonshot.cn/v1',
    model: 'moonshot-v1-8k'
  },
  'Minimax': {
    baseUrl: 'https://api.minimax.chat/v1',
    model: 'abab6.5-chat'
  }
};

export const SERVICE_NAME = 'ai-codex-starter';
