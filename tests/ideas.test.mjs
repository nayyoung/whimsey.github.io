import test from 'node:test';
import assert from 'node:assert/strict';
import { CATS, IDEAS, CAT_LABELS } from '../ideas.js';

test('categories are unique and include all', () => {
  assert.ok(Array.isArray(CATS));
  assert.ok(CATS.length > 0);

  const ids = CATS.map((cat) => cat.id);
  const uniqueIds = new Set(ids);
  assert.equal(uniqueIds.size, ids.length);
  assert.ok(uniqueIds.has('all'));
});

test('every idea maps to a known non-all category', () => {
  assert.ok(Array.isArray(IDEAS));
  assert.ok(IDEAS.length > 0);

  const validCategoryIds = new Set(CATS.filter((cat) => cat.id !== 'all').map((cat) => cat.id));

  for (const idea of IDEAS) {
    assert.ok(validCategoryIds.has(idea.c), `Unknown category "${idea.c}"`);
    assert.equal(typeof idea.t, 'string');
    assert.ok(idea.t.trim().length > 0);
  }
});

test('category labels align with categories', () => {
  for (const cat of CATS) {
    assert.equal(CAT_LABELS[cat.id], cat.label);
  }
});
