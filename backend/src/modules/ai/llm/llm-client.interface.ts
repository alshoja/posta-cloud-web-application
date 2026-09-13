import { ChatRequestDto } from '../dto/chat-request.dto';

export const LLM_CLIENT = Symbol('LLM_CLIENT');

export interface LlmClient {
  chat(request: ChatRequestDto): Promise<string>;
  embed(input: string): Promise<number[]>;
}
