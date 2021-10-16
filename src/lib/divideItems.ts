import type { Item, Territory } from '$lib/types';

export const divide = (items: Item[], baseName: string, maxPerTerritory: number): Territory[] => {
  const out = [];
  let i = 0;
  const total = Math.ceil(items.length / maxPerTerritory);
  while (i < total) {
    out.push({
      title: `${baseName} ${String.fromCharCode(97 + i).toLocaleUpperCase()}`,
      items: items.slice(
        Math.ceil(items.length / total) * i,
        Math.ceil(items.length / total) * (i + 1)
      )
    });
    i++;
  }
  return out;
};
