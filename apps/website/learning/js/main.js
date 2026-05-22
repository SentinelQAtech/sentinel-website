/* ═══════════════════════════════════════════════════════
   Sentinel Learning — main.js  |  Toast Pack v1
   Flow: skeleton → loadDashboardData() → initDashboard(data)
   Replace loadDashboardData with fetch() to go live.
════════════════════════════════════════════════════════ */

/* ─── Dashboard Data ─── */
const dashboardData = {
  user: {
    name: 'Rapha Castilho',
    role: 'QA Engineer',
    level: 4,
    currentXP: 2480,
    nextLevelXP: 3000,
  },

  progress: {
    currentModule:       'Testes Funcionais',
    currentLesson:       'Aula 4 · Ciclo de vida do bug',
    completionPercent:   42,
    weeklyGoalCompleted: 3,
    weeklyGoalTotal:     5,
    streakDays:          7,
    streakRecord:        [true, true, true, true, true, true, true],
    studyTimeLabel:      '14 h',
  },

  stats: [
    {
      label: 'XP Total',
      value: '2.480',
      iconVariant: 'primary',
      iconSvg: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M9 1L11.09 6.26L17 7.27L13 11.14L14.18 17L9 14.27L3.82 17L5 11.14L1 7.27L6.91 6.26L9 1Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    },
    {
      label: 'Sequência atual',
      value: '7 dias',
      iconVariant: 'warning',
      iconSvg: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M9 2C9 2 5 6 5 10a4 4 0 008 0c0-4-4-8-4-8z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    },
    {
      label: 'Módulos concluídos',
      value: '2 / 7',
      iconVariant: 'accent',
      iconSvg: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M3 4H15M3 9H15M3 14H10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    },
    {
      label: 'Tempo estudado',
      value: '14 h',
      iconVariant: 'success',
      iconSvg: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><circle cx="9" cy="9" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M9 5v4l2.5 2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    },
  ],

  journey: [
    { title: 'Fundamentos QA',    status: 'done' },
    { title: 'Testes Manuais',    status: 'done' },
    { title: 'Testes Funcionais', status: 'current' },
    { title: 'Automação Básica',  status: 'locked' },
    { title: 'Playwright',        status: 'locked' },
    { title: 'API Testing',       status: 'locked' },
    { title: 'E2E Avançado',      status: 'locked' },
  ],

  modules: [
    {
      title:        'Fundamentos de QA',
      meta:         '8 aulas · 3h 20min',
      progress:     100,
      status:       'done',
      iconLabel:    'FQ',
      iconVariant:  'primary',
      badgeLabel:   'Concluído',
      badgeVariant: 'accent',
    },
    {
      title:        'Testes Manuais',
      meta:         '10 aulas · 4h 10min',
      progress:     100,
      status:       'done',
      iconLabel:    'TM',
      iconVariant:  'accent',
      badgeLabel:   'Concluído',
      badgeVariant: 'accent',
    },
    {
      title:        'Testes Funcionais',
      meta:         '12 aulas · 5h 00min',
      progress:     42,
      status:       'current',
      iconLabel:    'TF',
      iconVariant:  'current',
      badgeLabel:   'Em andamento',
      badgeVariant: 'primary',
    },
  ],

  activity: [
    { type: 'accent',  text: 'Completou <strong>"Ciclo de vida do bug"</strong>', time: 'há 2 horas' },
    { type: 'primary', text: 'Ganhou <strong>+120 XP</strong> em Testes Funcionais', time: 'há 2 horas' },
    { type: 'warning', text: 'Iniciou módulo <strong>"Testes Funcionais"</strong>', time: 'ontem' },
  ],
};


/* ─── Gamification Constants ─── */
const XP_PER_LESSON = 120;

const _MODULE_LESSONS = [
  'Aula 1 · Introdução ao módulo',
  'Aula 2 · Tipos de teste funcional',
  'Aula 3 · Técnicas de análise',
  'Aula 4 · Ciclo de vida do bug',
  'Aula 5 · Criação de casos de teste',
  'Aula 6 · Ambientes de teste',
  'Aula 7 · Relatórios de bugs',
  'Aula 8 · Gestão de defeitos',
  'Aula 9 · Priorização de testes',
  'Aula 10 · Revisão de requisitos',
  'Aula 11 · Revisão final',
  'Aula 12 · Projeto prático',
];

const LEVEL_TITLES = [
  '', 'Iniciante', 'Aprendiz', 'Estudante', 'Praticante',
  'Desenvolvedor', 'Especialista', 'Senior', 'Expert', 'Mestre', 'Lenda',
];

const _STORE_PROGRESS     = 'sl_dashboard_progress';
const _STORE_ACHIEVEMENTS = 'sl_dashboard_achievements';
const _STORE_NOTES        = 'sl_notes';

let _state = null;


