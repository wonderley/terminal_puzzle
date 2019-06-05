export interface GridView {
  initializeView(): void;
  updateView(): void;
  drawCursorAt(x: number, y: number): void;
  clearCursorAt(x: number, y: number): void;
}