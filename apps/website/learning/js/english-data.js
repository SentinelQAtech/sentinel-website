// Sentinel Learning — English for Developers Course Data
// Structure: window.ENGLISH_DATA.levels[level].modules[module] = { title, description, lessons }
// Lesson IDs: 'L{level}.M{module}.L{lesson}'
// Level 1 Module 1: COMPLETE (5 full lessons — Introductions)
// Level 1 Module 2: COMPLETE (5 full lessons — Daily Routine)
// Level 1 Module 3: COMPLETE (5 full lessons — Basic Tech Vocabulary)
// Level 1 Module 4: COMPLETE (5 full lessons — Frontend Basics)
// Level 1 Module 5: COMPLETE (5 full lessons — Talking About Projects)
// Level 1 Module 6: COMPLETE (5 full lessons — Asking Questions)
// Level 1 Module 7: COMPLETE (5 full lessons — Simple Conversations)
// Level 1 COMPLETE — all 35 lessons done (A1/A2 Foundations)
// All other modules: skeleton (title/lesson titles defined, content per release)

(function () {
  'use strict';

  // ─────────────────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────────────────

  function skeleton(lvNum, modNum, moduleTitle, moduleDesc, lessonDefs) {
    var lessons = lessonDefs.map(function (def, i) {
      return {
        id: 'L' + lvNum + '.M' + modNum + '.L' + (i + 1),
        title: def.title,
        subtitle: def.subtitle || 'Coming soon',
        difficulty: def.difficulty || 'beginner',
        duration: 15,
        xpReward: 75,
        skeleton: true,
        sections: [
          { type: 'warmup', prompt: 'Content coming soon for this lesson. Check back soon!' }
        ]
      };
    });
    return { title: moduleTitle, description: moduleDesc, lessons: lessons };
  }

  // ─────────────────────────────────────────────────────────
  // LEVEL 1 — MODULE 1: Introductions  (FULL CONTENT)
  // ─────────────────────────────────────────────────────────
  var L1M1 = {
    title: 'Introductions',
    description: 'How to introduce yourself and talk about your role in English — from your first standup to your first job interview.',
    lessons: [
      {
        id: 'L1.M1.L1',
        title: "Hello, World!",
        subtitle: 'Your first professional introduction',
        difficulty: 'beginner',
        duration: 15,
        xpReward: 75,
        sections: [
          {
            type: 'warmup',
            prompt: 'Imagine you just joined a new international tech company. A colleague from the US comes to your desk and says: "Hey! I\'m Tyler, nice to meet you." What would you say in English?',
            tip: 'Don\'t worry about being perfect — just think about what you already know.'
          },
          {
            type: 'vocabulary',
            words: [
              { word: 'developer', phonetic: '/dɪˈvɛl.ə.pər/', meaning: '(n) A person who writes code and builds software', example: 'I\'m a frontend developer at Sentinel.', techNote: 'Also: "dev" (informal), "software engineer", "SWE"' },
              { word: 'team', phonetic: '/tiːm/', meaning: '(n) A group of people working together on a project', example: 'Our team has five developers and one QA.', techNote: 'Common: "squad", "pod", "crew" — all mean the same thing' },
              { word: 'work on', phonetic: '/wɜːk ɒn/', meaning: '(phrasal verb) To be responsible for / to be building something', example: 'I work on the checkout feature.', techNote: 'More natural than "I do" or "I make" in tech context' },
              { word: 'based in', phonetic: '/beɪst ɪn/', meaning: '(phrase) Where you are located', example: 'I\'m based in São Paulo, but I work remotely.', techNote: 'Common in remote work culture when you\'re not where the company HQ is' },
              { word: 'specialize in', phonetic: '/ˈspeʃ.ə.laɪz ɪn/', meaning: '(verb phrase) To focus professionally on a specific area', example: 'I specialize in backend development.', techNote: 'Great word for your LinkedIn bio and interviews' }
            ]
          },
          {
            type: 'explanation',
            title: 'How to introduce yourself in a tech context',
            content: '<p>In English-speaking tech companies, introductions are <strong>casual but informative</strong>. You don\'t need to be formal — but you do need to be clear about who you are and what you do.</p><p>A solid tech introduction has 3 parts:</p><ol><li><strong>Name:</strong> "I\'m [name]" or "My name is [name]"</li><li><strong>Role:</strong> "I\'m a [your role]" + "I work on [your area]"</li><li><strong>Context:</strong> Where you\'re based, your team, or how long you\'ve been there</li></ol><p>Example: <em>"Hi, I\'m Ana. I\'m a frontend developer. I work on the design system team. I\'m based in Brazil, but I\'ve been with the company for about a year."</em></p><p><strong>Tip:</strong> Native English speakers in tech are very informal. "Hey" and "Hi" are totally normal — even in professional settings.</p>'
          },
          {
            type: 'tech-example',
            title: 'Standup intro — First day on the team',
            scenario: 'It\'s your first Monday standup. The team lead asks everyone to do a quick intro. Here\'s how a developer handles it:',
            dialogue: [
              { speaker: 'Priya (Lead)', text: 'Hey everyone, let\'s do quick intros since we have two new people. I\'ll start — I\'m Priya, I lead the platform team. We build the core infrastructure.' },
              { speaker: 'Marcus', text: 'I\'m Marcus, senior dev. I specialize in APIs and databases. Been here three years.' },
              { speaker: 'You', text: 'Hi! I\'m [your name], nice to meet you all. I\'m a full-stack developer. I\'ll be working on the new user dashboard. I\'m based in Brazil, remote.', isYou: true },
              { speaker: 'Priya (Lead)', text: 'Great, welcome! We\'re really glad to have you.' }
            ],
            tip: 'Notice "I\'ll be working on" — this is more natural than "I will work on" and sounds less robotic.'
          },
          {
            type: 'speaking',
            prompt: 'Write your own professional introduction in English. Include: your name, your role, what you work on, and where you\'re based. Try to write 3-4 sentences.',
            tip: 'Use the vocabulary from this lesson. You can use your real information or invent a dev persona!',
            example: '"Hi, I\'m Raphael. I\'m a QA engineer. I specialize in test automation and I work on the checkout and payments team. I\'m based in Brazil and I work 100% remotely."'
          },
          {
            type: 'quiz',
            questions: [
              {
                question: 'Which phrase is most natural when explaining what you build at work?',
                options: [
                  { text: 'I do the frontend.', correct: false },
                  { text: 'I work on the frontend.', correct: true },
                  { text: 'I make the frontend.', correct: false },
                  { text: 'I am doing frontend.', correct: false }
                ],
                explanation: '"Work on" is the most natural phrasal verb in tech. "I do" is too vague, "make" sounds like a factory, and "I am doing" implies it\'s only temporary.'
              },
              {
                question: 'You\'re meeting a colleague online. Which greeting is appropriate in a tech company?',
                options: [
                  { text: 'Good day, sir. I am pleased to make your acquaintance.', correct: false },
                  { text: 'Hey! I\'m Ana, good to meet you.', correct: true },
                  { text: 'I am Ana. I am a developer.', correct: false },
                  { text: 'Hi. My name is Ana Maria Beatriz dos Santos.', correct: false }
                ],
                explanation: 'Tech companies are casual. "Hey! I\'m [first name], good to meet you" is warm, professional, and totally normal. Full formal names and stiff language feel out of place.'
              },
              {
                question: 'What does "I\'m based in Brazil" mean?',
                options: [
                  { text: 'I was born in Brazil.', correct: false },
                  { text: 'I am located/working from Brazil.', correct: true },
                  { text: 'I speak Portuguese from Brazil.', correct: false },
                  { text: 'The company is from Brazil.', correct: false }
                ],
                explanation: '"Based in" refers to where you are currently located or working from — especially useful in remote work when your location differs from the company headquarters.'
              }
            ]
          }
        ]
      },

      {
        id: 'L1.M1.L2',
        title: "What Do You Do?",
        subtitle: 'Tech roles, titles, and how to explain them',
        difficulty: 'beginner',
        duration: 15,
        xpReward: 75,
        sections: [
          {
            type: 'warmup',
            prompt: 'Someone at a party asks you: "What do you do for a living?" They\'re not a developer. How would you explain your job in simple English?',
            tip: 'Think about how to explain technical work to someone who doesn\'t know what a "pull request" is.'
          },
          {
            type: 'vocabulary',
            words: [
              { word: 'software engineer', phonetic: '/ˈsɒft.weər ˌen.dʒɪˈnɪər/', meaning: '(n) A professional who designs and builds software systems', example: 'I\'m a software engineer at a startup.', techNote: '"Software Engineer" and "Developer" are often interchangeable — but "Engineer" signals more systems-level thinking' },
              { word: 'front-end', phonetic: '/ˈfrʌnt.ɛnd/', meaning: '(adj/n) The visual, user-facing part of an application', example: 'I\'m a front-end developer — I build what users see.', techNote: 'Also written "frontend" (one word). The UI, buttons, screens.' },
              { word: 'back-end', phonetic: '/ˈbæk.ɛnd/', meaning: '(adj/n) The server, database, and logic behind the scenes', example: 'She handles back-end — servers, APIs, the database.', techNote: 'Also "backend". Users never see it directly, but it makes everything work.' },
              { word: 'full-stack', phonetic: '/ˈfʊl.stæk/', meaning: '(adj) Working on both frontend and backend', example: 'I\'m full-stack — I can build the whole app.', techNote: 'A popular title, though some debate whether true full-stack expertise is realistic' },
              { word: 'I\'m responsible for', phonetic: '/aɪm rɪˈspɒn.sɪ.bəl fɔːr/', meaning: '(phrase) This is my job / I own this area', example: 'I\'m responsible for the CI/CD pipeline.', techNote: 'More professional than "I do" — shows ownership and accountability' }
            ]
          },
          {
            type: 'explanation',
            title: 'Explaining your tech role to anyone',
            content: '<p>Tech job titles can be confusing — even to other developers. Knowing how to explain your role clearly is a superpower.</p><p><strong>Two modes:</strong></p><p><strong>1. To developers:</strong> Use the technical title directly. <em>"I\'m a senior backend engineer. I work mainly with Node.js and PostgreSQL."</em></p><p><strong>2. To non-developers:</strong> Translate to plain English. <em>"I write the code that makes apps work. I build the invisible parts — like when you click \'buy\' on a website, my code handles that."</em></p><p>Key phrases for explaining your role:</p><ul><li><em>"I build..."</em> — for products</li><li><em>"I\'m responsible for..."</em> — for ownership</li><li><em>"My job is to..."</em> — for descriptions</li><li><em>"I work with..."</em> — for technologies</li></ul>'
          },
          {
            type: 'tech-example',
            title: 'LinkedIn conversation — Tech recruiters talk like this',
            scenario: 'A recruiter messages you on LinkedIn. This is a real type of message you\'ll receive when you\'re job hunting in English:',
            dialogue: [
              { speaker: 'Recruiter (Sarah)', text: 'Hi! I came across your profile and I\'m really impressed. Can you tell me a bit about your current role?' },
              { speaker: 'You', text: 'Sure! I\'m a full-stack developer. I work on both the frontend (React) and backend (Node.js). I\'m currently responsible for our checkout flow and payment integrations.', isYou: true },
              { speaker: 'Recruiter (Sarah)', text: 'Great! And would you say you lean more front-end or back-end?' },
              { speaker: 'You', text: 'I\'d say I\'m stronger on the backend — databases and APIs are where I feel most comfortable. But I can hold my own on the frontend too.', isYou: true }
            ],
            tip: '"Hold my own" is a great idiom: it means "I can do it adequately / I\'m competent at it". It\'s honest and not overconfident.'
          },
          {
            type: 'speaking',
            prompt: 'Explain your tech role in TWO ways: (1) to a developer colleague, and (2) to someone who has never coded. Write 2-3 sentences for each.',
            tip: 'For non-developers: avoid terms like "API", "backend", "framework". Use analogies instead.',
            example: 'To devs: "I\'m a QA engineer. I write automated tests with Playwright and maintain our CI/CD pipeline."\nTo non-devs: "I make sure the software doesn\'t break. I write little programs that test the app automatically before it goes live."'
          },
          {
            type: 'quiz',
            questions: [
              {
                question: 'Which sentence correctly uses "responsible for"?',
                options: [
                  { text: 'I am responsible to the frontend.', correct: false },
                  { text: 'I responsible for frontend work.', correct: false },
                  { text: 'I\'m responsible for the frontend.', correct: true },
                  { text: 'I\'m responsible of the frontend.', correct: false }
                ],
                explanation: '"Responsible for" is the correct preposition. "Responsible to" means you report to someone. "Responsible of/at" don\'t exist in this context.'
              },
              {
                question: 'How would you explain "I\'m a backend developer" to a non-tech person?',
                options: [
                  { text: 'I work with databases and write SQL queries for API endpoints.', correct: false },
                  { text: 'I build the invisible parts of apps — the servers and logic that make things work.', correct: true },
                  { text: 'I\'m a full-stack engineer specializing in microservices.', correct: false },
                  { text: 'I code in Node.js and manage PostgreSQL databases.', correct: false }
                ],
                explanation: 'For non-developers, avoid technical jargon. "The invisible parts that make things work" is clear and relatable — anyone can understand that.'
              },
              {
                question: 'What does "full-stack" mean?',
                options: [
                  { text: 'A developer who works only on mobile apps', correct: false },
                  { text: 'A developer who works on both the frontend and backend', correct: true },
                  { text: 'A developer who knows every programming language', correct: false },
                  { text: 'A senior developer who manages a team', correct: false }
                ],
                explanation: '"Full-stack" means working on both the user-facing frontend AND the server-side backend. It doesn\'t mean knowing every language — just being able to build a complete application.'
              }
            ]
          }
        ]
      },

      {
        id: 'L1.M1.L3',
        title: "Your Stack",
        subtitle: 'Talking about technologies and tools',
        difficulty: 'beginner',
        duration: 15,
        xpReward: 75,
        sections: [
          {
            type: 'warmup',
            prompt: 'A developer from another company asks: "What\'s your tech stack?" How would you answer in English?',
            tip: 'Think about the technologies you use day-to-day. How would you describe them to someone unfamiliar?'
          },
          {
            type: 'vocabulary',
            words: [
              { word: 'stack', phonetic: '/stæk/', meaning: '(n) The combination of technologies used to build something', example: 'Our stack is React, Node, and PostgreSQL.', techNote: '"Tech stack" or just "stack" — the collection of tools you use together' },
              { word: 'I work with', phonetic: '/aɪ wɜːk wɪð/', meaning: '(phrase) To describe your regular tools/languages', example: 'I work with TypeScript on the frontend.', techNote: '"Work with" sounds more natural and professional than just "I use"' },
              { word: 'framework', phonetic: '/ˈfreɪm.wɜːk/', meaning: '(n) A pre-built structure that helps you build software faster', example: 'React is a JavaScript framework for building UIs.', techNote: 'Technically React is a library, but "framework" is commonly (if loosely) used' },
              { word: 'I\'m comfortable with', phonetic: '/aɪm ˈkʌm.fər.tə.bəl wɪð/', meaning: '(phrase) I know it well and can use it confidently', example: 'I\'m comfortable with Python and Docker.', techNote: 'A great phrase for job interviews — honest and professional' },
              { word: 'I\'m learning', phonetic: '/aɪm ˈlɜːr.nɪŋ/', meaning: '(phrase) A technology you are currently studying', example: 'I\'m currently learning Kubernetes.', techNote: 'Showing you\'re learning is a positive in tech — the industry respects growth mindset' }
            ]
          },
          {
            type: 'explanation',
            title: 'How to talk about your tech stack fluently',
            content: '<p>In tech conversations, being able to describe your stack clearly is essential. Here\'s a framework to answer the question "What do you use?" in any situation:</p><p><strong>Structure your answer:</strong></p><ol><li><strong>Language(s):</strong> "I mainly work with JavaScript/TypeScript."</li><li><strong>Frontend (if applicable):</strong> "On the frontend, I use React."</li><li><strong>Backend (if applicable):</strong> "On the backend, I work with Node.js and Express."</li><li><strong>Database:</strong> "For the database, we use PostgreSQL."</li><li><strong>Tools/Other:</strong> "We deploy to AWS and use Docker for containerization."</li></ol><p><strong>Key distinction:</strong> Use <em>"I work with"</em> for things you know well, and <em>"I\'m learning"</em> for things in progress. This is honest and shows self-awareness.</p>'
          },
          {
            type: 'tech-example',
            title: 'Technical interview — Stack questions',
            scenario: 'You\'re in a technical interview. The interviewer asks about your experience. This is how a strong candidate responds:',
            dialogue: [
              { speaker: 'Interviewer', text: 'Can you walk me through your tech stack? What have you been working with recently?' },
              { speaker: 'You', text: 'Sure. My main language is TypeScript. On the frontend, I work with React — I\'ve been building component libraries and working with state management using Zustand. On the backend, I use Node.js with NestJS. And for the database, I\'ve been working mostly with PostgreSQL through Prisma.', isYou: true },
              { speaker: 'Interviewer', text: 'Nice. And what about testing?' },
              { speaker: 'You', text: 'For unit and integration tests, I use Vitest. For end-to-end tests, I work with Playwright. I\'m also comfortable with CI/CD — we use GitHub Actions in my current role.', isYou: true },
              { speaker: 'Interviewer', text: 'Great. Any technologies you\'re currently learning?' },
              { speaker: 'You', text: 'I\'m currently learning Kubernetes. I understand Docker well, and I want to get more comfortable with orchestration.', isYou: true }
            ],
            tip: '"Walk me through" is a very common interview phrase. It means: "explain step by step". You\'ll hear it constantly.'
          },
          {
            type: 'speaking',
            prompt: 'Describe your tech stack in English as if you were answering an interview question. Cover: languages, frontend tools, backend tools, databases, testing, and anything you\'re currently learning.',
            tip: 'Use the structure from the explanation: language → frontend → backend → database → tools → learning.',
            example: '"My main language is JavaScript. On the frontend, I work with React. For the backend, I use Node.js. I\'m comfortable with MongoDB, and I\'m currently learning TypeScript to improve my code quality."'
          },
          {
            type: 'quiz',
            questions: [
              {
                question: 'Which phrase is best for describing a technology you know VERY WELL?',
                options: [
                  { text: 'I\'m learning React.', correct: false },
                  { text: 'I\'m comfortable with React.', correct: true },
                  { text: 'I like React.', correct: false },
                  { text: 'I know about React.', correct: false }
                ],
                explanation: '"I\'m comfortable with" signals professional-level proficiency. "I\'m learning" means you\'re still studying it. "I like" is a preference, not a skill claim. "I know about" is too vague.'
              },
              {
                question: 'What does "walk me through" mean in a technical interview?',
                options: [
                  { text: 'Give me a brief, one-sentence answer.', correct: false },
                  { text: 'Explain step by step.', correct: true },
                  { text: 'Write code on the whiteboard.', correct: false },
                  { text: 'Show me your portfolio.', correct: false }
                ],
                explanation: '"Walk me through [something]" = explain it step by step. It\'s an invitation to give a detailed, organized explanation. Common: "Walk me through your experience", "Walk me through this code."'
              },
              {
                question: 'Which is the MOST professional way to answer "What\'s your stack?"',
                options: [
                  { text: 'I know everything — React, Node, Python, Java, Go, Rust...', correct: false },
                  { text: 'I mainly work with TypeScript. Frontend: React. Backend: Node.js with NestJS. Database: PostgreSQL.', correct: true },
                  { text: 'I use computers and write code for apps.', correct: false },
                  { text: 'It depends on the project.', correct: false }
                ],
                explanation: 'The structured answer (language → frontend → backend → database) is clear, organized, and impressive. Claiming to know everything is a red flag. Being vague ("it depends") without specifics is unhelpful.'
              }
            ]
          }
        ]
      },

      {
        id: 'L1.M1.L4',
        title: "The Daily Standup",
        subtitle: 'Speaking in team meetings every day',
        difficulty: 'beginner',
        duration: 15,
        xpReward: 75,
        sections: [
          {
            type: 'warmup',
            prompt: 'Your team has a daily standup in English. Today you need to tell the team: you finished the login page yesterday, today you\'ll work on the API integration, and you have a blocker — you\'re waiting for the design file. How would you say this?',
            tip: 'Think about past tense (what you did) vs present/future (what you\'re doing today).'
          },
          {
            type: 'vocabulary',
            words: [
              { word: 'blocker', phonetic: '/ˈblɒk.ər/', meaning: '(n) Something that prevents you from progressing', example: 'I have a blocker — I\'m waiting for API credentials.', techNote: 'Essential standup vocabulary. Also used as verb: "I\'m blocked on this ticket"' },
              { word: 'yesterday I...', phonetic: '/ˈjes.tə.deɪ/', meaning: '(phrase) Past tense report of what you accomplished', example: 'Yesterday I finished the user auth module.', techNote: 'Use simple past: finished, deployed, reviewed, fixed, merged' },
              { word: 'today I\'m going to...', phonetic: '/tʊˈdeɪ/', meaning: '(phrase) Your plan for today', example: 'Today I\'m going to work on the dashboard component.', techNote: '"Going to" for plans is more natural than "will" in spoken English' },
              { word: 'waiting on', phonetic: '/ˈweɪ.tɪŋ ɒn/', meaning: '(phrasal verb) Waiting for someone/something before you can continue', example: 'I\'m waiting on the design team for the mockup.', techNote: 'More dynamic than "waiting for" — implies urgency and dependency' },
              { word: 'to wrap up', phonetic: '/ræp ʌp/', meaning: '(phrasal verb) To finish / to conclude', example: 'I\'m going to wrap up the PR today.', techNote: 'Very common in tech: "Let\'s wrap up this meeting", "I need to wrap up this feature"' }
            ]
          },
          {
            type: 'explanation',
            title: 'The three standup questions',
            content: '<p>Daily standups (also called "dailies" or "scrums") follow a simple 3-question format:</p><ol><li><strong>What did you do yesterday?</strong> — Use <em>simple past</em>: worked, fixed, reviewed, deployed, merged, created.</li><li><strong>What are you doing today?</strong> — Use <em>"going to"</em> or <em>present continuous</em>: "I\'m going to fix...", "I\'m working on..."</li><li><strong>Do you have any blockers?</strong> — Be specific: "I\'m blocked on X because Y" or "No blockers."</li></ol><p><strong>Common standup verbs:</strong></p><ul><li><em>finished / completed</em> — 100% done</li><li><em>reviewed</em> — looked at someone else\'s code</li><li><em>deployed</em> — sent to production/staging</li><li><em>merged</em> — combined code branches</li><li><em>picked up</em> — started working on a new ticket</li><li><em>handed off</em> — passed work to someone else</li></ul><p><strong>Keep it short!</strong> Standups should be under 2 minutes per person. If there\'s more to discuss, say "let\'s take it offline" (meaning: let\'s discuss separately).</p>'
          },
          {
            type: 'tech-example',
            title: 'Full standup — Engineering team',
            scenario: 'A real standup on a Monday morning. Five devs, remote team, all in English:',
            dialogue: [
              { speaker: 'Priya (Lead)', text: 'Let\'s do standups. Marcus, you start.' },
              { speaker: 'Marcus', text: 'Sure. Last week I finished the payment integration and deployed to staging. Today I\'m going to review the PRs that are pending review. No blockers.' },
              { speaker: 'Chen', text: 'I spent yesterday debugging the auth issue — finally found the root cause. Today I\'m going to open the PR. My only blocker is I need someone to review it urgently so we can merge before Thursday.' },
              { speaker: 'You', text: 'Yesterday I finished the dashboard layout and connected it to the API. Today I\'m going to write the unit tests and work on the mobile responsiveness. I\'m waiting on design for the empty state screen — that\'s my only blocker.', isYou: true },
              { speaker: 'Priya (Lead)', text: 'Good. I\'ll ping the design team about that. Let\'s take the auth issue offline after standup, Chen.' }
            ],
            tip: '"Take it offline" is a key phrase — it means "let\'s discuss this separately, not in front of everyone". You\'ll hear it in every tech meeting.'
          },
          {
            type: 'speaking',
            prompt: 'Write your standup update for today in English. Answer all three questions: (1) What did you do yesterday? (2) What are you doing today? (3) Any blockers? Use real or invented work.',
            tip: 'Keep it under 5 sentences total. Real standups are short. Use the vocabulary from this lesson.',
            example: '"Yesterday I finished writing the API integration tests. Today I\'m going to work on the error handling for the payment flow. I\'m blocked on the Stripe API credentials — I\'m waiting on DevOps to give me access."'
          },
          {
            type: 'quiz',
            questions: [
              {
                question: 'In a standup, which tense do you use to talk about what you did YESTERDAY?',
                options: [
                  { text: 'Present: "I finish the login page."', correct: false },
                  { text: 'Past: "I finished the login page."', correct: true },
                  { text: 'Future: "I will finish the login page."', correct: false },
                  { text: 'Perfect: "I have finishing the login page."', correct: false }
                ],
                explanation: 'Simple past (finished, worked, fixed, reviewed) is used for completed actions. "I have finishing" is grammatically wrong. Use simple past for yesterday\'s accomplishments.'
              },
              {
                question: 'What does "I\'m blocked" mean in a standup?',
                options: [
                  { text: 'I have finished my work for the day.', correct: false },
                  { text: 'Something is preventing me from moving forward.', correct: true },
                  { text: 'I don\'t understand the task.', correct: false },
                  { text: 'I refuse to do this task.', correct: false }
                ],
                explanation: '"I\'m blocked" (or "I have a blocker") means something external is stopping your progress — waiting for someone, missing access, unclear requirements, etc.'
              },
              {
                question: 'What does "let\'s take it offline" mean?',
                options: [
                  { text: 'Let\'s disconnect from the video call.', correct: false },
                  { text: 'Let\'s stop working for the day.', correct: false },
                  { text: 'Let\'s discuss this separately, after the meeting.', correct: true },
                  { text: 'Let\'s delete this from the agenda.', correct: false }
                ],
                explanation: '"Take it offline" = discuss separately after (or outside of) the current meeting. It keeps the standup short and focused.'
              }
            ]
          }
        ]
      },

      {
        id: 'L1.M1.L5',
        title: "Code Review Talk",
        subtitle: 'Giving and receiving feedback professionally',
        difficulty: 'beginner',
        duration: 20,
        xpReward: 100,
        sections: [
          {
            type: 'warmup',
            prompt: 'You\'re reviewing a colleague\'s code and you notice a problem — they\'re not handling errors in an API call. How would you mention this in a code review comment in English? What\'s the best way to say it without sounding rude?',
            tip: 'Think about the difference between "This is wrong" and "This might cause issues if..."'
          },
          {
            type: 'vocabulary',
            words: [
              { word: 'LGTM', phonetic: '/ˌel.dʒiː.tiːˈem/', meaning: '(acronym) Looks Good To Me — approval of a pull request', example: 'LGTM! Great work on the error handling.', techNote: 'Most commonly used as-is. Sometimes written as "lgtm" in casual reviews' },
              { word: 'nit', phonetic: '/nɪt/', meaning: '(n) Nitpick — a very small, minor suggestion (not blocking)', example: 'Nit: you could rename this variable for clarity.', techNote: 'Prefix your minor comments with "Nit:" to signal it\'s optional and not blocking merge' },
              { word: 'blocking', phonetic: '/ˈblɒk.ɪŋ/', meaning: '(adj) A comment that must be resolved before merge', example: 'This is blocking — the API call has no error handling.', techNote: 'Opposite of "nit". Use sparingly for real issues.' },
              { word: 'suggestion', phonetic: '/səˈdʒɛs.tʃən/', meaning: '(n) An idea for improvement (not mandatory)', example: 'Suggestion: we could extract this into a utility function.', techNote: 'Prefix with "Suggestion:" to make clear it\'s optional, not required' },
              { word: 'LGTM with nits', phonetic: '/', meaning: '(phrase) Approved, but with minor suggestions', example: 'LGTM with nits — feel free to merge if you agree.', techNote: 'A balanced review: approved, but here are some small things to consider' }
            ]
          },
          {
            type: 'explanation',
            title: 'The art of constructive code review in English',
            content: '<p>Code review comments can feel harsh in any language. In English tech culture, there are proven techniques to make feedback constructive and professional:</p><p><strong>Technique 1: Ask, don\'t tell</strong></p><p>Instead of: <em>"This is wrong."</em><br>Try: <em>"What happens if this function receives a null value here?"</em></p><p><strong>Technique 2: Say "we" not "you"</strong></p><p>Instead of: <em>"You didn\'t handle the error."</em><br>Try: <em>"We should probably add error handling here in case the API is down."</em></p><p><strong>Technique 3: Explain the WHY</strong></p><p>Instead of: <em>"Change this."</em><br>Try: <em>"This could cause a memory leak — consider using a cleanup function."</em></p><p><strong>Technique 4: Acknowledge what\'s good</strong></p><p><em>"Great solution for the caching logic. One thing I\'d consider here..."</em></p><p><strong>Classify your comments:</strong> prefix with "Nit:", "Suggestion:", "Blocking:", or "Question:" so the author knows the priority.</p>'
          },
          {
            type: 'tech-example',
            title: 'GitHub PR review — Real comments',
            scenario: 'A PR review thread on GitHub. Notice how feedback is phrased professionally:',
            dialogue: [
              { speaker: 'Chen (reviewer)', text: 'The overall approach here is really clean — nice work refactoring this. A couple of things:' },
              { speaker: 'Chen (reviewer)', text: 'Blocking: Line 47 — this API call has no try/catch. If the network fails, this will throw an unhandled rejection. We need error handling before we can merge.' },
              { speaker: 'Chen (reviewer)', text: 'Nit: Line 23 — `data2` isn\'t very descriptive. Maybe `filteredResults` or `userList`? Up to you.' },
              { speaker: 'Chen (reviewer)', text: 'Question: Line 89 — why are we doing a full reload here instead of just updating the state? Is there a reason for that?' },
              { speaker: 'You', text: 'Thanks for the review! Fixed the error handling on line 47. Renamed the variable as suggested — good call. The reload on line 89 is intentional — there\'s a race condition with the cache that I haven\'t solved yet. Happy to discuss if you have ideas.', isYou: true },
              { speaker: 'Chen (reviewer)', text: 'Perfect. LGTM with the fixes. Let\'s chat about the cache issue in the next sync.' }
            ],
            tip: 'Notice "Up to you" — this signals the suggestion is truly optional, not hidden criticism. Use it to soften nits.'
          },
          {
            type: 'speaking',
            prompt: 'Write 3 code review comments in English for the following situation: You\'re reviewing a PR that has: (1) missing error handling on an API call, (2) a variable named "x" that should be more descriptive, and (3) a clever use of memoization you want to praise. Make each comment constructive and professional.',
            tip: 'Use the techniques from the lesson: ask questions, use "we", explain the why, classify your comments (Blocking/Nit/Suggestion).',
            example: 'Blocking: "What happens if this API call fails? We should wrap this in a try/catch to handle network errors gracefully."\nNit: "The variable name `x` isn\'t very descriptive here — maybe `userId` or `selectedItem`? Makes it easier to read later."\n"Great use of useMemo here — this will definitely prevent unnecessary re-renders on the list."'
          },
          {
            type: 'quiz',
            questions: [
              {
                question: 'What does "LGTM" mean in a code review?',
                options: [
                  { text: 'Let\'s Get The Merge', correct: false },
                  { text: 'Looks Good To Me — I approve this PR', correct: true },
                  { text: 'Leave Good Technical Marks', correct: false },
                  { text: 'Let\'s Go To Main', correct: false }
                ],
                explanation: 'LGTM = "Looks Good To Me". It\'s the standard way to signal approval of a pull request in code review. It\'s been used in tech for decades.'
              },
              {
                question: 'Which code review comment is MOST constructive?',
                options: [
                  { text: '"This code is bad and wrong."', correct: false },
                  { text: '"You made a mistake here."', correct: false },
                  { text: '"What happens if this receives a null value? We might want to add a guard here."', correct: true },
                  { text: '"Don\'t do it like this."', correct: false }
                ],
                explanation: 'The best comment asks a question ("What happens if...") and suggests rather than demands ("we might want to..."). It identifies the risk without attacking the author.'
              },
              {
                question: 'You prefix a review comment with "Nit:". What does this signal?',
                options: [
                  { text: 'This is a critical bug that must be fixed before merge.', correct: false },
                  { text: 'This is a very minor, optional suggestion.', correct: true },
                  { text: 'This is a question you need answered.', correct: false },
                  { text: 'This is praise for good code.', correct: false }
                ],
                explanation: '"Nit:" (short for nitpick) signals the comment is very minor and optional — the PR can be merged even if the author disagrees with the suggestion.'
              }
            ]
          }
        ]
      }
    ]
  };

  // ─────────────────────────────────────────────────────────
  // LEVEL 1 — MODULE 2: Daily Routine  (FULL CONTENT)
  // ─────────────────────────────────────────────────────────
  var L1M2 = {
    title: 'Daily Routine',
    description: 'Talk about your day, your schedule, and the daily rhythm of a developer\'s life in English.',
    lessons: [
      // ── L1.M2.L1 — Morning Ritual ────────────────────────
      {
        id: 'L1.M2.L1',
        title: 'Morning Ritual',
        subtitle: 'Starting your workday in English',
        difficulty: 'beginner',
        duration: 15,
        xpReward: 75,
        sections: [
          {
            type: 'warmup',
            prompt: 'Think about the first 30 minutes of your workday. What do you do? Now try to describe it in English — even if it\'s just a few words or phrases.',
            tip: 'Don\'t worry about grammar yet — just think about the actions: check, open, read, write, start.'
          },
          {
            type: 'vocabulary',
            words: [
              { word: 'log in / sign in', phonetic: '/lɒɡ ɪn/', meaning: '(phrasal verb) To access a system with your credentials', example: 'I log in to Slack first thing in the morning.', techNote: '"Log in" (verb) vs "login" (noun): "My login failed" vs "I need to log in"' },
              { word: 'catch up', phonetic: '/kætʃ ʌp/', meaning: '(phrasal verb) To review what happened while you were away', example: 'I spend 10 minutes catching up on Slack messages.', techNote: 'Very natural in async teams: "I\'m catching up on the thread from yesterday"' },
              { word: 'pull', phonetic: '/pʊl/', meaning: '(v) To download the latest code from a remote repository', example: 'Every morning I pull from main before starting work.', techNote: 'Short for "git pull". Also used metaphorically: "pull the latest updates"' },
              { word: 'check in', phonetic: '/tʃɛk ɪn/', meaning: '(phrasal verb) To let your team know you\'re online and available', example: 'I check in on Slack when I start my day.', techNote: 'Different from "check" alone — "check in" implies announcing your presence to the team' },
              { word: 'set up', phonetic: '/sɛt ʌp/', meaning: '(phrasal verb) To prepare and configure something before using it', example: 'I set up my environment every morning.', techNote: '"Setup" (noun): "The setup took 10 minutes." "Set up" (verb): "I set up Docker."' }
            ]
          },
          {
            type: 'explanation',
            title: 'How developers talk about starting their day',
            content: '<p>In English-speaking tech teams, your morning routine involves specific verbs and phrases that are used consistently. Knowing them makes you sound natural and fluent in team conversations.</p><p><strong>Morning verbs in tech:</strong></p><ul><li><em>pull</em> — Pull the latest changes: "I pulled main and there were 3 new commits."</li><li><em>check</em> — Review something: "I checked my messages / I checked the pipeline."</li><li><em>catch up</em> — Read what you missed: "Catching up on the thread from yesterday."</li><li><em>set up</em> — Configure your environment: "I set up the dev server."</li><li><em>kick off</em> — Start something: "Let\'s kick off the day with the standup."</li></ul><p><strong>Common morning Slack messages:</strong></p><ul><li><em>"Morning everyone! 👋 Catching up now."</em></li><li><em>"Good morning! Just pulled — looks like the pipeline is green. 🟢"</em></li><li><em>"GM! Heads down on the auth bug this morning."</em></li></ul><p><strong>Note:</strong> "GM" is a very common shorthand for "Good morning" in async tech teams.</p>'
          },
          {
            type: 'tech-example',
            title: 'Slack — Monday morning check-in',
            scenario: 'It\'s Monday morning. The team is async. This is what the general channel looks like:',
            dialogue: [
              { speaker: 'Ana (Lead)', text: 'Good morning team! Hope everyone had a good weekend. Standup in 20 min. 🚀' },
              { speaker: 'Marcus', text: 'GM! Pulled main — looks like Chen merged the auth fix over the weekend. Nice work 🙌' },
              { speaker: 'Chen', text: 'Morning! Yeah, pushed it Saturday. Should be in staging now. Can someone verify?' },
              { speaker: 'You', text: 'GM everyone! Just catching up on the thread. I\'ll check staging now and report back.', isYou: true },
              { speaker: 'Ana (Lead)', text: 'Thanks! See everyone at standup in 15.' }
            ],
            tip: '"GM" = Good Morning. "Heads down" = focused, not available for chat. "Report back" = I\'ll come back with the result. All very common in async remote teams.'
          },
          {
            type: 'speaking',
            prompt: 'Write a Slack message for your team describing how you started your workday today (real or imagined). Include: a greeting, what you did first, and what you\'re about to work on.',
            tip: 'Keep it short and natural — 2-3 sentences max. This is casual chat, not formal writing.',
            example: '"GM team! Just caught up on yesterday\'s messages. Pulling main now and then I\'ll start on the payment validation bug. See everyone at standup! 🙌"'
          },
          {
            type: 'quiz',
            questions: [
              {
                question: 'What does "I\'m catching up" mean in a work context?',
                options: [
                  { text: 'I\'m running fast to meet someone.', correct: false },
                  { text: 'I\'m reviewing messages and updates I missed.', correct: true },
                  { text: 'I\'m finishing my work early.', correct: false },
                  { text: 'I\'m following someone\'s progress.', correct: false }
                ],
                explanation: '"Catch up" in a work context means reviewing what happened while you were away — reading unread messages, checking notifications, getting up to speed on a thread or project.'
              },
              {
                question: 'Which sentence correctly uses "pull" in a developer context?',
                options: [
                  { text: 'I pull my coffee every morning.', correct: false },
                  { text: 'I always pull the latest code before starting work.', correct: true },
                  { text: 'I pull my team at 9am.', correct: false },
                  { text: 'Let\'s pull this meeting.', correct: false }
                ],
                explanation: '"Pull" in dev context = running `git pull` to get the latest code from the remote repository. "Pull the latest code", "pull from main", "pull the branch" are all correct uses.'
              },
              {
                question: 'A colleague sends "GM, heads down this morning." What does "heads down" mean?',
                options: [
                  { text: 'They are sleeping.', correct: false },
                  { text: 'They are focused on work and not available for chat.', correct: true },
                  { text: 'They are in a meeting.', correct: false },
                  { text: 'They are looking at the floor.', correct: false }
                ],
                explanation: '"Heads down" is idiomatic for "I\'m deeply focused on work, please don\'t interrupt me unless it\'s urgent." Very common in tech teams to set expectations for availability.'
              }
            ]
          }
        ]
      },

      // ── L1.M2.L2 — Time Management Vocabulary ────────────
      {
        id: 'L1.M2.L2',
        title: 'Time Management Vocabulary',
        subtitle: 'Deadlines, priorities, and urgency in English',
        difficulty: 'beginner',
        duration: 15,
        xpReward: 75,
        sections: [
          {
            type: 'warmup',
            prompt: 'Your lead sends you a Slack message: "Hey, can you have that feature ready by EOD? It\'s high priority — the client is waiting." What does "EOD" mean? And how would you respond?',
            tip: 'Think about the abbreviations you\'ve seen in work messages. EOD, ASAP, EOM — what do they stand for?'
          },
          {
            type: 'vocabulary',
            words: [
              { word: 'EOD', phonetic: '/iː.əʊˈdiː/', meaning: '(acronym) End of Day — by the end of the current working day', example: 'I need the PR ready by EOD.', techNote: 'Also: "EOP" = End of Play (British). In global teams, always clarify timezone when using EOD!' },
              { word: 'ASAP', phonetic: '/ˌeɪ.sæp/', meaning: '(acronym) As Soon As Possible — urgent, needs to be done quickly', example: 'Can you review this ASAP? We\'re blocked.', techNote: 'Spoken as "ay-sap" not spelled out. A-S-A-P is also acceptable but less common in speech.' },
              { word: 'priority', phonetic: '/praɪˈɒr.ɪ.ti/', meaning: '(n) The level of importance or urgency of a task', example: 'This bug is top priority — it\'s affecting production.', techNote: 'Common levels: "top priority / high priority / low priority / P1 / P2 / P3"' },
              { word: 'deadline', phonetic: '/ˈdɛd.laɪn/', meaning: '(n) The date or time by which something must be completed', example: 'The deadline for the feature is Friday EOD.', techNote: 'Always firmer than "due date" — missing a deadline usually has consequences' },
              { word: 'bandwidth', phonetic: '/ˈbænd.wɪdθ/', meaning: '(n) Availability / capacity to take on work (not just internet)', example: 'I don\'t have the bandwidth to take on a new ticket right now.', techNote: 'Tech slang adopted from networking. "I don\'t have bandwidth" = "I\'m at capacity, I can\'t do more"' }
            ]
          },
          {
            type: 'explanation',
            title: 'Tech time vocabulary — what every developer needs to know',
            content: '<p>Time pressure is constant in tech. Knowing how to talk about urgency, deadlines, and capacity fluently will make you sound like a seasoned professional in any international team.</p><p><strong>Common time acronyms:</strong></p><ul><li><em>EOD</em> — End of Day</li><li><em>EOM</em> — End of Month</li><li><em>EOW</em> — End of Week</li><li><em>ASAP</em> — As Soon As Possible</li><li><em>ETA</em> — Estimated Time of Arrival (used for when something will be ready)</li></ul><p><strong>Expressing urgency:</strong></p><ul><li><em>"This is blocking us."</em> — We can\'t continue without this.</li><li><em>"This is time-sensitive."</em> — We need to do this quickly.</li><li><em>"We\'re on a tight deadline."</em> — We don\'t have much time.</li><li><em>"What\'s the ETA on this?"</em> — When will it be done?</li></ul><p><strong>Managing your own capacity:</strong></p><ul><li><em>"I don\'t have bandwidth for that right now."</em> — I\'m too busy.</li><li><em>"Let me reprioritize and get back to you."</em> — I\'ll reorganize my tasks.</li><li><em>"Can this wait until EOW?"</em> — Is Friday soon enough?</li></ul>'
          },
          {
            type: 'tech-example',
            title: 'Slack thread — Deadline negotiation',
            scenario: 'A lead needs something done urgently, but the developer needs to negotiate. This is how professionals handle it in English:',
            dialogue: [
              { speaker: 'Ana (Lead)', text: 'Hey! Quick question — any chance you can have the export feature ready by EOD today? The client demo is tomorrow morning and they specifically asked about it.' },
              { speaker: 'You', text: 'Hi Ana! I can prioritize it. Just to check — is it the full export feature or just the CSV download part? I can definitely get the CSV done by EOD, but the full feature needs at least one more day.', isYou: true },
              { speaker: 'Ana (Lead)', text: 'CSV is enough for the demo, honestly. Can you make that happen?' },
              { speaker: 'You', text: 'Absolutely. I\'ll shift my other tasks and focus on this now. ETA is around 4pm — I\'ll ping you when it\'s deployed to staging.', isYou: true },
              { speaker: 'Ana (Lead)', text: 'Perfect, thank you! That\'s exactly what I needed.' }
            ],
            tip: '"Any chance you can..." is a polite way to make an urgent request without sounding demanding. More natural than "Can you do this by EOD?" — it acknowledges the other person has other work.'
          },
          {
            type: 'speaking',
            prompt: 'Your team lead asks: "What\'s your ETA on the dashboard feature? We have a client call on Thursday." Write a realistic reply in English: give an honest timeline, mention any dependencies or risks, and offer to update them if anything changes.',
            tip: 'Use vocabulary from this lesson: ETA, EOD/EOW, priority, bandwidth. Keep it professional but direct.',
            example: '"Hi! ETA for the dashboard is Wednesday EOD, assuming the design specs are finalized today. If there are last-minute changes to the design, it might slip to Thursday morning. I\'ll flag it ASAP if that happens."'
          },
          {
            type: 'quiz',
            questions: [
              {
                question: 'A colleague says "ETA?" in a Slack message about your task. What are they asking?',
                options: [
                  { text: 'How difficult is this task?', correct: false },
                  { text: 'When will this be done?', correct: true },
                  { text: 'Do you need any help?', correct: false },
                  { text: 'Can you explain the task?', correct: false }
                ],
                explanation: 'ETA = Estimated Time of Arrival. In work contexts, it means "When will this be ready?" It\'s borrowed from logistics (when will the shipment arrive?) and used constantly in tech.'
              },
              {
                question: 'Your lead says "This is time-sensitive." What should you do?',
                options: [
                  { text: 'Check the time zone settings.', correct: false },
                  { text: 'Treat this as urgent and prioritize it.', correct: true },
                  { text: 'Work on it when you have free time.', correct: false },
                  { text: 'Ask for a deadline extension.', correct: false }
                ],
                explanation: '"Time-sensitive" means this needs to be done quickly — there\'s urgency involved. It\'s a polite but firm signal that time is running out and this should move up your priority list.'
              },
              {
                question: 'Which response is MOST professional when you can\'t take on new work?',
                options: [
                  { text: '"No, I\'m too busy."', correct: false },
                  { text: '"I don\'t have bandwidth for that right now — I\'m heads down on the payment bug. Can this wait until EOW?"', correct: true },
                  { text: '"That\'s not my job."', correct: false },
                  { text: '"Maybe later."', correct: false }
                ],
                explanation: 'The professional response explains WHY you can\'t take it (heads down on X), uses appropriate vocabulary (bandwidth), and offers an alternative timeline (EOW). It\'s a "no" that sounds like a "yes, but later."'
              }
            ]
          }
        ]
      },

      // ── L1.M2.L3 — Work from Home English ────────────────
      {
        id: 'L1.M2.L3',
        title: 'Work from Home English',
        subtitle: 'Remote work phrases every developer needs',
        difficulty: 'beginner',
        duration: 15,
        xpReward: 75,
        sections: [
          {
            type: 'warmup',
            prompt: 'You join a video call and your camera isn\'t working. The team is waiting. How would you tell everyone in English — quickly and professionally?',
            tip: 'Think about what you\'d actually type in the chat or say out loud.'
          },
          {
            type: 'vocabulary',
            words: [
              { word: 'async', phonetic: '/ˈeɪ.sɪŋk/', meaning: '(adj) Asynchronous — communication that doesn\'t require an immediate reply', example: 'We work async — you can reply when it suits you.', techNote: 'Borrowed from programming. "Async communication" = Slack, email. "Sync communication" = calls, meetings.' },
              { word: 'ping', phonetic: '/pɪŋ/', meaning: '(v) To send a quick message or notification to someone', example: 'Can you ping me when you\'re done with that?', techNote: 'Borrowed from network testing. Informal but universal: "I\'ll ping you on Slack", "ping me if you need anything"' },
              { word: 'OOO', phonetic: '/ˌəʊ.əʊˈəʊ/', meaning: '(acronym) Out of Office — not available for work', example: 'I\'ll be OOO next Monday — Marcus is covering for me.', techNote: 'Also written as "out of office". Always set an OOO auto-reply when on vacation.' },
              { word: 'on mute', phonetic: '/ɒn mjuːt/', meaning: '(phrase) Microphone is silenced on a call', example: 'You\'re on mute! We can\'t hear you.', techNote: 'One of the most common phrases in remote work history. Always check your mute before speaking.' },
              { word: 'connection issues', phonetic: '/kəˈnɛk.ʃən ˈɪʃ.uːz/', meaning: '(phrase) Problems with internet or audio/video quality on a call', example: 'Sorry, I\'m having connection issues — can you repeat that?', techNote: 'The professional phrase to use when your audio/video is cutting out. Much better than just going silent.' }
            ]
          },
          {
            type: 'explanation',
            title: 'The remote developer\'s language toolkit',
            content: '<p>Remote work has its own vocabulary. Mastering these phrases means you can handle any technical situation on a call or in a chat without awkward silences.</p><p><strong>Video call phrases:</strong></p><ul><li><em>"You\'re on mute."</em> — The most-said phrase in remote work.</li><li><em>"Can everyone hear me?"</em> — Check before talking.</li><li><em>"I\'m having some connection issues."</em> — Polite explanation for bad audio/video.</li><li><em>"Let me drop off and rejoin."</em> — Fixing connection by leaving and re-entering the call.</li><li><em>"Can you share your screen?"</em> — Asking someone to show their display.</li></ul><p><strong>Async communication phrases:</strong></p><ul><li><em>"I\'ll leave a note in the ticket."</em> — Document it for when others are online.</li><li><em>"Async is fine for this."</em> — We don\'t need a call to solve this.</li><li><em>"Let\'s sync tomorrow."</em> — Let\'s talk in real-time tomorrow.</li></ul><p><strong>Availability phrases:</strong></p><ul><li><em>"I\'ll be OOO next week."</em> — Not working, on vacation or leave.</li><li><em>"I\'m going offline now."</em> — Ending your workday / becoming unavailable.</li><li><em>"Back online."</em> — Returning after a break or lunch.</li></ul>'
          },
          {
            type: 'tech-example',
            title: 'Video call — Technical difficulties',
            scenario: 'A team call. Things go wrong — this is how the team handles it professionally:',
            dialogue: [
              { speaker: 'Ana (Lead)', text: 'Let\'s get started. Can everyone hear me okay?' },
              { speaker: 'Marcus', text: 'All good here!' },
              { speaker: 'Chen', text: 'Audio is good. Video is a little pixelated but fine.' },
              { speaker: 'You', text: 'Hey — I\'m having some connection issues. My camera is off for now. Can you hear me?', isYou: true },
              { speaker: 'Ana (Lead)', text: 'Yep, we can hear you fine. No worries about the camera.' },
              { speaker: 'You', text: 'Great, thanks. If I drop off, I\'ll rejoin immediately.', isYou: true },
              { speaker: 'Marcus', text: 'Wait — Chen, you\'re on mute! We can see you talking but can\'t hear anything.' },
              { speaker: 'Chen', text: 'Oops, sorry! Can you hear me now?' },
              { speaker: 'Ana (Lead)', text: 'Yes! Perfect. Okay, let\'s kick off...' }
            ],
            tip: '"Drop off" = leave the call accidentally or intentionally. "Rejoin" = come back. "Kick off" here means "start". These are all very natural in any video call.'
          },
          {
            type: 'speaking',
            prompt: 'It\'s your first week working with a new fully-remote international team. Write a short message to the team channel (3-4 sentences) introducing your typical schedule, your time zone, and how you prefer to communicate (async vs sync).',
            tip: 'Use vocabulary from this lesson. Real remote teams love this kind of message — it sets expectations from day one.',
            example: '"Hey team! Quick intro to my setup: I\'m in Brazil (UTC-3), so I\'m online 9am-6pm BRT. I work mostly async, so feel free to ping me on Slack and I\'ll usually respond within a couple of hours. Happy to jump on a call anytime if async isn\'t working — just give me a heads up!"'
          },
          {
            type: 'quiz',
            questions: [
              {
                question: 'Someone says "Let\'s take this async." What do they mean?',
                options: [
                  { text: 'Let\'s cancel this meeting.', correct: false },
                  { text: 'Let\'s handle this via messages instead of a live call.', correct: true },
                  { text: 'Let\'s speed this up.', correct: false },
                  { text: 'Let\'s write this in code.', correct: false }
                ],
                explanation: '"Take it async" = handle it via written communication (Slack, email, comments) instead of scheduling a synchronous meeting. Very common in distributed teams to protect focus time.'
              },
              {
                question: 'You join a meeting and your audio isn\'t working. What\'s the most professional response?',
                options: [
                  { text: 'Say nothing and wait for someone to notice.', correct: false },
                  { text: 'Type in the chat: "Having audio issues — I\'ll drop off and rejoin."', correct: true },
                  { text: 'Leave the meeting immediately without explanation.', correct: false },
                  { text: 'Turn your camera off and keep listening.', correct: false }
                ],
                explanation: 'Always communicate what\'s happening. Typing in chat is the fastest way to let the team know during audio issues. "I\'ll drop off and rejoin" tells them exactly what to expect — no mystery, no confusion.'
              },
              {
                question: 'What does "I\'ll be OOO next Friday" mean?',
                options: [
                  { text: 'I\'ll be working overtime next Friday.', correct: false },
                  { text: 'I\'ll be online at a different time next Friday.', correct: false },
                  { text: 'I won\'t be available for work next Friday.', correct: true },
                  { text: 'I\'ll be in the office next Friday.', correct: false }
                ],
                explanation: 'OOO = Out of Office. It means the person will not be working — they could be on vacation, a personal day, or public holiday. Always let your team know in advance when you\'ll be OOO.'
              }
            ]
          }
        ]
      },

      // ── L1.M2.L4 — Lunch & Breaks ─────────────────────────
      {
        id: 'L1.M2.L4',
        title: 'Lunch & Breaks',
        subtitle: 'Casual conversation outside the work context',
        difficulty: 'beginner',
        duration: 15,
        xpReward: 75,
        sections: [
          {
            type: 'warmup',
            prompt: 'A colleague messages you: "Hey, we\'re grabbing pizza for lunch — want to join?" You\'d love to, but you have a deadline in 2 hours. How would you respond in English — declining but keeping the relationship warm?',
            tip: 'Think about how you would say "no thank you" without sounding rude or cold.'
          },
          {
            type: 'vocabulary',
            words: [
              { word: 'grab (food)', phonetic: '/ɡræb/', meaning: '(v) Informal: to get or pick up food quickly', example: 'I\'m going to grab a coffee — want anything?', techNote: 'Very casual and common: "grab lunch", "grab a bite", "grab coffee". Never say "take" food in this context.' },
              { word: 'BRB', phonetic: '/biː.ɑː.ˈbiː/', meaning: '(acronym) Be Right Back — away for a moment, returning soon', example: 'BRB — stepping away for 10 minutes.', techNote: 'From old internet chat (IRC, MSN). Still widely used in Slack. Sister acronym: "AFK" = Away From Keyboard' },
              { word: 'AFK', phonetic: '/eɪ.ɛf.ˈkeɪ/', meaning: '(acronym) Away From Keyboard — not at your computer right now', example: 'Going AFK for lunch, back in an hour.', techNote: 'Gaming origin, adopted by tech teams. More casual than "OOO" — used for short absences within the day' },
              { word: 'take a break', phonetic: '/teɪk ə breɪk/', meaning: '(phrase) To stop work temporarily to rest', example: 'I\'m going to take a short break and come back fresh.', techNote: 'More formal than "BRB". Used when you want to explain you\'re stepping away intentionally to recharge.' },
              { word: 'I\'m in', phonetic: '/aɪm ɪn/', meaning: '(phrase) I want to participate / I accept the invitation', example: '"Coffee run?" "I\'m in! Get me an Americano."', techNote: 'Very casual acceptance. Opposite: "I\'m out" or "I\'ll pass" = declining. Both are friendly and natural.' }
            ]
          },
          {
            type: 'explanation',
            title: 'Building relationships through small talk',
            content: '<p>Casual conversation during breaks is NOT wasted time — it\'s relationship-building. In global remote teams, the ability to chat naturally during non-work moments is a real professional skill.</p><p><strong>Accepting an invitation:</strong></p><ul><li><em>"I\'m in! See you in 5."</em></li><li><em>"Sounds good, I could use a break."</em></li><li><em>"Absolutely — I\'ll join you."</em></li></ul><p><strong>Declining an invitation (kindly):</strong></p><ul><li><em>"I\'d love to, but I\'m heads down on a deadline. Have fun!"</em></li><li><em>"Can\'t this time — next one for sure!"</em></li><li><em>"I\'ll pass today, but save me a slice! 🍕"</em></li></ul><p><strong>Announcing you\'re stepping away:</strong></p><ul><li><em>"BRB — grabbing coffee."</em></li><li><em>"AFK for lunch, back around 1pm."</em></li><li><em>"Stepping away for a bit — feel free to ping, I\'ll respond when I\'m back."</em></li></ul><p><strong>Common lunch small talk topics:</strong></p><ul><li>Weekend plans / what you did over the weekend</li><li>What you\'re eating (food is universally safe)</li><li>A show or movie you\'re watching</li><li>Sports (if applicable to the team)</li><li>A fun tech project or article you saw</li></ul>'
          },
          {
            type: 'tech-example',
            title: 'Slack thread — The lunch invite',
            scenario: 'It\'s 12:15pm. The team is remote. Someone starts a lunch thread in the #general channel:',
            dialogue: [
              { speaker: 'Marcus', text: 'Anyone up for a virtual lunch? We can just hop on a call and eat together. No agenda, just chat. 🍕' },
              { speaker: 'Chen', text: 'I\'m in! Give me 5 minutes to grab food.' },
              { speaker: 'Ana (Lead)', text: 'Love this idea. Joining in 10!' },
              { speaker: 'You', text: 'I\'d love to but I\'m heads down on the PR — deadline is 2pm. Next time for sure! Have a good lunch everyone 😊', isYou: true },
              { speaker: 'Marcus', text: 'No worries! We\'ll catch you next time. Good luck with the PR! 💪' },
              { speaker: 'You', text: 'Thanks! I\'ll be AFK from about 2:30 — grabbing food after I push this. BRB then! 🍕', isYou: true }
            ],
            tip: '"No agenda" = the meeting has no work purpose, it\'s just social. This is actually a valuable signal in tech culture — it shows someone values the human connection, not just productivity.'
          },
          {
            type: 'speaking',
            prompt: 'It\'s Friday afternoon. Your team finishes the sprint successfully. A colleague starts a thread: "Sprint done! Anyone want to do a virtual happy hour at 5pm? Just chat, no work talk." Write TWO responses: one accepting and one declining — both warm and natural.',
            tip: 'The decline should still feel friendly. Use phrases like "next time", "have fun", or a reason that\'s relatable.',
            example: 'Accepting: "I\'m in! 🎉 That sprint was intense — definitely deserve a break. See everyone at 5!"\nDeclining: "I\'d love to but I have a dinner with family tonight. Have a great time — you all killed it this sprint! 🔥"'
          },
          {
            type: 'quiz',
            questions: [
              {
                question: 'Your colleague says "I\'m grabbing lunch, BRB." What does this mean?',
                options: [
                  { text: 'They are leaving the company.', correct: false },
                  { text: 'They are getting food and will return shortly.', correct: true },
                  { text: 'They are finishing their work for the day.', correct: false },
                  { text: 'They need help with something urgently.', correct: false }
                ],
                explanation: '"Grabbing lunch" = getting/picking up food. "BRB" = Be Right Back. Together: "I\'m going to get lunch and I\'ll be back soon." Very common in async Slack teams.'
              },
              {
                question: 'Which response best declines a lunch invitation while keeping the relationship warm?',
                options: [
                  { text: '"No."', correct: false },
                  { text: '"I can\'t."', correct: false },
                  { text: '"I\'d love to, but I\'m on a deadline today. Next time for sure — have fun!"', correct: true },
                  { text: '"I don\'t eat lunch."', correct: false }
                ],
                explanation: 'A warm decline explains briefly why you can\'t go, commits to a future opportunity ("next time"), and shows you still value the relationship ("have fun!"). One-word answers feel cold in English-speaking cultures.'
              },
              {
                question: 'What\'s the difference between "BRB" and "OOO"?',
                options: [
                  { text: 'BRB is for morning, OOO is for evening.', correct: false },
                  { text: 'BRB = short absence (minutes/hours), OOO = longer absence (full day or more).', correct: true },
                  { text: 'BRB is professional, OOO is casual.', correct: false },
                  { text: 'There is no difference — they mean the same thing.', correct: false }
                ],
                explanation: 'BRB (Be Right Back) = stepping away briefly, back very soon. OOO (Out of Office) = not working today or for several days — vacation, sick day, or personal leave. Using them correctly sets accurate expectations.'
              }
            ]
          }
        ]
      },

      // ── L1.M2.L5 — End of Day ─────────────────────────────
      {
        id: 'L1.M2.L5',
        title: 'End of Day — Wrapping Up',
        subtitle: 'Closing your workday professionally in English',
        difficulty: 'beginner',
        duration: 15,
        xpReward: 100,
        sections: [
          {
            type: 'warmup',
            prompt: 'It\'s 6pm and you\'re signing off for the day. You want to let your team know what you accomplished today, what\'s still in progress, and when you\'ll be back. How would you write that in a Slack message?',
            tip: 'This is called an "EOD update" — End of Day message. What would yours say?'
          },
          {
            type: 'vocabulary',
            words: [
              { word: 'signing off', phonetic: '/ˈsaɪ.nɪŋ ɒf/', meaning: '(phrase) Ending your workday and going offline', example: 'Signing off for today — see everyone tomorrow!', techNote: '"Sign off" (verb) vs "sign-off" (noun, as in approval). "I\'m signing off" = I\'m done for the day. "I need your sign-off" = I need your approval.' },
              { word: 'pick up tomorrow', phonetic: '/pɪk ʌp/', meaning: '(phrase) Continue unfinished work the next day', example: 'Left the PR half done — I\'ll pick it up tomorrow.', techNote: 'Very natural alternative to "continue" or "resume". Also used to resume conversations: "Let\'s pick this up tomorrow."' },
              { word: 'good progress', phonetic: '/ɡʊd ˈprɒɡ.rɛs/', meaning: '(phrase) Satisfactory advancement toward a goal', example: 'Made good progress on the auth module today.', techNote: 'Slightly understated but positive. "Great progress" is stronger. Both are common in EOD updates.' },
              { word: 'in review', phonetic: '/ɪn rɪˈvjuː/', meaning: '(phrase) Submitted and waiting for someone else to review it', example: 'PR is in review — waiting on Chen.', techNote: 'Jira/PR status language. Other common statuses: "in progress", "blocked", "merged", "done", "testing"' },
              { word: 'handover', phonetic: '/ˈhænd.əʊ.vər/', meaning: '(n) Transferring responsibility or context to another person', example: 'Left a handover note for Ana — she\'s covering tomorrow.', techNote: 'Critical in global teams across timezones. A good handover note prevents lost context and unblocks teammates.' }
            ]
          },
          {
            type: 'explanation',
            title: 'The art of the EOD update',
            content: '<p>A good End of Day (EOD) update is one of the highest-value communication habits in remote work. It takes 2 minutes to write and saves your team hours of confusion.</p><p><strong>A great EOD update covers:</strong></p><ol><li><strong>What you completed:</strong> "Finished the login validation and pushed to staging."</li><li><strong>What\'s still in progress:</strong> "PR for the dashboard is in review — waiting on Marcus."</li><li><strong>Any blockers or handovers:</strong> "Blocked on the API credentials — pinged DevOps."</li><li><strong>When you\'re back:</strong> "Back tomorrow at 9am BRT."</li></ol><p><strong>EOD update templates:</strong></p><p>Short version:<br><em>"Wrapping up for today. Merged the auth PR ✅. Dashboard UI is in review. Back tomorrow at 9!"</em></p><p>Detailed version:<br><em>"EOD update: Shipped the onboarding flow to staging — QA can test now. Auth PR is in review (needs 2 approvals). Blocked on DB access for the reporting feature — opened a ticket for DevOps. Back at 9am CET. Good night!"</em></p><p><strong>Useful emojis in EOD updates:</strong></p><ul><li>✅ = completed/done</li><li>🔄 = in progress</li><li>🚫 = blocked</li><li>👀 = in review / watching</li></ul>'
          },
          {
            type: 'tech-example',
            title: 'Slack EOD thread — The whole team signs off',
            scenario: 'End of a Tuesday. The team posts EOD updates in #engineering:',
            dialogue: [
              { speaker: 'Marcus', text: 'EOD: Reviewed 3 PRs ✅ and merged Chen\'s auth fix. Started on the cache optimization — about 40% done, picking it up tomorrow. No blockers. Night everyone! 🌙' },
              { speaker: 'Chen', text: 'EOD: Auth fix is live in staging — Marcus can verify in the morning. Spent the afternoon on the API rate limiting. It\'s tricky, might need a sync tomorrow. Back at 9am CST.' },
              { speaker: 'You', text: 'EOD: Made good progress on the export feature — CSV download is done and deployed 🎉. The Excel export is still in progress, should finish tomorrow morning. PR is up if anyone wants an early review 👀. Signing off — back at 9am BRT!', isYou: true },
              { speaker: 'Ana (Lead)', text: 'Great work today everyone! 🙌 Marcus I\'ll check the cache PR first thing. Chen let\'s sync on rate limiting at 10am tomorrow. See you all then — good night!' }
            ],
            tip: 'Notice how each person mentions what they FINISHED, what\'s IN PROGRESS, and any needs (review, sync). This is the gold standard of async EOD updates. Your lead will love you for it.'
          },
          {
            type: 'speaking',
            prompt: 'Write your own End of Day Slack update for today. Use real or imagined work. Include: (1) what you completed, (2) what\'s still in progress, (3) any blockers or things you need from others, and (4) when you\'ll be back. Use emojis if you like!',
            tip: 'Aim for 3-5 sentences. Be specific about what\'s done — "finished X" is more useful than "did some work on X".',
            example: '"EOD: Finished the loading state for the dashboard ✅ — looks clean, pushed to staging. PR for the mobile responsiveness is in review 👀 — feedback welcome! Blocked on the dark mode design spec, waiting on the design team. Back tomorrow at 9am. Night! 🌙"'
          },
          {
            type: 'quiz',
            questions: [
              {
                question: 'What is the main purpose of an EOD update?',
                options: [
                  { text: 'To prove to your manager that you worked today.', correct: false },
                  { text: 'To keep your team informed and unblocked across time zones.', correct: true },
                  { text: 'To show off how much you accomplished.', correct: false },
                  { text: 'It\'s required by Jira automatically.', correct: false }
                ],
                explanation: 'An EOD update is about team coordination, not performance theater. In async and cross-timezone teams, it ensures teammates in other hours know what\'s done, what needs attention, and what to pick up — without needing to interrupt anyone.'
              },
              {
                question: 'Which EOD message is MOST useful to your team?',
                options: [
                  { text: '"Had a productive day! See you tomorrow."', correct: false },
                  { text: '"Signing off."', correct: false },
                  { text: '"EOD: Shipped the user settings page ✅. Form validation PR is in review. Blocked on backend API — Dev ticket #234. Back at 9am CET."', correct: true },
                  { text: '"Done for today. Worked on stuff."', correct: false }
                ],
                explanation: 'The best EOD update is specific and actionable: it names what was done, what\'s waiting for input (in review), what\'s blocked and why (with a ticket reference), and when you\'re back. Vague updates help no one.'
              },
              {
                question: '"I\'ll pick up the API refactor tomorrow." What does "pick up" mean here?',
                options: [
                  { text: 'I\'ll start a new task tomorrow.', correct: false },
                  { text: 'I\'ll resume the unfinished task tomorrow.', correct: true },
                  { text: 'I\'ll collect a file tomorrow.', correct: false },
                  { text: 'I\'ll assign it to someone else tomorrow.', correct: false }
                ],
                explanation: '"Pick up" in work context means to resume or continue something that was paused. "I\'ll pick it up tomorrow" = I\'ll continue working on this task when I return. Very natural and common in tech communication.'
              }
            ]
          }
        ]
      }
    ]
  };

  // ─────────────────────────────────────────────────────────
  // LEVEL 1 — MODULE 3: Basic Tech Vocabulary  (FULL CONTENT)
  // ─────────────────────────────────────────────────────────
  var L1M3 = {
    title: 'Basic Tech Vocabulary',
    description: 'The essential words every developer needs to communicate clearly in English — hardware, networks, files, and the terminal.',
    lessons: [
      // ── L1.M3.L1 — Hardware & Software ──────────────────────
      {
        id: 'L1.M3.L1',
        title: 'Hardware & Software',
        subtitle: 'The foundational tech vocabulary',
        difficulty: 'beginner',
        duration: 15,
        xpReward: 75,
        sections: [
          {
            type: 'warmup',
            prompt: 'Quick challenge: in English, how would you explain the difference between "hardware" and "software" to someone who has never coded? Say it out loud or write it.',
            tip: 'There\'s no perfect answer — just think of the simplest, clearest way to explain it.'
          },
          {
            type: 'vocabulary',
            words: [
              { word: 'hardware', phonetic: '/ˈhɑːdwɛr/', meaning: '(n) The physical components of a computer system', example: 'The hardware upgrade gave us 50% better performance.', techNote: 'CPU, GPU, RAM, SSD — all hardware. The machine you can touch.' },
              { word: 'software', phonetic: '/ˈsɒftwɛr/', meaning: '(n) Programs and operating information — everything that runs on hardware', example: 'We need to update the software before the demo.', techNote: 'Apps, operating systems, SDKs, frameworks — all software.' },
              { word: 'device', phonetic: '/dɪˈvaɪs/', meaning: '(n) Any hardware unit — phone, laptop, server, IoT sensor', example: 'The app must work on any device.', techNote: 'Broader than "computer". "The user\'s device" = whatever they\'re using.' },
              { word: 'run', phonetic: '/rʌn/', meaning: '(v) To execute a program or process', example: 'The tests run in about 40 seconds.', techNote: '"Run" is universal — you run code, run tests, run servers, run scripts.' },
              { word: 'crash', phonetic: '/kræʃ/', meaning: '(v/n) When a program stops working unexpectedly', example: 'The app crashed on older Android devices.', techNote: 'Don\'t say "the program broke" — say "it crashed" or "it threw an error".' }
            ]
          },
          {
            type: 'explanation',
            title: 'How tech people describe hardware and software in conversation',
            content: '<p>In day-to-day tech communication, hardware and software vocabulary comes up constantly — in bug reports, architecture discussions, and deployment conversations. The key is knowing which level you\'re operating at.</p><p><strong>Common hardware references in dev conversations:</strong></p><ul><li><em>"The build is slow because the CI server has only 2 cores."</em></li><li><em>"This only happens on physical devices, not the simulator."</em></li><li><em>"We need more RAM on the staging machine."</em></li></ul><p><strong>Common software references:</strong></p><ul><li><em>"We\'re running Node 20."</em> (runtime)</li><li><em>"The latest build broke the login flow."</em></li><li><em>"Update the SDK and rerun."</em></li></ul><p><strong>The crash vocabulary:</strong></p><ul><li>crash → sudden, unexpected failure</li><li>hang / freeze → app stops responding but doesn\'t quit</li><li>throw an error / exception → the code signals something went wrong</li><li>segfault → low-level crash (common in C/C++, Rust)</li></ul>'
          },
          {
            type: 'tech-example',
            title: 'Slack thread — Bug report from QA',
            scenario: 'QA found a crash on a specific device. Watch how the team discusses it:',
            dialogue: [
              { speaker: 'Sofia (QA)', text: 'Bug: app crashes on launch on Samsung Galaxy S10. Android 11. Doesn\'t happen on the emulator — only physical hardware.' },
              { speaker: 'Leo (Dev)', text: 'Interesting. Could be a hardware-specific rendering issue. Which software version are they running — v2.1 or the new build?' },
              { speaker: 'Sofia (QA)', text: 'New build — v2.2.0-rc1. Happened twice. Hard crash, no error log visible to the user.' },
              { speaker: 'You', text: 'I\'ll pull the crash logs from Firebase. If it\'s device-specific, we might need to run on actual hardware in CI. Let me check what devices we have provisioned.', isYou: true },
              { speaker: 'Leo (Dev)', text: 'Good call. Could also be a memory issue — S10 has less RAM than our test devices.' }
            ],
            tip: '"Hard crash" = the app completely dies. "Soft crash" = recoverable error. "Provisioned" = set up and ready to use.'
          },
          {
            type: 'speaking',
            prompt: 'Describe your current development setup in English. Include: your machine (hardware), operating system, and the main software tools you use daily. Write 3–5 sentences.',
            tip: 'Use: "I work on a...", "I run...", "My main tools are...", "The setup includes..."',
            example: '"I work on a MacBook Pro with 16GB of RAM. I run macOS Ventura and I use VS Code as my main editor. My dev stack runs on Node.js and I test everything locally with Docker before pushing. I also have a Windows VM for cross-browser testing."'
          },
          {
            type: 'quiz',
            questions: [
              { question: 'The app stopped responding but didn\'t close. What\'s the correct term?', options: ['It crashed', 'It hung / froze', 'It failed', 'It errored'], correct: 1, explanation: '"Hung" or "froze" = unresponsive but still running. "Crashed" = terminated unexpectedly.' },
              { question: 'Which of these is hardware?', options: ['Node.js', 'The operating system', 'The server\'s CPU', 'A JavaScript framework'], correct: 2, explanation: 'CPU is a physical component — hardware. Node.js, the OS, and frameworks are all software.' },
              { question: 'How do you say "executar os testes" in English?', options: ['Make the tests', 'Do the tests', 'Run the tests', 'Start the tests'], correct: 2, explanation: '"Run" is the standard verb for executing code, tests, scripts, and servers in English.' },
              { question: 'A colleague says: "It only happens on physical devices." What does this mean?', options: ['It happens on all devices', 'It happens on emulators but not real hardware', 'It happens on real hardware but not emulators', 'It\'s a software-only bug'], correct: 2, explanation: '"Physical device" = real hardware. Emulators are software simulations of devices.' }
            ]
          }
        ]
      },

      // ── L1.M3.L2 — Internet & Networks ──────────────────────
      {
        id: 'L1.M3.L2',
        title: 'Internet & Networks',
        subtitle: 'Talking about connectivity and infrastructure',
        difficulty: 'beginner',
        duration: 15,
        xpReward: 75,
        sections: [
          {
            type: 'warmup',
            prompt: 'How would you explain what an API is to a non-technical person, in English? Try in 1–2 sentences.',
            tip: 'Think of a simple analogy — restaurant menus, electrical sockets, TV remotes. What works for you?'
          },
          {
            type: 'vocabulary',
            words: [
              { word: 'server', phonetic: '/ˈsɜːvər/', meaning: '(n) A computer that provides data or services to other computers over a network', example: 'The server is down — no requests are going through.', techNote: 'Can be physical hardware OR a software process. Context matters: "web server" vs "file server".' },
              { word: 'client', phonetic: '/ˈklaɪənt/', meaning: '(n) Any app or device that makes requests to a server', example: 'The client sends a POST request with the user data.', techNote: 'In client-server model: your browser = client, backend = server.' },
              { word: 'request / response', phonetic: '/rɪˈkwɛst/ /rɪˈspɒns/', meaning: '(n) The two halves of HTTP communication', example: 'The request returned a 404 response.', techNote: 'Client sends requests, server sends responses. Always in that order.' },
              { word: 'endpoint', phonetic: '/ˈɛndpɔɪnt/', meaning: '(n) A specific URL that handles a particular request type', example: 'The /users endpoint returns a paginated list.', techNote: 'Same as "route" in many frameworks. "Hit an endpoint" = make a request to it.' },
              { word: 'latency', phonetic: '/ˈleɪtənsi/', meaning: '(n) The time delay between a request being sent and a response arriving', example: 'High latency is causing the form submission to feel slow.', techNote: 'Different from "bandwidth" (how much data). Latency = how fast. Bandwidth = how much.' }
            ]
          },
          {
            type: 'explanation',
            title: 'Network and API vocabulary in real conversations',
            content: '<p>Network vocabulary is everywhere in tech conversations — pull requests, code reviews, architecture discussions. These are the terms you\'ll hear and need to use fluently.</p><p><strong>Status codes — say them, don\'t just know them:</strong></p><ul><li><em>"I\'m getting a 401"</em> = Unauthorized</li><li><em>"Returns 200 but the body is empty"</em> = Success but no data</li><li><em>"404 on that endpoint"</em> = Not found</li><li><em>"It\'s throwing a 500"</em> = Server error</li></ul><p><strong>Common network phrases:</strong></p><ul><li><em>"The request is timing out"</em> — no response arrives in time</li><li><em>"We\'re being rate limited"</em> — too many requests in a short window</li><li><em>"The payload is too large"</em> — 413 error, data size limit exceeded</li><li><em>"CORS is blocking the request"</em> — browser security preventing cross-origin requests</li></ul><p><strong>Quick API vocabulary:</strong></p><ul><li>REST API, GraphQL, WebSocket</li><li>payload = the data body of a request</li><li>token / bearer token = auth credential</li><li>headers = metadata sent with the request</li></ul>'
          },
          {
            type: 'tech-example',
            title: 'Code review comment thread — API integration',
            scenario: 'The team is reviewing a new API integration. Read how they discuss it in English:',
            dialogue: [
              { speaker: 'Carlos (Reviewer)', text: 'The endpoint is correct, but you\'re not handling the 429 (rate limit). If the third-party API throttles us, the client will just hang.' },
              { speaker: 'You', text: 'Good catch. I\'ll add retry logic with exponential backoff. Should I also cap the number of retries at 3?', isYou: true },
              { speaker: 'Carlos (Reviewer)', text: 'Yes, and add a proper error message to the response — something like "Service temporarily unavailable. Please try again." rather than leaking the upstream error.' },
              { speaker: 'You', text: 'Makes sense. I\'ll also add a timeout on the request — currently there\'s no fallback if the server takes more than 30 seconds.', isYou: true },
              { speaker: 'Carlos (Reviewer)', text: 'Perfect. 10 seconds is the standard timeout we use. Check the API docs for their SLA.' }
            ],
            tip: '"Rate limit" = too many requests. "Throttle" = slow down / restrict. "Backoff" = wait before retrying. "SLA" = Service Level Agreement (guaranteed performance standard).'
          },
          {
            type: 'speaking',
            prompt: 'Explain to a colleague (in English) why a feature is slow. Mention: latency, the endpoint, and what you plan to investigate. Write 3–4 sentences.',
            tip: 'Use: "The issue seems to be...", "I noticed the response from...", "I\'m going to check..."',
            example: '"The checkout page feels slow — I noticed the response from the /order endpoint is taking about 4 seconds. It might be a latency issue on the server side, or the payload could be too large. I\'m going to check the request timing in DevTools and see if we can optimize the response. I\'ll also check if the database query is the bottleneck."'
          },
          {
            type: 'quiz',
            questions: [
              { question: 'The API returns a 401. What does that mean?', options: ['Not found', 'Too many requests', 'Unauthorized / not authenticated', 'Server error'], correct: 2, explanation: '401 = Unauthorized. The request lacks valid authentication credentials.' },
              { question: 'What is "latency" in networking?', options: ['How much data can be sent at once', 'The time delay between a request and response', 'The number of requests per second', 'The size of the payload'], correct: 1, explanation: 'Latency is the delay — how long it takes for a response to arrive after a request is sent.' },
              { question: 'A developer says: "We\'re being rate limited." What happened?', options: ['The server crashed', 'Too many requests were sent in a short time', 'The endpoint was not found', 'Authentication failed'], correct: 1, explanation: 'Rate limiting = the API rejected requests because too many were made in a short window (e.g., 100 requests/minute).' },
              { question: 'What is an "endpoint"?', options: ['The last line of code in a file', 'A specific URL that handles a particular request', 'The closing bracket of a function', 'The end of a deployment pipeline'], correct: 1, explanation: 'An endpoint is a specific URL route that receives and handles HTTP requests.' }
            ]
          }
        ]
      },

      // ── L1.M3.L3 — Browsers & Devices ───────────────────────
      {
        id: 'L1.M3.L3',
        title: 'Browsers & Devices',
        subtitle: 'Cross-platform vocabulary',
        difficulty: 'beginner',
        duration: 15,
        xpReward: 75,
        sections: [
          {
            type: 'warmup',
            prompt: 'Your team uses Slack. Someone writes: "It works fine on Chrome desktop but breaks on Safari mobile." What would your first question be? Write it in English.',
            tip: 'Think like a QA engineer: what do you need to know to reproduce the bug?'
          },
          {
            type: 'vocabulary',
            words: [
              { word: 'browser', phonetic: '/ˈbraʊzər/', meaning: '(n) The application used to access the web — Chrome, Firefox, Safari, Edge', example: 'I\'ll test this in all major browsers before the release.', techNote: 'Never say "internet program". Always "browser". Chrome, Safari, Firefox = browsers.' },
              { word: 'viewport', phonetic: '/ˈvjuːpɔːrt/', meaning: '(n) The visible area of the browser window where web content is displayed', example: 'On mobile the viewport is too narrow for this layout.', techNote: 'Key CSS concept: @media queries target viewport widths. "Viewport" ≠ "screen".' },
              { word: 'cross-browser', phonetic: '/krɒs ˈbraʊzər/', meaning: '(adj) Compatible with multiple browsers', example: 'We need cross-browser testing before launch.', techNote: '"Cross-browser testing" = testing in multiple browsers. "Browser compatibility" = same concept.' },
              { word: 'responsive', phonetic: '/rɪˈspɒnsɪv/', meaning: '(adj) Adapts correctly to different screen sizes and devices', example: 'The design is fully responsive — tested on phones, tablets, and desktops.', techNote: 'Not just "mobile-friendly". Responsive = fluid adaptation across all sizes.' },
              { word: 'render', phonetic: '/ˈrɛndər/', meaning: '(v) How a browser processes and displays HTML, CSS, and JS visually', example: 'The icon doesn\'t render correctly on Safari.', techNote: '"Renders" = what you see. "Render issue" = visual bug. "SSR" = Server-Side Rendering.' }
            ]
          },
          {
            type: 'explanation',
            title: 'Talking about browser and device issues in English',
            content: '<p>Browser and device vocabulary is essential in frontend development. These terms come up daily in bug reports, standup updates, and cross-team communication.</p><p><strong>How to report browser/device issues:</strong></p><ul><li><em>"It works on Chrome but not Firefox."</em></li><li><em>"The layout breaks on mobile — viewport below 768px."</em></li><li><em>"Safari doesn\'t support this CSS property."</em></li><li><em>"Reproduced on iPhone 13, iOS 16. Can\'t reproduce on Android."</em></li></ul><p><strong>Useful browser-related terms:</strong></p><ul><li>DevTools — browser developer tools (Inspect Element)</li><li>console.log → "log to console" or "check the console"</li><li>cache — stored browser data. "Clear your cache and try again"</li><li>extension — browser add-on. "Disable extensions and retry"</li><li>tab — one open page in the browser</li></ul><p><strong>Device vocabulary:</strong></p><ul><li>mobile / phone / smartphone — all mean the same device type</li><li>tablet — iPad or Android tablet</li><li>desktop — computer with a large screen</li><li>emulator — software that simulates a device</li><li>physical device — real hardware (not a simulation)</li></ul>'
          },
          {
            type: 'tech-example',
            title: 'Bug report thread — Cross-browser issue',
            scenario: 'QA filed a bug. Watch how the team investigates in English:',
            dialogue: [
              { speaker: 'Ingrid (QA)', text: 'Bug: The date picker doesn\'t render correctly on Safari. The calendar overlay is clipped — can\'t select dates from the last column. Reproduced on macOS and iOS Safari. Chrome and Firefox work fine.' },
              { speaker: 'Diego (Frontend)', text: 'Thanks. Is it only Safari 16+, or older versions too? And does it happen on mobile Safari or just desktop?' },
              { speaker: 'Ingrid (QA)', text: 'Both. iPhone 14, Safari 16.5. And MacBook on Safari 16.4. Same clip on both viewports.' },
              { speaker: 'You', text: 'I\'ll check the CSS — Safari handles overflow and z-index differently. Could be a rendering issue with the overlay. I\'ll open DevTools and test with a viewport emulator.', isYou: true },
              { speaker: 'Diego (Frontend)', text: 'Good call. Check for webkit prefixes too — Safari often needs them for newer CSS features.' }
            ],
            tip: '"Clipped" = cut off, not fully visible. "Overlay" = element displayed on top of others. "webkit prefix" = CSS prefix for Safari compatibility (e.g., -webkit-overflow).'
          },
          {
            type: 'speaking',
            prompt: 'Write a bug report comment in English for this scenario: a button is visible on desktop but disappears on mobile. Include: the browser, device, viewport size, and what you tried.',
            tip: 'Bug reports need facts, not feelings. Be specific: "Chrome 124 on Samsung S23, viewport 360px" — not "it broke on my phone".',
            example: '"Reproduced: the submit button is not visible on Chrome 124 (Android), Samsung Galaxy S23, viewport 360×800px. The button appears correctly on Chrome desktop at 1440px. Tested in responsive mode in DevTools — disappears below 480px. No console errors. Possible CSS visibility or overflow issue on mobile."'
          },
          {
            type: 'quiz',
            questions: [
              { question: 'A developer says: "It\'s a rendering issue on Safari." What does this mean?', options: ['Safari can\'t download the file', 'Safari displays something incorrectly visually', 'Safari crashed', 'Safari doesn\'t have internet'], correct: 1, explanation: '"Rendering issue" = the browser is displaying something incorrectly — a visual bug.' },
              { question: 'What is a "viewport"?', options: ['The server that delivers content', 'The device\'s physical screen', 'The visible area of the browser window', 'The browser\'s cache memory'], correct: 2, explanation: 'The viewport is the visible area of the browser window — this is what CSS media queries target.' },
              { question: 'Someone says "test cross-browser." What should you do?', options: ['Test in multiple browsers', 'Test with multiple users', 'Test on multiple servers', 'Test different fonts'], correct: 0, explanation: 'Cross-browser testing = testing in multiple browsers (Chrome, Firefox, Safari, Edge, etc.).' },
              { question: 'What\'s the difference between an emulator and a physical device?', options: ['An emulator is faster', 'An emulator is software simulating a device; physical is real hardware', 'Physical devices don\'t support all apps', 'There is no difference'], correct: 1, explanation: 'Emulator = software simulation. Physical device = actual hardware (phone, tablet). Both are used for testing.' }
            ]
          }
        ]
      },

      // ── L1.M3.L4 — Files, Folders & Paths ──────────────────
      {
        id: 'L1.M3.L4',
        title: 'Files, Folders & Paths',
        subtitle: 'File system communication in English',
        difficulty: 'beginner',
        duration: 15,
        xpReward: 75,
        sections: [
          {
            type: 'warmup',
            prompt: 'Quick challenge: how would you tell a colleague (in English) where to find a config file in your project? Give them the exact path and a short description.',
            tip: 'Think of a real file you use daily. How would you describe its location clearly to someone who has never seen your project?'
          },
          {
            type: 'vocabulary',
            words: [
              { word: 'directory', phonetic: '/dɪˈrɛktəri/', meaning: '(n) A folder in the file system — a container for files and other directories', example: 'Create a new directory for the utility functions.', techNote: '"Directory" = technical term. "Folder" = casual/UI term. Both are correct. In CLI, always say "directory".' },
              { word: 'path', phonetic: '/pɑːθ/', meaning: '(n) The full address of a file or directory in the file system', example: 'The config file is at /src/config/env.js', techNote: 'Absolute path starts from root (/). Relative path starts from current location (./). Always know the difference.' },
              { word: 'root', phonetic: '/ruːt/', meaning: '(n) The top-level directory — the starting point of the entire file system or project', example: 'Run this command from the project root.', techNote: 'In projects: root = where package.json lives. In the OS: root = / (Unix) or C:\\ (Windows).' },
              { word: 'nested', phonetic: '/ˈnɛstɪd/', meaning: '(adj) Located inside another folder or structure — at a deeper level', example: 'The component is nested inside three subdirectories.', techNote: 'Deeply nested files = bad practice in most projects. "Three levels deep" = three folders in.' },
              { word: 'extension', phonetic: '/ɪkˈstɛnʃən/', meaning: '(n) The suffix after the dot in a filename that indicates its type', example: 'Make sure to save it as a .ts extension, not .js', techNote: '.ts, .tsx, .json, .env, .md — knowing file extensions is fundamental.' }
            ]
          },
          {
            type: 'explanation',
            title: 'Talking about files and paths in tech conversations',
            content: '<p>File system vocabulary is core to daily developer communication — in code reviews, onboarding, debugging, and CLI usage. Getting comfortable with these terms makes you much clearer in any tech conversation.</p><p><strong>Describing file locations:</strong></p><ul><li><em>"The config is in the root."</em></li><li><em>"Go into the src directory, then utils, and you\'ll find it."</em></li><li><em>"It\'s at src/components/Button/index.tsx"</em> (say: "src slash components slash Button slash index dot TSX")</li><li><em>"Check the .env file — it\'s in the project root, hidden file."</em></li></ul><p><strong>How to read paths aloud:</strong></p><ul><li>/ = "slash" (Unix/Mac/Linux) or "backslash" (Windows)</li><li>. = "dot"</li><li>.. = "dot dot" (parent directory)</li><li>./ = "dot slash" (current directory)</li><li>~/ = "tilde slash" (home directory)</li></ul><p><strong>Common verbs for file operations:</strong></p><ul><li>create / create a file</li><li>delete / remove</li><li>rename</li><li>move</li><li>copy</li><li>open / read</li><li>write / save</li></ul>'
          },
          {
            type: 'tech-example',
            title: 'Onboarding Slack thread — new developer setup',
            scenario: 'A new developer joined the team. The lead is guiding them via Slack to set up the project:',
            dialogue: [
              { speaker: 'Priya (Lead)', text: 'Welcome! First step: clone the repo and go into the root directory. You\'ll find a .env.example file there — copy it and rename it to .env' },
              { speaker: 'James (New Dev)', text: 'Done! But where do I put my AWS keys? I see two config files — one in /src and one in the root.' },
              { speaker: 'You', text: 'Use the one in the root. The one in /src is for the frontend environment variables only — it has a different scope. Your AWS keys go in the root .env under AWS_ACCESS_KEY_ID.', isYou: true },
              { speaker: 'James (New Dev)', text: 'Got it. And the scripts — should I run them from the root or from /src?' },
              { speaker: 'Priya (Lead)', text: 'Always from the root. The package.json is there — all npm scripts are defined relative to that path.' }
            ],
            tip: '"Scope" here = what the file applies to. "Relative to that path" = using that location as the starting reference point.'
          },
          {
            type: 'speaking',
            prompt: 'Explain to a new team member (in English) where to find 3 important files in your project, and what each one is for. Be specific about the path.',
            tip: 'Say the path clearly: "It\'s in src/utils/helpers.ts" → "src, slash, utils, slash, helpers dot ts". Describe what each file does in one sentence.',
            example: '"There are three key files to know. First, .env in the project root — this is where all your environment variables live. Never commit this file. Second, src/config/api.ts — this exports the base URL and auth headers for our API client. And third, src/types/index.ts — this is where all our shared TypeScript types are defined. When you add a new type that\'s used in more than one file, it goes there."'
          },
          {
            type: 'quiz',
            questions: [
              { question: 'What does "run this from the project root" mean?', options: ['Run it as an admin', 'Run it from the folder where package.json is located', 'Run it from the src directory', 'Run it from your home directory'], correct: 1, explanation: 'The project root = the top-level folder of the project, where package.json (or equivalent) lives.' },
              { question: 'A colleague says the file is "two levels deep in src." Where is it?', options: ['src/file.ts', 'src/folder/file.ts', 'src/folder/subfolder/file.ts', 'file.ts at root'], correct: 2, explanation: '"Two levels deep in src" means inside two nested folders: src/folder/subfolder/file.' },
              { question: 'What is the difference between ./ and ../ in a path?', options: ['./ is root, ../ is current', './ is current directory, ../ is parent directory', './ is parent, ../ is child', 'They are the same'], correct: 1, explanation: './ = current directory (where you are now). ../ = parent directory (one level up).' },
              { question: 'You want to say the path "src/types/index.ts" aloud. How do you say it?', options: ['"source types index typescript"', '"src slash types slash index dot ts"', '"src-types-index.ts"', '"source/types/index typescript"'], correct: 1, explanation: 'Say each separator: "src slash types slash index dot ts". Slash = /, dot = .' }
            ]
          }
        ]
      },

      // ── L1.M3.L5 — Commands & Terminals ─────────────────────
      {
        id: 'L1.M3.L5',
        title: 'Commands & Terminals',
        subtitle: 'CLI vocabulary in English',
        difficulty: 'beginner',
        duration: 20,
        xpReward: 100,
        sections: [
          {
            type: 'warmup',
            prompt: 'Think about the last CLI command you ran. How would you explain what it does to a junior developer in English? Write it in 1–2 sentences.',
            tip: 'Don\'t worry about being technical — focus on what the command accomplishes, not how it works internally.'
          },
          {
            type: 'vocabulary',
            words: [
              { word: 'terminal', phonetic: '/ˈtɜːmɪnəl/', meaning: '(n) The command-line interface application where you run shell commands', example: 'Open a new terminal and run npm install.', techNote: '"Terminal", "console", "shell", "command line", "CLI" — all refer to text-based interfaces. In casual speech, all are interchangeable.' },
              { word: 'command', phonetic: '/kəˈmɑːnd/', meaning: '(n) An instruction typed into the terminal to perform an action', example: 'Run the command and check the output.', techNote: '"Run a command" (not "execute a command" in casual speech — though "execute" is also correct).' },
              { word: 'flag / option', phonetic: '/flæɡ/ /ˈɒpʃən/', meaning: '(n) A modifier added to a command to change its behavior', example: 'Use the --verbose flag to see detailed output.', techNote: '--verbose, -v, --watch, --port 3000 — these are all flags or options.' },
              { word: 'output', phonetic: '/ˈaʊtpʊt/', meaning: '(n) The text displayed in the terminal as a result of running a command', example: 'Check the output — there should be no errors.', techNote: '"stdout" (standard output) is the technical term. In conversation, always say "output".' },
              { word: 'permission', phonetic: '/pəˈmɪʃən/', meaning: '(n) Access rights that control who can read, write, or execute a file', example: 'You need to change the file permissions — run chmod first.', techNote: '"Permission denied" is one of the most common terminal errors. Understanding permissions is fundamental.' }
            ]
          },
          {
            type: 'explanation',
            title: 'How developers talk about terminal work in English',
            content: '<p>Terminal vocabulary is deeply embedded in developer communication. Whether you\'re pairing, writing documentation, or helping a colleague — knowing how to talk about CLI work in English is essential.</p><p><strong>Common CLI verbs in conversation:</strong></p><ul><li><em>run</em> — "Run npm install" / "Run the build script"</li><li><em>install</em> — "Install the dependencies"</li><li><em>execute</em> — More formal, same as run</li><li><em>spin up</em> — Start a server/container: "Spin up the Docker container"</li><li><em>kill / stop</em> — End a process: "Kill the dev server" / "Stop the container"</li><li><em>pipe</em> — Send output to another command: "Pipe it to grep"</li><li><em>grep for</em> — Search using grep: "Grep for the error message"</li></ul><p><strong>Error vocabulary in the terminal:</strong></p><ul><li><em>"Permission denied"</em> → "You don\'t have access rights"</li><li><em>"Command not found"</em> → "That tool isn\'t installed or not in your PATH"</li><li><em>"Port already in use"</em> → "Something else is running on that port"</li><li><em>"Out of memory"</em> → "Process used too much RAM"</li></ul><p><strong>Useful pattern — sharing commands with context:</strong></p><p>Instead of just: <em>"Run this: npm run build"</em></p><p>Say: <em>"Run npm run build from the project root. It compiles the TypeScript, bundles the assets, and outputs to the /dist directory. Should take about 30 seconds. If it fails, check the output for type errors — that\'s usually the culprit."</em></p>'
          },
          {
            type: 'tech-example',
            title: 'Pair programming session — debugging a CLI error',
            scenario: 'You\'re pair programming over a video call. Your colleague has an error and you\'re walking them through fixing it:',
            dialogue: [
              { speaker: 'James', text: 'I ran npm start but it\'s failing. The output says "Error: listen EADDRINUSE: address already in use :::3000"' },
              { speaker: 'You', text: 'That means something is already running on port 3000. Run this command: lsof -i :3000 — it will show you which process is using that port.', isYou: true },
              { speaker: 'James', text: 'I see a process — PID 8423. Node.js.' },
              { speaker: 'You', text: 'That\'s a leftover dev server. Kill it with: kill -9 8423. Then run npm start again.', isYou: true },
              { speaker: 'James', text: 'Killed it. Running now... it\'s up! "Listening on port 3000." Thanks!' },
              { speaker: 'You', text: 'Nice. In the future, you can also just use npm run dev:clean — it kills old processes before starting. I added that script to package.json last week.', isYou: true }
            ],
            tip: '"Kill" = end a process. "PID" = Process ID. "Leftover" = still running from before, wasn\'t properly closed. "Listening on port" = server is running and accepting connections.'
          },
          {
            type: 'speaking',
            prompt: 'Walk a colleague through running your project locally in English. Include: the commands, what each one does, and what a successful start looks like. Write 4–6 sentences.',
            tip: 'Be practical — write what you\'d actually say on a video call. Use transition phrases: "First...", "Then...", "Once that\'s done...", "You should see..."',
            example: '"First, clone the repo and go into the project directory. Then run npm install to install all dependencies — this might take a minute. Once that\'s done, copy .env.example to .env and fill in your local values. Now run npm run dev to spin up the development server. You should see \'Server running on http://localhost:3000\' in the output. If you get a port error, something else is using port 3000 — just kill that process first."'
          },
          {
            type: 'quiz',
            questions: [
              { question: 'A colleague says "spin up the container." What should you do?', options: ['Stop the Docker container', 'Start the Docker container', 'Delete the Docker container', 'Update the Docker image'], correct: 1, explanation: '"Spin up" = start/launch. "Spin down" or "tear down" = stop. "Spin up the container" = start the Docker container.' },
              { question: 'The terminal shows "command not found." What does this mean?', options: ['You typed the command wrong', 'The command is not installed or not in the PATH', 'You don\'t have permission to run the command', 'The file doesn\'t exist'], correct: 1, explanation: '"Command not found" means the shell can\'t find the program — it\'s either not installed or not in your PATH.' },
              { question: 'What is a "flag" in the context of CLI commands?', options: ['A warning message in the output', 'A modifier that changes how a command runs', 'A file with special permissions', 'An error code'], correct: 1, explanation: 'A flag (or option) modifies a command\'s behavior: --verbose, --watch, -p 8080 are all flags.' },
              { question: 'How would you tell someone to look at the terminal output after running a command?', options: ['"Look at the screen"', '"Check the result"', '"Check the output"', '"Read the command"'], correct: 2, explanation: '"Check the output" is the standard phrase — the text the terminal displays as a result of running a command.' }
            ]
          }
        ]
      }
    ]
  };

  // ─────────────────────────────────────────────────────────
  // LEVEL 1 — MODULE 4: Frontend Basics  (FULL CONTENT)
  // ─────────────────────────────────────────────────────────
  var L1M4 = {
    title: 'Frontend Basics',
    description: 'English vocabulary for talking about UI, HTML, CSS, and JavaScript with your team — from markup to layout to interaction.',
    lessons: [
      // ── L1.M4.L1 — HTML & CSS in English ─────────────────
      {
        id: 'L1.M4.L1',
        title: 'HTML & CSS in English',
        subtitle: 'Markup and styling vocabulary',
        difficulty: 'beginner',
        duration: 15,
        xpReward: 75,
        sections: [
          {
            type: 'warmup',
            prompt: 'How do you describe the difference between HTML and CSS to someone who has never coded? Try in 2 sentences in English.',
            tip: 'HTML = structure, CSS = style. Think: HTML is the skeleton, CSS is the clothes.'
          },
          {
            type: 'vocabulary',
            words: [
              { word: 'markup', phonetic: '/ˈmɑːrkʌp/', meaning: '(n) HTML code — the structure and content of a web page', example: 'The markup for this page is clean — no unnecessary nesting.', techNote: '"Markup" refers specifically to HTML tags and structure. "Code" is broader.' },
              { word: 'tag', phonetic: '/tæɡ/', meaning: '(n) An HTML element identifier enclosed in angle brackets', example: 'Wrap the heading in an h2 tag.', techNote: '"Opening tag" = <div>, "closing tag" = </div>, "self-closing" = <img />. Always use the correct terminology.' },
              { word: 'attribute', phonetic: '/ˈætrɪbjuːt/', meaning: '(n) A property set inside an HTML tag that modifies its behavior', example: 'The href attribute defines where the link goes.', techNote: 'class, id, src, href, alt, type — all attributes. "Prop" in React is the equivalent.' },
              { word: 'selector', phonetic: '/sɪˈlɛktər/', meaning: '(n) The CSS pattern that targets which HTML elements to style', example: 'Use a class selector instead of an ID — it\'s more reusable.', techNote: 'Element selector (div), class (.btn), ID (#header), pseudo (:hover). Specificity rules apply.' },
              { word: 'property', phonetic: '/ˈprɒpərti/', meaning: '(n) A CSS rule that defines what aspect of an element to style', example: 'The color property sets the text color.', techNote: 'CSS property: color, font-size, margin, padding. "Value" is what you assign: color: red.' }
            ]
          },
          {
            type: 'explanation',
            title: 'Talking about HTML and CSS in code reviews and standups',
            content: '<p>Frontend developers spend a lot of time talking about structure and styling. Knowing the correct English terms for HTML and CSS makes code reviews clearer and team communication more precise.</p><p><strong>Common HTML phrases in team conversations:</strong></p><ul><li><em>"The markup is too deeply nested."</em> — too many nested elements</li><li><em>"Add an alt attribute to the image."</em> — accessibility requirement</li><li><em>"Use a semantic tag here — article instead of div."</em> — meaningful HTML</li><li><em>"The heading hierarchy is broken — h4 after h2."</em></li></ul><p><strong>Common CSS phrases:</strong></p><ul><li><em>"The selector is too specific — it will break if we rename the class."</em></li><li><em>"Add a :hover state for the button."</em></li><li><em>"The z-index is too high — it\'s covering the dropdown."</em></li><li><em>"Use a custom property (CSS variable) instead of hardcoding the color."</em></li></ul><p><strong>Key CSS terminology:</strong></p><ul><li>rule = a selector + declaration block</li><li>declaration = property + value pair (e.g., color: red)</li><li>cascade = the order in which rules are applied</li><li>specificity = how CSS decides which rule wins when two apply</li><li>inherit = value passed down from parent element</li></ul>'
          },
          {
            type: 'tech-example',
            title: 'Code review — HTML structure and CSS issue',
            scenario: 'A junior developer submitted a PR. The reviewer is leaving comments:',
            dialogue: [
              { speaker: 'Maya (Reviewer)', text: 'The markup looks good overall, but you\'re using a div where a button tag should be — the click handler is on a div. This breaks keyboard accessibility.' },
              { speaker: 'Tom (Dev)', text: 'Oh, I see. Should I just change the tag to button and remove the role attribute?' },
              { speaker: 'Maya (Reviewer)', text: 'Yes — native button elements come with keyboard support built in. You won\'t need the role attribute anymore.' },
              { speaker: 'You', text: 'Also noticed the CSS selector for that element is using the ID — I\'d switch to a class selector for reusability. If we ever have two buttons, the ID won\'t work.', isYou: true },
              { speaker: 'Tom (Dev)', text: 'Makes sense. I\'ll update the markup and refactor the selector. Thanks for the catch!' }
            ],
            tip: '"Native elements" = built-in HTML tags with built-in browser behavior. "Keyboard accessibility" = using Tab, Enter, and Space to interact. "Refactor" = restructure without changing behavior.'
          },
          {
            type: 'speaking',
            prompt: 'Write a code review comment in English for this issue: a developer used a <span> tag with an onClick event instead of a <button> tag. Explain the problem and suggest a fix.',
            tip: 'Be constructive, not just critical. Say what\'s wrong AND what to do instead — and briefly explain why.',
            example: '"This should be a button element rather than a span with an onClick handler. Native button tags have built-in keyboard support (Tab to focus, Enter/Space to activate) and the correct ARIA role by default — no extra attributes needed. Spans are inline, non-interactive elements; using them for interactions creates accessibility issues and requires a lot of extra work to replicate what a button does for free."'
          },
          {
            type: 'quiz',
            questions: [
              { question: 'What is an "attribute" in HTML?', options: ['A CSS style rule', 'A property set inside an HTML tag', 'A JavaScript function', 'A class selector'], correct: 1, explanation: 'Attributes are set inside HTML tags: <img src="..." alt="...">. src and alt are attributes.' },
              { question: 'A reviewer says "use a semantic tag." What do they mean?', options: ['Use a shorter tag name', 'Use a tag that describes the content\'s meaning, not just its appearance', 'Use a custom CSS class', 'Use lowercase tags'], correct: 1, explanation: 'Semantic tags like <header>, <nav>, <article> describe the role of the content. <div> and <span> are non-semantic — they have no inherent meaning.' },
              { question: 'The reviewer says "the selector is too specific." What is the likely problem?', options: ['The CSS rule is loading slowly', 'The rule targets too broadly and affects other elements', 'The rule might break if the HTML structure or class names change', 'The property value is wrong'], correct: 2, explanation: 'High specificity selectors (like #id > .class > tag) are fragile — small HTML changes can break them. Lower specificity = more reusable.' },
              { question: 'What does "cascade" mean in CSS?', options: ['When elements stack vertically', 'The priority order in which CSS rules are applied', 'When a style is copied to child elements', 'When animations run in sequence'], correct: 1, explanation: 'Cascade = the rules that determine which CSS style wins when multiple rules target the same element. Order, specificity, and importance all factor in.' }
            ]
          }
        ]
      },

      // ── L1.M4.L2 — JavaScript — Talking About Logic ───────
      {
        id: 'L1.M4.L2',
        title: 'JavaScript — Talking About Logic',
        subtitle: 'Functions, variables, and logic in English',
        difficulty: 'beginner',
        duration: 15,
        xpReward: 75,
        sections: [
          {
            type: 'warmup',
            prompt: 'How would you explain a function to a non-developer in English? Not technically — just the concept. Try in 1–2 sentences.',
            tip: 'Think of a real-life analogy: a recipe, a vending machine, a light switch with input and output.'
          },
          {
            type: 'vocabulary',
            words: [
              { word: 'function', phonetic: '/ˈfʌŋkʃən/', meaning: '(n) A reusable block of code that performs a specific task', example: 'Extract this into a function — we\'re repeating the same logic in three places.', techNote: '"Function" is universal. In specific contexts: "arrow function", "callback", "async function", "method" (when inside an object/class).' },
              { word: 'variable', phonetic: '/ˈvɛəriəbəl/', meaning: '(n) A named container that holds a value', example: 'The variable stores the user\'s session token.', techNote: 'In modern JS: const (immutable binding), let (reassignable), var (legacy, function-scoped). Always specify which when discussing.' },
              { word: 'loop', phonetic: '/luːp/', meaning: '(n) Code that repeats a block of logic for each item or while a condition is true', example: 'The loop iterates over every item in the cart.', techNote: '"Iterate over" = go through each item in a collection. for...of, forEach, map, reduce — all ways to loop.' },
              { word: 'condition', phonetic: '/kənˈdɪʃən/', meaning: '(n) A boolean expression that determines which code path runs', example: 'Add a condition to check if the user is logged in before showing the dashboard.', techNote: '"Check a condition", "evaluate the condition", "the condition is truthy/falsy" — all common phrases.' },
              { word: 'return', phonetic: '/rɪˈtɜːn/', meaning: '(v/n) The value a function sends back to its caller when done', example: 'The function returns null if no user is found.', techNote: '"Early return" = returning before the end of the function to exit quickly. Common pattern to avoid deep nesting.' }
            ]
          },
          {
            type: 'explanation',
            title: 'How to talk about JavaScript logic in English',
            content: '<p>JavaScript logic vocabulary comes up constantly in code reviews, debugging sessions, and technical discussions. Using the right words makes you sound precise and professional.</p><p><strong>Describing code behavior:</strong></p><ul><li><em>"This function takes a user ID and returns the user object."</em></li><li><em>"We loop through the array and filter out invalid entries."</em></li><li><em>"If the condition is falsy, we return early."</em></li><li><em>"The callback runs after the request resolves."</em></li></ul><p><strong>Talking about bugs in logic:</strong></p><ul><li><em>"The condition is never false — it always evaluates to true."</em> → infinite loop / unexpected branch</li><li><em>"The function mutates the original array instead of returning a copy."</em></li><li><em>"The variable is undefined at this point — it hasn\'t been initialized yet."</em></li><li><em>"It returns early before reaching the assignment."</em></li></ul><p><strong>Code quality phrases:</strong></p><ul><li><em>"Extract this into its own function."</em> — separation of concerns</li><li><em>"This is a side effect — avoid it in pure functions."</em></li><li><em>"The function does too much — single responsibility principle."</em></li><li><em>"Rename this variable — \'data\' tells us nothing."</em></li></ul>'
          },
          {
            type: 'tech-example',
            title: 'Pair programming — debugging logic',
            scenario: 'You and a colleague are debugging a cart total calculation:',
            dialogue: [
              { speaker: 'Lena', text: 'The total is always wrong when there\'s a discount code applied. The function returns the full price.' },
              { speaker: 'You', text: 'Let me check the condition. The discount logic is inside an if block — what\'s the condition evaluating to?', isYou: true },
              { speaker: 'Lena', text: 'It checks if discount is truthy... but discount is a number, and if the discount is zero, it\'s falsy.' },
              { speaker: 'You', text: 'That\'s the bug. A 0% discount is valid but evaluates as falsy. We need to check discount !== null instead of just checking the value.', isYou: true },
              { speaker: 'Lena', text: 'Right! And we should probably add a comment explaining why — this is the kind of thing that will confuse future developers.' },
              { speaker: 'You', text: 'Agreed. I\'ll also write a unit test for the edge case where discount is exactly zero.', isYou: true }
            ],
            tip: '"Truthy/falsy" = JavaScript values that evaluate as true/false in a boolean context. 0, "", null, undefined, NaN, false are falsy. Everything else is truthy.'
          },
          {
            type: 'speaking',
            prompt: 'Explain to a junior developer (in English) what an "early return" is and why it\'s useful. Write 3–4 sentences.',
            tip: 'Use: "Instead of...", "By returning early...", "This avoids...". Give a concrete benefit.',
            example: '"An early return is when a function exits before reaching the end, usually to handle an invalid condition first. Instead of wrapping all the logic in a big if block, you check the error case at the top and return immediately. By returning early, you reduce nesting and make the happy path — the normal flow — easier to read. It\'s a common pattern to make functions cleaner and more focused."'
          },
          {
            type: 'quiz',
            questions: [
              { question: 'A developer says "the function mutates the original array." What does this mean?', options: ['The function creates a new array', 'The function changes the original array instead of copying it', 'The function deletes the array', 'The function reads the array without changing it'], correct: 1, explanation: '"Mutate" = modify directly. Mutating the original can cause unexpected bugs in other parts of the code that share the same reference.' },
              { question: 'What is a "callback"?', options: ['Calling a function twice', 'A function passed as an argument and executed later', 'A return value from an API', 'A type of loop'], correct: 1, explanation: 'A callback is a function you pass to another function to be called when something finishes — like an event handler or an async operation.' },
              { question: 'A reviewer says "rename this variable — \'data\' tells us nothing." What should you do?', options: ['Delete the variable', 'Use a more descriptive name that explains what the variable holds', 'Add a comment explaining what data is', 'Capitalize the variable name'], correct: 1, explanation: 'Good variable names are self-documenting: userList, cartTotal, errorMessage — not data, result, temp.' },
              { question: 'What does "the condition is always truthy" mean?', options: ['The condition evaluates to true every time, so the else branch never runs', 'The condition checks for null values', 'The condition is missing a return statement', 'The condition runs in a loop'], correct: 0, explanation: 'If a condition is always truthy, the if branch always executes and the else is dead code — a logic bug.' }
            ]
          }
        ]
      },

      // ── L1.M4.L3 — The UI — What Users See ───────────────
      {
        id: 'L1.M4.L3',
        title: 'The UI — What Users See',
        subtitle: 'Design and interface vocabulary',
        difficulty: 'beginner',
        duration: 15,
        xpReward: 75,
        sections: [
          {
            type: 'warmup',
            prompt: 'Describe your app\'s main screen in English — just the layout. Where are the main elements? What does a user see when they first land on the page?',
            tip: 'Use spatial language: "top left", "below the header", "centered", "on the right side", "stacked vertically".'
          },
          {
            type: 'vocabulary',
            words: [
              { word: 'layout', phonetic: '/ˈleɪaʊt/', meaning: '(n) The overall arrangement and positioning of UI elements on a page', example: 'The layout breaks on narrow screens — the sidebar overlaps the content.', techNote: '"Grid layout", "flex layout", "fixed layout", "fluid layout" — all specific layout types in CSS.' },
              { word: 'component', phonetic: '/kəmˈpoʊnənt/', meaning: '(n) A reusable, self-contained piece of UI — button, modal, card, dropdown', example: 'Let\'s extract the avatar into its own component — it appears in three places.', techNote: 'Central concept in React, Vue, Angular. "Component library" = a collection of reusable UI components.' },
              { word: 'modal', phonetic: '/ˈmoʊdəl/', meaning: '(n) A dialog box that appears on top of the page and requires user interaction before continuing', example: 'The delete confirmation modal should trap focus — users shouldn\'t be able to Tab out of it.', techNote: '"Modal" vs "popup" vs "dialog": modals block the background. Popups open new browser windows. Dialog is the ARIA term.' },
              { word: 'state', phonetic: '/steɪt/', meaning: '(n) The current condition of a UI — what data it holds and how it\'s displayed', example: 'The button has three states: default, loading, and disabled.', techNote: 'Crucial concept in React: local state (useState), global state (context, Redux). "State change" triggers a re-render.' },
              { word: 'placeholder', phonetic: '/ˈpleɪshoʊldər/', meaning: '(n) Temporary text in an input field showing what to type, OR a content placeholder while data loads', example: 'The placeholder text should guide the user, not repeat the label.', techNote: 'Two meanings: 1) input hint text (disappears on type) 2) loading skeleton (grey blocks before real content appears).' }
            ]
          },
          {
            type: 'explanation',
            title: 'UI states — the vocabulary every frontend dev needs',
            content: '<p>Every UI element exists in multiple states. Knowing how to name and discuss these states is fundamental to frontend communication.</p><p><strong>The 5 states every UI element can have:</strong></p><ul><li><em>Default</em> — the normal, resting state</li><li><em>Hover</em> — user moves mouse over it</li><li><em>Focus</em> — user tabs to it (keyboard accessibility)</li><li><em>Active / pressed</em> — user is clicking/tapping it</li><li><em>Disabled</em> — interaction is not allowed</li></ul><p><strong>Page-level states:</strong></p><ul><li><em>Loading state</em> — data is being fetched</li><li><em>Empty state</em> — no data to show (e.g., empty cart)</li><li><em>Error state</em> — something went wrong</li><li><em>Success state</em> — action completed</li></ul><p><strong>Talking about layout in English:</strong></p><ul><li><em>"The sidebar is 240px fixed width, the content area takes the remaining space."</em></li><li><em>"The header is sticky — it stays at the top as the user scrolls."</em></li><li><em>"The button group is aligned to the right of the container."</em></li><li><em>"Use flexbox to center it both horizontally and vertically."</em></li></ul>'
          },
          {
            type: 'tech-example',
            title: 'Design review — discussing a UI spec',
            scenario: 'The designer shared a Figma spec. The team is discussing implementation:',
            dialogue: [
              { speaker: 'Ana (Designer)', text: 'The checkout button should have four states: default (blue), hover (darker blue), loading (spinner instead of text), and disabled (grey, when cart is empty).' },
              { speaker: 'You', text: 'Got it. I\'ll handle the loading state by replacing the text with a spinner and disabling pointer events. The disabled state needs to communicate clearly to the user — I\'ll add a tooltip explaining why it\'s not available.', isYou: true },
              { speaker: 'Ana (Designer)', text: 'Perfect. Also — when the modal opens, make sure to trap focus inside it. Users shouldn\'t be able to Tab to the background content.' },
              { speaker: 'You', text: 'Already planned for that — I\'ll use a focus trap library. I\'ll also set the aria-modal attribute and manage focus return to the trigger when the modal closes.', isYou: true },
              { speaker: 'Ana (Designer)', text: 'Great. One more thing — what\'s the empty state when there are no items in the cart?' },
              { speaker: 'You', text: 'I\'ll render a dedicated empty state component with an illustration and a "Start Shopping" CTA — I\'ll match the pattern we already use on the wishlist page.', isYou: true }
            ],
            tip: '"Pointer events" = mouse/touch interactions. "Focus trap" = keyboard focus stays inside a modal. "CTA" = Call to Action (button or link prompting user action).'
          },
          {
            type: 'speaking',
            prompt: 'Describe to your team (in English) all the states a login button should have, and what the user should see in each state. Write 4–5 sentences.',
            tip: 'Cover: default, loading (after click), success (redirecting), error (credentials wrong), disabled (form incomplete).',
            example: '"The login button has five states. In the default state it\'s active and labelled \'Log In\'. Once the user clicks, it switches to a loading state — the text changes to a spinner and the button is disabled to prevent double submission. If authentication fails, the button returns to default and an error message appears above the form. If authentication succeeds, the button shows \'Success!\' briefly before the redirect. The button should also be disabled and visually greyed out when either field is empty."'
          },
          {
            type: 'quiz',
            questions: [
              { question: 'What is a component in frontend development?', options: ['A CSS file', 'A reusable, self-contained piece of UI', 'A JavaScript function that runs on the server', 'A type of database query'], correct: 1, explanation: 'A component is a reusable UI unit — a button, a card, a modal. In React/Vue/Angular, everything is built from components.' },
              { question: 'A designer says the page needs an "empty state." What do they mean?', options: ['The page should be blank by default', 'There should be a UI shown when there is no data to display', 'The page should load faster', 'The background should be white'], correct: 1, explanation: 'An empty state is the UI shown when a list, table, or feed has no items — e.g., "No notifications yet." It prevents a blank or broken-looking UI.' },
              { question: 'What does "sticky" mean when describing a header?', options: ['The header is visually highlighted', 'The header stays fixed at the top as the user scrolls down', 'The header has a drop shadow', 'The header cannot be clicked'], correct: 1, explanation: 'A sticky header uses CSS position: sticky or position: fixed to remain visible at the top of the viewport while the user scrolls.' },
              { question: 'A developer says "the button is disabled." What does this mean for the user?', options: ['The button is invisible', 'The button cannot be clicked and interaction is not allowed', 'The button redirects to a different page', 'The button has no styles applied'], correct: 1, explanation: 'Disabled = not interactive. HTML disabled attribute prevents clicks. CSS opacity or color conveys this visually.' }
            ]
          }
        ]
      },

      // ── L1.M4.L4 — Responsive Design Vocabulary ──────────
      {
        id: 'L1.M4.L4',
        title: 'Responsive Design Vocabulary',
        subtitle: 'Mobile-first communication',
        difficulty: 'beginner',
        duration: 15,
        xpReward: 75,
        sections: [
          {
            type: 'warmup',
            prompt: 'Your manager asks: "Is the new feature responsive?" What does that question mean, and what would you check to answer it? Write your answer in English.',
            tip: 'Think: what does "responsive" actually require? It\'s not just "it works on mobile" — it\'s about how it adapts.'
          },
          {
            type: 'vocabulary',
            words: [
              { word: 'breakpoint', phonetic: '/ˈbreɪkpɔɪnt/', meaning: '(n) A screen width threshold where the layout changes to better fit the viewport', example: 'We have three breakpoints: 480px, 768px, and 1200px.', techNote: 'Defined in CSS @media queries. Mobile-first = write base styles for small screens, then use min-width breakpoints to expand.' },
              { word: 'fluid', phonetic: '/ˈfluːɪd/', meaning: '(adj) Stretches and shrinks smoothly with the viewport, rather than jumping at fixed sizes', example: 'Use fluid typography — font-size scales with the viewport width.', techNote: 'Fluid layouts use % or vw units. Fixed layouts use px. Fluid = smoother, fixed = more control.' },
              { word: 'overflow', phonetic: '/ˈoʊvərfloʊ/', meaning: '(n/v) Content that extends beyond its container\'s boundaries', example: 'The long product name is causing overflow on mobile — add text-overflow: ellipsis.', techNote: 'overflow: hidden (clips), scroll (scrollbar), auto (scrollbar only when needed), visible (default, content spills out).' },
              { word: 'stacked', phonetic: '/stækt/', meaning: '(adj) Elements arranged vertically on mobile (instead of horizontally on desktop)', example: 'On mobile, the two columns should stack — hero image above, text below.', techNote: '"Stack" is a common verb in responsive design: "stack the cards on mobile", "un-stack at 768px".' },
              { word: 'media query', phonetic: '/ˈmiːdiə ˈkwɪri/', meaning: '(n) A CSS rule that applies styles conditionally based on screen width, orientation, or other features', example: 'Add a media query at 600px to hide the sidebar on small screens.', techNote: '@media (max-width: 768px) { } = mobile styles. @media (min-width: 769px) { } = desktop (mobile-first approach).' }
            ]
          },
          {
            type: 'explanation',
            title: 'How to discuss responsive design in English',
            content: '<p>Responsive design is a constant topic in frontend teams. Whether in code reviews, QA sessions, or design discussions, knowing the vocabulary makes you much more effective.</p><p><strong>Describing layout behavior:</strong></p><ul><li><em>"At 768px the sidebar collapses into a hamburger menu."</em></li><li><em>"The grid switches from three columns to one column on mobile."</em></li><li><em>"The hero image scales with the viewport — it\'s fluid."</em></li><li><em>"The text overflows on screens below 360px."</em></li></ul><p><strong>Mobile-first philosophy:</strong></p><p>Mobile-first means starting with the smallest screen design and progressively enhancing for larger screens. This is the standard approach today.</p><ul><li><em>"We write mobile styles first, then use min-width media queries to add desktop enhancements."</em></li><li><em>"The base layout is one column — we only go to two columns at the medium breakpoint."</em></li></ul><p><strong>Common responsive bugs phrased in English:</strong></p><ul><li><em>"The button is too small to tap on mobile — needs more padding."</em></li><li><em>"The table overflows horizontally — needs a scroll wrapper."</em></li><li><em>"The modal is taller than the viewport on small phones."</em></li><li><em>"The text is unreadable on small screens — font size too small."</em></li></ul>'
          },
          {
            type: 'tech-example',
            title: 'QA bug report — responsive layout issues',
            scenario: 'A QA engineer is reporting several responsive bugs on the checkout page:',
            dialogue: [
              { speaker: 'Sofia (QA)', text: 'Found three responsive issues on checkout. First: the "Place Order" button overflows the screen on 320px viewports. It\'s wider than the viewport.' },
              { speaker: 'You', text: 'On it. I\'ll add max-width: 100% and remove the fixed width. Should fix the overflow.', isYou: true },
              { speaker: 'Sofia (QA)', text: 'Second issue: the order summary table doesn\'t have a scroll wrapper on mobile. Users can\'t see the price column — it\'s cut off.' },
              { speaker: 'You', text: 'I\'ll wrap the table in a div with overflow-x: auto. On mobile the table will scroll horizontally instead of clipping.', isYou: true },
              { speaker: 'Sofia (QA)', text: 'Perfect. Last one: at the 768px breakpoint, the two-column layout stacks correctly, but there\'s no gap between the stacked sections. They\'re touching.' },
              { speaker: 'You', text: 'That\'s a missing margin in the stacked state. I\'ll add margin-bottom at the breakpoint where the columns stack. I\'ll test all three on physical devices before closing the tickets.', isYou: true }
            ],
            tip: '"Viewport" = visible browser area. "Clip" = cut off at boundary. "Scroll wrapper" = container with overflow:auto that allows scrolling inside it. "Physical device" = real hardware (not emulator).'
          },
          {
            type: 'speaking',
            prompt: 'Explain to a designer (in English) what a breakpoint is and why you can\'t just have one universal layout. Write 3–4 sentences.',
            tip: 'Keep it non-technical — the designer understands design, but maybe not CSS. Focus on the why, not the how.',
            example: '"A breakpoint is a specific screen width where we change the layout to better fit the available space. A phone screen is typically 360–430px wide, a tablet around 768px, and a desktop over 1200px — the same content needs to work very differently in each of those spaces. Without breakpoints, we\'d either have a desktop layout squished onto a phone screen, or a mobile layout with huge empty margins on a desktop. Breakpoints let us create the best experience for each screen size without building separate websites."'
          },
          {
            type: 'quiz',
            questions: [
              { question: 'A QA engineer says "the table overflows on mobile." What is the issue?', options: ['The table is empty', 'The table extends beyond its container, content is not fully visible', 'The table is too small to see', 'The table has too many rows'], correct: 1, explanation: 'Overflow = content spills outside its container. On mobile, wide tables often overflow horizontally. Fix: overflow-x: auto on the wrapper.' },
              { question: 'What does "mobile-first" mean in responsive design?', options: ['Only mobile users can access the site', 'You design and code for mobile screens first, then enhance for larger screens', 'The mobile version is more important than desktop', 'You use a mobile testing device to build the site'], correct: 1, explanation: 'Mobile-first = write base CSS for small screens, then add min-width media queries to progressively enhance for larger screens.' },
              { question: 'A developer says "the columns stack at 768px." What happens at that breakpoint?', options: ['The columns disappear', 'The columns become narrower but stay side by side', 'The columns change from horizontal to vertical (one on top of the other)', 'The columns scroll horizontally'], correct: 2, explanation: '"Stack" in responsive design = switching from horizontal (side by side) to vertical (one above the other) layout.' },
              { question: 'What is a media query?', options: ['A request to a media server', 'A CSS rule that applies styles based on screen size or device features', 'A way to load images faster', 'A JavaScript event listener for screen changes'], correct: 1, explanation: 'Media queries (@media) let you apply CSS conditionally based on viewport width, height, orientation, and other device features.' }
            ]
          }
        ]
      },

      // ── L1.M4.L5 — Accessibility Language ────────────────
      {
        id: 'L1.M4.L5',
        title: 'Accessibility Language',
        subtitle: 'Inclusive design vocabulary',
        difficulty: 'beginner',
        duration: 20,
        xpReward: 100,
        sections: [
          {
            type: 'warmup',
            prompt: 'Have you ever used your keyboard to navigate a website — without a mouse? Try it now on any page. What did you notice? Write your observation in English.',
            tip: 'Press Tab to move forward, Shift+Tab to go back, Enter/Space to activate. Notice: can you reach everything? Is the focus visible?'
          },
          {
            type: 'vocabulary',
            words: [
              { word: 'accessibility', phonetic: '/əkˌsɛsɪˈbɪlɪti/', meaning: '(n) The practice of making web content usable by people of all abilities — shortened to "a11y" (a + 11 letters + y)', example: 'Accessibility is not optional — it\'s a legal requirement in many countries.', techNote: '"a11y" = accessibility (numeronym). "a11y" is pronounced as a word or "A-eleven-Y". WCAG = Web Content Accessibility Guidelines.' },
              { word: 'screen reader', phonetic: '/skriːn ˈriːdər/', meaning: '(n) Assistive software that reads page content aloud for visually impaired users', example: 'Test this with a screen reader — the icon button has no accessible label.', techNote: 'NVDA (Windows, free), JAWS (Windows, paid), VoiceOver (Mac/iOS, built-in). Always test with at least one.' },
              { word: 'focus', phonetic: '/ˈfoʊkəs/', meaning: '(n) The currently active element that receives keyboard input — indicated by a visible outline', example: 'Never remove the focus outline with outline: none without adding a custom focus indicator.', techNote: '"Tab order" = the sequence of elements Tab key moves through. "Focus trap" = keeping focus inside a modal.' },
              { word: 'aria', phonetic: '/ˈɑːriə/', meaning: '(n) Accessible Rich Internet Applications — HTML attributes that add semantic meaning for assistive tech', example: 'Add aria-label="Close dialog" to the X button — it has no text content for screen readers.', techNote: 'aria-label, aria-describedby, aria-live, aria-expanded, role — all ARIA attributes. Rule: prefer native HTML semantics first.' },
              { word: 'contrast', phonetic: '/ˈkɒntræst/', meaning: '(n) The ratio between text color and background color — minimum 4.5:1 for normal text per WCAG AA', example: 'The grey text on white background fails contrast — it\'s 2.8:1, below the 4.5:1 minimum.', techNote: 'Use tools like the WebAIM Contrast Checker. "AA" compliance = 4.5:1 normal text, 3:1 large text.' }
            ]
          },
          {
            type: 'explanation',
            title: 'Talking about accessibility in English',
            content: '<p>Accessibility is increasingly important in frontend development — both ethically and legally. Being able to discuss a11y in English is essential for working in international teams.</p><p><strong>Common accessibility phrases in code reviews:</strong></p><ul><li><em>"This image is missing an alt attribute — screen readers won\'t know what it is."</em></li><li><em>"The color contrast fails WCAG AA — change the text color."</em></li><li><em>"This interactive element needs a focus indicator."</em></li><li><em>"Add an aria-label — the button has no text content."</em></li><li><em>"The modal needs focus trapping."</em></li></ul><p><strong>Keyboard accessibility phrases:</strong></p><ul><li><em>"Can you navigate this without a mouse?"</em></li><li><em>"The Tab order is illogical — it jumps around the page."</em></li><li><em>"The dropdown closes on Escape, right?"</em></li><li><em>"Users should be able to activate this with Enter or Space."</em></li></ul><p><strong>ARIA usage rules (in plain English):</strong></p><ol><li>First, use the correct native HTML element</li><li>If no native element fits, use ARIA roles and properties</li><li>Never use ARIA to override native semantics</li><li>An ARIA attribute that\'s wrong is worse than none at all</li></ol>'
          },
          {
            type: 'tech-example',
            title: 'Code review — accessibility issues',
            scenario: 'A senior developer is reviewing a new icon button component:',
            dialogue: [
              { speaker: 'James (Senior)', text: 'The close button has no accessible label. It\'s just an X icon — screen reader users will hear "button" with no context. Add an aria-label.' },
              { speaker: 'You', text: 'Good catch. I\'ll add aria-label="Close dialog" to the button element. Should I also add a visually hidden span with the text as a fallback?', isYou: true },
              { speaker: 'James (Senior)', text: 'aria-label is enough for this case. But make sure the focus indicator is visible — I see outline: none in the CSS right now.' },
              { speaker: 'You', text: 'I\'ll remove that and add a custom :focus-visible style with a 2px cyan outline. That way keyboard users see the focus, but mouse users don\'t get the outline on click.', isYou: true },
              { speaker: 'James (Senior)', text: 'Perfect. :focus-visible is exactly the right approach. And run the contrast check on the button\'s icon color against the background — I want to make sure it passes AA.' }
            ],
            tip: '":focus-visible" = CSS pseudo-class that shows focus outline only for keyboard navigation, not mouse clicks. "Visually hidden" = element read by screen readers but not visible on screen (used for hidden labels).'
          },
          {
            type: 'speaking',
            prompt: 'Explain to your team (in English) why removing the focus outline (outline: none) without a replacement is a problem. Write 3–4 sentences.',
            tip: 'Who does it affect? What do they lose? What should you do instead?',
            example: '"Removing the focus outline without adding a replacement is a significant accessibility issue for keyboard users. People who navigate by keyboard — including users with motor disabilities, power users, and screen reader users — rely on the visible focus indicator to know which element is currently active. Without it, they lose their place on the page entirely. Instead of removing the outline, we should replace it with a custom :focus-visible style that matches our design system and provides clear, high-contrast visual feedback."'
          },
          {
            type: 'quiz',
            questions: [
              { question: 'What does "a11y" stand for?', options: ['All users', 'Accessibility', 'A JavaScript library', 'Application 11 version Y'], correct: 1, explanation: 'a11y = accessibility (a + 11 middle letters + y). It\'s a numeronym used widely in the web development community.' },
              { question: 'A reviewer says "the image is missing an alt attribute." What is the consequence?', options: ['The image won\'t load', 'Screen readers won\'t know what the image shows — visually impaired users lose context', 'The image will be too large', 'The page won\'t validate'], correct: 1, explanation: 'The alt attribute provides text alternatives for images. Screen readers read the alt text aloud. Missing alt = inaccessible for screen reader users.' },
              { question: 'What is the WCAG AA contrast ratio requirement for normal-sized text?', options: ['2:1', '3:1', '4.5:1', '7:1'], correct: 2, explanation: 'WCAG AA requires a 4.5:1 contrast ratio for normal text. Large text (18pt+ or 14pt+ bold) only requires 3:1.' },
              { question: 'A developer says "use :focus-visible instead of :focus." What is the benefit?', options: ['It\'s faster to render', 'It shows focus outline only during keyboard navigation, not on mouse clicks', 'It works in older browsers', 'It removes the focus outline entirely'], correct: 1, explanation: ':focus-visible shows the focus indicator only when the user is navigating with a keyboard or equivalent, not when clicking with a mouse. Better UX for both groups.' }
            ]
          }
        ]
      }
    ]
  };

  // ─────────────────────────────────────────────────────────
  // LEVEL 1 — MODULE 5: Talking About Projects  (FULL CONTENT)
  // ─────────────────────────────────────────────────────────
  var L1M5 = {
    title: 'Talking About Projects',
    description: 'How to describe what you\'re building, your progress, and your goals — to your team, your manager, and anyone else.',
    lessons: [
      // ── L1.M5.L1 — Project Overview — Elevator Pitch ──────
      {
        id: 'L1.M5.L1',
        title: 'Project Overview — Elevator Pitch',
        subtitle: 'Explaining your project in 30 seconds',
        difficulty: 'beginner',
        duration: 15,
        xpReward: 75,
        sections: [
          {
            type: 'warmup',
            prompt: 'Imagine you\'re in an elevator with your company\'s CEO. You have 30 seconds. What\'s your project, and why does it matter? Write your pitch in English.',
            tip: 'What = what you\'re building. Who = who it\'s for. Why = what problem it solves. Keep it simple — no jargon.'
          },
          {
            type: 'vocabulary',
            words: [
              { word: 'feature', phonetic: '/ˈfiːtʃər/', meaning: '(n) A specific piece of functionality in a product', example: 'We\'re shipping a new search feature next sprint.', techNote: '"Feature" vs "bug fix" vs "refactor": features add new value, bug fixes repair broken behavior, refactors improve code without changing behavior.' },
              { word: 'scope', phonetic: '/skoʊp/', meaning: '(n) The defined boundaries of what a project or feature includes', example: 'That\'s out of scope for this sprint — let\'s add it to the backlog.', techNote: '"Scope creep" = when extra requirements get added without adjusting timeline or resources. Very common and important to recognize.' },
              { word: 'goal', phonetic: '/ɡoʊl/', meaning: '(n) The outcome you\'re trying to achieve with the project', example: 'The goal is to reduce checkout drop-off by 15%.', techNote: 'Technical goal: "reduce load time". Business goal: "increase conversion". Both matter — always know both.' },
              { word: 'stakeholder', phonetic: '/ˈsteɪkhoʊldər/', meaning: '(n) Anyone with an interest in the project\'s outcome — managers, clients, end users, other teams', example: 'We need stakeholder sign-off before starting development.', techNote: '"Internal stakeholder" = within your company. "External stakeholder" = client, partner, end user.' },
              { word: 'deliver', phonetic: '/dɪˈlɪvər/', meaning: '(v) To complete and ship a feature, project, or milestone', example: 'We\'re on track to deliver the MVP by end of Q2.', techNote: '"Deliver" = ship, deploy, release, go live. "Delivery date" = the promised date of completion.' }
            ]
          },
          {
            type: 'explanation',
            title: 'The elevator pitch structure for developers',
            content: '<p>An elevator pitch is a short (30–60 second) explanation of your project that anyone can understand. It\'s a critical skill for developers — you need it for demos, leadership reviews, and cross-team communication.</p><p><strong>The 3-part structure:</strong></p><ol><li><strong>What:</strong> What are you building? One sentence, no jargon.</li><li><strong>Who:</strong> Who is it for? (Users, teams, customers)</li><li><strong>Why:</strong> What problem does it solve or what value does it create?</li></ol><p><strong>Example — bad pitch:</strong><br><em>"I\'m implementing a microservice with Redis caching and a React frontend that consumes our REST API to reduce TTFB."</em></p><p><strong>Example — good pitch:</strong><br><em>"I\'m building a faster search experience for our e-commerce platform. It\'s aimed at returning customers. The current search takes 4 seconds — we\'re bringing it down to under 500ms, which should directly increase purchase conversion."</em></p><p><strong>Key phrases to use:</strong></p><ul><li><em>"The goal of this project is..."</em></li><li><em>"It\'s designed to..."</em></li><li><em>"The main challenge we\'re solving is..."</em></li><li><em>"By the end of this sprint, we\'ll have..."</em></li></ul>'
          },
          {
            type: 'tech-example',
            title: 'Town hall Q&A — developer presenting to leadership',
            scenario: 'It\'s the quarterly all-hands meeting. A VP asks you to briefly explain your team\'s current project:',
            dialogue: [
              { speaker: 'VP Sarah', text: 'Can you give us a quick overview of what your team has been working on this quarter?' },
              { speaker: 'You', text: 'Of course. We\'re building a new onboarding flow for first-time users. The goal is to help new users reach their first "aha moment" — the point where they see real value from the product — within their first 10 minutes.', isYou: true },
              { speaker: 'VP Sarah', text: 'Interesting. What\'s driving that? Is there a specific metric you\'re targeting?' },
              { speaker: 'You', text: 'Yes — our current 7-day retention rate for new users is 28%. The industry benchmark is around 40%. We believe that a clearer onboarding flow will close most of that gap. We\'re targeting 35% as our success metric for this launch.', isYou: true },
              { speaker: 'VP Sarah', text: 'That\'s a clear goal. When are you delivering?' },
              { speaker: 'You', text: 'We\'re on track to deliver to production by the end of next sprint — that\'s about two weeks from now.', isYou: true }
            ],
            tip: '"Aha moment" = the moment a user understands the product\'s value. "Retention rate" = percentage of users who come back after their first visit. "Benchmark" = industry standard reference point.'
          },
          {
            type: 'speaking',
            prompt: 'Write a 30-second elevator pitch for a real or imagined project you\'re working on. Include: what it is, who it\'s for, and why it matters. Write 4–5 sentences.',
            tip: 'Avoid acronyms and technical jargon. If a non-developer couldn\'t understand one sentence, rewrite it.',
            example: '"We\'re building a QA dashboard for our engineering team. It gives developers real-time visibility into test results without having to dig through CI logs. The goal is to cut the time developers spend investigating test failures from 20 minutes down to under 5. It\'s aimed at our 30-person engineering team, and we expect it to save roughly 200 hours of developer time per month. We\'re delivering the first version at the end of this month."'
          },
          {
            type: 'quiz',
            questions: [
              { question: 'A manager says the feature is "out of scope." What does this mean?', options: ['The feature is too difficult to build', 'The feature is not included in the current project boundaries', 'The feature has already been built', 'The feature is the most important one'], correct: 1, explanation: '"Out of scope" = not included in what was agreed. Adding it would require renegotiating timeline or resources.' },
              { question: 'What is "scope creep"?', options: ['When a project finishes early', 'When code quality decreases over time', 'When extra requirements get added to a project without adjusting resources or timeline', 'When a bug reappears after being fixed'], correct: 2, explanation: 'Scope creep = uncontrolled growth of project scope. New features keep getting added, but the timeline and team size don\'t change.' },
              { question: 'What is a "stakeholder"?', options: ['A developer working on the project', 'Anyone with an interest in the project\'s outcome', 'The project manager only', 'The end user only'], correct: 1, explanation: 'Stakeholders include anyone affected by or interested in the project: managers, clients, end users, other teams, investors.' },
              { question: 'A developer says "we\'re delivering the MVP by end of Q2." What does MVP mean in this context?', options: ['Most Valuable Player', 'Minimum Viable Product', 'Main Version Published', 'Mobile Viewport Prototype'], correct: 1, explanation: 'MVP = Minimum Viable Product — the smallest version of the product that delivers value and can be tested with real users.' }
            ]
          }
        ]
      },

      // ── L1.M5.L2 — Features & Requirements ───────────────
      {
        id: 'L1.M5.L2',
        title: 'Features & Requirements',
        subtitle: 'Discussing what needs to be built',
        difficulty: 'beginner',
        duration: 15,
        xpReward: 75,
        sections: [
          {
            type: 'warmup',
            prompt: 'A product manager gives you a task: "Make the login better." What questions would you ask to turn that into a real requirement? Write 2–3 questions in English.',
            tip: 'Vague requirements need clarification. Think: What does "better" mean? Better for whom? What\'s the current problem?'
          },
          {
            type: 'vocabulary',
            words: [
              { word: 'requirement', phonetic: '/rɪˈkwaɪərmənt/', meaning: '(n) A defined, specific need that a feature or system must satisfy', example: 'The requirement is that users can reset their password via email.', techNote: '"Functional requirement" = what the system must do. "Non-functional requirement" = how it should perform (speed, security, accessibility).' },
              { word: 'acceptance criteria', phonetic: '/əkˈsɛptəns kraɪˈtɪəriə/', meaning: '(n, plural) The specific conditions that must be met for a feature to be considered done', example: 'The acceptance criteria state that the form must validate in under 200ms.', techNote: 'Often written as "Given / When / Then" in agile (BDD format). Tested by QA before sign-off.' },
              { word: 'edge case', phonetic: '/ɛdʒ keɪs/', meaning: '(n) An unusual or extreme input condition that might break normal logic', example: 'What happens if the user submits an empty form? That\'s an edge case we need to handle.', techNote: '"Happy path" = normal successful flow. "Edge case" = boundary conditions. "Corner case" = extremely rare conditions at the intersection of multiple edge cases.' },
              { word: 'dependency', phonetic: '/dɪˈpɛndənsi/', meaning: '(n) Something a feature relies on in order to work — another team, API, service, or piece of code', example: 'We have a dependency on the payments team — we can\'t ship until their API is ready.', techNote: '"Blocked by a dependency" = can\'t proceed until something else is done. Critical to surface early in planning.' },
              { word: 'assumption', phonetic: '/əˈsʌmpʃən/', meaning: '(n) A fact that\'s treated as true without explicit confirmation — a risk if wrong', example: 'Our assumption is that users are on a reliable internet connection — but what about offline mode?', techNote: '"Explicit assumption" = stated openly. "Implicit assumption" = unstated, often source of bugs or miscommunication.' }
            ]
          },
          {
            type: 'explanation',
            title: 'Requirements vocabulary in agile teams',
            content: '<p>Working with requirements in English requires a specific vocabulary. Whether you\'re reading a ticket, writing acceptance criteria, or flagging risks — these terms are essential.</p><p><strong>Types of requirements:</strong></p><ul><li><em>Functional:</em> "The user must be able to upload a PDF file."</li><li><em>Non-functional:</em> "The upload must complete in under 3 seconds."</li><li><em>Business:</em> "This feature must reduce support tickets by 20%."</li></ul><p><strong>Common phrases for clarifying requirements:</strong></p><ul><li><em>"Can you clarify what you mean by...?"</em></li><li><em>"What\'s the expected behavior when...?"</em></li><li><em>"What happens in the edge case where...?"</em></li><li><em>"Is this a hard requirement or a nice-to-have?"</em></li><li><em>"What are the acceptance criteria for this story?"</em></li></ul><p><strong>Flagging risks and assumptions:</strong></p><ul><li><em>"I\'m assuming the API will return the data in this format — is that confirmed?"</em></li><li><em>"We have a dependency on the auth service — is that ready?"</em></li><li><em>"This won\'t work if the user is offline — is that an edge case we need to handle?"</em></li></ul>'
          },
          {
            type: 'tech-example',
            title: 'Sprint planning — requirements discussion',
            scenario: 'The team is reviewing a user story in sprint planning. The developer is asking clarifying questions:',
            dialogue: [
              { speaker: 'PM Lucas', text: 'This story is about adding a file upload to the profile page. Users should be able to upload a profile photo.' },
              { speaker: 'You', text: 'A few questions before we estimate. What file formats are supported? Just images, or also PDFs?', isYou: true },
              { speaker: 'PM Lucas', text: 'Images only — JPEG, PNG, and WebP.' },
              { speaker: 'You', text: 'Got it. What\'s the size limit? And what\'s the acceptance criterion for image quality — do we need to resize or compress on upload?', isYou: true },
              { speaker: 'PM Lucas', text: 'Max 5MB. No compression required on our side — just validate and reject if too large.' },
              { speaker: 'You', text: 'One more: what\'s the expected behavior if the upload fails? Should the old photo remain, or should there be an error state?', isYou: true },
              { speaker: 'PM Lucas', text: 'Old photo should remain — never leave the user without a profile image. Good catch.' }
            ],
            tip: '"Before we estimate" = before we decide how long it takes. "Acceptance criterion" = the specific definition of done. "Edge case" here = upload failure.'
          },
          {
            type: 'speaking',
            prompt: 'A PM gives you this requirement: "Add a notification bell to the header." Write 4–5 clarifying questions in English to turn this into a real spec.',
            tip: 'Think about: what types of notifications, how are they triggered, what happens when clicked, does the count clear, real-time or on refresh?',
            example: '"A few questions before I start: What types of notifications should appear — system alerts, messages, activity updates? Should the bell show a count badge for unread notifications, and if so, does clicking the bell mark them as read or is there a separate action? Is this real-time via WebSocket or does it refresh on page load? What happens when there are no notifications — is there an empty state? And finally, should clicking a notification navigate to the relevant content, or just expand a dropdown panel?"'
          },
          {
            type: 'quiz',
            questions: [
              { question: 'What are "acceptance criteria"?', options: ['The design specifications from a designer', 'The conditions that must be met for a feature to be considered done', 'The list of bugs found in QA', 'The technical stack chosen for a project'], correct: 1, explanation: 'Acceptance criteria define exactly when a story is "done." They\'re agreed upon before development starts and verified by QA.' },
              { question: 'A developer says "we have a dependency on the payments team." What does this mean?', options: ['The payments team is working on the same feature', 'Their feature requires something from the payments team before it can be completed', 'The payments team wrote the original code', 'The payments team approved the feature'], correct: 1, explanation: 'A dependency = something your work relies on. If the payments team is delayed, you\'re blocked too.' },
              { question: 'What is the "happy path" in requirements testing?', options: ['The easiest part of the code to write', 'The normal, successful user flow with valid inputs', 'A shortcut through the application', 'The most popular user journey'], correct: 1, explanation: 'Happy path = the normal, expected flow where everything works correctly. Edge cases and error paths are tested separately.' },
              { question: 'A PM says a feature is a "nice-to-have." What does this mean?', options: ['It\'s required for launch', 'It\'s a high priority bug fix', 'It would be good to have but is not critical for the current release', 'It\'s already been built'], correct: 2, explanation: '"Nice-to-have" = optional, would add value but not essential. Opposite of "must-have" or "hard requirement."' }
            ]
          }
        ]
      },

      // ── L1.M5.L3 — Timeline & Milestones ─────────────────
      {
        id: 'L1.M5.L3',
        title: 'Timeline & Milestones',
        subtitle: 'Progress and deadlines vocabulary',
        difficulty: 'beginner',
        duration: 15,
        xpReward: 75,
        sections: [
          {
            type: 'warmup',
            prompt: 'How would you tell your manager that a task is taking longer than expected — without sounding like you\'re making excuses? Try drafting that message in English.',
            tip: 'Be direct, give a reason, and give a new estimate. Don\'t over-explain. Avoid "I\'m sorry" as the opening.'
          },
          {
            type: 'vocabulary',
            words: [
              { word: 'deadline', phonetic: '/ˈdɛdlaɪn/', meaning: '(n) The date or time by which something must be completed', example: 'The deadline for this feature is Friday EOD.', techNote: '"Hard deadline" = cannot move. "Soft deadline" = preferred but flexible. Always clarify which one you\'re dealing with.' },
              { word: 'milestone', phonetic: '/ˈmaɪlstoʊn/', meaning: '(n) A significant checkpoint or completion point in a project timeline', example: 'The first milestone is having a working prototype by end of week.', techNote: 'Milestones mark progress, not tasks. "We hit the milestone" = we reached the checkpoint.' },
              { word: 'estimate', phonetic: '/ˈɛstɪmɪt/', meaning: '(n/v) A calculated prediction of how long a task will take', example: 'My estimate for this task is 3 days, but I\'ll know more after the spike.', techNote: '"Story point" (agile) and "hour/day estimate" are common. Estimates are uncertain — always communicate confidence level.' },
              { word: 'on track', phonetic: '/ɒn træk/', meaning: '(phrase) Progressing as planned, expected to meet the deadline', example: 'The migration is on track — we\'ll hit the Friday milestone.', techNote: '"On track" vs "at risk" vs "blocked" — three key status phrases every developer needs.' },
              { word: 'slip', phonetic: '/slɪp/', meaning: '(v) When a deadline moves later than originally planned', example: 'The release date slipped by a week due to the security audit.', techNote: '"The deadline slipped" / "we\'re slipping" — neutral term, not blaming. Avoid "we failed the deadline."' }
            ]
          },
          {
            type: 'explanation',
            title: 'How to talk about timelines, progress, and delays',
            content: '<p>Timeline communication is one of the most important — and most feared — parts of developer English. Knowing how to give estimates, report progress, and flag delays professionally is critical.</p><p><strong>Giving estimates:</strong></p><ul><li><em>"My best estimate is 2–3 days."</em></li><li><em>"That\'s about half a sprint\'s worth of work."</em></li><li><em>"I\'ll have a better estimate after I investigate the API."</em></li><li><em>"I\'d say 4 points — it\'s more complex than it looks."</em></li></ul><p><strong>Reporting status:</strong></p><ul><li><em>"We\'re on track for the Friday release."</em></li><li><em>"We\'re at risk — the third-party integration is taking longer than expected."</em></li><li><em>"We\'re blocked on the design spec — waiting for approval."</em></li></ul><p><strong>Communicating delays early:</strong></p><ul><li><em>"I want to flag a risk early: this might take an extra day."</em></li><li><em>"The estimate was off — I found a complexity I didn\'t anticipate. Can we discuss the deadline?"</em></li><li><em>"We\'re going to miss the Thursday milestone. New estimate: Monday EOD. Here\'s why..."</em></li></ul><p><strong>Golden rule:</strong> Always communicate delays as early as possible. The longer you wait, the worse it looks — and the fewer options the team has to adapt.</p>'
          },
          {
            type: 'tech-example',
            title: 'Slack message — flagging a delay early',
            scenario: 'You discovered a task is more complex than estimated. You\'re updating the team proactively:',
            dialogue: [
              { speaker: 'You', text: '@channel Heads up on the payment integration task. My original estimate was 2 days, but after investigating the third-party API, it\'s clear it\'ll take closer to 4. The API has rate limiting we weren\'t aware of, and we need to add retry logic.', isYou: true },
              { speaker: 'PM Lucas', text: 'Thanks for flagging early. Does this affect the Thursday milestone?' },
              { speaker: 'You', text: 'It does — Thursday is no longer realistic. I\'m confident I can have it done by end of day Friday. If that\'s a hard deadline, let\'s discuss what we can deprioritize to speed things up.', isYou: true },
              { speaker: 'PM Lucas', text: 'Friday EOD works — the milestone is soft. Let\'s sync tomorrow to adjust the sprint board.' },
              { speaker: 'You', text: 'Sounds good. I\'ll send a summary of what I found in the API docs so the team is aware of the constraints for future integrations.', isYou: true }
            ],
            tip: '"Heads up" = proactive warning. "Flag early" = communicate the problem before it becomes a crisis. "Deprioritize" = move something lower in priority to free up time.'
          },
          {
            type: 'speaking',
            prompt: 'Write a Slack message to your team telling them that a task will take 2 days longer than estimated. Include: the reason, the new estimated date, and whether you need help.',
            tip: 'Start with the key information: the delay and the new date. Then explain why. End with a question or next step.',
            example: '"@team Quick update on the search refactor — I\'m going to need 2 extra days on this one. After diving into the codebase I found that the indexing logic is tightly coupled to the legacy search module, which adds significant refactoring work that wasn\'t visible from the outside. New estimate: I\'ll have the PR ready by Wednesday EOD instead of Monday. No blockers on my end — I don\'t need help right now, but I\'ll flag if that changes. Let me know if the Wednesday date is an issue."'
          },
          {
            type: 'quiz',
            questions: [
              { question: 'A project manager says "the deadline is hard." What does this mean?', options: ['The task is technically difficult', 'The deadline cannot be moved', 'The deadline is approximately this date', 'The deadline was set by leadership'], correct: 1, explanation: '"Hard deadline" = fixed, cannot be changed. "Soft deadline" = preferred date, can be negotiated.' },
              { question: 'A developer says "we\'re at risk." What is the correct interpretation?', options: ['There is a security vulnerability', 'There is a chance the deadline will not be met', 'The code is broken', 'The feature was cancelled'], correct: 1, explanation: '"At risk" = the project or milestone may not be delivered on time. Not a crisis yet, but a warning.' },
              { question: 'What does "the deadline slipped" mean?', options: ['The team missed the deadline', 'The deadline was moved to a later date', 'The deadline was set too early', 'The deadline is no longer needed'], correct: 1, explanation: '"Slipped" = moved to a later date than originally planned. Neutral term — doesn\'t assign blame.' },
              { question: 'A developer says "I\'ll have a better estimate after the spike." What is a "spike" in agile?', options: ['A sudden increase in server traffic', 'A time-boxed investigation to reduce uncertainty about a task', 'A type of unit test', 'A late-night coding session'], correct: 1, explanation: 'A spike = a short, time-limited research task to explore an unknown area and provide enough information to estimate the actual work.' }
            ]
          }
        ]
      },

      // ── L1.M5.L4 — Progress Updates ───────────────────────
      {
        id: 'L1.M5.L4',
        title: 'Progress Updates',
        subtitle: 'Reporting status in English',
        difficulty: 'beginner',
        duration: 15,
        xpReward: 75,
        sections: [
          {
            type: 'warmup',
            prompt: 'How do you answer "What are you working on?" in your standup? Write your typical standup update in English — as if you were saying it right now.',
            tip: 'Three parts: yesterday, today, blockers. Be specific but brief — standup isn\'t a status meeting, it\'s a quick sync.'
          },
          {
            type: 'vocabulary',
            words: [
              { word: 'in progress', phonetic: '/ɪn ˈprɒɡrɛs/', meaning: '(phrase) A task that has started but is not yet complete', example: 'The authentication refactor is in progress — I expect to have a PR up by end of day.', techNote: 'Jira/Linear statuses: To Do → In Progress → In Review → Done. "In progress" = actively being worked on.' },
              { word: 'blocker', phonetic: '/ˈblɒkər/', meaning: '(n) Anything that prevents a developer from making progress on their task', example: 'I have a blocker — I\'m waiting for the design spec before I can continue.', techNote: '"Hard blocker" = completely stopped. "Soft blocker" = can do some work but not everything. Always surface blockers in standup.' },
              { word: 'wrap up', phonetic: '/ræp ʌp/', meaning: '(phrasal verb) To finish or conclude something', example: 'I\'m wrapping up the PR today — just need to add tests.', techNote: '"Wrapping up" ≠ done. It means finishing the final steps. More progress than "in progress".' },
              { word: 'review', phonetic: '/rɪˈvjuː/', meaning: '(n/v) The process of a peer checking code before it\'s merged', example: 'The PR is in review — waiting on two approvals.', techNote: '"Code review" / "PR review" / "in review" — all the same concept. "Lgtm" = looks good to me (approval shorthand).' },
              { word: 'merged', phonetic: '/mɜːdʒd/', meaning: '(adj/v) Code that has been integrated into the main branch', example: 'The feature branch was merged yesterday — it\'s in staging now.', techNote: '"Merge" = combining branches. "Squash merge" = combining all commits into one. "Rebase and merge" = rewriting history before merging.' }
            ]
          },
          {
            type: 'explanation',
            title: 'How to give clear status updates in English',
            content: '<p>Progress updates are a daily communication skill. Whether in standup, async Slack messages, or sprint reviews, knowing how to report status clearly in English is essential.</p><p><strong>The standup formula:</strong></p><ol><li><em>Yesterday:</em> What did you complete? "I finished the validation logic and opened a PR."</li><li><em>Today:</em> What are you working on? "Today I\'m addressing the review comments and writing tests."</li><li><em>Blockers:</em> Is anything stopping you? "No blockers" OR "Blocked on X — I\'ll reach out to [person]."</li></ol><p><strong>Status vocabulary ladder (from least to most done):</strong></p><ol><li><em>Haven\'t started</em> — "This is still in the backlog"</li><li><em>Starting today</em> — "Picking this up today"</li><li><em>In progress</em> — "Actively working on it"</li><li><em>Almost done</em> — "Wrapping up", "Just finishing"</li><li><em>PR open</em> — "Up for review", "PR is open", "Waiting on review"</li><li><em>In review</em> — "In review", "Waiting on approval"</li><li><em>Merged</em> — "Merged into main", "In staging"</li><li><em>Done / shipped</em> — "Live", "Deployed", "Done"</li></ol>'
          },
          {
            type: 'tech-example',
            title: 'Standup updates across a sprint week',
            scenario: 'Watch how a developer communicates progress across five days:',
            dialogue: [
              { speaker: 'Monday — You', text: 'Yesterday: finished the research spike on the notification system architecture. Today: starting the backend API for notification storage. No blockers.', isYou: true },
              { speaker: 'Tuesday — You', text: 'Yesterday: got the basic API endpoints up and tested locally. Today: integrating with the frontend and handling edge cases. Still no blockers.', isYou: true },
              { speaker: 'Wednesday — You', text: 'Yesterday: most of the integration is done. Today: writing unit tests and opening a PR. One soft blocker — I need design confirmation on the notification bell icon, but it won\'t block the PR.', isYou: true },
              { speaker: 'Thursday — You', text: 'Yesterday: PR is open and in review. Today: addressing review comments. One hard blocker: CI is failing — infrastructure issue, not my code. Pinging DevOps.', isYou: true },
              { speaker: 'Friday — You', text: 'Yesterday: CI was fixed by DevOps, review comments addressed. The PR is approved. Today: merging and monitoring in staging. Should be deployed to prod EOD.', isYou: true }
            ],
            tip: '"Spike" = research task. "Soft blocker" = can still work, but missing something. "Hard blocker" = completely stopped. "Pinging" = reaching out to. "Monitoring" = watching for issues after deploy.'
          },
          {
            type: 'speaking',
            prompt: 'Write your standup update for today in English. Use a real or imagined task. Include: what you did yesterday, what you\'re doing today, and any blockers.',
            tip: 'Be specific and short. "Working on the login page" is vague. "Working on the form validation for the login page — specifically the email regex and error states" is clear.',
            example: '"Yesterday: finished the UI for the password reset form and connected it to the API. The happy path is working end-to-end. Today: adding validation for edge cases — empty fields, invalid email format, expired reset links. One blocker: I need the error message copy from the content team before I can finalize the error states. I\'ll follow up with them this morning."'
          },
          {
            type: 'quiz',
            questions: [
              { question: 'A developer says "I have a hard blocker." What does this mean?', options: ['The task is technically very difficult', 'They are completely unable to make progress until the blocker is resolved', 'They are slightly slowed down but can continue', 'The blocker was resolved yesterday'], correct: 1, explanation: '"Hard blocker" = completely stopped. Nothing can be done until it\'s resolved. "Soft blocker" = slowed but not stopped.' },
              { question: 'What does "the PR is in review" mean?', options: ['The code was approved and merged', 'The code has been submitted and is waiting for peer review', 'The developer is reviewing someone else\'s code', 'The PR was rejected'], correct: 1, explanation: '"In review" = the PR (Pull Request) has been opened and is waiting for colleagues to read, comment, and approve it.' },
              { question: 'A developer says "wrapping up." What stage are they at?', options: ['Just starting the task', 'About halfway done', 'Finishing the final steps — almost complete', 'Done and deployed'], correct: 2, explanation: '"Wrapping up" = in the final stages, almost done. More complete than "in progress" but not yet done.' },
              { question: 'What does "LGTM" mean in a code review comment?', options: ['Let\'s Get To Merging', 'Looks Good To Me — approval shorthand', 'Latest Git To Main', 'Large Gradle Test Module'], correct: 1, explanation: 'LGTM = "Looks Good To Me" — a standard code review approval shorthand used by developers globally.' }
            ]
          }
        ]
      },

      // ── L1.M5.L5 — Launch & Go-Live ───────────────────────
      {
        id: 'L1.M5.L5',
        title: 'Launch & Go-Live',
        subtitle: 'Deployment day communication',
        difficulty: 'beginner',
        duration: 20,
        xpReward: 100,
        sections: [
          {
            type: 'warmup',
            prompt: 'Imagine your team is deploying a major feature today. What would your pre-launch checklist look like? Write 4–5 items in English.',
            tip: 'Think: what do you verify before, during, and after a deploy? Tests? Monitoring? Rollback plan? Communication?'
          },
          {
            type: 'vocabulary',
            words: [
              { word: 'deploy', phonetic: '/dɪˈplɔɪ/', meaning: '(v) To release code to a server or environment where it becomes available to users', example: 'We\'re deploying to production at 2pm — all hands on deck.', techNote: '"Deploy to staging" = test environment. "Deploy to prod" = live users see it. "Continuous deployment" = automated deploy on every merged PR.' },
              { word: 'rollback', phonetic: '/ˈroʊlbæk/', meaning: '(n/v) Reverting to the previous version of code or configuration after a failed deployment', example: 'The deploy caused errors — initiating rollback to v2.1.4.', techNote: '"Rollback plan" = the prepared steps to undo a deploy. Always have one before going live.' },
              { word: 'monitoring', phonetic: '/ˈmɒnɪtərɪŋ/', meaning: '(n) Watching system metrics, logs, and errors in real time after a deploy', example: 'I\'ll monitor the error rate for 30 minutes after the deploy.', techNote: 'Tools: Datadog, Grafana, Sentry, New Relic. "Spike in errors" = sudden increase. "Baseline" = normal pre-deploy level.' },
              { word: 'feature flag', phonetic: '/ˈfiːtʃər flæɡ/', meaning: '(n) A configuration switch that enables or disables a feature in production without a code deploy', example: 'We\'ll use a feature flag to roll out the new checkout flow to 10% of users first.', techNote: '"Flag on" = feature enabled. "Flag off" = feature hidden. Allows gradual rollouts and instant kill-switch.' },
              { word: 'go live', phonetic: '/ɡoʊ laɪv/', meaning: '(phrasal verb) To make a feature or product available to real users in production', example: 'We go live at 3pm EST — make sure you\'re available for monitoring.', techNote: '"Go live" = deploy + announce. It implies the feature is available to users, not just deployed.' }
            ]
          },
          {
            type: 'explanation',
            title: 'Launch day communication vocabulary',
            content: '<p>Deployment day has its own vocabulary and rituals. Knowing how to communicate clearly during and after a launch is as important as the technical execution.</p><p><strong>Pre-launch checklist phrases:</strong></p><ul><li><em>"The feature flag is ready to enable."</em></li><li><em>"Staging smoke test is green — we\'re good to go."</em></li><li><em>"Rollback plan is documented — see the runbook."</em></li><li><em>"All hands on deck — this is a high-risk deploy."</em></li><li><em>"Who\'s on call tonight?"</em></li></ul><p><strong>During deployment:</strong></p><ul><li><em>"Deployment started — watching the pipeline."</em></li><li><em>"Green across all checks — looking good."</em></li><li><em>"Spike in error rate — investigating."</em></li><li><em>"Initiating rollback — do not merge anything."</em></li></ul><p><strong>Post-launch:</strong></p><ul><li><em>"We\'re live — monitor for the next hour."</em></li><li><em>"Error rate is within baseline — looks healthy."</em></li><li><em>"One issue spotted — it\'s minor, hotfix incoming."</em></li><li><em>"Deploy successful — feature is fully live for 100% of users."</em></li></ul><p><strong>Key concept — gradual rollout:</strong> Instead of deploying to all users at once, use feature flags to roll out to 1% → 10% → 50% → 100%. Reduces risk significantly.</p>'
          },
          {
            type: 'tech-example',
            title: 'Slack thread — deployment day',
            scenario: 'The team is deploying a new checkout flow. Here\'s the real-time communication:',
            dialogue: [
              { speaker: 'Priya (Lead)', text: '📢 Deploy starts in 10 minutes. Reminder: feature flag is OFF by default — we\'ll enable it for 10% of users once the deploy is confirmed healthy. Rollback doc: [link]' },
              { speaker: 'You', text: 'Staging smoke test is green. All critical flows passed. Ready on my end.', isYou: true },
              { speaker: 'Marcus (DevOps)', text: 'Deploy started. Watching the pipeline — all stages green so far.' },
              { speaker: 'Marcus (DevOps)', text: '✅ Deploy complete. Enabling the feature flag for 10% of users now.' },
              { speaker: 'You', text: 'Monitoring error rate in Sentry. Baseline is 0.3% — currently at 0.28%. Looks healthy.', isYou: true },
              { speaker: 'Priya (Lead)', text: 'Good. Keep watching for 30 min. If it stays clean, we\'ll ramp to 50% at 4pm and 100% tomorrow morning.' },
              { speaker: 'You', text: '30 minutes in — error rate stable at 0.3%. No anomalies in the checkout flow. Looking good to ramp. 👍', isYou: true }
            ],
            tip: '"All hands on deck" = everyone available and focused. "Smoke test" = basic quick test to confirm nothing is catastrophically broken. "Ramp" = gradually increase the percentage of users seeing the feature.'
          },
          {
            type: 'speaking',
            prompt: 'Write a post-deploy Slack message for your team after a successful feature launch. Include: confirmation it\'s live, what to monitor, any known issues, and next steps.',
            tip: 'Keep it factual and clear. Use emoji sparingly if your team does. Include: status, metrics, next action.',
            example: '"✅ The new search feature is now live for 100% of users. The deploy was clean — no spikes in error rate. Response times are within SLA (p95: 280ms vs baseline 270ms). One known issue: the loading skeleton doesn\'t appear on cached pages — this is cosmetic and a fix is already in review (#PR-847). I\'ll monitor logs for another hour and then hand off to the on-call engineer. If anything looks off, ping me directly. Great work everyone — this one took two sprints and it shipped clean. 🚀"'
          },
          {
            type: 'quiz',
            questions: [
              { question: 'What is a "rollback" in deployment?', options: ['Deploying a new version', 'Reverting to the previous working version of code or configuration', 'Reviewing code before deployment', 'Rolling out a feature to more users'], correct: 1, explanation: 'Rollback = undoing a deployment by reverting to the previous version. Essential when a deploy causes errors or outages.' },
              { question: 'A developer says "we\'re using a feature flag for the rollout." What does this mean?', options: ['The feature is enabled for all users immediately', 'A configuration switch controls who sees the feature, allowing gradual rollout', 'The feature is deployed but hidden in the code', 'A flag will appear in the UI when the feature loads'], correct: 1, explanation: 'Feature flags enable/disable features without a code deploy. They allow gradual rollouts (1%, 10%, 50%, 100%) and instant kill-switches.' },
              { question: 'The team says "all hands on deck." What does this mean?', options: ['Everyone is working from the office today', 'Everyone should be available and focused on this deployment', 'The team is expanding', 'The ship is leaving port'], correct: 1, explanation: '"All hands on deck" = everyone available and ready to respond. Used for high-stakes deployments or incidents.' },
              { question: 'What is a "smoke test" in the context of deployment?', options: ['A test that checks for memory leaks', 'A quick basic test to verify nothing is catastrophically broken before a full test run', 'A performance benchmark', 'A test that generates intentional errors'], correct: 1, explanation: 'A smoke test = a fast, basic verification that the application starts and critical flows work. If it passes, proceed with more thorough testing.' }
            ]
          }
        ]
      }
    ]
  };

  // ─────────────────────────────────────────────────────────
  // LEVEL 1 — MODULE 6: Asking Questions  (FULL CONTENT)
  // ─────────────────────────────────────────────────────────
  var L1M6 = {
    title: 'Asking Questions',
    description: 'How to ask for help, clarify requirements, and get unstuck — professionally and without sounding awkward.',
    lessons: [
      // ── L1.M6.L1 — Clarifying Requirements ───────────────
      {
        id: 'L1.M6.L1',
        title: 'Clarifying Requirements',
        subtitle: '"Can you clarify what you mean by...?"',
        difficulty: 'beginner',
        duration: 15,
        xpReward: 75,
        sections: [
          {
            type: 'warmup',
            prompt: 'A PM sends you this message: "Can you make the button more visible?" How do you respond? Write your reply in English before reading further.',
            tip: 'There are at least 5 things you\'d need to clarify. What are they? Bigger? Different color? More padding? On which screen? For which users?'
          },
          {
            type: 'vocabulary',
            words: [
              { word: 'clarify', phonetic: '/ˈklærɪfaɪ/', meaning: '(v) To make something clearer by asking for more specific information', example: 'Can you clarify what you mean by "faster"? Are we targeting load time or response time?', techNote: '"Clarify" is the professional word. Avoid "I don\'t understand" alone — follow it immediately with a specific question.' },
              { word: 'confirm', phonetic: '/kənˈfɜːrm/', meaning: '(v) To verify that your understanding of something is correct', example: 'Just to confirm — the deadline is end of sprint, not end of the week?', techNote: '"Just to confirm" is a polite opener that doesn\'t imply the other person was unclear — it puts the verification on you.' },
              { word: 'elaborate', phonetic: '/ɪˈlæbərɪt/', meaning: '(v) To explain in more detail', example: 'Could you elaborate on what you mean by "better user experience"?', techNote: '"Could you elaborate on...?" is more formal. "Can you say more about...?" is more casual. Both are correct and professional.' },
              { word: 'expectation', phonetic: '/ˌɛkspɛkˈteɪʃən/', meaning: '(n) What someone anticipates will happen or what they want to receive', example: 'I want to make sure my understanding of the expected behavior is correct.', techNote: '"Align on expectations" = make sure everyone agrees on what should happen. Critical before starting any significant work.' },
              { word: 'edge case', phonetic: '/ɛdʒ keɪs/', meaning: '(n) An unusual boundary condition that might not be covered by the main requirements', example: 'What should happen at the edge case where the user has no internet connection?', techNote: 'Asking about edge cases during requirements clarification = senior developer behavior. Most bugs live in edge cases.' }
            ]
          },
          {
            type: 'explanation',
            title: 'How to ask clarifying questions professionally',
            content: '<p>Asking good clarifying questions is a sign of expertise, not weakness. Senior developers are known for asking the right questions early — before building the wrong thing.</p><p><strong>The 3-part clarifying question formula:</strong></p><ol><li>Acknowledge what was said</li><li>State your current understanding</li><li>Ask for confirmation or more detail</li></ol><p><em>Example: "I understand you want the form to validate on submit. Just to confirm — should it also validate in real time as the user types, or only when they click Submit?"</em></p><p><strong>Phrases for requirements clarification:</strong></p><ul><li><em>"Can you clarify what you mean by [X]?"</em></li><li><em>"Just to make sure I understand — [restate your understanding]. Is that correct?"</em></li><li><em>"What\'s the expected behavior when [edge case]?"</em></li><li><em>"Is that a hard requirement, or a nice-to-have?"</em></li><li><em>"Who is the primary user for this feature?"</em></li><li><em>"What does success look like for this?"</em></li></ul><p><strong>Avoid:</strong></p><ul><li><em>"I don\'t understand."</em> → Too vague. What specifically don\'t you understand?</li><li><em>"That\'s not clear."</em> → Sounds blaming. Rephrase: "Could you help me understand...?"</li></ul>'
          },
          {
            type: 'tech-example',
            title: 'Slack thread — requirement needs clarification',
            scenario: 'A product manager posted a vague requirement. Watch how to handle it professionally:',
            dialogue: [
              { speaker: 'PM Daniel', text: 'Task: improve the performance of the dashboard page. It should load faster. Priority: high.' },
              { speaker: 'You', text: 'Hi Daniel, happy to work on this. A few things to clarify before I start: What\'s the current load time you\'re measuring, and what\'s the target?', isYou: true },
              { speaker: 'PM Daniel', text: 'It takes about 8 seconds right now. We\'d love it under 3.' },
              { speaker: 'You', text: 'Got it. Is this the initial load (first paint) or the time until all data is displayed? And are we targeting all users or a specific region where it\'s particularly slow?', isYou: true },
              { speaker: 'PM Daniel', text: 'Time until data is displayed, for all users. European users are complaining most.' },
              { speaker: 'You', text: 'Perfect — that tells me where to focus. I\'m assuming we can use caching and CDN optimizations. Should I also look at the API response times, or just the frontend?', isYou: true },
              { speaker: 'PM Daniel', text: 'Both if needed. Your call on the approach — just hit the 3-second target.' }
            ],
            tip: '"First paint" = when the user first sees something. "Time to data" = when meaningful content appears. "CDN" = Content Delivery Network (serves content from servers closer to the user).'
          },
          {
            type: 'speaking',
            prompt: 'A colleague says: "Add a dark mode to the app." Write 4–5 clarifying questions you would ask before starting. Write them in English.',
            tip: 'Think about: which pages, user preference storage, OS system preference, specific color tokens, beta rollout?',
            example: '"Before I start, a few questions: Should dark mode follow the user\'s OS system preference automatically, or should it be a manual toggle in the app? Where should the preference be stored — localStorage, their account settings, or both? Are we redesigning the full color palette, or just applying an existing dark theme? Which pages are in scope — all of them, or just the main app views? And do you want to ship this behind a feature flag to a subset of users first, or straight to everyone?"'
          },
          {
            type: 'quiz',
            questions: [
              { question: 'A PM says "make it faster." What is the best first response?', options: ['"OK."', '"That\'s not specific enough."', '"Can you clarify what you mean by faster — load time, response time, or animation speed?"', '"I\'ll look into it."'], correct: 2, explanation: 'Acknowledge the request and immediately ask for specific, measurable clarification. Don\'t start building without it.' },
              { question: 'What does "just to confirm" signal in a professional context?', options: ['You didn\'t understand what was said', 'You\'re verifying your understanding — politely, without blaming the other person', 'You\'re questioning the other person\'s decision', 'You\'re asking for permission'], correct: 1, explanation: '"Just to confirm" frames the verification as your own check, not a criticism of how clearly something was explained. Very professional phrasing.' },
              { question: 'Why is asking about edge cases during requirements discussion considered senior behavior?', options: ['It shows you know a lot of terminology', 'It delays the start of development', 'It prevents bugs and rework by surfacing overlooked scenarios early', 'It impresses the product manager'], correct: 2, explanation: 'Most bugs live in edge cases. Asking about them before writing code = catching problems when they\'re cheap to fix, not after.' },
              { question: 'A colleague says "could you elaborate on that?" What are they asking for?', options: ['A shorter explanation', 'More detailed information about what was just said', 'A different approach to the problem', 'Permission to ask a question'], correct: 1, explanation: '"Elaborate" = explain in more detail. "Could you elaborate on...?" is a polite way to ask for more information.' }
            ]
          }
        ]
      },

      // ── L1.M6.L2 — Asking for Help ────────────────────────
      {
        id: 'L1.M6.L2',
        title: 'Asking for Help',
        subtitle: 'Requesting assistance professionally',
        difficulty: 'beginner',
        duration: 15,
        xpReward: 75,
        sections: [
          {
            type: 'warmup',
            prompt: 'Think about the last time you needed help with a technical problem. How long did you struggle before asking? Now: how would you have asked for help in English? Write a short message.',
            tip: 'The best help requests include: what you\'re trying to do, what you\'ve already tried, and what happened.'
          },
          {
            type: 'vocabulary',
            words: [
              { word: 'stuck', phonetic: '/stʌk/', meaning: '(adj) Unable to make progress — not knowing what to do next', example: 'I\'ve been stuck on this for two hours — can I pair with someone?', techNote: '"Stuck" is the honest, natural word. "I\'m stuck" is direct and doesn\'t imply failure — it\'s a signal to collaborate.' },
              { word: 'debug', phonetic: '/ˌdiːˈbʌɡ/', meaning: '(v) To find and fix bugs or errors in code', example: 'I\'ve been debugging this for 3 hours and I can\'t find the issue — fresh eyes would help.', techNote: '"Debug" is both a technical action and a conversational shorthand: "I\'m debugging" = I\'m investigating a problem.' },
              { word: 'reproduce', phonetic: '/ˌriːprəˈdjuːs/', meaning: '(v) To trigger the same bug or error in a controlled way', example: 'I can reproduce the bug consistently — it happens every time I submit an empty form.', techNote: '"Can you reproduce it?" = can you make it happen again? "Intermittent" = happens sometimes but not always. Hard to debug.' },
              { word: 'pair', phonetic: '/pɛr/', meaning: '(v/n) Pair programming — two developers working together on the same code', example: 'Want to pair on this? Two sets of eyes might spot it faster.', techNote: '"Pair" as a verb: "Let\'s pair on this." "Driver" = person typing. "Navigator" = person thinking out loud.' },
              { word: 'workaround', phonetic: '/ˈwɜːrkəraʊnd/', meaning: '(n) A temporary solution that bypasses a bug or limitation without fully fixing it', example: 'I found a workaround for now — it\'s not clean but it unblocks us for the demo.', techNote: 'Always document workarounds with a TODO comment and create a ticket. Workarounds become permanent if not tracked.' }
            ]
          },
          {
            type: 'explanation',
            title: 'How to ask for help effectively in English',
            content: '<p>There is an art to asking for help. A poorly-worded help request can waste everyone\'s time. A well-worded one gets you unblocked in minutes.</p><p><strong>The perfect help request has 4 parts:</strong></p><ol><li><strong>Context:</strong> What are you trying to do?</li><li><strong>Tried:</strong> What have you already tried?</li><li><strong>Happened:</strong> What actually happens (error, unexpected behavior)?</li><li><strong>Ask:</strong> Specific question or type of help you need</li></ol><p><em>Bad: "My code doesn\'t work. Help."</em></p><p><em>Good: "I\'m trying to make an API call to the /users endpoint. I\'ve checked the auth headers and they look correct. The request returns 403 — but only in production, not in staging. I\'ve compared the env vars and they match. Could you take a look at whether there\'s a WAF rule or IP restriction I\'m not aware of?"</em></p><p><strong>Common phrases for asking for help:</strong></p><ul><li><em>"I\'ve been stuck on this for [time] — mind taking a look?"</em></li><li><em>"I could use a second pair of eyes on this."</em></li><li><em>"Before I go deeper down this rabbit hole — does this approach make sense?"</em></li><li><em>"Is there someone available to pair for 20 minutes?"</em></li><li><em>"Any idea what might cause [specific symptom]?"</em></li></ul>'
          },
          {
            type: 'tech-example',
            title: 'Slack thread — asking for help the right way',
            scenario: 'A developer is stuck on a tricky bug and writes a clear, structured help request:',
            dialogue: [
              { speaker: 'You', text: '@channel I\'m stuck and could use help. Context: I\'m implementing WebSocket reconnection logic. Problem: after a network dropout, the client reconnects successfully, but the first 2–3 messages after reconnect are lost. I\'ve checked that the reconnect event fires correctly — it does. I\'ve also tried buffering messages during the reconnection window — they\'re sent but not received.', isYou: true },
              { speaker: 'You', text: 'Any idea what might cause messages to be lost in the first few seconds after reconnect? Happy to share the code or pair on it.', isYou: true },
              { speaker: 'Dmitri', text: 'Seen this before — could be a race condition between the "connected" event and the actual socket being ready to receive. Try adding a small delay before the first post-reconnect send, or wait for the first server ping/pong.' },
              { speaker: 'You', text: 'That makes sense! I was assuming "connected" = fully ready. Let me try the ping/pong wait approach. Will report back in 30 min.', isYou: true },
              { speaker: 'You', text: '✅ Confirmed — waiting for the first server pong after reconnect fixed it completely. Thanks Dmitri!', isYou: true }
            ],
            tip: '"Down this rabbit hole" = going deeper into a complex, winding problem. "Race condition" = bug where outcome depends on unpredictable timing of concurrent operations. "Report back" = return with results.'
          },
          {
            type: 'speaking',
            prompt: 'Write a Slack message asking for help with a real or imagined bug. Include: context, what you tried, what happened, and your specific question.',
            tip: 'Be specific. "The CSS is broken" helps nobody. "The flex container on mobile ignores justify-content when the viewport is below 480px, despite the correct media query" is actionable.',
            example: '"Hi team — stuck on something and would appreciate a second pair of eyes. I\'m adding pagination to the user list API. It works fine for pages 1–3, but page 4 always returns an empty array even though there are 47 total records (10 per page). I\'ve verified the SQL query directly in the database — page 4 returns results there. I\'ve also checked the offset/limit calculation and it looks correct. The issue seems to be between the query and the response. Could someone take a look at the controller code? Happy to screen share."'
          },
          {
            type: 'quiz',
            questions: [
              { question: 'What should a good help request always include?', options: ['Just the error message', 'Context, what you tried, what happened, and a specific question', 'The full codebase for reference', 'An apology for asking'], correct: 1, explanation: 'A complete help request = context (what you\'re trying to do) + tried (what you already attempted) + happened (error/symptom) + specific question.' },
              { question: 'A colleague says "want to pair on this?" What are they suggesting?', options: ['Working independently on the same problem', 'Working together on the same code in real time', 'Sharing the code for async review', 'Swapping tasks'], correct: 1, explanation: 'Pair programming = two developers working together, usually one typing (driver) and one thinking out loud (navigator).' },
              { question: 'What is a "workaround"?', options: ['The correct fix for a bug', 'A temporary solution that bypasses a problem without fully resolving it', 'A type of code comment', 'A way to avoid testing'], correct: 1, explanation: 'A workaround = a temporary fix that unblocks you without fully solving the root cause. Always document it and create a follow-up ticket.' },
              { question: 'What does "intermittent" mean when describing a bug?', options: ['The bug is always reproducible', 'The bug appears sometimes but not consistently', 'The bug only happens in production', 'The bug only affects mobile users'], correct: 1, explanation: 'Intermittent bugs happen sporadically — not every time. They\'re harder to debug because you can\'t reproduce them on demand.' }
            ]
          }
        ]
      },

      // ── L1.M6.L3 — Technical Questions on Slack ──────────
      {
        id: 'L1.M6.L3',
        title: 'Technical Questions on Slack',
        subtitle: 'Written question formats',
        difficulty: 'beginner',
        duration: 15,
        xpReward: 75,
        sections: [
          {
            type: 'warmup',
            prompt: 'Read this Slack message: "anyone know why this breaks?" — What\'s wrong with it? What information is missing? Write your analysis in English.',
            tip: 'A question without context gets answers without solutions. What would you need to know to actually help?'
          },
          {
            type: 'vocabulary',
            words: [
              { word: 'thread', phonetic: '/θrɛd/', meaning: '(n) A chain of replies to a specific message in Slack', example: 'Let\'s keep this in the thread — no need to post to the main channel.', techNote: 'In Slack: "Reply in thread" keeps conversations organized. "Posting to channel" notifies everyone. Use threads for focused discussions.' },
              { word: 'channel', phonetic: '/ˈtʃænəl/', meaning: '(n) A dedicated Slack room for a specific topic, team, or project', example: 'Post technical questions in #dev-help, not in #general.', techNote: 'Naming convention: #team-name, #project-name, #topic. "#dev-help", "#frontend", "#incident-response" are common channels.' },
              { word: 'mention', phonetic: '/ˈmɛnʃən/', meaning: '(v/n) Tagging someone with @ to notify them directly', example: '@Maya could you review this before EOD?', techNote: '@username = direct mention. @here = everyone in the channel who is online. @channel = everyone in the channel regardless of status.' },
              { word: 'code snippet', phonetic: '/koʊd ˈsnɪpɪt/', meaning: '(n) A short piece of code shared in a message to illustrate a question or issue', example: 'I\'ll share a code snippet so you can see exactly what I\'m doing.', techNote: 'In Slack: use backticks for inline code, triple backticks for code blocks. Always include language for syntax highlighting.' },
              { word: 'reproduce steps', phonetic: '/riːprəˈdjuːs stɛps/', meaning: '(n) The step-by-step actions needed to trigger a bug or issue', example: 'I\'ll include reproduce steps so you don\'t have to guess how to see the problem.', techNote: 'Same as "steps to reproduce" or "repro steps". Essential for bug reports and technical questions.' }
            ]
          },
          {
            type: 'explanation',
            title: 'Writing effective technical questions on Slack',
            content: '<p>Async text communication — Slack, GitHub, Discord — requires more precision than face-to-face conversation. You can\'t read body language and back-and-forth takes hours. Write once, write clearly.</p><p><strong>Structure for a technical question in Slack:</strong></p><ol><li><strong>What:</strong> What are you trying to do? One sentence.</li><li><strong>Problem:</strong> What\'s happening instead? Include the error message verbatim.</li><li><strong>Context:</strong> Relevant code snippet, environment, or config.</li><li><strong>Tried:</strong> What did you already attempt?</li><li><strong>Question:</strong> Specific ask — don\'t end with just "any ideas?"</li></ol><p><strong>Slack formatting tips for questions:</strong></p><ul><li>Use code blocks (```) for code and error messages — never paste plain text</li><li>Use bullet points for steps to reproduce</li><li>Bold the actual question so it\'s easy to find</li><li>Tag only people who can actually help — don\'t blast @channel for everything</li><li>Reply in threads to keep channels clean</li></ul><p><strong>Timing etiquette:</strong></p><ul><li><em>"Anyone available to look at this?"</em> — general request</li><li><em>"@Maya this is in your area — mind taking a look when you get a chance?"</em> — specific, respectful</li><li>Don\'t expect instant replies in async teams — set your own deadline clearly</li></ul>'
          },
          {
            type: 'tech-example',
            title: 'Before and after — improving a Slack question',
            scenario: 'See the difference between a bad and a good technical question:',
            dialogue: [
              { speaker: 'Before (bad)', text: 'hey does anyone know why my component keeps re-rendering? its super annoying' },
              { speaker: 'After (good) — You', text: '**React re-render issue — any ideas?**\n\n**Trying to do:** Render a dashboard component that fetches user data on mount.\n\n**Problem:** The component re-renders every second even when no data changes. Console shows "Fetching data..." firing continuously.\n\n**Environment:** React 18, functional components, custom hook useUserData.\n\n**Tried:**\n• Added console.log to identify what\'s changing → the effect runs every render\n• Checked dependency array in useEffect → looks correct\n• Removed all state variables one by one → still re-renders\n\n**Question:** Could the issue be that the object I\'m passing as a dependency is being recreated on every render? Code snippet below 👇', isYou: true },
              { speaker: 'Carlos', text: 'Yes — that\'s almost certainly it. If the dependency is an object literal ({ id: user.id }), it\'s a new reference every render even if the value is the same. Use useMemo or extract the value to a primitive (just user.id).' },
              { speaker: 'You', text: 'That\'s exactly it — I was passing the full config object. Switched to just passing the string ID and the re-renders stopped. Thanks! 🎯', isYou: true }
            ],
            tip: '"Dependency array" = the second argument of useEffect — tells React when to re-run the effect. "New reference" = a new object created in memory even with the same values — triggers re-render.'
          },
          {
            type: 'speaking',
            prompt: 'Format the following bad Slack question into a good one: "anyone know why my API call returns undefined sometimes? help". Include structure, code snippet placeholder, and a specific question.',
            tip: 'Use the 5-part structure: What / Problem / Context / Tried / Question. Add formatting.',
            example: '"**Intermittent undefined from API call — help needed**\n\n**Trying to do:** Fetch user profile data on page load via /api/users/{id}.\n\n**Problem:** The call returns undefined intermittently — maybe 1 in 5 requests. No error in the console, just undefined response.data.\n\n**Environment:** Node.js v20, Axios 1.6, REST API.\n\n**Tried:**\n• Added console.log before and after the call — undefined happens after the call completes\n• Checked network tab — when it fails, status is 200 but response body is empty\n• Reproduced 6 times in staging, never in local dev\n\n**Question:** Could this be a race condition in the API, or is there a known issue with Axios returning undefined for empty 200 responses? Code below 👇"'
          },
          {
            type: 'quiz',
            questions: [
              { question: 'You want to tag someone in Slack without notifying the whole channel. What should you use?', options: ['@channel', '@here', '@username', '#channel'], correct: 2, explanation: '@username = direct notification to one person. @channel = notifies everyone in the channel. @here = notifies only currently active members.' },
              { question: 'Why should you use code blocks (```) when sharing code in Slack?', options: ['It makes the text bold', 'It preserves formatting, enables syntax highlighting, and makes the code readable', 'It notifies the recipient', 'It compresses the message size'], correct: 1, explanation: 'Code blocks preserve indentation, prevent markdown from interfering, and often apply syntax highlighting — making code much easier to read.' },
              { question: 'A colleague says "reply in thread." What do they want you to do?', options: ['Send a direct message to them', 'Reply to the specific message, not in the main channel', 'Create a new channel', 'Post the reply at the bottom of the channel'], correct: 1, explanation: 'Threads keep conversations organized around a specific message without flooding the main channel. Standard practice in async-heavy teams.' },
              { question: 'What makes "any ideas?" a weak question ending?', options: ['It\'s too casual', 'It\'s too broad — it doesn\'t tell responders what specifically you need', 'It\'s grammatically incorrect', 'It sounds too aggressive'], correct: 1, explanation: '"Any ideas?" invites vague responses. A specific question — "Could this be a race condition?" or "Is there a config I\'m missing?" — gets faster, more useful answers.' }
            ]
          }
        ]
      },

      // ── L1.M6.L4 — Stack Overflow English ────────────────
      {
        id: 'L1.M6.L4',
        title: 'Stack Overflow English',
        subtitle: 'How to ask and answer questions online',
        difficulty: 'beginner',
        duration: 15,
        xpReward: 75,
        sections: [
          {
            type: 'warmup',
            prompt: 'Have you ever posted a question on Stack Overflow or GitHub Discussions and gotten no response — or a "closed as duplicate" response? What do you think made your question ineffective? Write in English.',
            tip: 'Think about: title clarity, code example, what you tried, whether the problem was reproducible.'
          },
          {
            type: 'vocabulary',
            words: [
              { word: 'minimal reproducible example', phonetic: '/ˈmɪnɪməl rɪˌprɒdjuːsɪbəl ɪɡˈzɑːmpəl/', meaning: '(n) The smallest, self-contained piece of code that demonstrates the problem', example: 'Could you provide a minimal reproducible example? It\'ll help us diagnose the issue faster.', techNote: 'Also called "MRE" or "minimal example." The shorter and more isolated, the better. Remove everything that doesn\'t relate to the bug.' },
              { word: 'duplicate', phonetic: '/ˈdjuːplɪkɪt/', meaning: '(n/adj) A question that has already been answered elsewhere on the platform', example: 'This question was marked as a duplicate — the answer is in the linked post.', techNote: 'Stack Overflow closed questions often say "marked as duplicate of [link]." Check the linked answer before reposting.' },
              { word: 'upvote / downvote', phonetic: '/ˈʌpvoʊt/ /ˈdaʊnvoʊt/', meaning: '(n/v) Community signals indicating a question or answer is helpful (up) or not useful (down)', example: 'The accepted answer has 847 upvotes — it\'s reliable.', techNote: '"Accepted answer" = the answer the question asker marked as correct. "Upvotes" = community validation. High upvotes = trustworthy.' },
              { word: 'expected behavior', phonetic: '/ɪkˈspɛktɪd bɪˈheɪvjər/', meaning: '(n) What the code should do according to the specification or the developer\'s intent', example: 'My code returns null but the expected behavior is to return an empty array.', techNote: 'Essential Stack Overflow phrasing: "Current behavior: X. Expected behavior: Y." This structure helps responders quickly understand the gap.' },
              { word: 'workaround', phonetic: '/ˈwɜːrkəraʊnd/', meaning: '(n) A temporary solution while waiting for a proper fix', example: 'I found a workaround but I\'m looking for the root cause.', techNote: 'In Stack Overflow: mentioning you found a workaround but want the correct fix shows you\'ve tried. Good signal.' }
            ]
          },
          {
            type: 'explanation',
            title: 'Writing Stack Overflow questions and answers in English',
            content: '<p>Stack Overflow has strict quality standards. Understanding the format makes you more effective — whether you\'re asking or answering.</p><p><strong>Anatomy of a good Stack Overflow question:</strong></p><ol><li><strong>Title:</strong> Specific and searchable. "React useEffect runs on every render despite dependency array" beats "useEffect problem"</li><li><strong>Problem statement:</strong> Current behavior + expected behavior in 2–3 sentences</li><li><strong>Minimal reproducible example:</strong> The smallest code that shows the bug</li><li><strong>What I tried:</strong> At least 2–3 things you already attempted</li><li><strong>Environment:</strong> Framework version, OS, relevant config</li></ol><p><strong>Common SO phrases:</strong></p><ul><li><em>"I\'m trying to [goal] but [problem] happens instead."</em></li><li><em>"Current behavior: [X]. Expected behavior: [Y]."</em></li><li><em>"Here is a minimal reproducible example:"</em></li><li><em>"I\'ve tried [X] and [Y] but neither worked."</em></li><li><em>"I found a workaround ([describe it]) but I\'d like to understand the root cause."</em></li></ul><p><strong>Answering questions in English:</strong></p><ul><li>Start with the direct answer, then explain why</li><li>Include a working code example when possible</li><li>Reference official documentation</li><li>If you\'re not 100% sure: "I believe this is because..." or "This might be..."</li></ul>'
          },
          {
            type: 'tech-example',
            title: 'A well-structured Stack Overflow question',
            scenario: 'Read this example of a well-written SO question and notice the structure:',
            dialogue: [
              { speaker: 'Title', text: 'CSS Flexbox: justify-content: center not working on mobile — only when viewport < 480px' },
              { speaker: 'Question body', text: 'I\'m trying to center a flex container\'s children horizontally. It works correctly on desktop, but on mobile (viewport below 480px) the items are left-aligned despite justify-content: center being set.' },
              { speaker: 'Current behavior', text: 'Items are left-aligned at viewports below 480px.' },
              { speaker: 'Expected behavior', text: 'Items should be centered at all viewport sizes.' },
              { speaker: 'Minimal example', text: '.container { display: flex; justify-content: center; flex-wrap: wrap; }\n\nThe wrapping is needed because the items break to multiple lines on mobile.' },
              { speaker: 'What I tried', text: '1) Removed flex-wrap — items center correctly but overflow. 2) Added align-items: center — no change. 3) Checked browser DevTools — justify-content: center is applied and not overridden.' },
              { speaker: 'Answer — Marta (500 upvotes)', text: 'When flex-wrap: wrap is active and items wrap to new lines, justify-content centers items on their line — but if there\'s only one item per line and it doesn\'t fill the line, it may appear left-aligned. Try width: 100% on the flex items, or use justify-items: center on a CSS Grid container instead.' }
            ],
            tip: 'Notice: the question is searchable, has exact symptoms, a working minimal example, and lists what was tried. The answer is direct and explains the root cause.'
          },
          {
            type: 'speaking',
            prompt: 'Write a Stack Overflow question title and opening paragraph for this scenario: you\'re getting a CORS error when calling an API from localhost, but only in Chrome, not Firefox. Include: title, current vs expected behavior, and what you\'ve tried.',
            tip: 'A good title is specific and searchable. A good opening gives the reader everything they need without scrolling to see the code.',
            example: '"Title: CORS error in Chrome on localhost API call — works in Firefox, fails in Chrome 124\n\nI\'m making a fetch request from localhost:3000 to an API at api.example.com. The request succeeds in Firefox 125 but throws a CORS error in Chrome 124: \'Access to fetch at api.example.com from origin http://localhost:3000 has been blocked by CORS policy.\'\n\nCurrent behavior: Chrome blocks the request with CORS error. Expected behavior: request completes as it does in Firefox.\n\nI\'ve tried: 1) Checking the API response headers — Access-Control-Allow-Origin is set to \'*\'. 2) Adding mode: \'cors\' to the fetch options — no change. 3) Disabling Chrome extensions — still fails.\n\nEnvironment: Chrome 124 (Windows 11), Firefox 125, Node.js API with Express."'
          },
          {
            type: 'quiz',
            questions: [
              { question: 'What is a "minimal reproducible example"?', options: ['A summary of the full codebase', 'The smallest, self-contained code that demonstrates the specific problem', 'The first version of the code before any bugs', 'A unit test for the broken function'], correct: 1, explanation: 'A minimal reproducible example isolates the bug. Remove everything unrelated to the problem — it helps responders understand and reproduce your issue fast.' },
              { question: 'Your Stack Overflow question was "marked as duplicate." What does this mean?', options: ['Your question was deleted', 'The same question has already been answered — a link to the answer is provided', 'Your code has a duplicate variable name', 'Your question was too complex'], correct: 1, explanation: '"Marked as duplicate" = someone found an existing question with the same problem already answered. Read the linked answer before reposting.' },
              { question: 'What is the recommended structure for describing a bug in a Stack Overflow question?', options: ['"I tried X and it doesn\'t work."', '"Current behavior: [X]. Expected behavior: [Y]."', '"The bug is in line 42."', '"This is similar to [other question]."'], correct: 1, explanation: '"Current behavior" vs "expected behavior" is the standard format. It immediately tells responders exactly what the gap is.' },
              { question: 'When answering on Stack Overflow, what should you do first?', options: ['Ask for more information', 'Give the direct answer, then explain why', 'Link to the documentation', 'Tell them what they did wrong'], correct: 1, explanation: 'Start with the direct answer — people scan for the solution. The explanation can follow. This is the convention on Stack Overflow.' }
            ]
          }
        ]
      },

      // ── L1.M6.L5 — "I Don't Understand" — Politely ───────
      {
        id: 'L1.M6.L5',
        title: '"I Don\'t Understand" — Politely',
        subtitle: 'Navigating confusion professionally',
        difficulty: 'beginner',
        duration: 20,
        xpReward: 100,
        sections: [
          {
            type: 'warmup',
            prompt: 'A native English speaker explains something quickly in a meeting and you didn\'t catch all of it. Do you say something? What do you say? Write your response in English.',
            tip: 'There\'s no shame in asking for clarification — the shame is in pretending you understood and building the wrong thing. How do you ask without sounding lost?'
          },
          {
            type: 'vocabulary',
            words: [
              { word: 'follow', phonetic: '/ˈfɒloʊ/', meaning: '(v) To understand what someone is saying', example: 'I\'m not following — could you slow down a bit?', techNote: '"I\'m not following" is natural and professional. "I don\'t understand" is fine but more blunt. "Follow" is the most common natural word.' },
              { word: 'rephrase', phonetic: '/ˌriːˈfreɪz/', meaning: '(v) To say something again using different words', example: 'Could you rephrase that? I want to make sure I understand correctly.', techNote: '"Rephrase" = say it differently. "Repeat" = say the exact same thing again. Both are valid requests depending on whether the phrasing or speed was the issue.' },
              { word: 'take away', phonetic: '/teɪk əˈweɪ/', meaning: '(n) The key point or lesson from a meeting, presentation, or explanation', example: 'My main takeaway is that we need to prioritize the API refactor this sprint.', techNote: '"What\'s the takeaway?" or "my takeaway is..." — useful for confirming you understood the key point after a complex explanation.' },
              { word: 'lost', phonetic: '/lɒst/', meaning: '(adj) Confused or unable to follow — used informally in professional conversations', example: 'Sorry, you lost me at the architecture part — can we go back?', techNote: '"You lost me" is very natural in English. Not offensive — it puts the responsibility on the complexity, not the speaker\'s fault.' },
              { word: 'bear with me', phonetic: '/bɛr wɪð miː/', meaning: '(phrase) A polite request for patience while you process or formulate your response', example: 'Bear with me — I\'m translating in my head and need a moment.', techNote: 'Used when you need a few seconds to think. Much better than silence. Very common in English-speaking meetings.' }
            ]
          },
          {
            type: 'explanation',
            title: 'How to handle not understanding — professionally',
            content: '<p>For non-native English speakers, one of the biggest fears is not understanding something in a meeting or conversation. Here are the tools to handle it without embarrassment.</p><p><strong>Phrases for when you didn\'t hear or missed something:</strong></p><ul><li><em>"Sorry, I didn\'t catch that — could you repeat?"</em></li><li><em>"Could you say that again? The audio cut out."</em> (great remote work excuse)</li><li><em>"I missed the last part — what was after [X]?"</em></li></ul><p><strong>Phrases for when you understood the words but not the meaning:</strong></p><ul><li><em>"I\'m not following — could you walk me through that again?"</em></li><li><em>"You lost me at [point] — can we go back?"</em></li><li><em>"Could you rephrase that? I want to make sure I understood correctly."</em></li></ul><p><strong>Confirming your understanding before moving on:</strong></p><ul><li><em>"Let me make sure I understood — [restate]. Is that right?"</em></li><li><em>"So my takeaway is [X]. Does that match what you meant?"</em></li><li><em>"Just to recap: we agreed that [X]. Correct?"</em></li></ul><p><strong>When you need time to process:</strong></p><ul><li><em>"Bear with me — I\'m processing."</em></li><li><em>"Give me a moment."</em></li><li><em>"Let me think about that."</em></li></ul><p><strong>One key mindset:</strong> Asking for clarification is a professional skill, not a weakness. Native English speakers in meetings ask for clarification all the time.</p>'
          },
          {
            type: 'tech-example',
            title: 'Architecture meeting — navigating confusion',
            scenario: 'A senior architect is explaining a complex system decision. You\'re not following part of it:',
            dialogue: [
              { speaker: 'Architect Tom', text: 'So we\'ll use an event-driven architecture with Kafka as the message broker, separate consumer groups for billing and notifications, and idempotency keys to handle at-least-once delivery semantics.' },
              { speaker: 'You', text: 'Could you slow down a bit — I want to make sure I\'m following. I understood the Kafka part, but you lost me at "at-least-once delivery." What does that mean for our system?', isYou: true },
              { speaker: 'Architect Tom', text: 'Good question. It means a message might be delivered more than once — the system guarantees it arrives at least once, but not exactly once. So our consumers need to handle duplicate messages without breaking.' },
              { speaker: 'You', text: 'Got it. So the idempotency keys are our way of detecting duplicates and ignoring them?', isYou: true },
              { speaker: 'Architect Tom', text: 'Exactly. If you\'ve already processed a message with key X, you skip it if you see it again.' },
              { speaker: 'You', text: 'That makes sense. Let me make sure I have the full picture — [restate]. Does that match what you described?', isYou: true },
              { speaker: 'Architect Tom', text: 'That\'s spot on. Good summary.' }
            ],
            tip: '"You lost me at X" = I followed up to point X, then got confused. Very useful phrase — it tells the speaker exactly where to re-explain from. "Spot on" = exactly correct.'
          },
          {
            type: 'speaking',
            prompt: 'Write a short script (3–4 exchanges) for this scenario: in a meeting, your lead explains a new deployment process too quickly and you don\'t understand the rollback procedure. Ask for clarification politely.',
            tip: 'Use: "I didn\'t follow...", "Could you walk me through...", "Let me confirm I understood...", "So the takeaway is..."',
            example: '"Lead: ...and if the deploy fails, you\'ll revert via the Argo CD rollback button, which undoes the last sync.\n\nYou: Could you walk me through that again? I\'m not sure I followed the rollback step — I\'ve never used Argo CD before.\n\nLead: Of course. You open the Argo CD dashboard, find the application, and click Rollback. It reverts to the previous successful deployment automatically.\n\nYou: Got it. Let me confirm I understood — so if I deploy version 2.3 and it breaks, I click Rollback in Argo CD and it automatically goes back to version 2.2?\n\nLead: Exactly.\n\nYou: Perfect — my takeaway is: always have the Argo CD dashboard open during deploys so I can roll back quickly if needed. I\'ll add that to the runbook."'
          },
          {
            type: 'quiz',
            questions: [
              { question: 'A colleague says "you lost me." What does this mean?', options: ['They left the meeting', 'They stopped understanding at the point you just made', 'They forgot who you are', 'They disagree with you'], correct: 1, explanation: '"You lost me" = "I was following you until now, but I\'m confused at this point." Polite and clear — tells you exactly where to re-explain.' },
              { question: 'What is the best way to confirm you understood a complex explanation?', options: ['"OK."', '"I think I got it."', '"So my takeaway is [restate]. Is that correct?"', '"Let\'s move on."'], correct: 2, explanation: 'Restating the explanation in your own words and asking for confirmation is the most reliable way to verify mutual understanding.' },
              { question: 'What does "bear with me" mean?', options: ['"I disagree with you"', '"Please be patient while I process or respond"', '"This is too difficult"', '"I\'ll explain later"'], correct: 1, explanation: '"Bear with me" = please have patience for a moment. Used when you need time to think, translate, or formulate your response.' },
              { question: 'What\'s the difference between asking someone to "repeat" vs "rephrase"?', options: ['"Repeat" means say it louder, "rephrase" means say it slower', '"Repeat" means say the same words again, "rephrase" means explain it using different words', 'They mean the same thing', '"Rephrase" is more polite than "repeat"'], correct: 1, explanation: 'Repeat = same words again (useful when you didn\'t hear). Rephrase = different words (useful when you heard but didn\'t understand the phrasing).' }
            ]
          }
        ]
      }
    ]
  };

  // ─────────────────────────────────────────────────────────
  // LEVEL 1 — MODULE 7: Simple Conversations  (FULL CONTENT)
  // ─────────────────────────────────────────────────────────
  var L1M7 = {
    title: 'Simple Conversations',
    description: 'Casual English for the moments between meetings — small talk that builds real connections with your international team.',
    lessons: [
      // ── L1.M7.L1 — Small Talk at the Office ──────────────
      {
        id: 'L1.M7.L1',
        title: 'Small Talk at the Office',
        subtitle: 'Building rapport with colleagues',
        difficulty: 'beginner',
        duration: 15,
        xpReward: 75,
        sections: [
          {
            type: 'warmup',
            prompt: 'You arrive at the office and a colleague you don\'t know well is waiting for the elevator. What do you say? Write the first 2 exchanges in English.',
            tip: 'Small talk is low-stakes — you don\'t need to be witty. Friendly, brief, and genuine is enough.'
          },
          {
            type: 'vocabulary',
            words: [
              { word: 'catch up', phonetic: '/kætʃ ʌp/', meaning: '(phrasal verb) To talk with someone to hear what they\'ve been doing recently', example: 'Let\'s grab coffee and catch up — I haven\'t seen you since the hackathon!', techNote: '"Catch up" in social context = share updates after time apart. Different from the morning "catching up on Slack" (reviewing messages).' },
              { word: 'hectic', phonetic: '/ˈhɛktɪk/', meaning: '(adj) Very busy and chaotic', example: '"How\'s it going?" "Hectic — we\'re in the middle of a big release." "Tell me about it."', techNote: '"Hectic" is very natural in tech conversations. Alternatives: "crazy busy", "flat out", "slammed". All mean extremely busy.' },
              { word: 'settle in', phonetic: '/ˈsɛtəl ɪn/', meaning: '(phrasal verb) To become comfortable in a new place or job', example: '"How\'s the new job?" "Still settling in, but the team is great."', techNote: '"Settling in" implies an adjustment period — still getting used to things. After a few weeks: "I\'m settled in now."' },
              { word: 'pull through', phonetic: '/pʊl θruː/', meaning: '(phrasal verb) To get through a difficult period successfully', example: '"Last week was brutal." "We pulled through though — deploy went well."', techNote: '"Pull through" = survive something hard. "Made it through" = same idea. Common in post-sprint debrief conversations.' },
              { word: 'hang out', phonetic: '/hæŋ aʊt/', meaning: '(phrasal verb) To spend casual time together without a specific agenda', example: '"A few of us are hanging out after work if you want to join."', techNote: '"Hang out" is casual — office social events, after-work drinks, lunch together. More casual than "meet" or "get together".' }
            ]
          },
          {
            type: 'explanation',
            title: 'Small talk: the unspoken skill that builds trust',
            content: '<p>In English-speaking workplaces, small talk is not trivial — it\'s the foundation of working relationships. The people who chat briefly at the coffee machine are the ones who collaborate more naturally in meetings.</p><p><strong>Common small talk topics in tech workplaces:</strong></p><ul><li>The weekend — "How was your weekend?"</li><li>The current sprint — "How\'s the release going?"</li><li>The weather — yes, genuinely common</li><li>Recent tech news — "Did you see that announcement from OpenAI?"</li><li>Commute — "How long is your commute?"</li><li>Remote work — "Are you in the office this week?"</li></ul><p><strong>Small talk formula:</strong></p><ol><li>Ask an open question (not yes/no)</li><li>Listen and respond briefly</li><li>Relate or share something yourself</li><li>Transition gracefully or wrap up</li></ol><p><strong>Wrap-up phrases (how to end small talk politely):</strong></p><ul><li><em>"Anyway, I should get back to it — great talking to you!"</em></li><li><em>"I\'ll let you go — enjoy your afternoon!"</em></li><li><em>"Let\'s catch up more at the team lunch."</em></li></ul>'
          },
          {
            type: 'tech-example',
            title: 'Elevator conversation — Monday morning',
            scenario: 'Two developers bump into each other on the way in:',
            dialogue: [
              { speaker: 'Priya', text: 'Hey! Haven\'t seen you in a while — how was the trip to Lisbon?' },
              { speaker: 'You', text: 'It was great, really needed it after the Q3 crunch. The city is beautiful. How\'s your project going — you were mid-deploy when I left, right?', isYou: true },
              { speaker: 'Priya', text: 'Ha — yes. We pulled through! Launched Thursday, a few minor issues but nothing critical. The team was exhausted but proud.' },
              { speaker: 'You', text: 'That\'s the best feeling — I\'m glad it went well. Is the new feature getting good feedback?', isYou: true },
              { speaker: 'Priya', text: 'Really positive so far! We should catch up properly at lunch — I want to hear more about Lisbon.' },
              { speaker: 'You', text: 'Definitely — 12:30?', isYou: true }
            ],
            tip: '"Q3 crunch" = the intense work period at the end of quarter 3. "Pulled through" = succeeded despite the difficulty. "Catch up properly" = have a real conversation, not just a quick exchange.'
          },
          {
            type: 'speaking',
            prompt: 'Write a short small talk exchange (4–6 turns) with a colleague who just returned from a vacation. Include: a greeting, asking about the trip, sharing something about your week, and wrapping up.',
            tip: 'Keep each turn short — small talk is lightweight. Avoid lengthy monologues. Ask follow-up questions.',
            example: '"You: Hey Marco! Welcome back — how was the holiday?\n\nMarco: Amazing, thank you. We went hiking in the Alps — completely disconnected for two weeks.\n\nYou: That sounds incredible. You needed it after the product launch madness. Did you actually manage to stay offline?\n\nMarco: Fully! No Slack, no email. It felt illegal at first, then amazing.\n\nYou: Ha — I know that feeling. We had a quiet week on my end, mostly bug fixes. The big news is that the new search feature shipped on Thursday.\n\nMarco: Really? That\'s been in the works forever — did it go well?\n\nYou: Cleanest deploy of the year. Anyway, I\'ll let you settle back in — coffee later?\n\nMarco: Absolutely — 3pm?"'
          },
          {
            type: 'quiz',
            questions: [
              { question: 'A colleague asks "how\'s it going?" What is the most natural professional response?', options: ['"I am functioning within normal parameters."', '"Good thanks, busy with the release — you?"', '"I am well, thank you very much for asking."', '"Fine."'], correct: 1, explanation: '"Good thanks, busy with [context] — you?" is natural, brief, and invites the conversation to continue. It\'s appropriately casual for workplace small talk.' },
              { question: 'What does "settle in" mean in a new job context?', options: ['"Start working immediately"', '"Become comfortable and adjusted to a new environment"', '"Find a place to sit"', '"Organize your desk"'], correct: 1, explanation: '"Settling in" = the process of getting comfortable in a new role or environment. It implies a gradual adjustment, not an instant start.' },
              { question: 'How do you politely end a small talk conversation?', options: ['"Goodbye."', '"Stop talking now."', '"Anyway, I should get back to it — great talking!"', '"I have to go."'], correct: 2, explanation: '"Anyway, I should get back to it" signals the close gracefully. "Great talking" adds warmth. Just saying "I have to go" is abrupt.' },
              { question: 'A colleague says "hectic." What does this mean about their week?', options: ['It was quiet and relaxed', 'It was extremely busy and chaotic', 'It was average', 'It was great'], correct: 1, explanation: '"Hectic" = very busy, fast-paced, and somewhat chaotic. Common response to "how\'s your week going?" in tech teams during active sprints.' }
            ]
          }
        ]
      },

      // ── L1.M7.L2 — On a Video Call ────────────────────────
      {
        id: 'L1.M7.L2',
        title: 'On a Video Call',
        subtitle: 'Remote meeting small talk',
        difficulty: 'beginner',
        duration: 15,
        xpReward: 75,
        sections: [
          {
            type: 'warmup',
            prompt: 'You join a video call 2 minutes early and the host is already there. What do you say while you wait for others to join? Write it in English.',
            tip: 'This is the most common moment of small talk in remote teams. It\'s brief, friendly, and low-pressure.'
          },
          {
            type: 'vocabulary',
            words: [
              { word: 'muted', phonetic: '/ˈmjuːtɪd/', meaning: '(adj) Microphone is off — your audio is not being transmitted', example: '"I think you\'re muted — we can\'t hear you."', techNote: '"You\'re on mute" is the most common English phrase in remote work. Other versions: "your mic is off", "we can\'t hear you", "you\'re muted."' },
              { word: 'drop off', phonetic: '/drɒp ɒf/', meaning: '(phrasal verb) When someone\'s connection fails and they leave the call unexpectedly', example: '"Sorry, my internet dropped off for a second — what did I miss?"', techNote: '"Drop off" = connection loss. "Freeze" = video freezes. "Cut out" = audio breaks up. "The call is breaking up" = general technical problems.' },
              { word: 'break up', phonetic: '/breɪk ʌp/', meaning: '(phrasal verb) When audio or video becomes choppy and hard to understand', example: '"You\'re breaking up — can you move closer to your router?"', techNote: 'Not the romantic kind! "Breaking up" = audio/video signal is unstable. Very common in remote meetings.' },
              { word: 'wrap up', phonetic: '/ræp ʌp/', meaning: '(phrasal verb) To finish or close a meeting', example: '"Let\'s wrap up — we\'re almost at time and everyone has the action items."', techNote: '"Wrap up" = end the meeting. Signals 2–3 minutes remaining. Alternative: "Let\'s close out."' },
              { word: 'action item', phonetic: '/ˈækʃən ˈaɪtəm/', meaning: '(n) A specific task assigned to a person during a meeting that needs to be completed', example: '"My action item is to send the API spec to the team by Thursday."', techNote: '"Action item" = task. "Owner" = the person responsible. "Due date" = when it\'s due. Common in meeting summaries.' }
            ]
          },
          {
            type: 'explanation',
            title: 'Video call English — from join to wrap up',
            content: '<p>Remote work has its own language. Knowing the right phrases for common video call situations makes you sound polished and professional on international calls.</p><p><strong>Pre-call small talk (while waiting for others):</strong></p><ul><li><em>"Hey! How are things on your end?"</em></li><li><em>"Where are you calling from today?"</em></li><li><em>"Let\'s give it a minute — still waiting on a few people."</em></li></ul><p><strong>Technical issues:</strong></p><ul><li><em>"I think you\'re muted."</em> / <em>"You\'re on mute!"</em></li><li><em>"We\'re losing you — you\'re breaking up a bit."</em></li><li><em>"My connection dropped — what did I miss?"</em></li><li><em>"Let me rejoin the call — one second."</em></li></ul><p><strong>During the meeting:</strong></p><ul><li><em>"Can everyone hear me okay?"</em></li><li><em>"I\'ll share my screen — give me a second."</em></li><li><em>"Quick note before we dive in — [important info]"</em></li><li><em>"Anyone have questions before we move on?"</em></li></ul><p><strong>Closing a call:</strong></p><ul><li><em>"Let\'s wrap up — I\'ll send the recap and action items."</em></li><li><em>"Thanks everyone — great discussion!"</em></li><li><em>"See you at standup tomorrow!"</em></li></ul>'
          },
          {
            type: 'tech-example',
            title: 'Video call — from pre-call chat to close',
            scenario: 'A design review call with international participants:',
            dialogue: [
              { speaker: 'You (joining early)', text: 'Hey Yuki! How\'s Tokyo treating you?', isYou: true },
              { speaker: 'Yuki', text: 'Ha — rainy week here. How about São Paulo?' },
              { speaker: 'You', text: 'Same actually! Okay, looks like everyone\'s here — should we kick off?', isYou: true },
              { speaker: 'Marcus (joining late)', text: 'Sorry, sorry — my dog decided to bark through the entire connection sequence.' },
              { speaker: 'You', text: 'Ha, no worries. Actually, Marcus, you might be muted — we can\'t hear you now.', isYou: true },
              { speaker: 'Marcus', text: '...better?' },
              { speaker: 'You', text: 'Perfect. Okay — before we dive in, quick context for Yuki who wasn\'t at last week\'s session...', isYou: true },
              { speaker: 'You (wrapping up)', text: 'Alright, we\'re almost at the hour. Two action items: Marcus, you own the updated spec by Friday. Yuki, can you confirm the color tokens by Wednesday? I\'ll send the recap in Slack.', isYou: true }
            ],
            tip: '"Kick off" = start the meeting. "Before we dive in" = before we get into the main topic. "You own X" = you\'re responsible for X. "Recap" = summary of what was discussed and decided.'
          },
          {
            type: 'speaking',
            prompt: 'Write the opening 3 exchanges of a video call where: you\'re the host, one person joins late, and someone has a technical issue. Use natural remote work English.',
            tip: 'Include: pre-call small talk, a latecomer, a tech issue, and a smooth transition to the topic.',
            example: '"You: Hey Ana, hey Raj! How\'s everyone? We\'ll give it 30 seconds for Leo.\n\nAna: Good here! Long week but almost Friday.\n\nYou: Tell me about it. Oh — Leo just joined. Leo, can you hear us?\n\nLeo: Sorry I\'m late — I can hear you but my camera\'s acting up. Just give me a second.\n\nYou: No worries, take your time.\n\nLeo: Okay, audio only for now — my internet is being tricky today.\n\nYou: That\'s fine, we can see your screen share later. Alright — quick agenda for today: we\'re reviewing the new onboarding flow designs. Ana, do you want to kick us off?"'
          },
          {
            type: 'quiz',
            questions: [
              { question: 'Someone on a call says "you\'re on mute." What should you do?', options: ['Leave the call', 'Unmute your microphone', 'Turn on your camera', 'Speak louder'], correct: 1, explanation: '"On mute" = microphone is off. Click the microphone button to unmute. Then confirm: "Can you hear me now?"' },
              { question: 'What does "breaking up" mean on a video call?', options: ['The meeting is being cancelled', 'The audio or video signal is choppy and hard to understand', 'Someone is upset', 'The screen share has stopped'], correct: 1, explanation: '"Breaking up" = unstable signal causing choppy audio or video. "You\'re breaking up a bit" = your connection is unstable.' },
              { question: 'At the end of a call, you say "let\'s wrap up." What does this signal?', options: ['A new agenda item is starting', 'The meeting is ending soon — 2–3 minutes remaining', 'Someone needs to leave urgently', 'The call will continue tomorrow'], correct: 1, explanation: '"Wrap up" = wind down and close. It signals the end of the main discussion and transition to action items or goodbyes.' },
              { question: 'What is an "action item" in a meeting?', options: ['An emergency situation', 'A specific task assigned to someone that must be completed after the meeting', 'A new feature request', 'A decision made during the meeting'], correct: 1, explanation: 'Action items = the tasks that come out of a meeting. Each has an owner (who) and a due date (when). Usually captured in the meeting recap.' }
            ]
          }
        ]
      },

      // ── L1.M7.L3 — Meeting New Teammates ─────────────────
      {
        id: 'L1.M7.L3',
        title: 'Meeting New Teammates',
        subtitle: 'First day and onboarding conversations',
        difficulty: 'beginner',
        duration: 15,
        xpReward: 75,
        sections: [
          {
            type: 'warmup',
            prompt: 'It\'s your first day on an international remote team. Your manager sends you a Slack message: "Say hi to the team in #general!" What do you write? Draft it now.',
            tip: 'Keep it friendly, briefly mention who you are and what you do, and show enthusiasm. Don\'t over-explain your entire career history.'
          },
          {
            type: 'vocabulary',
            words: [
              { word: 'onboard', phonetic: '/ˈɒnbɔːrd/', meaning: '(v) To introduce and integrate a new employee into the team and processes', example: 'My first week is all about onboarding — meeting the team and getting the dev environment set up.', techNote: '"Onboarding" is the noun/verb for the new employee experience. "I\'m being onboarded" or "onboarding week". It includes setup, introductions, and learning the processes.' },
              { word: 'background', phonetic: '/ˈbækɡraʊnd/', meaning: '(n) A person\'s professional history, skills, and experience', example: 'My background is in backend development, mostly Node.js and PostgreSQL.', techNote: '"What\'s your background?" = tell me about your experience and skills. More natural than "tell me your resume."' },
              { word: 'reach out', phonetic: '/riːtʃ aʊt/', meaning: '(phrasal verb) To contact someone for help, collaboration, or connection', example: 'If you have questions, reach out to me on Slack anytime — I\'m happy to help.', techNote: '"Reach out" is very natural in professional English. More friendly than "contact me." Can be via any channel: Slack, email, DM.' },
              { word: 'get up to speed', phonetic: '/ɡɛt ʌp tə spiːd/', meaning: '(phrase) To learn the current context, processes, and state of a project', example: 'I\'m still getting up to speed on the codebase — there\'s a lot to take in.', techNote: '"Get up to speed" is the professional phrase for "learn everything I need to know." Natural to say in your first 2–4 weeks.' },
              { word: 'open door', phonetic: '/ˈoʊpən dɔːr/', meaning: '(idiom) An invitation to approach with questions or concerns without hesitation', example: '"My calendar is open — feel free to book time with me." or "Open door policy — always reach out."', techNote: '"Open door policy" = leadership saying anyone can approach them with concerns. A cultural signal of approachability.' }
            ]
          },
          {
            type: 'explanation',
            title: 'First-day conversations — joining a new team',
            content: '<p>The first week on a new team sets the tone for your working relationships. Knowing how to introduce yourself, ask questions, and build rapport early makes a huge difference.</p><p><strong>First-day Slack introduction template:</strong></p><p><em>"Hey everyone! 👋 I\'m [name], and I\'m joining the [team name] team as a [role]. I\'m based in [city], and my background is mainly in [skills/stack]. I\'m really excited to be here and looking forward to getting to know you all. Feel free to reach out if you want to chat — open to coffee chats or just a quick Slack DM. See you around! 🚀"</em></p><p><strong>Questions to ask your new team:</strong></p><ul><li><em>"What\'s the best way to get up to speed on the codebase?"</em></li><li><em>"Who should I go to with questions about [X]?"</em></li><li><em>"What are the communication conventions here — async-first or more synchronous?"</em></li><li><em>"Is there anything you wish someone had told you when you joined?"</em></li></ul><p><strong>Phrases to use when you don\'t know something yet:</strong></p><ul><li><em>"I\'m still getting up to speed on that."</em></li><li><em>"I haven\'t dug into that part yet — who\'s the best person to ask?"</em></li><li><em>"I\'ll look into that and get back to you."</em></li></ul>'
          },
          {
            type: 'tech-example',
            title: 'First week — building relationships',
            scenario: 'Day 3. A colleague from the design team initiates a coffee chat:',
            dialogue: [
              { speaker: 'Sofia (Designer)', text: 'Hey! I\'m Sofia from the design team — I saw your intro in Slack. Welcome aboard! I wanted to reach out because I heard you\'ll be working on the new checkout flow with us.' },
              { speaker: 'You', text: 'Hey Sofia! Yes, that\'s me — really looking forward to it. I\'ve worked closely with design teams before and I love that collaboration. What\'s your focus on the checkout project?', isYou: true },
              { speaker: 'Sofia', text: 'I\'m leading the UX redesign — we\'ve done a lot of user research and there\'s a whole new flow. I\'ll walk you through the Figma when you\'re ready.' },
              { speaker: 'You', text: 'I\'d love that. I\'m still getting up to speed on the full project context, but I\'ve started reading the spec doc. One thing I want to understand better is how you handle the edge cases — the current designs have some gaps there.', isYou: true },
              { speaker: 'Sofia', text: 'Sharp eye already! That\'s exactly something we\'re still working on. Let\'s schedule a proper session and go through it together.' },
              { speaker: 'You', text: 'Sounds great — I\'ll send a calendar invite for next week. Really happy to be working with you.', isYou: true }
            ],
            tip: '"Welcome aboard" = welcome to the team. "Sharp eye" = you noticed something clever. "Walk through" = explain step by step. "Proper session" = a focused, dedicated meeting (not just a quick chat).'
          },
          {
            type: 'speaking',
            prompt: 'Write your Slack introduction message for a new job at an international tech company. Include: your name, role, background, location, what you\'re excited about, and an invitation to connect.',
            tip: 'Keep it under 100 words. Be warm but professional. Use emoji sparingly if that\'s the team culture.',
            example: '"Hey team! 👋 I\'m Raphael, joining as a QA Engineer. I\'m based in São Paulo, Brazil, and my background is in test automation with Playwright and TypeScript, plus manual testing and API testing. I\'m really excited to work with this team — I\'ve been following the product for a while and I love the direction it\'s going. I\'m all about catching bugs before users do, so please loop me in early and often! Open to coffee chats — drop me a DM anytime. Looking forward to meeting everyone! 🚀"'
          },
          {
            type: 'quiz',
            questions: [
              { question: 'What does "welcome aboard" mean?', options: ['"Welcome to the ship"', '"Welcome to the company or team"', '"Please take your seat"', '"The boarding process is complete"'], correct: 1, explanation: '"Welcome aboard" is an idiom from nautical language — now used universally to welcome someone to a new job, team, or project.' },
              { question: 'A colleague says "feel free to reach out." What are they offering?', options: ['"I will contact you soon"', '"You can contact me anytime if you need anything"', '"Please schedule a formal meeting"', '"I\'ll be unavailable for a while"'], correct: 1, explanation: '"Reach out" = contact me. "Feel free to" = you have permission and it\'s encouraged. Combined: "please contact me whenever you need."' },
              { question: 'You\'re asked about your "background" in an intro conversation. What should you talk about?', options: ['Where you grew up', 'Your professional skills, experience, and tech stack', 'Your educational qualifications only', 'Your personal hobbies'], correct: 1, explanation: '"Background" in professional context = your experience, skills, and relevant history. "My background is in backend development, mainly Java and Kubernetes."' },
              { question: 'What does "getting up to speed" mean in a new job?', options: ['Working faster than before', 'Learning everything you need to know about the new project or codebase', 'Running training sessions for others', 'Reading technical documentation quickly'], correct: 1, explanation: '"Getting up to speed" = reaching the point where you understand the context, processes, and state of the project well enough to contribute effectively.' }
            ]
          }
        ]
      },

      // ── L1.M7.L4 — Coffee Chat with Your Lead ─────────────
      {
        id: 'L1.M7.L4',
        title: 'Coffee Chat with Your Lead',
        subtitle: '1:1 casual conversation',
        difficulty: 'beginner',
        duration: 15,
        xpReward: 75,
        sections: [
          {
            type: 'warmup',
            prompt: 'Your tech lead schedules a casual 1:1 with you — not a formal check-in, just a coffee chat. They ask: "How are you finding things so far?" What do you say? Write your answer in English.',
            tip: 'This is not a performance review. Be honest but constructive. Share what\'s going well AND what\'s challenging.'
          },
          {
            type: 'vocabulary',
            words: [
              { word: 'feedback', phonetic: '/ˈfiːdbæk/', meaning: '(n) Information about how someone is performing, with the aim of improvement', example: '"I\'d love your feedback on my PR — I\'m still learning the team\'s code style."', techNote: '"Constructive feedback" = helpful criticism aimed at improvement. "Positive feedback" = recognition. Both matter.' },
              { word: 'overwhelmed', phonetic: '/ˌoʊvərˈwɛlmd/', meaning: '(adj) Feeling too much pressure or having too much to handle', example: '"I\'ll be honest — the first week was a bit overwhelming, but I\'m getting more comfortable."', techNote: 'Being honest about feeling overwhelmed is professional, not weak. Follow it with what\'s helping: "but I\'m getting more comfortable now."' },
              { word: 'challenge', phonetic: '/ˈtʃælɪndʒ/', meaning: '(n) A difficult task or situation that requires effort to overcome', example: '"The biggest challenge so far is understanding the legacy codebase — it\'s complex."', techNote: 'Framing difficulties as "challenges" sounds more professional than "problems." It implies you\'re actively working on them.' },
              { word: 'comfortable', phonetic: '/ˈkʌmftəbəl/', meaning: '(adj) At ease — confident and not anxious about something', example: '"I\'m not fully comfortable with the testing setup yet — still learning the toolchain."', techNote: '"I\'m comfortable with X" = I know it well enough to work independently. "Not comfortable yet" = still learning, need more time or guidance.' },
              { word: 'going well', phonetic: '/ˈɡoʊɪŋ wɛl/', meaning: '(phrase) Progressing positively', example: '"The collaboration with the design team is going really well — they\'re great to work with."', techNote: '"Going well" = positive status update. "Going smoothly" = no friction. "Going better than expected" = pleasantly surprised.' }
            ]
          },
          {
            type: 'explanation',
            title: 'How to have a productive 1:1 coffee chat in English',
            content: '<p>1:1 conversations with your lead are opportunities to build the relationship, share feedback, and raise concerns early. Knowing how to navigate them in English gives you a significant advantage.</p><p><strong>Topics for a coffee chat 1:1:</strong></p><ul><li>How you\'re settling in</li><li>What\'s going well</li><li>What\'s challenging or unclear</li><li>Questions about the team, codebase, or processes</li><li>What you\'re excited about working on</li></ul><p><strong>Phrases for sharing honest updates:</strong></p><ul><li><em>"I\'ll be honest — [honest observation]."</em></li><li><em>"I\'m finding [X] more complex than I expected — is that normal?"</em></li><li><em>"The [X] is going really well — I\'m enjoying that part."</em></li><li><em>"I\'m not sure I fully understand [X] yet — who\'s the best person to ask?"</em></li></ul><p><strong>Asking for guidance:</strong></p><ul><li><em>"Is there anything you\'d like me to focus on in the next two weeks?"</em></li><li><em>"What would be most valuable for me to learn first?"</em></li><li><em>"Am I asking the right questions? I want to make sure I\'m ramping up in the right direction."</em></li></ul><p><strong>Key mindset:</strong> Your lead wants you to succeed. The more honest you are about what\'s going well and what\'s hard, the more they can help. Pretending everything is fine when it\'s not leads to slower ramp-up.</p>'
          },
          {
            type: 'tech-example',
            title: 'Coffee chat 1:1 — week two check-in',
            scenario: 'Your tech lead scheduled a casual 30-minute coffee chat to check in on your second week:',
            dialogue: [
              { speaker: 'Lead Ana', text: 'So — two weeks in. How are you finding things? And be honest, I want to know what\'s actually going on.' },
              { speaker: 'You', text: 'Honestly? The first week was pretty overwhelming — there was a lot to take in. But this week feels better. I\'m getting more comfortable with the codebase flow.', isYou: true },
              { speaker: 'Lead Ana', text: 'That\'s totally normal — the codebase is large and has a lot of history. What\'s been the biggest challenge?' },
              { speaker: 'You', text: 'The testing setup. I understand the concept, but the way the fixtures and mocks are structured is still clicking into place. I\'ve been reading the test files to learn by example, but I\'m not fully comfortable writing new tests independently yet.', isYou: true },
              { speaker: 'Lead Ana', text: 'That\'s great awareness. Let me pair with you on a test this week — it\'ll be faster than figuring it out alone.' },
              { speaker: 'You', text: 'I\'d really appreciate that. On the positive side — the collaboration with the design team is going really well. Sofia has been fantastic to work with.', isYou: true },
              { speaker: 'Lead Ana', text: 'She\'s great. Is there anything you need from me to make the next two weeks smoother?' },
              { speaker: 'You', text: 'Just continue the availability to ask questions. And actually — any guidance on what I should prioritize learning next?', isYou: true }
            ],
            tip: '"Ramping up" = getting up to speed. "Clicking into place" = gradually starting to make sense. "Fantastic to work with" = very positive feedback about a colleague.'
          },
          {
            type: 'speaking',
            prompt: 'Write your response to the question "How are you finding things so far?" — as if you\'re in your second week at a new job. Be honest, share one challenge and one thing going well, and ask for guidance.',
            tip: 'Aim for 4–6 sentences. Be specific — not just "it\'s good" but "the team communication is very clear, especially in standups."',
            example: '"I\'ll be honest — the first week was a lot to take in. There\'s a lot of codebase to understand and I\'m still mapping how the different services connect. The biggest challenge is the deployment pipeline — I haven\'t worked with Kubernetes before and it\'s a bit of a learning curve. But the team has been really welcoming, and the standup format is clear and efficient — I feel like I\'m getting context quickly. The collaboration with the QA team is also going really well. My question for you: is there a specific part of the codebase you\'d recommend I prioritize getting familiar with first?"'
          },
          {
            type: 'quiz',
            questions: [
              { question: 'Your lead asks "how are you finding things?" What does this mean?', options: ['"Are you able to locate things in the office?"', '"How is your experience going — what do you think of the role so far?"', '"Have you found all the documentation you need?"', '"Is the search feature working for you?"'], correct: 1, explanation: '"How are you finding things?" is an idiomatic way to ask "what\'s your experience been like?" — invite to share honest feedback.' },
              { question: 'A developer says "I\'m not fully comfortable with X yet." What does this communicate?', options: ['"I refuse to work with X"', '"I\'m learning X but haven\'t reached full confidence or independence yet"', '"X is making me physically uncomfortable"', '"X is too easy for me"'], correct: 1, explanation: '"Not comfortable yet" = in progress, not fully independent. Professional way to acknowledge a learning gap without dismissing the ability to improve.' },
              { question: 'Why is being honest in a 1:1 about challenges more effective than saying everything is fine?', options: ['It makes you look weak', 'It helps your lead understand where to support you, leading to faster growth', 'Leads prefer employees who never struggle', 'It is more politically safe'], correct: 1, explanation: 'Your lead\'s job is to help you succeed. Honest feedback about challenges gives them the information to support you effectively. Hiding struggles slows your ramp-up.' },
              { question: 'What does "constructive feedback" mean?', options: ['Feedback that is only positive', 'Feedback that is harsh and direct', 'Helpful criticism aimed at improvement, not just evaluation', 'Feedback from a manager, not a peer'], correct: 2, explanation: 'Constructive = aimed at building/improving. Constructive feedback identifies what can be better AND gives guidance on how to improve — not just criticism.' }
            ]
          }
        ]
      },

      // ── L1.M7.L5 — End of Sprint Celebration ─────────────
      {
        id: 'L1.M7.L5',
        title: 'End of Sprint Celebration',
        subtitle: 'Team wins and positive language',
        difficulty: 'beginner',
        duration: 20,
        xpReward: 100,
        sections: [
          {
            type: 'warmup',
            prompt: 'Your team just shipped a big feature. Your manager sends a Slack message: "Great work everyone! 🎉" — How would you respond? And how would you call out a specific teammate who helped you? Write it in English.',
            tip: 'Recognition in English is specific and genuine. "Great job!" is nice. "Thank you for staying late to fix that CI issue — it made the difference" is memorable.'
          },
          {
            type: 'vocabulary',
            words: [
              { word: 'shoutout', phonetic: '/ˈʃaʊtaʊt/', meaning: '(n) Public recognition of someone\'s effort or contribution', example: '"Big shoutout to Marcus for the incredible performance optimization this sprint — cut load time by 60%!"', techNote: '"Shoutout" or "shout-out" = informal public appreciation. Very common in tech team Slack channels after releases or successes.' },
              { word: 'kudos', phonetic: '/ˈkjuːdɒs/', meaning: '(n) Praise and recognition for an achievement — singular (not "kudos are")', example: '"Kudos to the whole team — this was our cleanest launch yet."', techNote: '"Kudos" is singular despite ending in S. "Give kudos" = recognize someone\'s work. Some companies have formal kudos systems in Slack.' },
              { word: 'nail it', phonetic: '/neɪl ɪt/', meaning: '(phrasal verb) To do something perfectly or with great success', example: '"The demo nailed it — the client loved every feature."', techNote: '"Nailed it" = executed perfectly. Informal but very common. "You nailed the presentation!" is high praise.' },
              { word: 'pull off', phonetic: '/pʊl ɒf/', meaning: '(phrasal verb) To successfully complete something difficult', example: '"I wasn\'t sure we could pull this off in two sprints, but we did it."', techNote: '"Pull off" implies something was difficult but you succeeded anyway. Strong positive phrase — shows awareness of the challenge.' },
              { word: 'across the finish line', phonetic: '/əˈkrɒs ðə ˈfɪnɪʃ laɪn/', meaning: '(idiom) To complete or deliver something, especially something challenging or close to the deadline', example: '"Thank you for getting us across the finish line this sprint — it was a team effort."', techNote: 'Racing metaphor. Very common in project completion contexts, especially when it was a close call.' }
            ]
          },
          {
            type: 'explanation',
            title: 'Celebrating wins and giving recognition in English',
            content: '<p>Team celebrations and recognition are an important part of healthy tech culture. Knowing how to express genuine appreciation and celebrate wins in English builds team morale and relationships.</p><p><strong>Ways to celebrate a release in Slack:</strong></p><ul><li><em>"🚀 We shipped it! Huge thank you to everyone who worked on this."</em></li><li><em>"Big kudos to the whole team — cleanest deploy of the year."</em></li><li><em>"Shoutout to [name] for [specific thing] — made a real difference."</em></li></ul><p><strong>Recognizing specific contributions:</strong></p><ul><li><em>"[Name] — I couldn\'t have done this without your help on [specific thing]."</em></li><li><em>"Huge shoutout to [name] for catching that bug before it hit prod."</em></li><li><em>"Thanks for jumping in on the weekend — that was above and beyond."</em></li></ul><p><strong>Expressing your own feelings about a win:</strong></p><ul><li><em>"I\'m really proud of what we built here."</em></li><li><em>"This was a tough sprint — we pulled it off and I\'m thrilled."</em></li><li><em>"Honestly one of the best teams I\'ve worked with — this was special."</em></li></ul><p><strong>Retrospective positives ("what went well"):</strong></p><ul><li><em>"The communication was excellent throughout — no surprises."</em></li><li><em>"We caught the performance issue early — great QA work."</em></li><li><em>"The deployment process was smoother than last time."</em></li></ul>'
          },
          {
            type: 'tech-example',
            title: 'Post-sprint Slack thread — celebrating the win',
            scenario: 'The team just shipped a major feature after a tough 3-week sprint:',
            dialogue: [
              { speaker: 'Lead Ana', text: '🎉 It\'s live! The new dashboard is in production and performing beautifully. I\'m so proud of what this team pulled off in 3 weeks. You all went above and beyond.' },
              { speaker: 'You', text: 'This was a tough one but we nailed it. Big kudos to Maya for keeping the design handoffs clean — made my life so much easier on the frontend side.', isYou: true },
              { speaker: 'Maya (Designer)', text: 'Thank you! And shoutout to you for implementing the animations exactly as designed — I know those were tricky.' },
              { speaker: 'Marcus', text: 'Real talk: I wasn\'t sure we could pull this off with the scope change in week 2. The team communication was exceptional — no one dropped the ball.' },
              { speaker: 'You', text: 'Agreed. The Monday sync calls made a huge difference — always left those knowing exactly what to prioritize. @Ana thank you for keeping us aligned through the chaos.', isYou: true },
              { speaker: 'Lead Ana', text: 'It was a team effort — I just kept the blockers out of the way. Now please: disconnect this weekend. You\'ve earned it. 🙏' },
              { speaker: 'You', text: 'Already closed my laptop. See you Monday everyone. 🚀', isYou: true }
            ],
            tip: '"Above and beyond" = did more than expected. "Dropped the ball" = made a mistake or failed to deliver on a responsibility. "Scope change" = requirements changed mid-project. "Keeping us aligned" = making sure everyone understands the same goals.'
          },
          {
            type: 'speaking',
            prompt: 'Write a Slack message celebrating a team win. Mention: the achievement, a specific shoutout to a teammate, something that went particularly well, and a note about what\'s next.',
            tip: 'Be specific and genuine. "Great job everyone" is forgettable. "Marcus refactored the entire auth flow in 4 days and it\'s cleaner than ever" is something Marcus will remember.',
            example: '"🎉 We shipped the new search experience today — and it went live without a single production error. That\'s not luck, that\'s preparation.\n\nHuge shoutout to Sofia for the beautiful UX — users are already saying it\'s night and day compared to the old version. And to Carlos: that database index optimization you snuck in last minute cut query time by 80%. Absolute game changer.\n\nWhat went well: our QA-dev collaboration this sprint was the best I\'ve seen. Sofia caught 12 edge cases in the first pass and we fixed every single one before launch. That\'s the standard.\n\nNext up: we\'ll run a 2-week bake period, monitor performance metrics, and then we\'re into Sprint 18. For now — please rest this weekend. You\'ve more than earned it. 🙏🚀"'
          },
          {
            type: 'quiz',
            questions: [
              { question: 'What is a "shoutout" in a team context?', options: ['A loud announcement in the office', 'Public recognition of someone\'s specific contribution', 'A formal performance review', 'A notification to the whole company'], correct: 1, explanation: 'A shoutout = informal public appreciation for someone\'s effort. "Big shoutout to [name] for [specific thing]." Common in Slack after releases.' },
              { question: 'A lead says "you went above and beyond." What does this mean?', options: ['You worked overtime', 'You did significantly more than what was expected', 'You exceeded the budget', 'You travelled far for work'], correct: 1, explanation: '"Above and beyond" = exceeded expectations. More than the minimum was required, and you delivered extra value or effort.' },
              { question: 'The team says "we pulled it off!" What happened?', options: ['They failed to deliver', 'They successfully completed something difficult', 'They cancelled the project', 'They found a major bug'], correct: 1, explanation: '"Pull off" = successfully complete something difficult. The phrase implies it was challenging or uncertain — and you succeeded anyway.' },
              { question: 'What does "what went well" mean in a sprint retrospective?', options: ['A question about the team\'s health', 'A section for identifying successful practices and achievements to continue', 'A request to explain the technical architecture', 'A list of bugs that were fixed'], correct: 1, explanation: '"What went well" is a standard retrospective category — it identifies practices and behaviors that helped the sprint succeed and should be repeated.' }
            ]
          }
        ]
      }
    ]
  };

  // ─────────────────────────────────────────────────────────
  // LEVEL 1 — Foundations (A1/A2)
  // ─────────────────────────────────────────────────────────
  var LEVEL1 = {
    label: 'A1/A2',
    name: 'Foundations',
    description: 'Master the fundamentals of English in a tech context — introductions, daily communication, and basic tech vocabulary.',
    color: '#35F4FF',
    modules: {
      1: L1M1,
      2: L1M2,
      3: L1M3,
      4: L1M4,
      5: L1M5,
      6: L1M6,
      7: L1M7
    }
  };

  // ─────────────────────────────────────────────────────────
  // LEVEL 2 — Professional Communication (B1)
  // ─────────────────────────────────────────────────────────
  var LEVEL2 = {
    label: 'B1',
    name: 'Professional Communication',
    description: 'Operate confidently in agile teams, meetings, and professional tech environments entirely in English.',
    color: '#8A2BE2',
    modules: {
      1: skeleton(2, 1, 'Agile & Scrum', 'Master the language of agile ceremonies — standups, retrospectives, and sprint planning.', [
        { title: 'Scrum Ceremonies Vocabulary', subtitle: 'The complete agile glossary', difficulty: 'intermediate' },
        { title: 'Sprint Planning Meeting', subtitle: 'Story points, backlog, and velocity', difficulty: 'intermediate' },
        { title: 'Daily Standup — Advanced', subtitle: 'Beyond the three questions', difficulty: 'intermediate' },
        { title: 'Retrospective Talk', subtitle: '"What went well? What didn\'t?"', difficulty: 'intermediate' },
        { title: 'Scrum Master Communication', subtitle: 'Facilitation and servant leadership language', difficulty: 'intermediate' }
      ]),
      2: skeleton(2, 2, 'Daily Meetings', 'Run and participate in meetings in English — from agenda to action items.', [
        { title: 'Running a Meeting in English', subtitle: 'Facilitation and structure', difficulty: 'intermediate' },
        { title: 'Agenda & Action Items', subtitle: 'Meeting documentation vocabulary', difficulty: 'intermediate' },
        { title: 'Giving Your Opinion', subtitle: '"I think...", "In my view...", "What if we..."', difficulty: 'intermediate' },
        { title: 'Challenging Ideas Respectfully', subtitle: 'Disagreeing without conflict', difficulty: 'intermediate' },
        { title: 'Following Up After Meetings', subtitle: 'Action items, summaries, and next steps', difficulty: 'intermediate' }
      ]),
      3: skeleton(2, 3, 'Talking About Tasks', 'Jira tickets, estimates, handoffs, and the language of getting work done.', [
        { title: 'Jira & Ticket Language', subtitle: 'Story, epic, subtask vocabulary', difficulty: 'intermediate' },
        { title: 'Story Points & Estimates', subtitle: 'Talking about complexity and time', difficulty: 'intermediate' },
        { title: 'Blocked & Dependencies', subtitle: 'When you can\'t move forward', difficulty: 'intermediate' },
        { title: 'Handoffs & Handovers', subtitle: 'Transitioning work between teammates', difficulty: 'intermediate' },
        { title: 'Task Completion Reports', subtitle: 'Status updates and done definitions', difficulty: 'intermediate' }
      ]),
      4: skeleton(2, 4, 'Explaining Features', 'How to demo, document, and communicate about the features you build.', [
        { title: 'Demo Language', subtitle: '"Let me show you how this works..."', difficulty: 'intermediate' },
        { title: 'Technical Walkthrough', subtitle: 'Step-by-step explanation vocabulary', difficulty: 'intermediate' },
        { title: 'Explaining Edge Cases', subtitle: '"What happens when...?"', difficulty: 'intermediate' },
        { title: 'API Documentation Talk', subtitle: 'Endpoints, parameters, and responses', difficulty: 'intermediate' },
        { title: 'Feature vs Bug — Communicating', subtitle: 'Framing and categorizing issues', difficulty: 'intermediate' }
      ]),
      5: skeleton(2, 5, 'QA & Bugs', 'The language of quality assurance — bug reports, test plans, and QA sign-off.', [
        { title: 'Bug Report Language', subtitle: 'Writing clear, reproducible reports', difficulty: 'intermediate' },
        { title: 'Severity & Priority Talk', subtitle: 'Critical vs low — communicating impact', difficulty: 'intermediate' },
        { title: 'Regression Testing Communication', subtitle: 'What to test after a change', difficulty: 'intermediate' },
        { title: 'Test Plans in English', subtitle: 'Test cases, preconditions, expected results', difficulty: 'intermediate' },
        { title: 'QA Sign-off Vocabulary', subtitle: '"Approved for release" — QA English', difficulty: 'intermediate' }
      ]),
      6: skeleton(2, 6, 'GitHub & Pull Requests', 'Professional communication for code reviews, issues, and open source collaboration.', [
        { title: 'PR Descriptions That Get Merged', subtitle: 'Writing clear, helpful PR summaries', difficulty: 'intermediate' },
        { title: 'Code Review Comments', subtitle: 'Advanced review vocabulary and tone', difficulty: 'intermediate' },
        { title: 'Merge Conflicts — Explaining Them', subtitle: 'Communicating technical git issues', difficulty: 'intermediate' },
        { title: 'GitHub Issues & Labels', subtitle: 'Issue tracking communication', difficulty: 'intermediate' },
        { title: 'Open Source Communication', subtitle: 'Contributing to global projects', difficulty: 'intermediate' }
      ]),
      7: skeleton(2, 7, 'Team Communication', 'Navigate team dynamics, conflict, celebration, and collaboration in English.', [
        { title: 'Cross-functional Collaboration', subtitle: 'Working with product, design, and data', difficulty: 'intermediate' },
        { title: 'Escalating Issues Professionally', subtitle: 'When to loop in leadership', difficulty: 'intermediate' },
        { title: 'Saying No at Work', subtitle: 'Declining politely and professionally', difficulty: 'intermediate' },
        { title: 'Conflict Resolution', subtitle: 'Navigating disagreements constructively', difficulty: 'intermediate' },
        { title: 'Celebrating Team Wins', subtitle: 'Positive and recognition language', difficulty: 'intermediate' }
      ])
    }
  };

  // ─────────────────────────────────────────────────────────
  // LEVEL 3 — International Developer (B2)
  // ─────────────────────────────────────────────────────────
  var LEVEL3 = {
    label: 'B2',
    name: 'International Developer',
    description: 'Get hired internationally, work with global clients, present your work, and solve complex problems in English.',
    color: '#E0234E',
    modules: {
      1: skeleton(3, 1, 'Job Interviews', 'Ace technical and behavioral interviews at international companies — in English.', [
        { title: 'Technical Interview Introduction', subtitle: 'First impressions and small talk', difficulty: 'advanced' },
        { title: 'STAR Method — Behavioral Questions', subtitle: 'Situation, Task, Action, Result', difficulty: 'advanced' },
        { title: 'Coding Interview Talk-Through', subtitle: 'Thinking out loud while coding', difficulty: 'advanced' },
        { title: 'System Design Interview', subtitle: 'Architecture and trade-offs vocabulary', difficulty: 'advanced' },
        { title: 'Salary & Benefits Negotiation', subtitle: 'Negotiating your package confidently', difficulty: 'advanced' }
      ]),
      2: skeleton(3, 2, 'Portfolio Presentation', 'Present your projects, decisions, and code to international audiences.', [
        { title: 'Presenting Your Best Project', subtitle: 'Opening strong and keeping attention', difficulty: 'advanced' },
        { title: 'Explaining Technical Decisions', subtitle: '"We chose X because..."', difficulty: 'advanced' },
        { title: 'Handling "Why did you use X?"', subtitle: 'Defending your choices calmly', difficulty: 'advanced' },
        { title: 'Your GitHub Profile in English', subtitle: 'README, bio, and contribution language', difficulty: 'advanced' },
        { title: 'Portfolio Case Study Narration', subtitle: 'Telling the story of a project', difficulty: 'advanced' }
      ]),
      3: skeleton(3, 3, 'Freelance Calls', 'Win clients, scope projects, and manage freelance relationships in English.', [
        { title: 'Upwork & Freelance Pitch', subtitle: 'Writing proposals that win', difficulty: 'advanced' },
        { title: 'Discovery Call Vocabulary', subtitle: 'Understanding client needs', difficulty: 'advanced' },
        { title: 'Scoping a Project', subtitle: 'What\'s in, what\'s out, what\'s the price', difficulty: 'advanced' },
        { title: 'Pricing & Contracts', subtitle: 'Rates, invoices, and contract language', difficulty: 'advanced' },
        { title: 'Client Onboarding', subtitle: 'Starting a project right', difficulty: 'advanced' }
      ]),
      4: skeleton(3, 4, 'Client Meetings', 'Manage client relationships, deliver updates, and handle difficult conversations.', [
        { title: 'Status Update Calls', subtitle: 'Weekly and bi-weekly progress reports', difficulty: 'advanced' },
        { title: 'Managing Client Expectations', subtitle: '"I need to be transparent about..."', difficulty: 'advanced' },
        { title: 'Delivering Bad News Gracefully', subtitle: 'Delays, bugs, and scope changes', difficulty: 'advanced' },
        { title: 'Change Request Communication', subtitle: 'Scope creep and how to address it', difficulty: 'advanced' },
        { title: 'Project Handover & Documentation', subtitle: 'Closing a project professionally', difficulty: 'advanced' }
      ]),
      5: skeleton(3, 5, 'Technical Explanations', 'Explain complex technical concepts to non-technical stakeholders with clarity.', [
        { title: 'Explaining Your Architecture', subtitle: 'System design for non-engineers', difficulty: 'advanced' },
        { title: 'Trade-offs & Decisions', subtitle: '"The reason we chose this approach..."', difficulty: 'advanced' },
        { title: '"Why is this taking so long?"', subtitle: 'Communicating complexity with empathy', difficulty: 'advanced' },
        { title: 'Explaining Technical Debt', subtitle: 'Making the invisible visible', difficulty: 'advanced' },
        { title: 'Teaching Non-Technical Stakeholders', subtitle: 'Analogies and clear language', difficulty: 'advanced' }
      ]),
      6: skeleton(3, 6, 'Architecture Basics', 'Discuss system design, technical trade-offs, and architecture decisions in English.', [
        { title: 'Monolith vs Microservices Talk', subtitle: 'Architecture decision vocabulary', difficulty: 'advanced' },
        { title: 'Database Design Vocabulary', subtitle: 'SQL, NoSQL, and schema discussions', difficulty: 'advanced' },
        { title: 'API Design Discussion', subtitle: 'REST, GraphQL, and contract language', difficulty: 'advanced' },
        { title: 'Scalability Conversations', subtitle: '"What happens when we have 1M users?"', difficulty: 'advanced' },
        { title: 'System Design Whiteboarding', subtitle: 'Drawing and explaining simultaneously', difficulty: 'advanced' }
      ]),
      7: skeleton(3, 7, 'Problem Solving', 'Debug out loud, write incident reports, and communicate under pressure in English.', [
        { title: 'Debugging Out Loud', subtitle: 'Narrating your problem-solving process', difficulty: 'advanced' },
        { title: 'Root Cause Analysis Communication', subtitle: '"The issue was caused by..."', difficulty: 'advanced' },
        { title: 'Incident Reports', subtitle: 'Writing clear post-incident documentation', difficulty: 'advanced' },
        { title: 'Post-Mortem Language', subtitle: 'Blameless retrospective vocabulary', difficulty: 'advanced' },
        { title: '"I Found the Bug!" — Celebration', subtitle: 'Sharing discoveries with the team', difficulty: 'advanced' }
      ])
    }
  };

  // ─────────────────────────────────────────────────────────
  // LEVEL 4 — Advanced Fluency (C1)
  // ─────────────────────────────────────────────────────────
  var LEVEL4 = {
    label: 'C1',
    name: 'Advanced Fluency',
    description: 'Lead teams, present at conferences, mentor others, and communicate at the highest level of professional English.',
    color: '#FFD700',
    modules: {
      1: skeleton(4, 1, 'Leadership', 'Communicate with authority, clarity, and empathy as a technical leader.', [
        { title: 'Leading a Technical Team', subtitle: 'Setting direction and building trust', difficulty: 'mastery' },
        { title: '1:1 Meeting Language', subtitle: 'Coaching, feedback, and growth conversations', difficulty: 'mastery' },
        { title: 'Performance Reviews', subtitle: 'Evaluating and developing people', difficulty: 'mastery' },
        { title: 'Giving Direction & Feedback', subtitle: 'Clear, actionable, and kind', difficulty: 'mastery' },
        { title: 'Technical Vision Communication', subtitle: 'Articulating where you\'re going and why', difficulty: 'mastery' }
      ]),
      2: skeleton(4, 2, 'Product Thinking', 'Bridge the gap between engineering and product — speak both languages fluently.', [
        { title: 'OKRs & KPIs in English', subtitle: 'Metrics, goals, and business vocabulary', difficulty: 'mastery' },
        { title: 'Product Roadmap Discussions', subtitle: 'Strategy, priorities, and trade-offs', difficulty: 'mastery' },
        { title: 'Feature Prioritization Talk', subtitle: '"What should we build next?"', difficulty: 'mastery' },
        { title: 'User Research Language', subtitle: 'Personas, user stories, and insight', difficulty: 'mastery' },
        { title: 'Product vs Engineering Alignment', subtitle: 'Navigating competing priorities', difficulty: 'mastery' }
      ]),
      3: skeleton(4, 3, 'Negotiation', 'Negotiate deadlines, scope, salaries, and vendor contracts with confidence.', [
        { title: 'Negotiating Deadlines', subtitle: '"We need more time, and here\'s why"', difficulty: 'mastery' },
        { title: 'Scope Negotiation', subtitle: 'Protecting your team from overcommitting', difficulty: 'mastery' },
        { title: 'Salary & Promotion', subtitle: 'Making your case with evidence', difficulty: 'mastery' },
        { title: 'Vendor Negotiations', subtitle: 'Contracts, SLAs, and pricing talks', difficulty: 'mastery' },
        { title: 'Stakeholder Influence', subtitle: 'Persuading without authority', difficulty: 'mastery' }
      ]),
      4: skeleton(4, 4, 'Public Speaking', 'Command a room, deliver a conference talk, and handle Q&A with confidence.', [
        { title: 'Conference Talk Structure', subtitle: 'Opening, body, and closing that land', difficulty: 'mastery' },
        { title: 'CFP Writing', subtitle: 'Call for Proposals that get accepted', difficulty: 'mastery' },
        { title: 'Stage Presence & Delivery', subtitle: 'Pace, pause, and emphasis', difficulty: 'mastery' },
        { title: 'Handling Q&A Sessions', subtitle: 'Thinking on your feet in English', difficulty: 'mastery' },
        { title: 'Virtual Presentations', subtitle: 'Webinars, demos, and recorded talks', difficulty: 'mastery' }
      ]),
      5: skeleton(4, 5, 'Technical Presentations', 'Present to engineers, executives, and board members in English.', [
        { title: 'Architecture Review Boards', subtitle: 'Defending decisions to senior engineers', difficulty: 'mastery' },
        { title: 'Engineering All-Hands', subtitle: 'Communicating strategy to your team', difficulty: 'mastery' },
        { title: 'Investor & Board Presentations', subtitle: 'Technical depth, business clarity', difficulty: 'mastery' },
        { title: 'Technical Podcast Guest', subtitle: 'Conversational tech communication', difficulty: 'mastery' },
        { title: 'Workshop Facilitation', subtitle: 'Running technical training sessions', difficulty: 'mastery' }
      ]),
      6: skeleton(4, 6, 'Mentoring', 'Develop junior developers and build a learning culture entirely in English.', [
        { title: 'Onboarding Junior Developers', subtitle: 'Setting them up for success', difficulty: 'mastery' },
        { title: 'Code Review as a Mentor', subtitle: 'Teaching through review, not just correcting', difficulty: 'mastery' },
        { title: 'Career Guidance Conversations', subtitle: '"Where do you want to be in 5 years?"', difficulty: 'mastery' },
        { title: 'Technical Interview Coaching', subtitle: 'Preparing your team to shine', difficulty: 'mastery' },
        { title: 'Building a Learning Culture', subtitle: 'Psychological safety and growth mindset', difficulty: 'mastery' }
      ]),
      7: skeleton(4, 7, 'Advanced Communication', 'Write, speak, and lead at the highest professional level in English.', [
        { title: 'Engineering Blog Posts', subtitle: 'Writing that establishes authority', difficulty: 'mastery' },
        { title: 'RFC & Design Document Language', subtitle: 'Technical writing at its most impactful', difficulty: 'mastery' },
        { title: 'Cross-cultural Communication', subtitle: 'Navigating global team dynamics', difficulty: 'mastery' },
        { title: 'Remote Leadership', subtitle: 'Building culture across timezones', difficulty: 'mastery' },
        { title: 'Thought Leadership in English', subtitle: 'Your voice in the global tech conversation', difficulty: 'mastery' }
      ])
    }
  };

  // ─────────────────────────────────────────────────────────
  // Public API
  // ─────────────────────────────────────────────────────────
  window.ENGLISH_DATA = {
    levels: { 1: LEVEL1, 2: LEVEL2, 3: LEVEL3, 4: LEVEL4 },

    getLesson: function (level, mod, lesson) {
      var lv = this.levels[level];
      if (!lv) return null;
      var m = lv.modules[mod];
      if (!m) return null;
      return m.lessons[lesson - 1] || null;
    },

    getModule: function (level, mod) {
      var lv = this.levels[level];
      return lv ? (lv.modules[mod] || null) : null;
    }
  };
})();
