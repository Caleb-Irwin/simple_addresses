/**
 * Can be made globally available by placing this
 * inside `global.d.ts` and removing `export` keyword
 */
export interface Locals {
  userid: string;
}
export interface Search {
  query: string;
  id: string;
  requestId: number;
}

export interface Item {
  Id: string;
  Type: string;
  Text: string;
  Highlight: string;
  Description: string;
}
