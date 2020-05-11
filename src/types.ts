export type IterableNodeListOf<T extends Node> = NodeListOf<T> & Iterable<T>;

export interface CursorPosition {
  x: number;
  y: number;
}
