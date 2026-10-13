import { supabase } from './supabase-client.js';
import { modules } from './herops-content.js';

const $ = id => document.getElementById(id);
const course = $('ho-course');
const auth = $('ho-auth');
let user = null;
let completed = new Set();
let activeModule = 0;
let activeLesson = -1;
let questionChoice = -1;
let busy = false;

const lessonId = (m, l) => `m${String(m + 1).padStart(2, '0')}-l${String(l + 1).padStart(2, '0')}`;
const el = (tag, cls, content) => {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (content !== undefined) node.textContent = content;
  return node;
};
const add = (parent, ...nodes) => { parent.append(...nodes); return parent; };
const button = (text, handler, cls = 'ho-button') => {
  const b = el('button', cls, text);
  b.type = 'button';
  b.addEventListener('click', handler);
  return b;
};

function refreshProgress() {
  const n = completed.size;
  const percent = Math.round(n / 24 * 100);
  $('ho-count').textContent = `${n} / 24`;
  $('ho-percent').textContent = `${percent}%`;
  $('ho-progress').setAttribute('aria-valuenow', String(percent));
  $('ho-progress-fill').style.width = `${percent}%`;
}

function renderNavigation() {
  const nav = $('ho-module-nav');
  nav.replaceChildren();
  modules.forEach((module, m) => {
    const done = module.lessons.filter((_, l) => completed.has(lessonId(m, l))).length;
    const b = el('button', 'ho-module-button');
    b.type = 'button';
    b.setAttribute('aria-current', String(activeModule === m));
    add(b, el('span', '', `MODULE ${String(m + 1).padStart(2, '0')} · ${done}/3 COMPLETE`), el('strong', '', module.title));
    b.addEventListener('click', () => { activeModule = m; activeLesson = -1; render(); });
    nav.append(b);
  });
}

function renderModule() {
  const module = modules[activeModule];
  const target = $('ho-detail');
  target.replaceChildren();
  add(target, el('div', 'ho-kicker', `MODULE ${String(activeModule + 1).padStart(2, '0')} / 08`), el('h2', '', module.title), el('p', '', module.intro), el('h3', '', 'LESSONS & ASSESSMENTS'));
  const list = el('div', 'ho-lesson-grid');
  module.lessons.forEach((lesson, l) => {
    const done = completed.has(lessonId(activeModule, l));
    const b = el('button', 'ho-lesson-button');
    b.type = 'button';
    add(b, el('span', '', `LESSON ${l + 1} / 3 ${done ? '· COMPLETED ✓' : '· READY'}`), el('strong', '', lesson[0]));
    b.addEventListener('click', () => { activeLesson = l; questionChoice = -1; render(); });
    list.append(b);
  });
  target.append(list);
}

function renderLesson() {
  const m = activeModule, l = activeLesson;
  const [title, theory, question, options, answer, explanation, practice] = modules[m].lessons[l];
  const target = $('ho-detail');
  target.replaceChildren();
  target.append(button('← ALL LESSONS', () => { activeLesson = -1; render(); }, 'ho-button ho-button-outline ho-back'));
  add(target, el('div', 'ho-kicker', `MODULE ${m + 1} / LESSON ${l + 1}`), el('h2', '', title), el('h3', '', '01 / LEARN'), el('p', '', theory), el('h3', '', '02 / PRACTICE'), el('div', 'ho-note', practice), el('h3', '', '03 / KNOWLEDGE CHECK'), el('p', '', question));
  const optionsEl = el('div', 'ho-options');
  options.forEach((option, i) => {
    const label = el('label', 'ho-option');
    const input = el('input');
    input.type = 'radio'; input.name = 'ho-answer'; input.value = String(i);
    input.addEventListener('change', () => { questionChoice = i; submit.disabled = false; });
    add(label, input, el('span', '', option));
    optionsEl.append(label);
  });
  target.append(optionsEl);
  const submit = button('CHECK ANSWER →', async () => {
    if (busy || questionChoice < 0) return;
    feedback.replaceChildren();
    if (questionChoice !== answer) {
      feedback.textContent = 'Not quite. Review the lesson and try again.';
      return;
    }
    if (completed.has(lessonId(m, l))) {
      feedback.textContent = `Correct. ${explanation} This lesson is already completed.`;
      return;
    }
    busy = true; submit.disabled = true;
    feedback.textContent = 'Correct. Saving completion to your account…';
    try {
      const { error } = await supabase.from('herops_lesson_progress').upsert({ user_id: user.id, lesson_id: lessonId(m, l) }, { onConflict: 'user_id,lesson_id' });
      if (error) throw error;
      completed.add(lessonId(m, l));
      refreshProgress();
      renderNavigation();
      feedback.textContent = `Completed ✓ ${explanation}`;
      const next = l < 2 ? [m, l + 1] : m < 7 ? [m + 1, 0] : null;
      if (next) target.append(button('NEXT LESSON →', () => { activeModule = next[0]; activeLesson = next[1]; questionChoice = -1; render(); }));
    } catch (error) {
      feedback.textContent = `Correct answer, but completion was not saved: ${error.message}. Check the Supabase SQL setup.`;
    } finally { busy = false; submit.disabled = false; }
  });
  submit.disabled = true;
  target.append(submit);
  if (completed.has(lessonId(m, l))) target.append(el('p', 'ho-complete', '✓ ALREADY COMPLETED'));
  const feedback = el('div', 'ho-feedback');
  feedback.setAttribute('role', 'status');
  feedback.setAttribute('aria-live', 'polite');
  target.append(feedback);
}

function render() {
  renderNavigation();
  if (activeLesson === -1) renderModule(); else renderLesson();
}

async function initialize() {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      auth.replaceChildren(document.createTextNode('MEMBER SIGN-IN REQUIRED // '));
      const a = el('a', '', 'Sign in to start learning →'); a.href = './account.html'; auth.append(a);
      return;
    }
    user = data.user;
    const result = await supabase.from('herops_lesson_progress').select('lesson_id').eq('user_id', user.id);
    if (result.error) throw result.error;
    completed = new Set((result.data || []).map(row => row.lesson_id));
    auth.textContent = `SIGNED IN // ${user.email || 'HERSTACKS MEMBER'}`;
    course.hidden = false;
    refreshProgress(); render();
  } catch (error) {
    auth.textContent = `Unable to load HerOps: ${error.message}. Ensure herops-progress.sql was run in Supabase.`;
    auth.classList.add('ho-error');
  }
}
initialize();
