export class ChatRequestDto {
  systemPrompt: string;
  userContent: string;
  temperature: number;
  format?: 'json';
  unavailableMessage?: string;
}
