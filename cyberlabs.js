import { supabase } from './supabase-client.js';

const TRACKS = {
  herops: {
    title: 'CYBERSECURITY / HEROPS',
    description: 'Build practical cybersecurity skills, from digital safety and OSINT to defensive investigation.',
    modules: [
      'Cybersecurity Fundamentals',
      'OSINT & Digital Footprints',
      'Social Engineering Awareness',
      'Networking Fundamentals',
      'Linux & Security Tools',
      'Web Security Fundamentals',
      'SQL Injection & XSS',
      'Blue Team & Incident Response'
    ]
  },
  vibecoding: {
    title: 'VIBE CODING & AI DEVELOPMENT',
    description: 'Learn to build and deploy digital products using AI assistance and core web development skills.',
    modules: [
      'Introduction to Vibe Coding',
      'Prompt Engineering for Builders',
      'Build Your First Website',
      'GitHub & Deployment',
      'Build Interactive Applications',
      'Final Project — Ship Your Product'
    ]
  }
};

const $ = id => document.getElementById(id);
const onboarding = $('lab-onboarding');
const dashboard = $('lab-dashboard');
const form = $('lab-interest-form');
const save = $('lab-save');
const status = $('lab-save-status');
let member = null;
let selected = [];

function chosen() {
  return [...form.querySelectorAll('input[name="interest"]:checked')].map(input => input.value);
}
function syncForm() {
  save.disabled = chosen().length === 0 || !member;
}
function showOnboarding() {
  onboarding.hidden = false;
  dashboard.hidden = true;
  form.querySelectorAll('input[name="interest"]').forEach(input => {
    input.checked = selected.includes(input.value);
  });
  syncForm();
}
function renderDashboard() {
  onboarding.hidden = true;
  dashboard.hidden = false;
  $('lab-track-count').textContent = String(selected.length);
  $('lab-module-count').textContent = String(selected.reduce((sum, key) => sum + TRACKS[key].modules.length, 0));
  const target = $('lab-paths');
  target.replaceChildren();
  for (const key of selected) {
    const track = TRACKS[key];
    const article = document.createElement('article');
    article.className = 'lab-path';
    const heading = document.createElement('header');
    const details = document.createElement('div');
    const kicker = document.createElement('div');
    kicker.className = 'lab-kicker';
    kicker.textContent = 'SELECTED LEARNING PATH';
    const title = document.createElement('h3');
    title.textContent = track.title;
    const desc = document.createElement('p');
    desc.textContent = track.description;
    details.append(kicker, title, desc);
    const tag = document.createElement('span');
    tag.className = 'lab-tag';
    tag.textContent = `${track.modules.length} MODULES`;
    heading.append(details, tag);
    const modules = document.createElement('div');
    modules.className = 'lab-module-list';
    track.modules.forEach((name, index) => {
      const row = document.createElement('div');
      row.className = 'lab-module';
      const number = document.createElement('span');
      number.className = 'lab-module-number';
      number.textContent = String(index + 1).padStart(2, '0');
      const label = document.createElement('span');
      label.className = 'lab-module-title';
      label.textContent = name;
      const state = document.createElement('span');
      state.className = 'lab-module-status';
      state.textContent = key === 'herops' ? 'AVAILABLE' : 'PLANNED';
      row.append(number, label, state);
      modules.append(row);
    });
    article.append(heading, modules);
    if (key === 'herops') {
      const launch = document.createElement('a');
      launch.href = './herops.html';
      launch.className = 'lab-button';
      launch.style.cssText = 'display:inline-block;margin-top:20px;text-decoration:none';
      launch.textContent = 'START HEROPS COURSE →';
      article.append(launch);
    }
    target.append(article);
  }
}

form.addEventListener('change', syncForm);
$('lab-edit').addEventListener('click', showOnboarding);
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (!member || chosen().length === 0) return;
  save.disabled = true;
  status.textContent = 'Saving preferences…';
  const next = chosen();
  // Phase 1: persist in Supabase Auth user metadata. Never use this for authorization or XP.
  const { error } = await supabase.auth.updateUser({ data: { herstacks_learning_interests: next } });
  if (error) {
    status.textContent = `Unable to save: ${error.message}`;
    syncForm();
    return;
  }
  selected = next;
  status.textContent = '';
  renderDashboard();
});

async function initialize() {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      $('lab-auth').innerHTML = 'MEMBER SIGN-IN REQUIRED // <a href="./account.html">Sign in to select your learning track →</a>';
      return;
    }
    member = data.user;
    selected = Array.isArray(member.user_metadata?.herstacks_learning_interests)
      ? [...new Set(member.user_metadata.herstacks_learning_interests.filter(key => Object.hasOwn(TRACKS, key)))]
      : [];
    $('lab-auth').textContent = `SIGNED IN // ${member.email || 'HERSTACKS MEMBER'}`;
    if (selected.length) renderDashboard();
    else showOnboarding();
  } catch (error) {
    $('lab-auth').textContent = `Could not load your member session: ${error.message}`;
  }
}
initialize();