/* ─── SVG Primitives ─── */
const _SVG_CHECK = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8L6.5 11.5L13 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const _SVG_PLAY  = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3 2L11 7L3 12V2Z" fill="currentColor"/></svg>`;
const _SVG_LOCK  = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><rect x="2" y="6" width="10" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/><path d="M4 6V4.5a3 3 0 016 0V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;
const _SVG_WARN  = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 2L18.5 17H1.5L10 2Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 8v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="10" cy="14.5" r="0.75" fill="currentColor"/></svg>`;

function _esc(s) {
  return s ? String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;') : '';
}
function _escCode(s) {
  return s ? String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') : '';
}


/* ═══════════════════════════════════════════════════════
   State — Storage & Init
════════════════════════════════════════════════════════ */

function _loadStoredProgress() {
  try { return JSON.parse(localStorage.getItem(_STORE_PROGRESS)); } catch { return null; }
}

function _loadStoredAchievements() {
  try { return JSON.parse(localStorage.getItem(_STORE_ACHIEVEMENTS)); } catch { return null; }
}

function _saveState() {
  try {
    localStorage.setItem(_STORE_PROGRESS,     JSON.stringify(_state.progress));
    localStorage.setItem(_STORE_ACHIEVEMENTS, JSON.stringify(_state.achievements));
  } catch { /* storage unavailable */ }
}

function _initState(savedProgress, savedAchievements) {
  const defaultProgress = {
    level:               4,
    currentXP:           2480,
    totalXP:             12480,
    nextLevelXP:         3000,
    currentModule:       'Testes Funcionais',
    currentLesson:       _MODULE_LESSONS[3],
    completionPercent:   42,
    completedLessons:    5,
    totalLessons:        12,
    weeklyGoalCompleted: 3,
    weeklyGoalTotal:     5,
    streakDays:          7,
    streakRecord:        [true, true, true, true, true, true, true],
    studyTimeLabel:      '14 h',
    moduleComplete:      false,
  };

  const defaultAchievements = [
    { id: 'first_step',    title: 'Primeiro Passo', desc: 'Concluiu a primeira aula',            unlocked: false },
    { id: 'on_fire',       title: 'Em Chamas',      desc: '7 dias consecutivos de estudo',       unlocked: false },
    { id: 'goal_crusher',  title: 'Meta Cumprida',  desc: 'Atingiu a meta semanal',              unlocked: false },
    { id: 'level_up_once', title: 'Evoluindo',      desc: 'Subiu de nível pela primeira vez',    unlocked: false },
  ];

  _state = {
    progress:     Object.assign({}, defaultProgress, savedProgress || {}),
    achievements: savedAchievements || defaultAchievements,
  };
}

function _getLevelTitle(level) {
  return LEVEL_TITLES[Math.min(level, LEVEL_TITLES.length - 1)] || 'Lenda';
}

function _computeStats(progress) {
  return [
    { label: 'XP Total',           value: progress.totalXP.toLocaleString('pt-BR'), iconVariant: 'primary', iconSvg: dashboardData.stats[0].iconSvg },
    { label: 'Sequência atual',    value: `${progress.streakDays} dias`,             iconVariant: 'warning', iconSvg: dashboardData.stats[1].iconSvg },
    { label: 'Módulos concluídos', value: '2 / 7',                                  iconVariant: 'accent',  iconSvg: dashboardData.stats[2].iconSvg },
    { label: 'Tempo estudado',     value: progress.studyTimeLabel,                  iconVariant: 'success', iconSvg: dashboardData.stats[3].iconSvg },
  ];
}

function _computeModules(progress) {
  return dashboardData.modules.map(mod => {
    if (mod.status !== 'current') return mod;
    return Object.assign({}, mod, {
      progress:     progress.completionPercent,
      badgeLabel:   progress.moduleComplete ? 'Concluído'   : 'Em andamento',
      badgeVariant: progress.moduleComplete ? 'accent'      : 'primary',
    });
  });
}


/* ═══════════════════════════════════════════════════════
   Skeleton Templates
════════════════════════════════════════════════════════ */

function _skelHero() {
  return `
    <div aria-hidden="true">
      <div class="flex items-center gap-sm mb-sm">
        <div class="skeleton skeleton-pill" style="width:64px;height:20px"></div>
        <div class="skeleton skeleton-line sk-w-2q sk-h-xs"></div>
      </div>
      <div class="skeleton skeleton-line sk-w-3q sk-h-lg mt-sm mb-sm"></div>
      <div class="skeleton skeleton-line sk-w-half sk-h-sm mb-md"></div>
      <div class="mt-md mb-md">
        <div class="skeleton skeleton-line sk-w-full sk-h-bar"></div>
      </div>
      <div class="mt-md mb-xl">
        <div class="skeleton skeleton-line sk-w-full sk-h-bar"></div>
      </div>
      <div class="skeleton sk-h-xl" style="width:180px;border-radius:var(--radius-md)"></div>
    </div>
  `;
}

function _skelStats() {
  return Array(4).fill(null).map(() => `
    <div class="stat-card" aria-hidden="true">
      <div class="skeleton skeleton-circle" style="width:36px;height:36px;flex-shrink:0"></div>
      <div class="flex flex-col gap-sm flex-1 min-w-0">
        <div class="skeleton skeleton-line sk-w-half sk-h-md"></div>
        <div class="skeleton skeleton-line sk-w-3q sk-h-xs"></div>
      </div>
    </div>
  `).join('');
}

function _skelJourney() {
  let html = '';
  for (let i = 0; i < 7; i++) {
    html += `
      <div class="journey-step" aria-hidden="true">
        <div class="skeleton skeleton-circle" style="width:40px;height:40px"></div>
        <div class="skeleton skeleton-line mt-sm" style="width:64px;height:10px"></div>
      </div>
    `;
    if (i < 6) {
      html += `<div class="skeleton journey-connector sk-h-bar" style="border-radius:var(--radius-full)" aria-hidden="true"></div>`;
    }
  }
  return html;
}

function _skelModules() {
  return Array(3).fill(null).map(() => `
    <div class="module-card" aria-hidden="true">
      <div class="skeleton skeleton-circle module-card__icon" style="width:40px;height:40px"></div>
      <div class="module-card__body">
        <div class="skeleton skeleton-line sk-h-sm mb-sm" style="width:60%"></div>
        <div class="skeleton skeleton-line sk-h-xs mb-md" style="width:40%"></div>
        <div class="skeleton skeleton-line sk-h-bar sk-w-full"></div>
      </div>
      <div class="module-card__tail">
        <div class="skeleton skeleton-line sk-h-sm" style="width:32px"></div>
        <div class="skeleton skeleton-pill mt-sm" style="width:72px;height:20px"></div>
      </div>
    </div>
  `).join('');
}

function _skelGoal() {
  return `
    <div class="goal-ring-wrap" aria-hidden="true">
      <div class="goal-ring-container">
        <div class="skeleton skeleton-circle" style="width:88px;height:88px"></div>
      </div>
      <div class="skeleton skeleton-line mt-md" style="width:120px;height:10px;margin-left:auto;margin-right:auto"></div>
    </div>
  `;
}

function _skelStreak() {
  return `
    <div class="streak-display" aria-hidden="true">
      <div class="skeleton" style="width:60px;height:56px;border-radius:var(--radius-lg)"></div>
      <div class="flex flex-col gap-sm">
        <div class="skeleton skeleton-line" style="width:36px;height:14px"></div>
        <div class="skeleton skeleton-line" style="width:80px;height:10px"></div>
      </div>
    </div>
    <div class="streak-days mt-md" aria-hidden="true">
      ${Array(7).fill(`<div class="skeleton sk-h-streak" style="flex:1;border-radius:var(--radius-full)"></div>`).join('')}
    </div>
  `;
}

function _skelActivity() {
  return Array(3).fill(null).map(() => `
    <div class="activity-item" aria-hidden="true">
      <div class="skeleton skeleton-circle" style="width:8px;height:8px;flex-shrink:0;margin-top:4px"></div>
      <div class="flex flex-col gap-sm flex-1 min-w-0">
        <div class="skeleton skeleton-line sk-h-sm" style="width:85%"></div>
        <div class="skeleton skeleton-line sk-h-xs" style="width:40%"></div>
      </div>
    </div>
  `).join('');
}

function renderSkeletonDashboard() {
  const main = document.getElementById('main');
  if (main) main.setAttribute('aria-busy', 'true');

  _announce('Carregando dashboard...');

  document.getElementById('hero-summary').innerHTML   = _skelHero();
  document.getElementById('stats-row').innerHTML      = _skelStats();
  document.getElementById('journey-map').innerHTML    = _skelJourney();
  document.getElementById('module-list').innerHTML    = _skelModules();
  document.getElementById('goal-ring-card').innerHTML = _skelGoal();
  document.getElementById('streak-card').innerHTML    = _skelStreak();
  document.getElementById('activity-list').innerHTML  = _skelActivity();
}


/* ═══════════════════════════════════════════════════════
   Render Functions  (real data)
════════════════════════════════════════════════════════ */

function renderHero(progress) {
  const el = document.getElementById('hero-summary');
  if (!el) return;

  const levelTitle = _getLevelTitle(progress.level);
  const xpPct      = Math.min(Math.round((progress.currentXP / progress.nextLevelXP) * 100), 100);
  const isComplete = progress.moduleComplete;

  el.innerHTML = `
    <div class="flex items-center gap-sm mb-sm">
      <span class="badge badge--primary">Nível ${progress.level}</span>
      <span class="hero-card__label" style="margin-bottom:0">${levelTitle}</span>
    </div>
    <h2 class="hero-card__title">${progress.currentModule}</h2>
    <p class="hero-card__subtitle">${progress.currentLesson}</p>

    <div class="hero-xp">
      <div class="hero-xp__header">
        <span style="font-size:var(--text-xs);color:var(--color-text-secondary)">XP do Nível</span>
        <span style="font-size:var(--text-xs);font-weight:var(--weight-semibold);color:var(--color-warning)">
          ${progress.currentXP.toLocaleString('pt-BR')} / ${progress.nextLevelXP.toLocaleString('pt-BR')} XP
        </span>
      </div>
      <div class="progress-bar"
           role="progressbar"
           aria-valuenow="${xpPct}"
           aria-valuemin="0"
           aria-valuemax="100"
           aria-label="XP do nível: ${xpPct}%">
        <div class="progress-bar__fill progress-bar__fill--xp" data-progress="${xpPct}%"></div>
      </div>
    </div>

    <div class="hero-card__progress-wrap">
      <div class="hero-card__progress-label">
        <span>Progresso do módulo</span>
        <span>${progress.completionPercent}%</span>
      </div>
      <div class="progress-bar"
           role="progressbar"
           aria-valuenow="${progress.completionPercent}"
           aria-valuemin="0"
           aria-valuemax="100"
           aria-label="Progresso: ${progress.completionPercent}%">
        <div class="progress-bar__fill" data-progress="${progress.completionPercent}%"></div>
      </div>
    </div>

    <button
      class="hero-card__cta button button--primary button--lg${isComplete ? ' is-disabled' : ''}"
      ${isComplete ? 'aria-disabled="true"' : ''}
      title="${isComplete ? 'Módulo concluído' : 'Concluir aula atual'}"
    >
      ${_SVG_PLAY}
      ${isComplete ? 'Módulo Concluído' : 'Concluir Aula'}
    </button>
  `;
}

function renderStats(stats) {
  const el = document.getElementById('stats-row');
  if (!el) return;

  el.innerHTML = stats.map(stat => `
    <div class="stat-card" role="listitem">
      <div class="stat-card__icon icon-chip icon-chip--md icon-chip--${stat.iconVariant}">
        ${stat.iconSvg}
      </div>
      <div>
        <div class="stat-card__value">${stat.value}</div>
        <div class="stat-card__label">${stat.label}</div>
      </div>
    </div>
  `).join('');
}

function renderJourney(journey) {
  const el = document.getElementById('journey-map');
  if (!el) return;

  const statusLabels = { done: 'Concluído', current: 'Em andamento', locked: 'Bloqueado' };
  const statusIcons  = { done: _SVG_CHECK, current: _SVG_PLAY, locked: _SVG_LOCK };

  let html = '';
  journey.forEach((step, i) => {
    html += `
      <div class="journey-step ${step.status}" role="listitem"
           aria-label="${step.title} — ${statusLabels[step.status]}">
        <div class="journey-step__bubble" aria-hidden="true">${statusIcons[step.status]}</div>
        <span class="journey-step__label">${step.title}</span>
      </div>
    `;
    if (i < journey.length - 1) {
      const next = journey[i + 1];
      let connClass = '';
      if (step.status === 'done' && next.status === 'done')    connClass = 'done';
      if (step.status === 'done' && next.status === 'current') connClass = 'partial';
      html += `<div class="journey-connector ${connClass}" aria-hidden="true"></div>`;
    }
  });

  el.innerHTML = html;
}

function renderModules(modules) {
  const el = document.getElementById('module-list');
  if (!el) return;

  el.innerHTML = modules.map(mod => {
    const pctClass = mod.status === 'done' ? 'text-accent' : '';
    return `
      <div class="module-card" tabindex="0" role="button"
           aria-label="${mod.title} — ${mod.progress}% ${mod.badgeLabel.toLowerCase()}">
        <div class="module-card__icon icon-chip icon-chip--lg icon-chip--${mod.iconVariant}"
             aria-hidden="true">${mod.iconLabel}</div>
        <div class="module-card__body">
          <div class="module-card__name">${mod.title}</div>
          <div class="module-card__meta">${mod.meta}</div>
          <div class="progress-bar"
               role="progressbar"
               aria-valuenow="${mod.progress}"
               aria-valuemin="0"
               aria-valuemax="100"
               aria-label="${mod.title}: ${mod.progress}% concluído">
            <div class="progress-bar__fill" data-progress="${mod.progress}%"></div>
          </div>
        </div>
        <div class="module-card__tail">
          <span class="module-card__pct ${pctClass}">${mod.progress}%</span>
          <span class="badge badge--${mod.badgeVariant} mt-sm">${mod.badgeLabel}</span>
        </div>
      </div>
    `;
  }).join('');
}

function renderGoal(progress) {
  const el = document.getElementById('goal-ring-card');
  if (!el) return;

  const pct = Math.round((progress.weeklyGoalCompleted / progress.weeklyGoalTotal) * 100);

  el.innerHTML = `
    <div class="goal-ring-wrap">
      <div class="goal-ring-container">
        <svg class="goal-ring" viewBox="0 0 72 72" aria-hidden="true">
          <defs>
            <linearGradient id="goalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stop-color="#6C63FF"/>
              <stop offset="100%" stop-color="#00D4AA"/>
            </linearGradient>
          </defs>
          <circle class="goal-ring__track" cx="36" cy="36" r="30"/>
          <circle class="goal-ring__fill"  cx="36" cy="36" r="30" data-progress="${pct}"/>
        </svg>
        <div class="goal-ring-text"
             aria-label="${progress.weeklyGoalCompleted} de ${progress.weeklyGoalTotal} aulas concluídas">
          ${progress.weeklyGoalCompleted}/${progress.weeklyGoalTotal}
        </div>
      </div>
      <p class="goal-ring-label">aulas concluídas hoje</p>
    </div>
  `;
}

function renderStreak(progress) {
  const el = document.getElementById('streak-card');
  if (!el) return;

  const DAY_LABELS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

  el.innerHTML = `
    <div class="streak-display" aria-label="${progress.streakDays} dias consecutivos de estudo">
      <span class="streak-number">${progress.streakDays}</span>
      <div class="streak-info">
        <span class="streak-unit">dias</span>
        <span class="streak-sublabel">consecutivos</span>
      </div>
    </div>
    <div class="streak-days" aria-label="Dias da semana com estudo" role="list">
      ${progress.streakRecord.map((done, i) => `
        <div class="streak-day${done ? ' done' : ''}"
             role="listitem"
             aria-label="${DAY_LABELS[i]} — ${done ? 'feito' : 'pendente'}"></div>
      `).join('')}
    </div>
  `;
}

function renderActivity(activity) {
  const el = document.getElementById('activity-list');
  if (!el) return;

  el.innerHTML = activity.map(item => `
    <div class="activity-item" role="listitem">
      <div class="activity-item__dot activity-item__dot--${item.type}" aria-hidden="true"></div>
      <div>
        <p class="activity-item__text">${item.text}</p>
        <p class="activity-item__time">${item.time}</p>
      </div>
    </div>
  `).join('');
}


/* ─── Animations ─── */
function animateProgressBars() {
  const bars = document.querySelectorAll('.progress-bar__fill[data-progress]');
  if (!bars.length) return;
  requestAnimationFrame(() => {
    setTimeout(() => {
      bars.forEach(bar => { bar.style.width = bar.dataset.progress; });
    }, 150);
  });
}

function animateGoalRing() {
  const fill = document.querySelector('.goal-ring__fill[data-progress]');
  if (!fill) return;
  const pct = parseFloat(fill.dataset.progress) / 100;
  setTimeout(() => {
    fill.style.strokeDashoffset = 188.5 * (1 - pct);
  }, 200);
}


/* ═══════════════════════════════════════════════════════
   Loading / Error / Orchestration
════════════════════════════════════════════════════════ */

function loadDashboardData() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(dashboardData), 700);
  });
}

function _announce(message) {
  const el = document.getElementById('dashboard-status');
  if (!el) return;
  el.textContent = '';
  requestAnimationFrame(() => { el.textContent = message; });
}

function initDashboard() {
  const main = document.getElementById('main');
  if (main) main.setAttribute('aria-busy', 'false');

  _initState(_loadStoredProgress(), _loadStoredAchievements());
  _renderAll();

  _announce('Dashboard carregado.');
  Toast.success('Dashboard carregado', 'Seus dados foram atualizados.');
}

function renderDashboardError(message) {
  const main    = document.getElementById('main');
  const layout  = document.querySelector('.dashboard-layout');
  const errorEl = document.getElementById('dashboard-error');

  const view = document.getElementById('app-view');

  if (main)   main.setAttribute('aria-busy', 'false');
  if (layout) layout.classList.add('is-hidden');
  if (view)   view.classList.add('is-hidden');
  if (!errorEl) return;

  errorEl.classList.remove('is-hidden');
  errorEl.innerHTML = `
    <div class="card card--panel" style="max-width:400px;margin:var(--space-8) auto;text-align:center">
      <div class="icon-chip icon-chip--lg icon-chip--danger"
           style="margin:0 auto var(--space-4)"
           aria-hidden="true">
        ${_SVG_WARN}
      </div>
      <h2 style="font-size:var(--text-lg);font-weight:var(--weight-semibold);
                 color:var(--color-text);margin-bottom:var(--space-2)">
        Erro ao carregar
      </h2>
      <p style="font-size:var(--text-sm);color:var(--color-text-secondary);
                margin-bottom:var(--space-6)">
        ${message}
      </p>
      <button class="button button--primary" onclick="Router.navigate('/dashboard')">
        Tentar novamente
      </button>
    </div>
  `;

  _announce('Erro ao carregar o dashboard.');
  Toast.error('Erro ao carregar', 'Não foi possível carregar os dados.');
}

async function startDashboard() {
  const layout  = document.querySelector('.dashboard-layout');
  const errorEl = document.getElementById('dashboard-error');
  const view    = document.getElementById('app-view');

  if (view)    view.classList.remove('is-hidden');
  if (layout)  layout.classList.remove('is-hidden');
  if (errorEl) { errorEl.classList.add('is-hidden'); errorEl.innerHTML = ''; }

  renderSkeletonDashboard();

  try {
    await loadDashboardData();
    initDashboard();
  } catch (err) {
    renderDashboardError(err.message || 'Não foi possível carregar o dashboard. Tente novamente.');
  }
}


/* ═══════════════════════════════════════════════════════
   Gamification — Logic & Actions
════════════════════════════════════════════════════════ */

function _checkLevelUp(progress) {
  if (progress.currentXP < progress.nextLevelXP) return false;
  progress.currentXP  -= progress.nextLevelXP;
  progress.level      += 1;
  progress.nextLevelXP = Math.round(progress.nextLevelXP * 1.35);
  return true;
}

function _checkAchievements(progress, achievements) {
  const newlyUnlocked = [];
  achievements.forEach(a => {
    if (a.unlocked) return;
    let unlock = false;
    if (a.id === 'first_step'    && progress.completedLessons >= 1)                             unlock = true;
    if (a.id === 'on_fire'       && progress.streakDays >= 7)                                    unlock = true;
    if (a.id === 'goal_crusher'  && progress.weeklyGoalCompleted >= progress.weeklyGoalTotal)    unlock = true;
    if (a.id === 'level_up_once' && progress.level >= 5)                                         unlock = true;
    if (unlock) { a.unlocked = true; newlyUnlocked.push(a); }
  });
  return newlyUnlocked;
}

function _notifyLessonComplete(xp, leveledUp, goalMet, newAchievements) {
  let delay = 0;
  const STEP = 700;

  setTimeout(() => Toast.success('Aula concluída!', `+${xp} XP ganhos.`), delay);
  delay += STEP;

  if (leveledUp) {
    const lvl = _state.progress.level;
    setTimeout(() => Toast.success('Subiu de nível!', `Nível ${lvl} — ${_getLevelTitle(lvl)} desbloqueado!`, 5000), delay);
    delay += STEP;
  }

  if (goalMet) {
    setTimeout(() => Toast.success('Meta semanal!', 'Você atingiu sua meta da semana. Continue assim!', 5000), delay);
    delay += STEP;
  }

  newAchievements.forEach(a => {
    setTimeout(() => Toast.info(`Conquista: ${a.title}`, a.desc), delay);
    delay += STEP;
  });
}

function _rerenderProgress() {
  renderHero(_state.progress);
  renderStats(_computeStats(_state.progress));
  renderGoal(_state.progress);
  renderModules(_computeModules(_state.progress));
  animateProgressBars();
  animateGoalRing();
}

function _renderAll() {
  renderHero(_state.progress);
  renderStats(_computeStats(_state.progress));
  renderJourney(dashboardData.journey);
  renderModules(_computeModules(_state.progress));
  renderGoal(_state.progress);
  renderStreak(_state.progress);
  renderActivity(dashboardData.activity);
  animateProgressBars();
  animateGoalRing();
}

function completeLesson() {
  const p = _state.progress;
  if (p.moduleComplete) return;

  p.completedLessons += 1;
  p.currentXP        += XP_PER_LESSON;
  p.totalXP          += XP_PER_LESSON;

  const nextIdx    = p.completedLessons;
  p.currentLesson  = nextIdx < _MODULE_LESSONS.length
    ? _MODULE_LESSONS[nextIdx]
    : _MODULE_LESSONS[_MODULE_LESSONS.length - 1];

  p.completionPercent = Math.min(Math.round((p.completedLessons / p.totalLessons) * 100), 100);
  if (p.completedLessons >= p.totalLessons) p.moduleComplete = true;

  if (p.weeklyGoalCompleted < p.weeklyGoalTotal) p.weeklyGoalCompleted += 1;
  const goalMet = p.weeklyGoalCompleted >= p.weeklyGoalTotal;

  const leveledUp      = _checkLevelUp(p);
  const newAchievements = _checkAchievements(p, _state.achievements);

  _saveState();
  _rerenderProgress();
  _notifyLessonComplete(XP_PER_LESSON, leveledUp, goalMet, newAchievements);
  _announce(`Aula concluída. +${XP_PER_LESSON} XP ganhos.`);
}

function resetProgress() {
  if (!confirm('Resetar todo o progresso do dashboard?\nEsta ação não pode ser desfeita.')) return;
  localStorage.removeItem(_STORE_PROGRESS);
  localStorage.removeItem(_STORE_ACHIEVEMENTS);
  _initState(null, null);
  _rerenderProgress();
  Toast.info('Progresso resetado', 'Dados de desenvolvimento reiniciados.');
}


/* ═══════════════════════════════════════════════════════
   Toast Module
   API: Toast.show() · Toast.success() · Toast.warning()
        Toast.error() · Toast.info() · Toast.dismiss() · Toast.clear()
════════════════════════════════════════════════════════ */
const Toast = (() => {
  let _region  = null;
  let _counter = 0;

  const DURATION_DEFAULT = 4000;
  const TRANSITION_MS    = 300;

  const _ICONS = {
    success: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    warning: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M7 1.5L13 12.5H1L7 1.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 6v2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="7" cy="10.5" r="0.65" fill="currentColor"/></svg>`,
    danger:  `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="5.5" stroke="currentColor" stroke-width="1.5"/><path d="M5 5l4 4M9 5L5 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    info:    `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="5.5" stroke="currentColor" stroke-width="1.5"/><path d="M7 6.5V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="7" cy="4.5" r="0.65" fill="currentColor"/></svg>`,
  };

  /* Maps toast type → icon-chip color variant */
  const _CHIP = { success: 'success', warning: 'warning', danger: 'danger', info: 'info' };

  function init() {
    _region = document.getElementById('toast-region');
    if (!_region) return;

    /* Delegated close — avoids inline onclick */
    _region.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-dismiss]');
      if (btn) dismiss(btn.dataset.dismiss);
    });
  }

  function show({ type = 'info', title, message = '', duration = DURATION_DEFAULT }) {
    if (!_region) return null;

    const id = `toast-${++_counter}`;
    const el = document.createElement('div');

    el.id        = id;
    el.className = `toast toast--${type}`;
    /* danger uses assertive role so screen readers interrupt immediately */
    el.setAttribute('role', type === 'danger' ? 'alert' : 'status');

    el.innerHTML = `
      <div class="toast__icon icon-chip icon-chip--sm icon-chip--${_CHIP[type]}"
           aria-hidden="true">
        ${_ICONS[type]}
      </div>
      <div class="toast__content">
        <p class="toast__title">${title}</p>
        ${message ? `<p class="toast__message">${message}</p>` : ''}
      </div>
      <button class="toast__close"
              aria-label="Fechar: ${title}"
              data-dismiss="${id}">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>
    `;

    _region.appendChild(el);

    /* Double rAF ensures the initial opacity:0 / transform is painted before transition fires */
    requestAnimationFrame(() => {
      requestAnimationFrame(() => el.classList.add('is-visible'));
    });

    if (duration > 0) {
      setTimeout(() => dismiss(id), duration);
    }

    return id;
  }

  function dismiss(id) {
    const el = document.getElementById(id);
    if (!el || el.classList.contains('is-exiting')) return;

    el.classList.remove('is-visible');
    el.classList.add('is-exiting');
    setTimeout(() => el.remove(), TRANSITION_MS);
  }

  function clear() {
    if (!_region) return;
    _region.querySelectorAll('.toast').forEach(el => {
      el.classList.remove('is-visible');
      el.classList.add('is-exiting');
    });
    setTimeout(() => { if (_region) _region.innerHTML = ''; }, TRANSITION_MS);
  }

  /* Convenience wrappers — duration is optional (uses DURATION_DEFAULT) */
  function success(title, message, duration) { return show({ type: 'success', title, message, duration }); }
  function warning(title, message, duration) { return show({ type: 'warning', title, message, duration }); }
  function error  (title, message, duration) { return show({ type: 'danger',  title, message, duration }); }
  function info   (title, message, duration) { return show({ type: 'info',    title, message, duration }); }

  return { init, show, dismiss, clear, success, warning, error, info };
})();


