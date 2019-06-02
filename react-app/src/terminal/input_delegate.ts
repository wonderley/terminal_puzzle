export interface InputDelegate {
  onUserInput(input: { full: string }): void;
}
