// Sentinel Learning — English for Developers
// Thin metadata wrapper — full lesson data lives in js/english-data.js (window.ENGLISH_DATA)
// window.SL_ENGLISH

(function () {
  'use strict';

  var COURSE = {
    id: 'english-for-devs',
    slug: 'english',
    title: 'English for Developers',
    subtitle: 'Inglês técnico para times internacionais',
    description: 'Do primeiro standup à code review em inglês. 4 níveis (A1 → C1) com vocabulário técnico, diálogos reais e quiz interativo.',
    category: 'Idiomas',
    level: 'A1 → C1',
    estimatedHours: 80,
    totalModules: 28,
    totalLessons: 140,
    status: 'available',
    tags: ['english', 'communication', 'soft skills'],
    storageKey: 'sentinel_learning_english_v1',

    // Full lesson content lives in window.ENGLISH_DATA (js/english-data.js)
    // Module metadata only — lesson renderer reads from ENGLISH_DATA directly
    modules: [
      // Level 1 — Foundations (A1/A2) — COMPLETE
      { id: 'L1M1', title: 'Introductions & Greetings',  lessons: 5, level: 'A1', status: 'available' },
      { id: 'L1M2', title: 'Daily Routine',              lessons: 5, level: 'A1', status: 'available' },
      { id: 'L1M3', title: 'Basic Tech Vocabulary',      lessons: 5, level: 'A1', status: 'available' },
      { id: 'L1M4', title: 'Frontend Basics',            lessons: 5, level: 'A1', status: 'available' },
      { id: 'L1M5', title: 'Talking About Projects',     lessons: 5, level: 'A2', status: 'available' },
      { id: 'L1M6', title: 'Asking Questions',           lessons: 5, level: 'A2', status: 'available' },
      { id: 'L1M7', title: 'Simple Conversations',       lessons: 5, level: 'A2', status: 'available' },
      // Level 2 — Professional Communication (B1/B2) — skeleton
      { id: 'L2M1', title: 'Agile & Scrum',             lessons: 5, level: 'B1', status: 'coming-soon' },
      { id: 'L2M2', title: 'Code Reviews',              lessons: 5, level: 'B1', status: 'coming-soon' },
      { id: 'L2M3', title: 'Technical Presentations',   lessons: 5, level: 'B1', status: 'coming-soon' },
      { id: 'L2M4', title: 'Remote Communication',      lessons: 5, level: 'B1', status: 'coming-soon' },
      { id: 'L2M5', title: 'Writing & Documentation',   lessons: 5, level: 'B1', status: 'coming-soon' },
      { id: 'L2M6', title: 'Bug Reports & QA',          lessons: 5, level: 'B1', status: 'coming-soon' },
      { id: 'L2M7', title: 'API & Backend Vocab',       lessons: 5, level: 'B2', status: 'coming-soon' },
      // Level 3 — International Developer (B2/C1) — skeleton
      { id: 'L3M1', title: 'Job Interviews',            lessons: 5, level: 'B2', status: 'coming-soon' },
      { id: 'L3M2', title: 'Portfolio Presentation',    lessons: 5, level: 'B2', status: 'coming-soon' },
      { id: 'L3M3', title: 'Freelance Calls',           lessons: 5, level: 'B2', status: 'coming-soon' },
      { id: 'L3M4', title: 'Client Meetings',           lessons: 5, level: 'B2', status: 'coming-soon' },
      { id: 'L3M5', title: 'Technical Explanations',    lessons: 5, level: 'B2', status: 'coming-soon' },
      { id: 'L3M6', title: 'Architecture Basics',       lessons: 5, level: 'C1', status: 'coming-soon' },
      { id: 'L3M7', title: 'Problem Solving',           lessons: 5, level: 'C1', status: 'coming-soon' },
      // Level 4 — Advanced Fluency (C1) — skeleton
      { id: 'L4M1', title: 'Leadership',                lessons: 5, level: 'C1', status: 'coming-soon' },
      { id: 'L4M2', title: 'Product Thinking',          lessons: 5, level: 'C1', status: 'coming-soon' },
      { id: 'L4M3', title: 'Negotiation',               lessons: 5, level: 'C1', status: 'coming-soon' },
      { id: 'L4M4', title: 'Public Speaking',           lessons: 5, level: 'C1', status: 'coming-soon' },
      { id: 'L4M5', title: 'Technical Presentations',   lessons: 5, level: 'C1', status: 'coming-soon' },
      { id: 'L4M6', title: 'Mentoring',                 lessons: 5, level: 'C1', status: 'coming-soon' },
      { id: 'L4M7', title: 'Advanced Communication',    lessons: 5, level: 'C1', status: 'coming-soon' },
    ],

    // Helper: get lesson data from the live ENGLISH_DATA module
    getLesson: function (levelNum, moduleNum, lessonNum) {
      var ED = window.ENGLISH_DATA;
      return ED ? ED.getLesson(levelNum, moduleNum, lessonNum) : null;
    }
  };

  window.SL_ENGLISH = COURSE;
})();