/* ─── Theme Module ─── */
const Theme = (() => {
  const STORAGE_KEY = 'sl_theme';
  const DARK  = 'dark';
  const LIGHT = 'light';

  let _btn = null;

  function init() {
    _btn = document.getElementById('theme-toggle');
    if (!_btn) return;

    _updateButton(_current());
    _btn.addEventListener('click', toggle);

    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
      if (localStorage.getItem(STORAGE_KEY)) return;
      _apply(e.matches ? LIGHT : DARK, false);
    });
  }

  function toggle() {
    _apply(_current() === DARK ? LIGHT : DARK, true);
  }

  function _apply(theme, save) {
    document.documentElement.setAttribute('data-theme', theme);
    _updateButton(theme);
    if (save) {
      localStorage.setItem(STORAGE_KEY, theme);
      const label = theme === DARK ? 'Modo escuro ativado.' : 'Modo claro ativado.';
      Toast.info('Tema atualizado', label);
    }
  }

  function _current() {
    return document.documentElement.getAttribute('data-theme') || DARK;
  }

  function _updateButton(theme) {
    if (!_btn) return;
    const isDark = theme === DARK;
    _btn.setAttribute('aria-pressed', String(isDark));
    _btn.setAttribute('aria-label', isDark ? 'Ativar modo claro' : 'Ativar modo escuro');
    const label = _btn.querySelector('.theme-toggle__label');
    if (label) label.textContent = isDark ? 'Dark' : 'Light';
  }

  return { init, toggle };
})();


/* ═══════════════════════════════════════════════════════
   Page Render Functions
════════════════════════════════════════════════════════ */

function renderDashboardPage() {
  const view    = document.getElementById('app-view');
  const errorEl = document.getElementById('dashboard-error');
  if (!view) return;

  view.classList.remove('is-hidden');
  if (errorEl) { errorEl.classList.add('is-hidden'); errorEl.innerHTML = ''; }

  view.innerHTML = `
    <div class="dashboard-layout">
      <div class="dashboard-main">
        <div id="active-courses-row"></div>
        <div class="hero-card" role="region" aria-label="Continuar aprendendo">
          <div id="hero-summary" class="hero-card__content"></div>
          <div class="hero-card__visual" aria-hidden="true">
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
              <rect x="6" y="8" width="32" height="36" rx="3" stroke="currentColor" stroke-width="2"/>
              <path d="M6 16H38" stroke="currentColor" stroke-width="2"/>
              <path d="M13 24H31M13 30H25" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <circle cx="40" cy="38" r="8" fill="var(--color-accent)" fill-opacity="0.15" stroke="var(--color-accent)" stroke-width="1.5"/>
              <path d="M37.5 38L39.5 40L43 36.5" stroke="var(--color-accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        <div id="stats-row" class="stats-row" role="list" aria-label="Estatísticas"></div>
        <section class="dashboard-section" aria-labelledby="journey-title">
          <div class="section-header">
            <h2 class="section-title" id="journey-title">Trilha de Aprendizado</h2>
            <a href="#/modules" class="section-link">Ver módulos</a>
          </div>
          <div class="journey-map">
            <div id="journey-map" class="journey-track" role="list" aria-label="Etapas da jornada de aprendizado"></div>
          </div>
        </section>
        <section class="dashboard-section" aria-labelledby="modules-title">
          <div class="section-header">
            <h2 class="section-title" id="modules-title">Módulos Recentes</h2>
            <a href="#/modules" class="section-link">Ver todos</a>
          </div>
          <div id="module-list" class="module-list"></div>
        </section>
      </div>
      <aside class="dashboard-panel" aria-label="Painel lateral">
        <div class="panel-card">
          <h3 class="panel-card__title">Meta do Dia</h3>
          <div id="goal-ring-card"></div>
        </div>
        <div class="panel-card">
          <h3 class="panel-card__title">Sequência</h3>
          <div id="streak-card"></div>
        </div>
        <div class="panel-card">
          <h3 class="panel-card__title">Atividade Recente</h3>
          <div id="activity-list" class="activity-list" role="list"></div>
        </div>
      </aside>
    </div>
  `;

  startDashboard();
  _renderActiveCourses();
}

function _renderActiveCourses() {
  const el = document.getElementById('active-courses-row');
  if (!el) return;

  const cards = [];

  // English for Developers
  const ES = window.EStorage;
  if (ES) {
    try {
      const s      = ES.getStats();
      const xi     = ES.xpToLevel(s.xp);
      const cl     = s.currentLevel || 1, cm = s.currentModule || 1, cle = s.currentLesson || 1;
      const ED     = window.ENGLISH_DATA;
      const nextL  = ED ? ED.getLesson(cl, cm, cle) : null;
      const href   = `pages/english-lesson.html?level=${cl}&module=${cm}&lesson=${cle}`;
      cards.push(`
        <a class="active-course-card" href="${href}" style="--accent:#00D4AA">
          <div class="active-course-card__icon" style="background:rgba(0,212,170,.12);color:#00D4AA;font-family:var(--font-mono);font-size:11px;font-weight:700">EN</div>
          <div class="active-course-card__body">
            <div class="active-course-card__title">English for Developers</div>
            <div class="active-course-card__next">${nextL ? _esc(nextL.title) : 'Level ' + cl + ' · Module ' + cm}</div>
            <div class="progress-bar active-course-card__bar">
              <div class="progress-bar__fill" style="width:${s.overallPercent}%;background:#00D4AA"></div>
            </div>
          </div>
          <div class="active-course-card__meta">
            <span style="font-size:12px;font-weight:700;color:#00D4AA;font-family:var(--font-mono)">${s.overallPercent}%</span>
            <span class="active-course-card__level" style="color:#00D4AA">${_esc(xi.label)}</span>
          </div>
        </a>
      `);
    } catch (_) { /* EStorage not ready */ }
  }

  // QA Foundation
  if (_state && _state.progress) {
    const p    = _state.progress;
    const href = '#/modules';
    cards.push(`
      <a class="active-course-card" href="${href}" style="--accent:#6C63FF">
        <div class="active-course-card__icon" style="background:rgba(108,99,255,.12);color:#6C63FF;font-family:var(--font-mono);font-size:11px;font-weight:700">QA</div>
        <div class="active-course-card__body">
          <div class="active-course-card__title">QA Foundation</div>
          <div class="active-course-card__next">${_esc(p.currentModule)} · ${_esc(p.currentLesson)}</div>
          <div class="progress-bar active-course-card__bar">
            <div class="progress-bar__fill" style="width:${p.completionPercent}%;background:#6C63FF"></div>
          </div>
        </div>
        <div class="active-course-card__meta">
          <span style="font-size:12px;font-weight:700;color:#6C63FF;font-family:var(--font-mono)">${p.completionPercent}%</span>
          <span class="active-course-card__level" style="color:#6C63FF">M${_computeModules(p).filter(m=>m.status==='done').length + (p.moduleComplete?1:0)}/7</span>
        </div>
      </a>
    `);
  }

  if (!cards.length) return;

  if (!document.getElementById('sl-active-course-styles')) {
    const s = document.createElement('style');
    s.id = 'sl-active-course-styles';
    s.textContent = `
      .active-courses-row{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:var(--space-4);margin-bottom:var(--space-5)}
      .active-course-card{display:flex;align-items:center;gap:var(--space-4);background:var(--color-surface);border:1px solid var(--color-border);border-left:3px solid var(--accent,var(--color-primary));border-radius:var(--radius-lg);padding:var(--space-4) var(--space-5);text-decoration:none;transition:background .2s,border-color .2s;cursor:pointer}
      .active-course-card:hover{background:var(--color-surface-alt);border-color:var(--accent,var(--color-primary))}
      .active-course-card__icon{width:40px;height:40px;border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;flex-shrink:0}
      .active-course-card__body{flex:1;min-width:0}
      .active-course-card__title{font-size:13px;font-weight:600;color:var(--color-text);margin-bottom:2px}
      .active-course-card__next{font-size:11px;color:var(--color-text-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:6px}
      .active-course-card__bar{height:3px;margin-top:0}
      .active-course-card__meta{display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0}
      .active-course-card__level{font-size:10px;font-family:var(--font-mono)}
    `;
    document.head.appendChild(s);
  }

  el.innerHTML = `
    <div style="margin-bottom:var(--space-2)">
      <h3 style="font-size:var(--text-xs);font-family:var(--font-mono);text-transform:uppercase;letter-spacing:var(--letter-tag);color:var(--color-text-muted)">Continue estudando</h3>
    </div>
    <div class="active-courses-row">${cards.join('')}</div>
  `;
}


function renderJourneyPage() {
  Router.navigate('/dashboard');
}


// Map slug → window data object
const _COURSE_DATA_MAP = {
  'english':              function () { return window.SL_ENGLISH; },
  'qa-foundation':        function () { return window.SL_QA_FOUNDATION; },
  'javascript':           function () { return window.SL_JS_FOUNDATION; },
  'playwright-qa':        function () { return window.SL_PLAYWRIGHT; },
  'frontend':             function () { return window.SL_FRONTEND; },
  'jira-jql':             function () { return window.SL_JIRA; },
  'git-github':           function () { return window.SL_GIT; },
  'web-fundamentals':     function () { return window.SL_WEB; },
};

function renderModulesPage(params) {
  if (!_state) return;
  const view = document.getElementById('app-view');
  if (!view) return;

  const slug = (params && params.course) ||
    localStorage.getItem('sl_modules_course') || 'qa-foundation';

  if (slug === 'english' && window.EStorage && window.ENGLISH_DATA) {
    _renderEnglishModules(view);
    return;
  }

  if (slug === 'qa-foundation') {
    _renderQAModules(view);
    return;
  }

  // Generic renderer for other courses using SL_* data files
  const getter = _COURSE_DATA_MAP[slug];
  const courseData = getter ? getter() : null;
  if (courseData) {
    _renderGenericModulesPage(view, courseData, slug);
    return;
  }

  _renderQAModules(view);
}

