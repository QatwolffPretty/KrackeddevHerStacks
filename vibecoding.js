import { supabase } from './supabase-client.js';
import { modules } from './vibecoding-content.js';

const $ = (id) => document.getElementById(id);
const element = (tag, className = '', text = '') => {
  const node = document.createElement(tag);
  node.className = className;
  node.textContent = text;
  return node;
};
const lessonId = (moduleIndex, lessonIndex) =>
  `m${String(moduleIndex + 1).padStart(2, '0')}-l${String(lessonIndex + 1).padStart(2, '0')}`;

let user = null;
let completed = new Set();
let activeModule = 0;
let activeLesson = -1;
let saving = false;

function updateProgress() {
  const count = completed.size;
  const percent = Math.round((count / 24) * 100);
  $('vc-count').textContent = `${count} / 24`;
  $('vc-percent').textContent = `${percent}%`;
  $('vc-progress').setAttribute('aria-valuenow', String(percent));
  $('vc-progress-fill').style.width = `${percent}%`;
}

function renderNavigation() {
  const target = $('vc-module-nav');
  target.replaceChildren();
  modules.forEach((module, moduleIndex) => {
    const count = module.lessons.filter((_, index) => completed.has(lessonId(moduleIndex, index))).length;
    const button = element('button', 'vc-module');
    button.type = 'button';
    button.classList.toggle('active', moduleIndex === activeModule);
    button.append(
      element('small', '', `MODULE ${String(moduleIndex + 1).padStart(2, '0')} · ${count}/3 COMPLETE`),
      element('strong', '', module.title)
    );
    button.addEventListener('click', () => {
      activeModule = moduleIndex;
      activeLesson = -1;
      render();
    });
    target.append(button);
  });
}

function renderModule() {
  const module = modules[activeModule];
  const target = $('vc-detail');
  target.replaceChildren(
    element('div', 'kicker', `MODULE ${String(activeModule + 1).padStart(2, '0')} / 08`),
    element('h2', '', module.title),
    element('p', 'vc-copy', module.intro),
    element('h3', '', 'LESSONS & KNOWLEDGE CHECKS')
  );
  const list = element('div', 'vc-lessons');
  module.lessons.forEach((lesson, index) => {
    const done = completed.has(lessonId(activeModule, index));
    const button = element('button', 'vc-lesson');
    button.type = 'button';
    button.append(
      element('small', '', `LESSON ${index + 1} / 3 · ${done ? 'COMPLETED ✓' : 'READY'}`),
      element('strong', '', lesson[0])
    );
    button.addEventListener('click', () => {
      activeLesson = index;
      render();
    });
    list.append(button);
  });
  target.append(list);
}

function renderLesson() {
  const target = $('vc-detail');
  const moduleIndex = activeModule;
  const lessonIndex = activeLesson;
  const [title, theory, practice, question, options, answer, explanation] =
    modules[moduleIndex].lessons[lessonIndex];
  target.replaceChildren();

  const back = element('button', 'vc-button vc-outline', '← BACK TO LESSONS');
  back.type = 'button';
  back.addEventListener('click', () => { activeLesson = -1; render(); });
  target.append(back);
  target.append(
    element('div', 'kicker', `MODULE ${moduleIndex + 1} / LESSON ${lessonIndex + 1}`),
    element('h2', '', title),
    element('h3', '', '01 / LEARN'),
    element('p', 'vc-copy', theory),
    element('h3', '', '02 / PRACTICE'),
    element('p', 'vc-practice', practice),
    element('h3', '', '03 / KNOWLEDGE CHECK'),
    element('p', 'vc-copy', question)
  );

  const choices = element('fieldset', 'vc-choices');
  const legend = element('legend', 'vc-visually-hidden', 'Choose your answer');
  choices.append(legend);
  let selection = -1;
  const submit = element('button', 'vc-button', 'CHECK ANSWER →');
  submit.type = 'button';
  submit.disabled = true;
  const feedback = element('p', 'vc-feedback');
  feedback.setAttribute('role', 'status');

  options.forEach((option, index) => {
    const label = element('label', 'vc-option');
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'vc-answer';
    input.value = String(index);
    input.addEventListener('change', () => { selection = index; submit.disabled = false; });
    label.append(input, element('span', '', option));
    choices.append(label);
  });

  submit.addEventListener('click', async () => {
    if (saving || selection < 0) return;
    if (selection !== answer) {
      feedback.textContent = 'Not quite. Review the explanation and try again.';
      return;
    }
    if (completed.has(lessonId(moduleIndex, lessonIndex))) {
      feedback.textContent = `Correct! ${explanation} This lesson is already recorded.`;
      return;
    }
    saving = true;
    submit.disabled = true;
    feedback.textContent = 'Correct. Saving your progress…';
    try {
      const { error } = await supabase.from('vibecoding_lesson_progress').upsert(
        { user_id: user.id, lesson_id: lessonId(moduleIndex, lessonIndex) },
        { onConflict: 'user_id,lesson_id', ignoreDuplicates: true }
      );
      if (error) throw error;
      completed.add(lessonId(moduleIndex, lessonIndex));
      updateProgress();
      renderNavigation();
      feedback.textContent = `COMPLETED ✓ ${explanation}`;
      const next = lessonIndex < 2 ? [moduleIndex, lessonIndex + 1] : moduleIndex < 7 ? [moduleIndex + 1, 0] : null;
      if (next) {
        const nextButton = element('button', 'vc-button vc-outline', 'NEXT LESSON →');
        nextButton.type = 'button';
        nextButton.addEventListener('click', () => {
          activeModule = next[0];
          activeLesson = next[1];
          render();
        });
        target.append(nextButton);
      }
    } catch (error) {
      feedback.textContent = `Unable to save completion: ${error.message}`;
    } finally {
      saving = false;
      submit.disabled = false;
    }
  });

  target.append(choices, submit, feedback);
  if (completed.has(lessonId(moduleIndex, lessonIndex))) {
    feedback.textContent = '✓ THIS LESSON IS ALREADY COMPLETED';
  }
}

function render() {
  renderNavigation();
  if (activeLesson < 0) renderModule();
  else renderLesson();
}

async function initialize() {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    if (!data.user) {
      const status = $('vc-auth');
      status.replaceChildren(document.createTextNode('MEMBER SIGN-IN REQUIRED // '));
      const link = element('a', '', 'SIGN IN →');
      link.href = './account.html';
      status.append(link);
      return;
    }
    user = data.user;
    const result = await supabase.from('vibecoding_lesson_progress')
      .select('lesson_id').eq('user_id', user.id);
    if (result.error) throw result.error;
    const valid = new Set(modules.flatMap((module, m) => module.lessons.map((_, l) => lessonId(m, l))));
    completed = new Set((result.data || []).map((row) => row.lesson_id).filter((id) => valid.has(id)));
    $('vc-auth').textContent = `SIGNED IN // ${user.email || 'HERSTACKS MEMBER'}`;
    $('vc-course').hidden = false;
    updateProgress();
    render();
  } catch (error) {
    $('vc-auth').textContent = `Unable to load course: ${error.message}`;
  }
}

initialize();
