import data from './ideas.json' with { type: 'json' };

export const CATS = data.CATS;
export const IDEAS = data.IDEAS;
export const CAT_LABELS = Object.fromEntries(CATS.map((c) => [c.id, c.label]));