function _renderQAModules(view) {
  const p = _state.progress;
  const allModules = [
    { title: 'Fundamentos de QA',            meta: '8 aulas · 3h 20min',  label: 'M1', status: 'done',    progress: 100,               variant: 'accent',  badge: 'Concluído',    badgeV: 'accent',  firstLesson: 'qa.1.1' },
    { title: 'Testes Manuais & Bug Reports',  meta: '8 aulas · 3h 30min',  label: 'M2', status: 'done',    progress: 100,               variant: 'accent',  badge: 'Concluído',    badgeV: 'accent',  firstLesson: 'qa.2.1' },
    { title: 'Automação com Playwright',      meta: '9 aulas · 4h 00min',  label: 'M3', status: 'current', progress: p.completionPercent, variant: 'current', badge: p.moduleComplete ? 'Concluído' : 'Em andamento', badgeV: p.moduleComplete ? 'accent' : 'primary', firstLesson: 'qa.3.1' },
    { title: 'Testes de API',                 meta: '7 aulas · 3h 00min',  label: 'M4', status: 'locked',  progress: 0,                 variant: 'info',    badge: 'Bloqueado',    badgeV: 'info'    },
    { title: 'CI/CD para QA',                 meta: '6 aulas · 2h 30min',  label: 'M5', status: 'locked',  progress: 0,                 variant: 'info',    badge: 'Bloqueado',    badgeV: 'info'    },
    { title: 'Estratégia & Métricas',         meta: '5 aulas · 2h 00min',  label: 'M6', status: 'locked',  progress: 0,                 variant: 'info',    badge: 'Bloqueado',    badgeV: 'info'    },
    { title: 'QA no Mercado',                 meta: '5 aulas · 2h 00min',  label: 'M7', status: 'locked',  progress: 0,                 variant: 'info',    badge: 'Bloqueado',    badgeV: 'info'    },
  ];

  const done = allModules.filter(m => m.status === 'done').length;

  view.innerHTML = `
    <div class="page-layout">
      <div class="page-header">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:var(--space-3)">
          <div>
            <h2 class="page-header__title">Módulos · QA Foundation</h2>
            <p class="page-header__subtitle">${done} de ${allModules.length} módulos concluídos</p>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:var(--space-2)">
            <button class="button button--ghost button--sm" style="opacity:.7;cursor:default" disabled>QA Foundation</button>
            <a class="button button--secondary button--sm" href="#/modules?course=english">English</a>
            <a class="button button--secondary button--sm" href="#/modules?course=javascript">JavaScript</a>
            <a class="button button--secondary button--sm" href="#/modules?course=playwright-qa">Playwright</a>
          </div>
        </div>
      </div>
      <div class="module-list" role="list">
        ${allModules.map(mod => `
          <div class="module-card${mod.status === 'locked' ? ' is-disabled' : ''}"
               tabindex="${mod.status !== 'locked' ? '0' : '-1'}"
               role="listitem"
               aria-label="${mod.title} — ${mod.badge}"
               ${mod.status === 'locked' ? 'aria-disabled="true"' : ''}>
            <div class="module-card__icon icon-chip icon-chip--lg icon-chip--${mod.variant}" aria-hidden="true">
              ${mod.status === 'locked' ? _SVG_LOCK : mod.label}
            </div>
            <div class="module-card__body">
              <div class="module-card__name">${mod.title}</div>
              <div class="module-card__meta">${mod.meta}</div>
              <div class="progress-bar" role="progressbar"
                   aria-valuenow="${mod.progress}" aria-valuemin="0" aria-valuemax="100"
                   aria-label="${mod.title}: ${mod.progress}% concluído">
                <div class="progress-bar__fill" data-progress="${mod.progress}%"></div>
              </div>
            </div>
            <div class="module-card__tail">
              <span class="module-card__pct ${mod.status === 'done' ? 'text-accent' : ''}">${mod.progress}%</span>
              <span class="badge badge--${mod.badgeV} mt-sm">${mod.badge}</span>
              ${mod.firstLesson ? `<a class="button button--secondary button--sm mt-sm" href="#/lesson/qa-foundation/${mod.firstLesson}">Ver aulas →</a>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  requestAnimationFrame(() => {
    setTimeout(() => {
      document.querySelectorAll('#app-view .progress-bar__fill[data-progress]').forEach(bar => {
        bar.style.width = bar.dataset.progress;
      });
    }, 150);
  });
}

function _renderEnglishModules(view) {
  const ES = window.EStorage;
  const ED = window.ENGLISH_DATA;
  const stats = ES.getStats();
  const completedLessons = stats.completedLessons || [];

  const level1 = ED.levels[0];
  const modules = level1 ? level1.modules : [];

  view.innerHTML = `
    <div class="page-layout">
      <div class="page-header">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:var(--space-3)">
          <div>
            <h2 class="page-header__title">Módulos · English for Developers</h2>
            <p class="page-header__subtitle">Level 1 — Foundations (A1/A2)</p>
          </div>
          <div style="display:flex;gap:var(--space-2)">
            <a class="button button--secondary button--sm" href="#/modules">QA Foundation</a>
            <button class="button button--ghost button--sm" style="opacity:.7;cursor:default" disabled>English</button>
          </div>
        </div>
      </div>
      <div class="module-list" role="list">
        ${modules.map((mod, mi) => {
          const total = mod.lessons ? mod.lessons.length : 5;
          const done  = mod.lessons
            ? mod.lessons.filter((_, li) => completedLessons.indexOf('L1.M' + (mi+1) + '.L' + (li+1)) !== -1).length
            : 0;
          const pct   = total ? Math.round((done / total) * 100) : 0;
          const isComplete = done === total;
          const isCurrent  = !isComplete && done > 0;
          const variant = isComplete ? 'accent' : isCurrent ? 'current' : 'info';
          const badge   = isComplete ? 'Concluído' : isCurrent ? 'Em andamento' : 'Não iniciado';
          const badgeV  = isComplete ? 'accent' : isCurrent ? 'primary' : 'info';
          const href    = 'pages/english-lesson.html?level=1&module=' + (mi+1) + '&lesson=1';
          return `
            <div class="module-card" tabindex="0" role="listitem" aria-label="${_esc(mod.title)} — ${badge}">
              <div class="module-card__icon icon-chip icon-chip--lg icon-chip--${variant}" aria-hidden="true">
                ${isComplete ? _SVG_CHECK : 'L' + (mi+1)}
              </div>
              <div class="module-card__body">
                <div class="module-card__name">${_esc(mod.title)}</div>
                <div class="module-card__meta">${done}/${total} aulas · Level 1 A${mi < 4 ? '1' : '2'}</div>
                <div class="progress-bar" role="progressbar"
                     aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
                  <div class="progress-bar__fill" style="width:${pct}%;background:var(--color-accent)"></div>
                </div>
              </div>
              <div class="module-card__tail">
                <span class="module-card__pct ${isComplete ? 'text-accent' : ''}">${pct}%</span>
                <span class="badge badge--${badgeV} mt-sm">${badge}</span>
                <a class="button button--secondary button--sm mt-sm" href="${href}">Acessar</a>
              </div>
            </div>`;
        }).join('')}
      </div>
    </div>
  `;
}


function _renderGenericModulesPage(view, courseData, activeSlug) {
  const allSlugs = [
    { slug: 'qa-foundation', label: 'QA Foundation' },
    { slug: 'english',       label: 'English' },
    { slug: 'javascript',    label: 'JavaScript' },
    { slug: 'playwright-qa', label: 'Playwright' },
    { slug: 'frontend',      label: 'Front-End' },
    { slug: 'jira-jql',      label: 'Jira' },
    { slug: 'git-github',    label: 'Git' },
    { slug: 'web-fundamentals', label: 'Web' },
  ];

  const switcher = allSlugs.map(s => {
    const isActive = s.slug === activeSlug;
    return isActive
      ? `<button class="button button--ghost button--sm" style="opacity:.7;cursor:default" disabled>${s.label}</button>`
      : `<a class="button button--secondary button--sm" href="#/modules?course=${s.slug}">${s.label}</a>`;
  }).join('');

  const mods = courseData.modules || [];
  const totalLessons = mods.reduce((acc, m) => acc + (m.lessons ? m.lessons.length : 0), 0);
  const doneMods = mods.filter(m => m.status === 'done').length;
  const isSoon = courseData.status === 'coming-soon';

  const modRows = mods.map(function (mod) {
    const lessons = mod.lessons || [];
    const lessonCount = lessons.length;
    const doneLessons = lessons.filter(l => l.status === 'done').length;
    const pct = lessonCount ? Math.round((doneLessons / lessonCount) * 100) : 0;
    const isModSoon = mod.status === 'coming-soon' || isSoon;
    const variant = isModSoon ? 'info' : (doneLessons === lessonCount ? 'accent' : 'current');
    const badge = isModSoon ? 'Em breve' : (doneLessons === lessonCount ? 'Concluído' : 'Disponível');
    const badgeV = isModSoon ? 'info' : (doneLessons === lessonCount ? 'accent' : 'primary');
    const firstLesson = !isModSoon && lessons[0] ? lessons[0].id : null;

    return `
      <div class="module-card${isModSoon ? ' is-disabled' : ''}"
           tabindex="${isModSoon ? '-1' : '0'}"
           role="listitem"
           aria-label="${_esc(mod.title)} — ${badge}"
           ${isModSoon ? 'aria-disabled="true"' : ''}>
        <div class="module-card__icon icon-chip icon-chip--lg icon-chip--${variant}" aria-hidden="true">
          ${isModSoon ? _SVG_LOCK : _esc(mod.id)}
        </div>
        <div class="module-card__body">
          <div class="module-card__name">${_esc(mod.title)}</div>
          <div class="module-card__meta">${lessonCount} aulas${mod.description ? ' · ' + _esc(mod.description.slice(0, 50)) : ''}</div>
          <div class="progress-bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
            <div class="progress-bar__fill" style="width:${pct}%${!isModSoon ? ';background:var(--color-primary)' : ''}"></div>
          </div>
        </div>
        <div class="module-card__tail">
          <span class="module-card__pct">${pct}%</span>
          <span class="badge badge--${badgeV} mt-sm">${badge}</span>
          ${firstLesson ? `<a class="button button--secondary button--sm mt-sm" href="#/lesson/${activeSlug}/${firstLesson}">Ver aulas →</a>` : ''}
        </div>
      </div>`;
  }).join('');

  view.innerHTML = `
    <div class="page-layout">
      <div class="page-header">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:var(--space-3)">
          <div>
            <h2 class="page-header__title">Módulos · ${_esc(courseData.title)}</h2>
            <p class="page-header__subtitle">${doneMods} de ${mods.length} módulos · ${totalLessons} aulas no total</p>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:var(--space-2)">${switcher}</div>
        </div>
      </div>
      ${isSoon ? `<div class="card" style="padding:var(--space-6);text-align:center;margin-bottom:var(--space-5);border-style:dashed">
        <div style="font-size:var(--text-lg);font-weight:600;color:var(--color-text-secondary);margin-bottom:var(--space-2)">Em estruturação</div>
        <p style="font-size:var(--text-sm);color:var(--color-text-muted)">${_esc(courseData.description)}</p>
        <a href="#/course/${_esc(courseData.slug)}" class="button button--secondary button--sm" style="margin-top:var(--space-4)">Ver detalhes do curso →</a>
      </div>` : ''}
      <div class="module-list" role="list">${modRows}</div>
    </div>
  `;
}


function renderAchievementsPage() {
  if (!_state) return;
  const view = document.getElementById('app-view');
  if (!view) return;

  const { achievements, progress } = _state;
  const unlocked = achievements.filter(a => a.unlocked).length;
  const pct      = Math.round((unlocked / achievements.length) * 100);

  const _ACH_ICONS = {
    first_step:    `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 1L11.09 6.26L17 7.27L13 11.14L14.18 17L9 14.27L3.82 17L5 11.14L1 7.27L6.91 6.26L9 1Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    on_fire:       `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2C9 2 5 6 5 10a4 4 0 008 0c0-4-4-8-4-8z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    goal_crusher:  `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 12.5C11.485 12.5 13.5 10.485 13.5 8C13.5 5.515 11.485 3.5 9 3.5C6.515 3.5 4.5 5.515 4.5 8C4.5 10.485 6.515 12.5 9 12.5Z" stroke="currentColor" stroke-width="1.5"/><path d="M5.8 11.5L4.5 15.5L9 13.5L13.5 15.5L12.2 11.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    level_up_once: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 3v12M9 3L4 8M9 3L14 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  };

  view.innerHTML = `
    <div class="page-layout">
      <div class="page-header">
        <h2 class="page-header__title">Conquistas</h2>
        <p class="page-header__subtitle">${unlocked} de ${achievements.length} desbloqueadas · ${progress.totalXP.toLocaleString('pt-BR')} XP total</p>
      </div>
      <div class="mb-lg">
        <div class="flex items-center justify-between mb-sm">
          <span style="font-size:var(--text-xs);color:var(--color-text-secondary)">Progresso geral</span>
          <span style="font-size:var(--text-xs);font-weight:var(--weight-semibold);color:var(--color-primary)">${pct}%</span>
        </div>
        <div class="progress-bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="Conquistas: ${pct}%">
          <div class="progress-bar__fill" data-progress="${pct}%"></div>
        </div>
      </div>
      <div class="achievement-grid">
        ${achievements.map(a => `
          <div class="achievement-card ${a.unlocked ? 'is-unlocked' : 'is-locked'}"
               aria-label="${a.title} — ${a.unlocked ? 'Desbloqueada' : 'Bloqueada'}">
            <div class="icon-chip icon-chip--md icon-chip--${a.unlocked ? 'primary' : 'info'}" aria-hidden="true">
              ${_ACH_ICONS[a.id] || _SVG_CHECK}
            </div>
            <div>
              <div class="achievement-card__title">${a.title}</div>
              <div class="achievement-card__desc">${a.desc}</div>
            </div>
            <span class="badge badge--${a.unlocked ? 'accent' : 'info'}">
              ${a.unlocked ? 'Desbloqueada' : 'Bloqueada'}
            </span>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  requestAnimationFrame(() => {
    setTimeout(() => {
      document.querySelectorAll('#app-view .progress-bar__fill[data-progress]').forEach(bar => {
        bar.style.width = bar.dataset.progress;
      });
    }, 150);
  });
}


function _loadNote(module) {
  try { return localStorage.getItem(`${_STORE_NOTES}_${module}`) || ''; } catch { return ''; }
}

function _saveNote(module, text) {
  try { localStorage.setItem(`${_STORE_NOTES}_${module}`, text); } catch { /* unavailable */ }
}

function renderNotesPage() {
  if (!_state) return;
  const view = document.getElementById('app-view');
  if (!view) return;

  const modules    = ['Testes Funcionais', 'Fundamentos de QA', 'Testes Manuais', 'Geral'];
  const selModule  = localStorage.getItem('sl_notes_selected') || modules[0];
  const savedText  = _loadNote(selModule);

  view.innerHTML = `
    <div class="page-layout">
      <div class="page-header">
        <h2 class="page-header__title">Anotações</h2>
        <p class="page-header__subtitle">Suas notas de estudo — salvas automaticamente</p>
      </div>
      <div class="notes-editor">
        <div class="flex items-center justify-between gap-md">
          <select id="notes-module-select" class="button button--secondary" style="cursor:pointer">
            ${modules.map(m => `<option value="${m}"${m === selModule ? ' selected' : ''}>${m}</option>`).join('')}
          </select>
          <button id="notes-save-btn" class="button button--primary button--sm">Salvar</button>
        </div>
        <textarea
          id="notes-textarea"
          class="notes-textarea"
          placeholder="Escreva suas anotações aqui..."
          aria-label="Área de anotações"
          spellcheck="false"
        >${savedText}</textarea>
        <div class="notes-footer">
          <span id="notes-char-count" class="notes-char-count">${savedText.length} caracteres</span>
          <span class="notes-char-count">Autosave a cada 2s</span>
        </div>
      </div>
    </div>
  `;

  _initNotesPage();
}

function _initNotesPage() {
  const select    = document.getElementById('notes-module-select');
  const textarea  = document.getElementById('notes-textarea');
  const charCount = document.getElementById('notes-char-count');
  const saveBtn   = document.getElementById('notes-save-btn');
  let   _autosave = null;
  if (!textarea) return;

  function updateCount() {
    if (charCount) charCount.textContent = `${textarea.value.length} caracteres`;
  }

  function save(silent) {
    const mod = select ? select.value : 'Geral';
    _saveNote(mod, textarea.value);
    if (!silent) Toast.success('Anotações salvas', `Módulo: ${mod}`);
  }

  textarea.addEventListener('input', () => {
    updateCount();
    clearTimeout(_autosave);
    _autosave = setTimeout(() => save(true), 2000);
  });

  if (select) {
    select.addEventListener('change', () => {
      clearTimeout(_autosave);
      save(true);
      textarea.value = _loadNote(select.value);
      updateCount();
      localStorage.setItem('sl_notes_selected', select.value);
    });
  }

  if (saveBtn) saveBtn.addEventListener('click', () => save(false));
}


