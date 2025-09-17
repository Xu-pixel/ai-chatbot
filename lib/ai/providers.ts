import { customProvider } from 'ai';
import { gateway } from '@ai-sdk/gateway';
import { createOpenAI } from '@ai-sdk/openai';
import { isTestEnvironment } from '../constants';
import { createDeepSeek } from '@ai-sdk/deepseek';
const openai = createOpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: 'sk-b82a6f219a10463aafde2894a3213226',
});

const deepseek = createDeepSeek({
  apiKey: 'sk-b82a6f219a10463aafde2894a3213226',
});
export const myProvider = isTestEnvironment
  ? (() => {
      const {
        artifactModel,
        chatModel,
        reasoningModel,
        titleModel,
      } = require('./models.mock');
      return customProvider({
        languageModels: {
          'chat-model': chatModel,
          'chat-model-reasoning': reasoningModel,
          'title-model': titleModel,
          'artifact-model': artifactModel,
        },
      });
    })()
  : customProvider({
      languageModels: {
        'chat-model': openai.chat('deepseek-chat'),
        'chat-model-reasoning': deepseek('deepseek-reasoner'),
        'title-model': gateway.languageModel('xai/grok-2-1212'),
        'artifact-model': gateway.languageModel('xai/grok-2-1212'),
      },
    });
