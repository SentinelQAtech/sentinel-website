// Sentinel Learning — English for Developers Storage (EStorage)
// Key: sentinel_learning_english_v1
// Lesson IDs: 'L{level}.M{module}.L{lesson}'

(function () {
  'use strict';

  var KEY = 'sentinel_learning_english_v1';

  var SIZES = { levels: 4, modulesPerLevel: 7, lessonsPerModule: 5 };

  var DEFAULTS = {
    completedLessons: [],
    xp: 0,
    streak: { count: 0, lastDate: null },
    totalMinutes: 0,
    achievements: [],
    pendingNotifications: [],
    recentActivity: []      // [{id, title, xp, completedAt}] — max 5
  };

  // ── Achievement definitions ────────────────────────────────
  var ACHIEVEMENTS = [
    {
      id: 'first_words',
      name: 'First Words',
      description: 'Completed your first lesson',
      icon: '★',
      rarity: 'common',
      xpBonus: 10,
      threshold: 1,
      type: 'lessons'
    },
    {
      id: 'module_1_done',
      name: 'Module Clear',
      description: 'Finished every lesson in a module',
      icon: '⬡',
      rarity: 'common',
      xpBonus: 25,
      threshold: 5,
      type: 'lessons'
    },
    {
      id: 'ten_lessons',
      name: 'Ten Strong',
      description: 'Completed 10 lessons',
      icon: '◎',
      rarity: 'uncommon',
      xpBonus: 50,
      threshold: 10,
      type: 'lessons'
    },
    {
      id: 'streak_7',
      name: 'Week Streak',
      description: '7 days of consecutive learning',
      icon: '⚡',
      rarity: 'uncommon',
      xpBonus: 75,
      threshold: 7,
      type: 'streak'
    },
    {
      id: 'twenty_five',
      name: 'Quarter Century',
      description: 'Completed 25 lessons',
      icon: '◈',
      rarity: 'rare',
      xpBonus: 100,
      threshold: 25,
      type: 'lessons'
    },
    {
      id: 'xp_500',
      name: 'XP Milestone',
      description: 'Earned 500 XP',
      icon: '✦',
      rarity: 'rare',
      xpBonus: 150,
      threshold: 500,
      type: 'xp'
    },
    {
      id: 'level_2_unlock',
      name: 'Level 2 Unlocked',
      description: 'Completed all of Level 1',
      icon: '◆',
      rarity: 'epic',
      xpBonus: 250,
      threshold: 35,     // 7 modules × 5 lessons
      type: 'lessons'
    },
    {
      id: 'xp_1000',
      name: 'Grand Master',
      description: 'Earned 1,000 XP',
      icon: '⊛',
      rarity: 'legendary',
      xpBonus: 500,
      threshold: 1000,
      type: 'xp'
    }
  ];

  var RARITY_COLORS = {
    common:    '#A8B3C7',
    uncommon:  '#35F4FF',
    rare:      '#8A2BE2',
    epic:      '#E0234E',
    legendary: '#FFD700'
  };

  // ── Storage helpers ────────────────────────────────────────
  function load() {
    try {
      var saved = localStorage.getItem(KEY);
      if (saved) {
        var p = JSON.parse(saved);
        if (!p.completedLessons)    p.completedLessons    = [];
        if (p.xp === undefined)     p.xp                  = 0;
        if (!p.streak)              p.streak              = { count: 0, lastDate: null };
        if (!p.totalMinutes)        p.totalMinutes        = 0;
        if (!p.achievements)        p.achievements        = [];
        if (!p.pendingNotifications) p.pendingNotifications = [];
        if (!p.recentActivity)      p.recentActivity      = [];
        return p;
      }
    } catch (_) {}
    return JSON.parse(JSON.stringify(DEFAULTS));
  }

  function persist(data) {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (_) {}
  }

  // ── Streak ────────────────────────────────────────────────
  function updateStreak(data) {
    var today = new Date().toDateString();
    if (data.streak.lastDate === today) return;
    var yesterday = new Date(Date.now() - 86400000).toDateString();
    data.streak.count = (data.streak.lastDate === yesterday) ? data.streak.count + 1 : 1;
    data.streak.lastDate = today;
  }

  // ── Lesson ID ─────────────────────────────────────────────
  function lessonId(level, module, lesson) {
    return 'L' + level + '.M' + module + '.L' + lesson;
  }

  // ── Completion checks ─────────────────────────────────────
  function isCompleted(level, module, lesson) {
    return load().completedLessons.indexOf(lessonId(level, module, lesson)) !== -1;
  }

  function isUnlocked(level, module, lesson) {
    if (level === 1 && module === 1 && lesson === 1) return true;
    if (lesson > 1) return isCompleted(level, module, lesson - 1);
    if (module > 1) {
      for (var l = 1; l <= SIZES.lessonsPerModule; l++) {
        if (!isCompleted(level, module - 1, l)) return false;
      }
      return true;
    }
    if (level > 1) {
      for (var m = 1; m <= SIZES.modulesPerLevel; m++) {
        for (var ls = 1; ls <= SIZES.lessonsPerModule; ls++) {
          if (!isCompleted(level - 1, m, ls)) return false;
        }
      }
      return true;
    }
    return false;
  }

  // ── Achievements ──────────────────────────────────────────
  function checkAchievements(data) {
    var count = data.completedLessons.length;
    ACHIEVEMENTS.forEach(function (ach) {
      if (data.achievements.indexOf(ach.id) !== -1) return;
      var earned = false;
      if (ach.type === 'lessons' && count >= ach.threshold) earned = true;
      if (ach.type === 'streak'  && data.streak.count >= ach.threshold) earned = true;
      if (ach.type === 'xp'      && data.xp >= ach.threshold) earned = true;
      if (earned) {
        data.achievements.push(ach.id);
        data.xp += ach.xpBonus;
        data.pendingNotifications.push({
          id:          ach.id,
          name:        ach.name,
          description: ach.description,
          icon:        ach.icon,
          rarity:      ach.rarity,
          color:       RARITY_COLORS[ach.rarity] || '#fff',
          xpBonus:     ach.xpBonus,
          unlockedAt:  new Date().toISOString()
        });
      }
    });
  }

  function getAndClearNotifications() {
    var data = load();
    var notifs = data.pendingNotifications || [];
    data.pendingNotifications = [];
    persist(data);
    return notifs;
  }

  // ── Complete lesson ───────────────────────────────────────
  function completeLesson(level, module, lesson, xpAmount, durationMin, lessonTitle) {
    var data = load();
    var id = lessonId(level, module, lesson);
    if (data.completedLessons.indexOf(id) === -1) {
      data.completedLessons.push(id);
      data.xp += (xpAmount || 50);
      data.totalMinutes += (durationMin || 0);
      updateStreak(data);

      data.recentActivity.unshift({
        id:          id,
        title:       lessonTitle || ('Lesson ' + id),
        xp:          xpAmount || 50,
        completedAt: new Date().toISOString()
      });
      if (data.recentActivity.length > 5) data.recentActivity = data.recentActivity.slice(0, 5);

      checkAchievements(data);
    }
    persist(data);
    return data;
  }

  // ── Progress queries ──────────────────────────────────────
  function getLevelProgress(level) {
    var data = load();
    var total = SIZES.modulesPerLevel * SIZES.lessonsPerModule;
    var done = 0;
    for (var m = 1; m <= SIZES.modulesPerLevel; m++) {
      for (var l = 1; l <= SIZES.lessonsPerModule; l++) {
        if (data.completedLessons.indexOf(lessonId(level, m, l)) !== -1) done++;
      }
    }
    return { done: done, total: total, percent: Math.round((done / total) * 100) };
  }

  function getModuleProgress(level, module) {
    var data = load();
    var done = 0;
    for (var l = 1; l <= SIZES.lessonsPerModule; l++) {
      if (data.completedLessons.indexOf(lessonId(level, module, l)) !== -1) done++;
    }
    return {
      done: done,
      total: SIZES.lessonsPerModule,
      percent: Math.round((done / SIZES.lessonsPerModule) * 100)
    };
  }

  function getStats() {
    var data = load();
    var total = SIZES.levels * SIZES.modulesPerLevel * SIZES.lessonsPerModule;
    var completed = data.completedLessons.length;

    var currentLevel = 1, currentModule = 1, currentLesson = 1;
    outer: for (var lv = 1; lv <= SIZES.levels; lv++) {
      for (var mo = 1; mo <= SIZES.modulesPerLevel; mo++) {
        for (var le = 1; le <= SIZES.lessonsPerModule; le++) {
          if (data.completedLessons.indexOf(lessonId(lv, mo, le)) === -1) {
            currentLevel = lv; currentModule = mo; currentLesson = le;
            break outer;
          }
        }
      }
    }

    return {
      completedLessons: completed,
      totalLessons:     total,
      xp:               data.xp,
      streak:           data.streak.count,
      totalMinutes:     data.totalMinutes,
      overallPercent:   Math.round((completed / total) * 100),
      achievements:     data.achievements,
      recentActivity:   data.recentActivity || [],
      currentLevel:     currentLevel,
      currentModule:    currentModule,
      currentLesson:    currentLesson
    };
  }

  function getRecentActivity() {
    return (load().recentActivity || []);
  }

  // ── XP → level label ─────────────────────────────────────
  function xpToLevel(xp) {
    if (xp >= 2000) return { label: 'C1', tier: 4 };
    if (xp >= 800)  return { label: 'B2', tier: 3 };
    if (xp >= 250)  return { label: 'B1', tier: 2 };
    return { label: 'A2', tier: 1 };
  }

  function getAchievementById(id) {
    for (var i = 0; i < ACHIEVEMENTS.length; i++) {
      if (ACHIEVEMENTS[i].id === id) return ACHIEVEMENTS[i];
    }
    return null;
  }

  function reset() {
    try { localStorage.removeItem(KEY); } catch (_) {}
  }

  // ── Public API ────────────────────────────────────────────
  window.EStorage = {
    KEY:                     KEY,
    SIZES:                   SIZES,
    ACHIEVEMENTS:            ACHIEVEMENTS,
    RARITY_COLORS:           RARITY_COLORS,
    load:                    load,
    completeLesson:          completeLesson,
    isCompleted:             isCompleted,
    isUnlocked:              isUnlocked,
    getStats:                getStats,
    getLevelProgress:        getLevelProgress,
    getModuleProgress:       getModuleProgress,
    getRecentActivity:       getRecentActivity,
    getAndClearNotifications: getAndClearNotifications,
    getAchievementById:      getAchievementById,
    lessonId:                lessonId,
    xpToLevel:               xpToLevel,
    reset:                   reset
  };
})();