function renderSettingsPage() {
  if (!_state) return;
  const view = document.getElementById('app-view');
  if (!view) return;

  const { progress } = _state;
  const theme        = document.documentElement.getAttribute('data-theme') || 'dark';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  view.innerHTML = `
    <div class="page-layout">
      <div class="page-header">
        <h2 class="page-header__title">Configurações</h2>
        <p class="page-header__subtitle">Preferências e informações do sistema</p>
      </div>
      <div class="settings-stack">

        <div class="settings-section">
          <h3 class="settings-section__title">Perfil</h3>
          <div class="settings-row">
            <span class="settings-row__label">Nome</span>
            <span class="settings-row__value">${dashboardData.user.name}</span>
          </div>
          <div class="settings-row">
            <span class="settings-row__label">Cargo</span>
            <span class="settings-row__value">${dashboardData.user.role}</span>
          </div>
          <div class="settings-row">
            <span class="settings-row__label">Nível</span>
            <span class="settings-row__value">Nível ${progress.level} — ${_getLevelTitle(progress.level)}</span>
          </div>
          <div class="settings-row">
            <span class="settings-row__label">XP Total</span>
            <span class="settings-row__value">${progress.totalXP.toLocaleString('pt-BR')} XP</span>
          </div>
        </div>

        <div class="settings-section">
          <h3 class="settings-section__title">Aparência</h3>
          <div class="settings-row">
            <span class="settings-row__label">Tema atual</span>
            <span class="settings-row__value">${theme === 'dark' ? 'Modo escuro' : 'Modo claro'}</span>
          </div>
          <div class="settings-row">
            <span class="settings-row__label">Alternar tema</span>
            <button class="button button--secondary button--sm" onclick="Theme.toggle()">
              ${theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
            </button>
          </div>
          <div class="settings-row">
            <span class="settings-row__label">Movimento reduzido</span>
            <span class="settings-row__value">${reducedMotion ? 'Ativo (sistema)' : 'Inativo'}</span>
          </div>
        </div>

        <div class="settings-section">
          <h3 class="settings-section__title">Progresso</h3>
          <div class="settings-row">
            <span class="settings-row__label">Módulo atual</span>
            <span class="settings-row__value">${progress.currentModule}</span>
          </div>
          <div class="settings-row">
            <span class="settings-row__label">Aulas concluídas</span>
            <span class="settings-row__value">${progress.completedLessons} de ${progress.totalLessons}</span>
          </div>
          <div class="settings-row">
            <span class="settings-row__label">Sequência</span>
            <span class="settings-row__value">${progress.streakDays} dias consecutivos</span>
          </div>
          <div class="settings-row" style="padding-top:var(--space-3);margin-top:var(--space-2);border-top:1px solid var(--color-border-subtle)">
            <span class="settings-row__label" style="color:var(--color-danger)">Resetar progresso</span>
            <button class="button button--danger button--sm" onclick="resetProgress()">Resetar</button>
          </div>
        </div>

        <div class="settings-section">
          <h3 class="settings-section__title">Sistema</h3>
          <div class="settings-row">
            <span class="settings-row__label">Versão</span>
            <span class="settings-row__value">Dashboard v1.6 — SPA Router</span>
          </div>
          <div class="settings-row">
            <span class="settings-row__label">Rota atual</span>
            <span class="settings-row__value">${Router.getCurrentRoute()}</span>
          </div>
          <div class="settings-row">
            <span class="settings-row__label">Armazenamento</span>
            <span class="settings-row__value">localStorage (local)</span>
          </div>
          <div class="settings-row">
            <span class="settings-row__label">Renderização</span>
            <span class="settings-row__value">SPA · Hash Routing</span>
          </div>
        </div>

      </div>
    </div>
  `;
}


/* ═══════════════════════════════════════════════════════
   English Course — SPA Integration
   Renders the English for Developers course dashboard
   inside the main SPA shell. Standalone pages remain for tests.
════════════════════════════════════════════════════════ */

function _ensureEngStyles() {
  if (document.getElementById('sl-eng-styles')) return;
  const s = document.createElement('style');
  s.id = 'sl-eng-styles';
  s.textContent = `
    .eng-hero{background:linear-gradient(135deg,rgba(0,212,170,.06) 0%,rgba(108,99,255,.06) 100%);border:1px solid rgba(0,212,170,.14);border-radius:var(--radius-xl);padding:28px 32px;margin-bottom:24px;display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap}
    .eng-hero-left h2{font-size:22px;font-weight:700;background:linear-gradient(120deg,var(--color-text) 40%,var(--color-accent) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:4px}
    .eng-tagline{font-size:12px;color:var(--color-text-secondary);font-family:var(--font-mono);letter-spacing:.04em}
    .eng-stats{display:flex;gap:12px;flex-wrap:wrap}
    .eng-stat{text-align:center;padding:12px 18px;background:rgba(255,255,255,.03);border:1px solid var(--color-border);border-radius:var(--radius-lg);min-width:70px}
    .eng-stat-val{display:block;font-family:var(--font-mono);font-size:20px;font-weight:700;color:var(--color-accent);line-height:1}
    .eng-stat-lbl{display:block;font-size:10px;color:var(--color-text-secondary);margin-top:4px;letter-spacing:.04em}
    .eng-xp-wrap{margin-bottom:24px}
    .eng-xp-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px}
    .eng-xp-from{font-size:11px;font-family:var(--font-mono);color:var(--color-text-secondary);text-transform:uppercase;letter-spacing:.07em}
    .eng-xp-val{font-size:12px;font-family:var(--font-mono);color:var(--color-accent)}
    .eng-continue{background:var(--color-surface-alt);border:1px solid var(--color-border);border-left:3px solid var(--color-accent);border-radius:var(--radius-lg);padding:16px 20px;display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:24px;cursor:pointer;transition:border-color .2s,background .2s;text-decoration:none}
    .eng-continue:hover{border-color:var(--color-accent);background:rgba(0,212,170,.03)}
    .eng-continue-left{flex:1}
    .eng-continue-tag{font-size:10px;font-family:var(--font-mono);color:var(--color-accent);text-transform:uppercase;letter-spacing:.1em;display:block;margin-bottom:4px}
    .eng-continue-title{font-size:15px;font-weight:600;color:var(--color-text);display:block;margin-bottom:2px}
    .eng-continue-sub{font-size:12px;color:var(--color-text-secondary);display:block}
    .eng-btn{display:inline-flex;align-items:center;gap:6px;padding:10px 20px;background:var(--color-accent);color:#0B0E1A;font-size:13px;font-weight:700;border-radius:var(--radius-md);border:none;cursor:pointer;white-space:nowrap;transition:opacity .2s;text-decoration:none}
    .eng-btn:hover{opacity:.85}
    .eng-quick{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:24px}
    .eng-quick-btn{display:flex;align-items:center;gap:8px;background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-md);padding:10px 16px;font-size:12px;font-weight:500;color:var(--color-text-secondary);text-decoration:none;cursor:pointer;transition:all .2s}
    .eng-quick-btn:hover{border-color:var(--color-accent);color:var(--color-accent)}
    .eng-grid{display:grid;grid-template-columns:1fr 240px;gap:24px;align-items:start}
    @media(max-width:820px){.eng-grid{grid-template-columns:1fr}}
    .eng-sec-lbl{font-size:11px;font-family:var(--font-mono);color:var(--color-text-secondary);text-transform:uppercase;letter-spacing:.1em;margin-bottom:14px}
    .eng-level-card{background:var(--color-surface-alt);border:1px solid var(--color-border);border-radius:var(--radius-lg);overflow:hidden;transition:border-color .2s;margin-bottom:8px}
    .eng-level-card.locked{opacity:.5}
    .eng-level-hdr{display:flex;align-items:center;gap:14px;padding:14px 20px;cursor:pointer;user-select:none}
    .eng-level-hdr:hover .eng-level-title{color:var(--color-accent)}
    .eng-level-badge{font-family:var(--font-mono);font-size:11px;font-weight:700;padding:3px 9px;border-radius:5px;white-space:nowrap}
    .eng-badge-A1{background:rgba(0,212,170,.1);color:var(--color-accent);border:1px solid rgba(0,212,170,.25)}
    .eng-badge-B1{background:rgba(108,99,255,.1);color:var(--color-primary);border:1px solid rgba(108,99,255,.25)}
    .eng-badge-B2{background:rgba(255,77,109,.1);color:#FF4D6D;border:1px solid rgba(255,77,109,.25)}
    .eng-badge-C1{background:rgba(255,215,0,.1);color:#FFD700;border:1px solid rgba(255,215,0,.25)}
    .eng-level-info{flex:1}
    .eng-level-title{font-size:13px;font-weight:600;color:var(--color-text);transition:color .2s;display:block;margin-bottom:1px}
    .eng-level-desc{font-size:11px;color:var(--color-text-secondary)}
    .eng-level-pbar{width:70px;height:3px;background:rgba(255,255,255,.06);border-radius:99px;overflow:hidden}
    .eng-level-pfill{height:100%;border-radius:99px;transition:width .4s}
    .eng-level-pct{font-family:var(--font-mono);font-size:10px;color:var(--color-text-secondary);min-width:28px;text-align:right}
    .eng-level-toggle{font-size:15px;color:var(--color-text-secondary);transition:transform .25s}
    .eng-level-card.open .eng-level-toggle{transform:rotate(90deg)}
    .eng-mods{display:none;padding:0 16px 14px;gap:6px;flex-direction:column}
    .eng-level-card.open .eng-mods{display:flex}
    .eng-mod-row{display:flex;align-items:center;gap:10px;padding:10px 12px;background:rgba(255,255,255,.02);border:1px solid var(--color-border);border-radius:var(--radius-md);cursor:pointer;transition:border-color .2s,background .2s;text-decoration:none}
    .eng-mod-row.locked{cursor:not-allowed;opacity:.45}
    .eng-mod-row:not(.locked):hover{border-color:rgba(0,212,170,.25);background:rgba(0,212,170,.03)}
    .eng-mod-row.done{border-color:rgba(0,212,170,.18)}
    .eng-mod-num{font-family:var(--font-mono);font-size:10px;color:var(--color-text-secondary);min-width:26px}
    .eng-mod-info{flex:1;min-width:0}
    .eng-mod-title{font-size:12px;font-weight:500;color:var(--color-text);display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .eng-mod-meta{font-size:10px;color:var(--color-text-secondary)}
    .eng-mod-pbar{width:44px;height:2px;background:rgba(255,255,255,.06);border-radius:99px;overflow:hidden;flex-shrink:0}
    .eng-mod-pfill{height:100%;background:linear-gradient(90deg,var(--color-primary),var(--color-accent));border-radius:99px}
    .eng-mod-status{font-size:10px;font-family:var(--font-mono);white-space:nowrap;padding:2px 7px;border-radius:99px;flex-shrink:0}
    .eng-mod-status.done{color:var(--color-accent);background:rgba(0,212,170,.08);border:1px solid rgba(0,212,170,.2)}
    .eng-mod-status.active{color:#fff;background:rgba(108,99,255,.2);border:1px solid rgba(108,99,255,.4)}
    .eng-mod-status.avail{color:var(--color-text-secondary);background:transparent;border:1px solid var(--color-border)}
    .eng-mod-status.locked{color:var(--color-text-secondary);background:transparent;border:1px solid var(--color-border);opacity:.5}
    .eng-sidebar{display:flex;flex-direction:column;gap:16px}
    .eng-panel{background:var(--color-surface-alt);border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:16px}
    .eng-panel-title{font-size:10px;font-family:var(--font-mono);color:var(--color-text-secondary);text-transform:uppercase;letter-spacing:.09em;margin-bottom:14px}
    .eng-act-list{display:flex;flex-direction:column;gap:10px}
    .eng-act-item{display:flex;align-items:flex-start;gap:10px}
    .eng-act-dot{width:6px;height:6px;border-radius:50%;background:var(--color-accent);margin-top:5px;flex-shrink:0}
    .eng-act-body{flex:1;min-width:0}
    .eng-act-title{font-size:12px;color:var(--color-text);display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .eng-act-meta{font-size:10px;color:var(--color-text-secondary);display:flex;gap:8px;margin-top:1px}
    .eng-act-xp{color:#FFD700;font-family:var(--font-mono)}
    .eng-empty{font-size:12px;color:var(--color-text-secondary);font-style:italic}
    .eng-ach-list{display:flex;flex-direction:column;gap:8px}
    .eng-ach-item{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:var(--radius-md);border:1px solid}
    .eng-ach-item.locked{opacity:.35;filter:grayscale(1);border-color:var(--color-border)}
    .eng-ach-icon{width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:7px;border:1px solid;font-size:15px;flex-shrink:0}
    .eng-ach-info{flex:1;min-width:0}
    .eng-ach-name{font-size:11px;font-weight:600;color:var(--color-text);display:block}
    .eng-ach-rarity{font-size:9px;font-family:var(--font-mono);text-transform:uppercase;letter-spacing:.07em}
  `;
  document.head.appendChild(s);
}

