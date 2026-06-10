const data = await fetch('./ideas.json').then((res) => {
  if (!res.ok) throw new Error('Unable to load ideas.json');
  return res.json();
});

const CATS = data.CATS;
const IDEAS = data.IDEAS;
const CAT_LABELS = Object.fromEntries(CATS.map((cat) => [cat.id, cat.label]));

const state = {
  view: 'home',
  cat: 'all',
  idea: null,
  log: loadLog(),
};

const els = {
  homeView: document.querySelector('#home-view'),
  logView: document.querySelector('#log-view'),
  categoryList: document.querySelector('#category-list'),
  ideaCategory: document.querySelector('#idea-category'),
  ideaText: document.querySelector('#idea-text'),
  pick: document.querySelector('#pick'),
  complete: document.querySelector('#complete'),
  tabHome: document.querySelector('#tab-home'),
  tabLog: document.querySelector('#tab-log'),
  countTab: document.querySelector('#count-tab'),
  countCopy: document.querySelector('#count-copy'),
  logList: document.querySelector('#log-list'),
  logEmpty: document.querySelector('#log-empty'),
};

els.tabHome.addEventListener('click', () => {
  state.view = 'home';
  render();
});
els.tabLog.addEventListener('click', () => {
  state.view = 'log';
  render();
});
els.pick.addEventListener('click', pickIdea);
els.complete.addEventListener('click', completeIdea);

function loadLog() {
  try {
    return JSON.parse(localStorage.getItem('whimsey-log-v1') || '[]');
  } catch {
    return [];
  }
}

function saveLog() {
  try {
    localStorage.setItem('whimsey-log-v1', JSON.stringify(state.log));
  } catch {
    // Ignore storage errors
  }
}

function pickIdea() {
  const pool = IDEAS.filter((idea) => state.cat === 'all' || idea.c === state.cat);
  if (!pool.length) return;

  let next = pool[Math.floor(Math.random() * pool.length)];
  if (pool.length > 1 && state.idea && next.t === state.idea.t) {
    next = pool[(pool.indexOf(next) + 1) % pool.length];
  }

  state.idea = next;
  render();
}

function completeIdea() {
  if (!state.idea) return;

  state.log = [{ t: state.idea.t, c: state.idea.c, ts: Date.now() }, ...state.log];
  saveLog();
  render();
}

function renderCategories() {
  const fragment = document.createDocumentFragment();

  for (const cat of CATS) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = cat.label;
    btn.className = state.cat === cat.id ? 'active' : '';
    btn.addEventListener('click', () => {
      state.cat = cat.id;
      render();
    });
    fragment.appendChild(btn);
  }

  els.categoryList.replaceChildren(fragment);
}

function renderLog() {
  els.logList.replaceChildren();

  const count = state.log.length;
  const countText = count === 1 ? '1 whimsy completed' : `${count} whimsies completed`;

  els.countTab.textContent = String(count);
  els.countCopy.textContent = countText;
  els.logEmpty.classList.toggle('hidden', count > 0);

  const fmt = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' });

  for (const item of state.log) {
    const li = document.createElement('li');

    const meta = document.createElement('strong');
    meta.textContent = `${CAT_LABELS[item.c] || item.c} · ${fmt.format(item.ts)}`;
    li.append(meta, document.createElement('br'));
    li.append(document.createTextNode(item.t));

    els.logList.appendChild(li);
  }
}

function renderIdea() {
  if (!state.idea) {
    els.ideaCategory.textContent = 'Ready when you are';
    els.ideaText.textContent = 'Press the button to receive a whimsy.';
    els.complete.classList.add('hidden');
    return;
  }

  els.ideaCategory.textContent = CAT_LABELS[state.idea.c] || state.idea.c;
  els.ideaText.textContent = state.idea.t;
  els.complete.classList.remove('hidden');
}

function render() {
  renderCategories();
  renderIdea();
  renderLog();

  const home = state.view === 'home';
  els.homeView.classList.toggle('hidden', !home);
  els.logView.classList.toggle('hidden', home);
  els.tabHome.classList.toggle('active', home);
  els.tabLog.classList.toggle('active', !home);
}

render();