function renderEnglishCoursePage() {
  _ensureEngStyles();
  const view = document.getElementById('app-view');
  if (!view) return;

  const ES = window.EStorage;
  const ED = window.ENGLISH_DATA;

  if (!ES || !ED) {
    view.innerHTML = `<div class="card" style="padding:var(--space-8);text-align:center"><p style="color:var(--color-text-muted)">Dados do curso não disponíveis.</p></div>`;
    return;
  }

  const stats      = ES.getStats();
  const xpInfo     = ES.xpToLevel(stats.xp);
  const lvData     = ED.levels;
  const cl = stats.currentLevel || 1;
  const cm = stats.currentModule || 1;
  const cle = stats.currentLesson || 1;
  const nextLesson = ED.getLesson(cl, cm, cle);
  const lv         = lvData[cl];

  const XP_TIERS = [
    { from: 'A1', to: 'A2', min: 0,    max: 250  },
    { from: 'A2', to: 'B1', min: 250,  max: 800  },
    { from: 'B1', to: 'B2', min: 800,  max: 2000 },
    { from: 'B2', to: 'C1', min: 2000, max: 3500 },
  ];
  const tier     = XP_TIERS[Math.min((xpInfo.tier || 1) - 1, XP_TIERS.length - 1)];
  const xpInTier = Math.max(0, stats.xp - tier.min);
  const xpPct    = Math.min(100, Math.round((xpInTier / (tier.max - tier.min)) * 100));
  const ctaHref  = `pages/english-lesson.html?level=${cl}&module=${cm}&lesson=${cle}`;

  view.innerHTML = `
    <div class="eng-hero">
      <div class="eng-hero-left">
        <h2>English for Developers</h2>
        <p class="eng-tagline">Learn the language of modern technology.</p>
      </div>
      <div class="eng-stats">
        <div class="eng-stat"><span class="eng-stat-val">${stats.xp}</span><span class="eng-stat-lbl">Total XP</span></div>
        <div class="eng-stat"><span class="eng-stat-val">${stats.streak}</span><span class="eng-stat-lbl">Day Streak</span></div>
        <div class="eng-stat"><span class="eng-stat-val">${stats.overallPercent}%</span><span class="eng-stat-lbl">Complete</span></div>
        <div class="eng-stat"><span class="eng-stat-val">${_esc(xpInfo.label)}</span><span class="eng-stat-lbl">Level</span></div>
      </div>
    </div>

    <div class="eng-xp-wrap">
      <div class="eng-xp-hdr">
        <span class="eng-xp-from">${tier.from} → ${tier.to}</span>
        <span class="eng-xp-val">${stats.xp} / ${tier.max} XP</span>
      </div>
      <div class="progress-bar" style="height:5px">
        <div class="progress-bar__fill" style="width:${xpPct}%;background:linear-gradient(90deg,var(--color-primary),var(--color-accent))"></div>
      </div>
    </div>

    <a class="eng-continue" href="${ctaHref}" id="eng-continue-link">
      <div class="eng-continue-left">
        <span class="eng-continue-tag">Level ${cl} · ${_esc(lv ? lv.name : '')}</span>
        <span class="eng-continue-title">${nextLesson ? _esc(nextLesson.title) : 'Module ' + cm + ' · Lesson ' + cle}</span>
        <span class="eng-continue-sub">${nextLesson ? _esc(nextLesson.subtitle || '') + ' · ' + (nextLesson.duration || 15) + ' min · ' + (nextLesson.xpReward || 75) + ' XP' : ''}</span>
      </div>
      <span class="eng-btn">Continue →</span>
    </a>

    <div class="eng-quick">
      <a class="eng-quick-btn" href="pages/english-vocab.html">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="12" height="12" rx="1.5" stroke="currentColor" stroke-width="1.4"/><path d="M3.5 4.5H7M3.5 7H9.5M3.5 9.5H6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
        Vocabulary Bank
      </a>
      <a class="eng-quick-btn" href="pages/english-review.html">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" stroke-width="1.4"/><path d="M7 4v3l2 2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
        Quiz Review
      </a>
    </div>

    <div class="eng-grid">
      <div>
        <div class="eng-sec-lbl">Your Journey</div>
        <div id="eng-levels-stack"></div>
        <div style="margin-top:16px;text-align:center">
          <a href="#/courses" style="font-size:12px;color:var(--color-text-secondary);text-decoration:none;border-bottom:1px solid var(--color-border);padding-bottom:2px">← All courses</a>
        </div>
      </div>
      <div class="eng-sidebar">
        <div class="eng-panel">
          <div class="eng-panel-title">Recent Activity</div>
          <div class="eng-act-list" id="eng-activity"></div>
        </div>
        <div class="eng-panel">
          <div class="eng-panel-title">Achievements</div>
          <div class="eng-ach-list" id="eng-achievements"></div>
        </div>
      </div>
    </div>
  `;

  _buildEngJourney(ES, ED, lvData, cl, cm, cle);
  _buildEngActivity(ES, stats);
  _buildEngAchievements(ES, stats);
  _drainEngToasts(ES);
}

function _buildEngJourney(ES, ED, lvData, cl, cm, cle) {
  const stack = document.getElementById('eng-levels-stack');
  if (!stack) return;
  const BADGE = { 1: 'A1', 2: 'B1', 3: 'B2', 4: 'C1' };
  const COLOR = { 1: 'var(--color-accent)', 2: 'var(--color-primary)', 3: '#FF4D6D', 4: '#FFD700' };

  [1, 2, 3, 4].forEach(function (lvNum) {
    const lv2       = lvData[lvNum];
    const lvProg    = ES.getLevelProgress(lvNum);
    const isLocked  = lvNum > 1 && !ES.isUnlocked(lvNum, 1, 1);
    const isOpen    = lvNum === cl;

    const card = document.createElement('div');
    card.className = 'eng-level-card' + (isOpen ? ' open' : '') + (isLocked ? ' locked' : '');

    const hdr = document.createElement('div');
    hdr.className = 'eng-level-hdr';
    hdr.innerHTML = `
      <span class="eng-level-badge eng-badge-${BADGE[lvNum]}">${_esc(lv2.label)}</span>
      <div class="eng-level-info">
        <span class="eng-level-title">${_esc(lv2.name)}</span>
        <span class="eng-level-desc">${_esc((lv2.description || '').substring(0, 70))}…</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <div class="eng-level-pbar"><div class="eng-level-pfill" style="width:${lvProg.percent}%;background:${COLOR[lvNum]}"></div></div>
        <span class="eng-level-pct">${lvProg.percent}%</span>
      </div>
      ${isLocked ? '<span style="font-size:12px;color:var(--color-text-muted)">🔒</span>' : '<span class="eng-level-toggle">›</span>'}
    `;
    card.appendChild(hdr);

    const modList = document.createElement('div');
    modList.className = 'eng-mods';

    for (let modNum = 1; modNum <= 7; modNum++) {
      const mod        = lv2.modules[modNum];
      if (!mod) continue;
      const modProg    = ES.getModuleProgress(lvNum, modNum);
      const isModLocked = isLocked || !ES.isUnlocked(lvNum, modNum, 1);
      const isModDone  = modProg.done >= modProg.total;
      const isModActive = !isModDone && !isModLocked && (lvNum === cl && modNum === cm);
      const statusLbl  = isModDone ? '✓ done' : isModLocked ? 'locked' : isModActive ? 'active' : modProg.done > 0 ? modProg.done + '/5' : 'start';
      const statusCls  = isModDone ? 'done' : isModLocked ? 'locked' : isModActive ? 'active' : 'avail';

      const row = document.createElement('div');
      row.className = 'eng-mod-row' + (isModLocked ? ' locked' : '') + (isModDone ? ' done' : '');
      row.innerHTML = `
        <span class="eng-mod-num">M${modNum}</span>
        <div class="eng-mod-info">
          <span class="eng-mod-title">${_esc(mod.title)}</span>
          <span class="eng-mod-meta">${_esc(lv2.label)} · 5 lessons</span>
        </div>
        <div class="eng-mod-pbar"><div class="eng-mod-pfill" style="width:${modProg.percent}%"></div></div>
        <span class="eng-mod-status ${statusCls}">${statusLbl}</span>
      `;

      if (!isModLocked) {
        (function (lv3, mo3) {
          row.addEventListener('click', function () {
            let startL = 1;
            for (let le = 1; le <= 5; le++) {
              if (!ES.isCompleted(lv3, mo3, le)) { startL = le; break; }
            }
            location.href = `pages/english-lesson.html?level=${lv3}&module=${mo3}&lesson=${startL}`;
          });
        })(lvNum, modNum);
      }
      modList.appendChild(row);
    }

    card.appendChild(modList);
    if (!isLocked) {
      hdr.addEventListener('click', function () { card.classList.toggle('open'); });
    }
    stack.appendChild(card);
  });
}

function _buildEngActivity(ES, stats) {
  const el = document.getElementById('eng-activity');
  if (!el) return;
  const activity = stats.recentActivity || [];
  if (activity.length === 0) {
    el.innerHTML = `<div class="eng-empty">No lessons completed yet.<br>Start your first lesson!</div>`;
    return;
  }
  activity.forEach(function (act) {
    const date    = new Date(act.completedAt);
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const item    = document.createElement('div');
    item.className = 'eng-act-item';
    item.innerHTML = `
      <div class="eng-act-dot"></div>
      <div class="eng-act-body">
        <span class="eng-act-title">${_esc(act.title)}</span>
        <div class="eng-act-meta"><span class="eng-act-xp">+${act.xp} XP</span><span>${dateStr}</span></div>
      </div>
    `;
    el.appendChild(item);
  });
}

function _buildEngAchievements(ES, stats) {
  const el = document.getElementById('eng-achievements');
  if (!el) return;
  const earnedIds = stats.achievements || [];
  ES.ACHIEVEMENTS.forEach(function (ach) {
    const earned = earnedIds.indexOf(ach.id) !== -1;
    const color  = earned ? (ES.RARITY_COLORS[ach.rarity] || '#fff') : 'var(--color-border)';
    const item   = document.createElement('div');
    item.className = 'eng-ach-item' + (earned ? '' : ' locked');
    item.style.borderColor = earned ? color + '30' : 'var(--color-border)';
    item.style.background  = earned ? color + '08' : 'transparent';
    item.innerHTML = `
      <div class="eng-ach-icon" style="border-color:${color}30;background:${color}10;color:${color}">${ach.icon}</div>
      <div class="eng-ach-info">
        <span class="eng-ach-name">${_esc(ach.name)}</span>
        <span class="eng-ach-rarity" style="color:${color}">${_esc(ach.rarity)}${earned ? '' : ' · locked'}</span>
      </div>
    `;
    el.appendChild(item);
  });
}

function _drainEngToasts(ES) {
  const notifs = ES.getAndClearNotifications ? ES.getAndClearNotifications() : [];
  if (!notifs.length) return;
  const queue = notifs.slice();
  function _next() {
    if (!queue.length) return;
    const n     = queue.shift();
    const color = n.color || '#fff';
    const toast = document.createElement('div');
    toast.style.cssText = `position:fixed;top:20px;right:20px;z-index:9999;display:flex;align-items:center;gap:14px;padding:14px 18px;background:var(--color-surface-raise);border:1px solid ${color}40;border-radius:var(--radius-lg);min-width:280px;max-width:340px;box-shadow:var(--shadow-lg);animation:sl-toast-in .35s ease forwards`;
    toast.innerHTML = `
      <div style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;border-radius:10px;border:1px solid ${color}40;background:${color}10;color:${color};font-size:18px;flex-shrink:0">${n.icon}</div>
      <div style="flex:1">
        <span style="font-size:9px;font-family:var(--font-mono);text-transform:uppercase;letter-spacing:.1em;color:${color};display:block;margin-bottom:2px">Achievement Unlocked · ${_esc(n.rarity)}</span>
        <span style="font-size:13px;font-weight:700;color:var(--color-text);display:block">${_esc(n.name)}</span>
        <span style="font-size:11px;color:var(--color-text-secondary)">${_esc(n.description)}</span>
      </div>
      <span style="font-family:var(--font-mono);font-size:13px;font-weight:700;color:${color};white-space:nowrap">+${n.xpBonus}</span>
    `;
    if (!document.getElementById('sl-toast-kf')) {
      const kf = document.createElement('style');
      kf.id = 'sl-toast-kf';
      kf.textContent = '@keyframes sl-toast-in{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}';
      document.head.appendChild(kf);
    }
    document.body.appendChild(toast);
    setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(40px)';
      toast.style.transition = 'opacity .3s,transform .3s';
      setTimeout(function () { toast.remove(); _next(); }, 320);
    }, 4000);
  }
  _next();
}


/* ═══════════════════════════════════════════════════════
   Lesson Page  (#/lesson/:course/:lessonId)
════════════════════════════════════════════════════════ */

function renderLessonPage(params) {
  const courseSlug = params && params.course;
  const lessonId   = params && params.lessonId;
  if (!courseSlug || !lessonId) { Router.navigate('/modules'); return; }

  const getter     = _COURSE_DATA_MAP[courseSlug];
  const courseData = getter ? getter() : null;
  if (!courseData || !courseData.getLessonById) { Router.navigate('/modules'); return; }

  const found = courseData.getLessonById(lessonId);
  if (!found) { Router.navigate(`/modules?course=${courseSlug}`); return; }

  const { module: mod, lesson, li } = found;

  // Parse "qa.1.1" → moduleNum=1, lessonIndex=0
  const parts      = lessonId.split('.');
  const moduleNum  = parseInt(parts[1], 10);
  const lessonNum  = parseInt(parts[2], 10);
  const lessonIndex = lessonNum - 1;

  const contentObj = courseData.getLessonContent ? courseData.getLessonContent(moduleNum, lessonIndex) : null;

  // Prev / next within the whole course
  const allLessons  = courseData.getAllLessons ? courseData.getAllLessons() : [];
  const currentIdx  = allLessons.findIndex(item => item.lesson.id === lessonId);
  const prevEntry   = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
  const nextEntry   = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;

  const view = document.getElementById('app-view');
  if (!view) return;

  const lessonPos   = li + 1;
  const lessonTotal = mod.lessons.length;
  const pct         = Math.round((lessonPos / lessonTotal) * 100);

  const sectionsHtml = contentObj ? _renderLessonSections(contentObj.sections || []) :
    `<div class="card" style="padding:var(--space-8);text-align:center;color:var(--color-text-muted)">Conteúdo em preparação...</div>`;

  view.innerHTML = `
    <div style="max-width:800px;margin:0 auto">
      <div style="margin-bottom:var(--space-5);display:flex;align-items:center;gap:var(--space-2);flex-wrap:wrap;font-size:12px;color:var(--color-text-secondary)">
        <a href="#/modules?course=${courseSlug}" style="color:inherit;text-decoration:none">← ${_esc(courseData.title)}</a>
        <span style="color:var(--color-text-muted)">/</span>
        <span style="color:var(--color-text-muted)">${_esc(mod.title)}</span>
      </div>

      <div class="card" style="padding:var(--space-6);margin-bottom:var(--space-5)">
        <div style="font-size:11px;color:var(--color-text-muted);font-family:var(--font-mono);margin-bottom:var(--space-2)">
          ${_esc(mod.title)} · Aula ${lessonPos} de ${lessonTotal}
        </div>
        <h2 style="font-size:var(--text-xl);font-weight:var(--weight-bold);color:var(--color-text);margin-bottom:var(--space-3)">${_esc(lesson.title)}</h2>
        <div style="display:flex;gap:var(--space-4);flex-wrap:wrap;margin-bottom:var(--space-4)">
          <span style="font-size:12px;color:var(--color-text-muted)">⏱ ${_esc(lesson.duration)}</span>
          <span style="font-size:12px;color:var(--color-primary);font-weight:600">+${lesson.xp} XP</span>
          ${lesson.type === 'project' ? `<span class="badge badge--warning" style="font-size:11px">Projeto</span>` : ''}
        </div>
        <div class="progress-bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="Progresso no módulo: ${pct}%">
          <div class="progress-bar__fill" style="width:${pct}%;background:var(--color-primary)"></div>
        </div>
      </div>

      <div class="lesson-content">${sectionsHtml}</div>

      <div style="display:flex;justify-content:space-between;align-items:center;gap:var(--space-3);margin-top:var(--space-6);padding-top:var(--space-5);border-top:1px solid var(--color-border);flex-wrap:wrap">
        ${prevEntry
          ? `<a href="#/lesson/${courseSlug}/${prevEntry.lesson.id}" class="button button--secondary button--sm" style="max-width:240px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${_esc(prevEntry.lesson.title)}">← ${_esc(prevEntry.lesson.title)}</a>`
          : `<a href="#/modules?course=${courseSlug}" class="button button--ghost button--sm">← Módulos</a>`}
        <a href="#/modules?course=${courseSlug}" class="button button--ghost button--sm" style="flex-shrink:0">Todos os módulos</a>
        ${nextEntry
          ? `<a href="#/lesson/${courseSlug}/${nextEntry.lesson.id}" class="button button--primary button--sm" style="max-width:240px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${_esc(nextEntry.lesson.title)}">${_esc(nextEntry.lesson.title)} →</a>`
          : `<span class="badge badge--accent" style="padding:8px 16px">Módulo concluído!</span>`}
      </div>
    </div>
  `;

  _ensureLessonStyles();

  requestAnimationFrame(() => {
    document.querySelectorAll('.lesson-exercise__textarea[data-exercise-id]').forEach(ta => {
      const saved = localStorage.getItem(`sl_exercise_${ta.dataset.exerciseId}`);
      if (saved) ta.value = saved;
    });
  });
}

function _renderLessonSections(sections) {
  if (!sections || !sections.length) return '';
  return sections.map(function (s) {
    switch (s.type) {
      case 'text':
        return `<div class="lesson-section lesson-section--text">${s.content || ''}</div>`;

      case 'write-exercise':
        return `
          <div class="lesson-section lesson-section--exercise">
            <div class="lesson-exercise__label">✍️ Exercício prático</div>
            <p class="lesson-exercise__prompt">${_esc(s.prompt || '')}</p>
            <textarea class="lesson-exercise__textarea" rows="5"
              placeholder="${_esc(s.placeholder || 'Digite sua resposta...')}"
              data-exercise-id="${_esc(s.id || '')}"
              aria-label="Sua resposta ao exercício"></textarea>
            <button class="button button--secondary button--sm lesson-exercise__save"
              data-exercise-id="${_esc(s.id || '')}">Salvar resposta</button>
          </div>`;

      case 'h2':
        return `<h2 class="lesson-section__h2">${_esc(s.text || '')}</h2>`;

      case 'p':
        return `<p class="lesson-section__p">${s.html || ''}</p>`;

      case 'callout':
        return `<div class="lesson-section lesson-section--callout">${s.html || ''}</div>`;

      case 'code':
        return `
          <div class="lesson-section lesson-section--code">
            ${s.lang ? `<div class="lesson-code__label">${_esc(s.lang)}</div>` : ''}
            <pre class="lesson-code__pre"><code>${_escCode(s.raw || '')}</code></pre>
          </div>`;

      case 'exercise':
        return `
          <div class="lesson-section lesson-section--exercise">
            <div class="lesson-exercise__label">💻 ${_esc(s.title || 'Exercício')}</div>
            ${s.desc ? `<p class="lesson-exercise__prompt">${_esc(s.desc)}</p>` : ''}
            ${s.steps && s.steps.length ? `<ol class="lesson-exercise__steps">${s.steps.map(step => `<li>${_esc(step)}</li>`).join('')}</ol>` : ''}
            ${s.starterCode ? `
              <div class="lesson-section lesson-section--code" style="margin-bottom:var(--space-3)">
                <div class="lesson-code__label">Código inicial</div>
                <pre class="lesson-code__pre"><code>${_escCode(s.starterCode)}</code></pre>
              </div>` : ''}
            ${s.solution ? `
              <details class="lesson-exercise__solution">
                <summary style="cursor:pointer;font-size:13px;color:var(--color-primary);padding:var(--space-2) 0">Ver solução</summary>
                <div class="lesson-section lesson-section--code" style="margin-top:var(--space-2)">
                  <pre class="lesson-code__pre"><code>${_escCode(s.solution)}</code></pre>
                </div>
              </details>` : ''}
          </div>`;

      default:
        return '';
    }
  }).join('');
}

function _ensureLessonStyles() {
  if (document.getElementById('sl-lesson-styles')) return;
  const s = document.createElement('style');
  s.id = 'sl-lesson-styles';
  s.textContent = `
    .lesson-content { display:flex; flex-direction:column; gap:var(--space-4); }
    .lesson-section { padding:var(--space-5) var(--space-6); background:var(--color-surface); border:1px solid var(--color-border); border-radius:var(--radius-lg); }
    .lesson-section--text { line-height:1.75; color:var(--color-text); }
    .lesson-section--text h2 { font-size:var(--text-lg); font-weight:var(--weight-semibold); color:var(--color-text); margin:var(--space-5) 0 var(--space-3); }
    .lesson-section--text h2:first-child { margin-top:0; }
    .lesson-section--text p { margin-bottom:var(--space-3); color:var(--color-text-secondary); }
    .lesson-section--text ul, .lesson-section--text ol { padding-left:var(--space-5); margin-bottom:var(--space-3); color:var(--color-text-secondary); }
    .lesson-section--text li { margin-bottom:var(--space-1); }
    .lesson-section--text blockquote { border-left:3px solid var(--color-primary); padding-left:var(--space-4); color:var(--color-text-secondary); font-style:italic; margin:var(--space-4) 0; }
    .lesson-section--callout { background:rgba(108,99,255,.06); border-color:rgba(108,99,255,.25); color:var(--color-text-secondary); line-height:1.7; }
    .lesson-section--code { padding:0; overflow:hidden; background:var(--color-surface-alt, #1a1a2e); border-color:var(--color-border); }
    .lesson-code__label { font-size:10px; font-family:var(--font-mono); color:var(--color-text-muted); padding:var(--space-2) var(--space-4); border-bottom:1px solid var(--color-border); letter-spacing:.05em; text-transform:uppercase; }
    .lesson-code__pre { margin:0; padding:var(--space-4); overflow-x:auto; font-size:13px; line-height:1.6; font-family:var(--font-mono); color:var(--color-text); }
    .lesson-section--exercise { background:rgba(0,212,170,.04); border-color:rgba(0,212,170,.2); }
    .lesson-exercise__label { font-size:11px; font-weight:var(--weight-semibold); color:var(--color-accent); letter-spacing:.04em; text-transform:uppercase; margin-bottom:var(--space-3); }
    .lesson-exercise__prompt { font-size:14px; color:var(--color-text-secondary); line-height:1.6; margin-bottom:var(--space-4); }
    .lesson-exercise__textarea { width:100%; min-height:120px; resize:vertical; background:var(--color-surface); border:1px solid var(--color-border); border-radius:var(--radius-md); padding:var(--space-3); font-size:13px; color:var(--color-text); font-family:inherit; margin-bottom:var(--space-3); box-sizing:border-box; }
    .lesson-exercise__textarea:focus { outline:none; border-color:var(--color-primary); box-shadow:0 0 0 2px rgba(108,99,255,.15); }
    .lesson-exercise__steps { font-size:13px; color:var(--color-text-secondary); padding-left:var(--space-5); margin-bottom:var(--space-4); line-height:1.7; }
    .lesson-section__h2 { font-size:var(--text-lg); font-weight:var(--weight-semibold); color:var(--color-text); margin:0; padding:var(--space-2) 0; }
    .lesson-section__p { font-size:14px; color:var(--color-text-secondary); line-height:1.75; margin:0; }
    .lesson-section__p code { font-family:var(--font-mono); font-size:12px; background:rgba(108,99,255,.1); padding:1px 5px; border-radius:3px; color:var(--color-primary); }
    .lesson-section__p strong { color:var(--color-text); font-weight:var(--weight-semibold); }
  `;
  document.head.appendChild(s);
}


/* ═══════════════════════════════════════════════════════
   Generic Course Page  (#/course/:slug)
════════════════════════════════════════════════════════ */

function renderCoursePage(params) {
  const slug = params && params.slug;
  if (!slug) { Router.navigate('/courses'); return; }

  if (slug === 'english') { renderEnglishCoursePage(); return; }

  const course = window.SL_COURSES && window.SL_COURSES.getBySlug(slug);
  if (!course) { Router.navigate('/courses'); return; }

  _renderGenericCoursePage(course);
}

function _renderGenericCoursePage(course) {
  const view = document.getElementById('app-view');
  if (!view) return;

  const isAvail = course.status === 'available';

  const modulesHtml = (course.modules || []).map(function (mod, i) {
    const isSoon = mod.status === 'coming-soon' || !isAvail;
    return `
      <div class="course-module-row ${isSoon ? 'course-module-row--locked' : ''}">
        <div class="course-module-row__num" style="font-family:var(--font-mono);font-size:11px;color:var(--color-text-muted);min-width:32px">M${i+1}</div>
        <div style="flex:1;min-width:0">
          <div style="font-size:13px;font-weight:500;color:${isSoon ? 'var(--color-text-muted)' : 'var(--color-text)'}">${_esc(mod.title)}</div>
          <div style="font-size:11px;color:var(--color-text-muted);margin-top:2px">${mod.lessons} aulas · ${_esc(mod.level)}</div>
        </div>
        <span style="font-size:10px;font-family:var(--font-mono);padding:2px 8px;border-radius:99px;
          ${isSoon ? 'color:var(--color-text-muted);border:1px solid var(--color-border)' : 'color:var(--color-primary);background:rgba(108,99,255,.1);border:1px solid rgba(108,99,255,.2)'}">
          ${isSoon ? 'Em breve' : _esc(mod.status === 'done' ? '✓ done' : mod.status === 'current' ? 'active' : 'disponível')}
        </span>
      </div>
    `;
  }).join('');

  const ctaHtml = isAvail
    ? `<a href="${course.href}" class="button button--primary">Continuar curso →</a>`
    : `<span class="badge badge--info" style="padding:10px 18px;font-size:13px">Em estruturação — em breve</span>`;

  view.innerHTML = `
    <div style="max-width:880px">
      <div style="margin-bottom:var(--space-4)">
        <a href="#/courses" style="font-size:12px;color:var(--color-text-secondary);text-decoration:none;display:inline-flex;align-items:center;gap:6px;margin-bottom:var(--space-4)">
          ← Todos os cursos
        </a>
      </div>

      <div class="card" style="padding:var(--space-8);margin-bottom:var(--space-5);
        background:linear-gradient(135deg,rgba(${course.color === '#00D4AA' ? '0,212,170' : course.color === '#6C63FF' ? '108,99,255' : '255,179,71'},.04) 0%,var(--color-surface) 60%);
        border-color:${course.color}22">
        <div style="display:flex;align-items:flex-start;gap:var(--space-5);flex-wrap:wrap">
          <div class="course-card__icon course-card__icon--${course.iconVariant}" style="width:56px;height:56px;font-size:14px;flex-shrink:0">${_esc(course.iconLabel)}</div>
          <div style="flex:1;min-width:200px">
            <div style="display:flex;align-items:center;gap:var(--space-3);flex-wrap:wrap;margin-bottom:var(--space-2)">
              <span class="course-card__category course-card__category--${course.categoryVariant}">${_esc(course.category)}</span>
              <span class="${isAvail ? 'course-card__status course-card__status--available' : 'course-card__status'}">${isAvail ? 'Disponível' : 'Em breve'}</span>
            </div>
            <h2 style="font-size:var(--text-2xl);font-weight:var(--weight-bold);color:var(--color-text);margin-bottom:var(--space-2)">${_esc(course.title)}</h2>
            <p style="font-size:var(--text-sm);color:var(--color-text-secondary);margin-bottom:var(--space-4)">${_esc(course.description)}</p>
            <div style="display:flex;gap:var(--space-4);flex-wrap:wrap;margin-bottom:var(--space-5)">
              <span style="font-size:12px;color:var(--color-text-muted)">
                <strong style="color:var(--color-text)">${course.estimatedHours}h</strong> estimadas
              </span>
              <span style="font-size:12px;color:var(--color-text-muted)">
                <strong style="color:var(--color-text)">${course.totalModules}</strong> módulos
              </span>
              <span style="font-size:12px;color:var(--color-text-muted)">
                <strong style="color:var(--color-text)">${course.totalLessons}</strong> aulas
              </span>
              <span style="font-size:12px;color:var(--color-text-muted)">
                Nível: <strong style="color:var(--color-text)">${_esc(course.level)}</strong>
              </span>
            </div>
            ${ctaHtml}
          </div>
        </div>
      </div>

      <div class="card" style="padding:0;overflow:hidden">
        <div style="padding:var(--space-5) var(--space-6);border-bottom:1px solid var(--color-border)">
          <h3 style="font-size:var(--text-sm);font-weight:var(--weight-semibold);color:var(--color-text)">Módulos do curso</h3>
        </div>
        <div style="display:flex;flex-direction:column;gap:0">
          ${modulesHtml}
        </div>
      </div>
    </div>
  `;

  _ensureCourseModuleStyles();
}

function _ensureCourseModuleStyles() {
  if (document.getElementById('sl-course-mod-styles')) return;
  const s = document.createElement('style');
  s.id = 'sl-course-mod-styles';
  s.textContent = `
    .course-module-row{display:flex;align-items:center;gap:var(--space-4);padding:var(--space-4) var(--space-6);border-bottom:1px solid var(--color-border);transition:background .15s}
    .course-module-row:last-child{border-bottom:none}
    .course-module-row:not(.course-module-row--locked):hover{background:rgba(108,99,255,.04)}
    .course-module-row--locked{opacity:.6}
  `;
  document.head.appendChild(s);
}


/* ═══════════════════════════════════════════════════════
   Courses Page
════════════════════════════════════════════════════════ */
function renderCoursesPage() {
  const view = document.getElementById('app-view');
  if (!view) return;

  const courses = (window.COURSES_DATA && window.COURSES_DATA.courses) || [];

  function _courseCard(c) {
    const isAvail    = c.status === 'available';
    const isHighlight = c.highlight;
    const cardClass  = [
      'course-card',
      isHighlight ? 'course-card--highlight' : '',
      !isAvail    ? 'course-card--soon'      : '',
    ].filter(Boolean).join(' ');

    const statusLabel = isAvail ? 'Disponível' : 'Em breve';
    const statusClass = isAvail ? 'course-card__status course-card__status--available'
                                : 'course-card__status';

    const progressBlock = isAvail ? `
      <div class="course-card__progress-wrap">
        <div class="course-card__progress-header">
          <span style="font-size:10px;color:var(--color-text-muted)">Progresso</span>
          <span class="course-card__progress-val">${c.progress}%</span>
        </div>
        <div class="progress-bar" style="margin-top:4px">
          <div class="progress-bar__fill" style="width:${c.progress}%"></div>
        </div>
      </div>` : '';

    const ctaClass = isAvail ? 'course-card__cta' : 'course-card__cta course-card__cta--ghost';
    const ctaText  = isAvail ? 'Acessar →' : 'Em breve';
    const ctaHref  = isAvail ? c.href : '#/courses';
    const ctaAttr  = !isAvail ? ' aria-disabled="true" tabindex="-1"' : '';

    const isFav = window.SL_Favorites && window.SL_Favorites.has(c.id);

    return `
    <div class="${cardClass}" style="--card-color:${c.color}">
      <div class="course-card__header">
        <div class="course-card__icon course-card__icon--${c.iconVariant}">${c.iconLabel}</div>
        <div class="course-card__badges">
          <span class="course-card__category course-card__category--${c.categoryVariant}">${c.category}</span>
          <span class="${statusClass}">${statusLabel}</span>
        </div>
        <button class="course-card__fav${isFav ? ' is-fav' : ''}"
                data-course-id="${c.id}"
                aria-label="${isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}"
                title="${isFav ? 'Remover favorito' : 'Favoritar'}">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="${isFav ? 'currentColor' : 'none'}" aria-hidden="true">
            <path d="M8 1L9.8 5.6L15 6.4L11.5 9.8L12.6 15L8 12.5L3.4 15L4.5 9.8L1 6.4L6.2 5.6L8 1Z"
                  stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      <div class="course-card__body">
        <div class="course-card__title">${c.title}</div>
        <div class="course-card__subtitle">${c.subtitle}</div>
        <div class="course-card__meta">
          <span class="course-card__meta-item">${c.estimatedHours}h</span>
          <span class="course-card__meta-item">${c.totalModules} módulos</span>
          <span class="course-card__meta-item">${c.totalLessons} aulas</span>
        </div>
        ${progressBlock}
      </div>
      <div class="course-card__footer">
        <span class="course-card__level">${c.level}</span>
        <a class="${ctaClass}" href="${ctaHref}"${ctaAttr}>${ctaText}</a>
      </div>
    </div>`;
  }

  view.innerHTML = `
    <div class="page-header" style="margin-bottom:var(--space-8)">
      <h2 class="page-title">Todos os Cursos</h2>
      <p class="page-subtitle" style="margin-top:var(--space-2);color:var(--color-text-secondary);font-size:var(--text-sm)">
        ${courses.filter(c => c.status === 'available').length} disponíveis · ${courses.filter(c => c.status !== 'available').length} em breve · Favorite para acesso rápido no menu
      </p>
    </div>
    <div class="courses-grid">
      ${courses.map(_courseCard).join('')}
    </div>
  `;
}


/* ═══════════════════════════════════════════════════════
   Progress Page (placeholder)
════════════════════════════════════════════════════════ */
function renderProgressPage() {
  const view = document.getElementById('app-view');
  if (!view) return;

  // QA Foundation stats
  const p      = (_state && _state.progress) || {};
  const qaPct  = p.completionPercent || 0;
  const qaStreak = p.streakDays || 0;
  const qaXP   = (_state && _state.progress && _state.progress.totalXP) || 2480;

  // English stats
  let engPct = 0, engLessons = 0, engXP = 0, engStreak = 0;
  if (window.EStorage) {
    try {
      const s = window.EStorage.getStats();
      engPct     = s.overallPercent || 0;
      engLessons = (s.completedLessons || []).length;
      engXP      = s.xp || 0;
      engStreak  = s.streakDays || 0;
    } catch (_) { /* storage unavailable */ }
  }

  const streak = Math.max(qaStreak, engStreak);

  function _courseBlock(label, icon, color, pct, lessons, xp, href) {
    return `
      <div class="card" style="padding:var(--space-6);border-left:3px solid ${color}">
        <div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-4)">
          <div style="width:36px;height:36px;border-radius:var(--radius-md);background:${color}20;color:${color};display:flex;align-items:center;justify-content:center;font-family:var(--font-mono);font-size:11px;font-weight:700">${icon}</div>
          <div>
            <div style="font-weight:var(--weight-semibold);font-size:var(--text-sm)">${label}</div>
            <div style="font-size:var(--text-xs);color:var(--color-text-muted)">${lessons} aulas concluídas · ${xp.toLocaleString('pt-BR')} XP</div>
          </div>
          <div style="margin-left:auto;font-size:var(--text-2xl);font-weight:var(--weight-bold);color:${color};font-family:var(--font-mono)">${pct}%</div>
        </div>
        <div class="progress-bar" style="height:6px;border-radius:3px">
          <div class="progress-bar__fill" style="width:${pct}%;background:${color}"></div>
        </div>
        <div style="margin-top:var(--space-4);text-align:right">
          <a class="button button--secondary button--sm" href="${href}">Ver módulos →</a>
        </div>
      </div>`;
  }

  view.innerHTML = `
    <div class="page-layout">
      <div class="page-header">
        <h2 class="page-header__title">Progresso</h2>
        <p class="page-header__subtitle">Rendimento consolidado — todos os cursos</p>
      </div>

      <div class="stats-row" role="list" aria-label="Resumo" style="margin-bottom:var(--space-8)">
        <div class="stat-card" role="listitem">
          <div class="stat-card__value" style="color:var(--color-primary)">${(qaXP + engXP).toLocaleString('pt-BR')}</div>
          <div class="stat-card__label">XP Total</div>
        </div>
        <div class="stat-card" role="listitem">
          <div class="stat-card__value" style="color:var(--color-warning)">${streak}</div>
          <div class="stat-card__label">Dias seguidos</div>
        </div>
        <div class="stat-card" role="listitem">
          <div class="stat-card__value" style="color:var(--color-accent)">${engLessons + (p.completedLessons || 0)}</div>
          <div class="stat-card__label">Aulas concluídas</div>
        </div>
        <div class="stat-card" role="listitem">
          <div class="stat-card__value" style="color:var(--color-success)">2</div>
          <div class="stat-card__label">Cursos ativos</div>
        </div>
      </div>

      <div class="dashboard-section" style="margin-bottom:var(--space-4)">
        <div class="section-header"><h3 class="section-title">Por curso</h3></div>
        <div style="display:grid;gap:var(--space-4)">
          ${_courseBlock('QA Foundation', 'QA', '#6C63FF', qaPct, p.completedLessons || 0, qaXP, '#/modules')}
          ${_courseBlock('English for Developers', 'EN', '#00D4AA', engPct, engLessons, engXP, '#/modules?course=english')}
        </div>
      </div>
    </div>
  `;

  requestAnimationFrame(() => {
    setTimeout(() => {
      document.querySelectorAll('#app-view .progress-bar__fill[data-progress]').forEach(bar => {
        bar.style.width = bar.dataset.progress;
      });
    }, 150);
  });
}


/* ═══════════════════════════════════════════════════════
   Router
   API: Router.init() · Router.navigate(path) · Router.getCurrentRoute()
════════════════════════════════════════════════════════ */
const Router = (() => {
  const _routes = {
    '/dashboard':    renderDashboardPage,
    '/journey':      renderJourneyPage,
    '/modules':      renderModulesPage,
    '/achievements': renderAchievementsPage,
    '/notes':        renderNotesPage,
    '/settings':     renderSettingsPage,
    '/courses':      renderCoursesPage,
    '/progress':     renderProgressPage,
  };

  const _PAGE_TITLES = {
    '/dashboard':    'Minha Jornada',
    '/journey':      'Minha Jornada',
    '/modules':      'Módulos',
    '/achievements': 'Conquistas',
    '/notes':        'Anotações',
    '/settings':     'Configurações',
    '/courses':      'Todos os Cursos',
    '/progress':     'Progresso',
  };

  function getCurrentRoute() {
    const raw  = location.hash.replace(/^#/, '') || '/dashboard';
    const path = raw.startsWith('/') ? raw : `/${raw}`;
    return path.split('?')[0];
  }

  function _getQueryParams() {
    const raw = location.hash.replace(/^#/, '');
    const qi  = raw.indexOf('?');
    if (qi === -1) return {};
    const out = {};
    raw.slice(qi + 1).split('&').forEach(pair => {
      const [k, v] = pair.split('=');
      if (k) out[decodeURIComponent(k)] = decodeURIComponent(v || '');
    });
    return out;
  }

  function navigate(path) {
    location.hash = path;
  }

  function _matchRoute(route) {
    const qp = _getQueryParams();
    if (_routes[route]) return { handler: _routes[route], params: qp };

    const courseMatch = route.match(/^\/course\/([a-z0-9-]+)$/);
    if (courseMatch) return { handler: renderCoursePage, params: Object.assign({ slug: courseMatch[1] }, qp) };

    const lessonMatch = route.match(/^\/lesson\/([a-z0-9-]+)\/([a-z0-9._-]+)$/);
    if (lessonMatch) return { handler: renderLessonPage, params: Object.assign({ course: lessonMatch[1], lessonId: lessonMatch[2] }, qp) };

    return null;
  }

  function _syncNav(route) {
    document.querySelectorAll('.nav-item[data-route]').forEach(item => {
      const itemRoute = item.dataset.route;
      const active = itemRoute === route ||
        (route.startsWith('/course/') && itemRoute === `/course/${route.split('/')[2]}`);
      item.classList.toggle('active', active);
      if (active) item.setAttribute('aria-current', 'page');
      else        item.removeAttribute('aria-current');
    });
  }

  function _updateTitle(route) {
    let title = _PAGE_TITLES[route];

    if (!title) {
      const cm = route.match(/^\/course\/([a-z0-9-]+)$/);
      if (cm) {
        const c = window.SL_COURSES && window.SL_COURSES.getBySlug(cm[1]);
        title = c ? c.title : 'Curso';
      }
    }

    if (!title) {
      const lm = route.match(/^\/lesson\/([a-z0-9-]+)\/([a-z0-9._-]+)$/);
      if (lm) {
        const getter = _COURSE_DATA_MAP[lm[1]];
        const cd = getter ? getter() : null;
        const found = cd && cd.getLessonById ? cd.getLessonById(lm[2]) : null;
        title = found ? found.lesson.title : 'Aula';
      }
    }

    title = title || 'Dashboard';
    const el = document.getElementById('page-title');
    if (el) el.textContent = title;
    document.title = `${title} — Sentinel Learning`;
  }

  function render(route) {
    const match = _matchRoute(route);
    if (!match) { navigate('/dashboard'); return; }
    window.scrollTo(0, 0);
    _syncNav(route);
    _updateTitle(route);
    match.handler(match.params);
  }

  function init() {
    window.addEventListener('hashchange', () => render(getCurrentRoute()));
    render(getCurrentRoute());
  }

  function syncNavOnly() { _syncNav(getCurrentRoute()); }

  return { init, navigate, render, getCurrentRoute, syncNavOnly };
})();


/* ─── Nav Items ─── */
function _initNavItems() { /* superseded by Router._syncNav */ }


/* ─── Sidebar Favorites ─── */
function _updateSidebarFavorites() {
  const container = document.getElementById('sidebar-favorites-list');
  if (!container) return;

  const SF = window.SL_Favorites;
  const SC = window.SL_COURSES;
  if (!SF || !SC) return;

  const ids = SF.getAll();

  if (!ids.length) {
    container.innerHTML = `
      <div class="nav-favorites-empty">
        <span class="nav-favorites-empty__icon" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M8 1L9.8 5.6L15 6.4L11.5 9.8L12.6 15L8 12.5L3.4 15L4.5 9.8L1 6.4L6.2 5.6L8 1Z"
                  stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
        <span>Favorite um curso para acesso rápido</span>
      </div>`;
    return;
  }

  const items = ids.map(id => {
    const c = SC.getById(id);
    if (!c) return '';
    const route = c.href && c.href.startsWith('#') ? c.href.slice(1) : `/course/${c.slug}`;
    return `
      <a class="nav-item" href="#${route}" data-route="${route}" data-label="${_esc(c.title)}">
        <span class="nav-item__icon" aria-hidden="true" style="color:${c.color}">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 1L9.8 5.6L15 6.4L11.5 9.8L12.6 15L8 12.5L3.4 15L4.5 9.8L1 6.4L6.2 5.6L8 1Z"
                  stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
        <span class="nav-item__label">${_esc(c.title)}</span>
      </a>`;
  }).join('');

  container.innerHTML = items;
  Router.syncNavOnly();
}


/* ─── Global Events (delegated, handles dynamic content) ─── */
function _initGlobalEvents() {
  document.addEventListener('click', (e) => {
    /* Hero CTA — rendered dynamically, guard against aria-disabled */
    const cta = e.target.closest('.hero-card__cta');
    if (cta) {
      e.preventDefault();
      if (cta.getAttribute('aria-disabled') !== 'true') completeLesson();
    }

    if (e.target.closest('#reset-progress')) resetProgress();

    /* Favorite toggle on course cards */
    const favBtn = e.target.closest('.course-card__fav');
    if (favBtn && window.SL_Favorites) {
      e.preventDefault();
      const id = favBtn.dataset.courseId;
      window.SL_Favorites.toggle(id);
      const isFav = window.SL_Favorites.has(id);
      favBtn.classList.toggle('is-fav', isFav);
      favBtn.setAttribute('aria-label', isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos');
      const svgPath = favBtn.querySelector('path');
      if (svgPath) svgPath.parentElement.setAttribute('fill', isFav ? 'currentColor' : 'none');
      _updateSidebarFavorites();
      Toast.info(isFav ? 'Adicionado aos favoritos' : 'Removido dos favoritos', '');
    }

    /* Save write-exercise response */
    const saveBtn = e.target.closest('.lesson-exercise__save');
    if (saveBtn) {
      const exerciseId = saveBtn.dataset.exerciseId;
      const ta = document.querySelector(`.lesson-exercise__textarea[data-exercise-id="${exerciseId}"]`);
      if (exerciseId && ta) {
        try { localStorage.setItem(`sl_exercise_${exerciseId}`, ta.value); } catch (_) {}
        Toast.info('Resposta salva!', '');
      }
    }
  });

}


/* ─── Mobile Menu ─── */
function _initMobileMenu() {
  const toggle = document.getElementById('mobile-menu-toggle');
  if (!toggle) return;

  const isSmall = () => window.innerWidth <= 768;

  function sync() {
    toggle.style.display = isSmall() ? 'flex' : 'none';
  }

  toggle.addEventListener('click', () => Sidebar.openMobile());
  window.addEventListener('resize', sync);
  sync();
}


/* ─── Bootstrap ─── */
document.addEventListener('DOMContentLoaded', () => {
  Sidebar.init();
  Theme.init();
  Toast.init();
  _initGlobalEvents();
  _initMobileMenu();
  _updateSidebarFavorites();
  Router.init();
});
