// All case-study content lives here. Edit text freely; images are in img/<project>/.
const K = 'img/kash/', A = 'img/afri/', L = 'img/loop/';

window.PROJECTS = [
{
  id: 'kash',
  title: 'Kash',
  kicker: 'Personal finance · Android',
  summary: 'An Android app that turns the bank and mobile-money SMS people in Ethiopia already get into one clear spending record. There’s nothing to type and no bank login.',
  theme: { bg: '#E9DFC6', fg: '#222A36', accent: '#3D4859' },
  cover: { kind: 'phone', imgs: [K + 'Review.webp', K + 'Home.webp', K + 'Analytics.webp'] },
  tags: ['Product design', 'UX research', 'UI', 'Design system', 'Brand'],
  snapshot: [
    ['Role', 'Product designer: research, UX, UI and brand'],
    ['Platform', 'Android app, plus a web dashboard'],
    ['Year', '2026'],
    ['Status', 'Beta with testers, before the Play Store launch'],
  ],
  sections: [
    { id: 'problem', title: 'The problem', html: `
      <p>Most people in Ethiopia bank with several providers, such as ${pill('bank','CBE')} ${pill('bank','Telebirr')} ${pill('bank','Awash')} and ${pill('bank','Dashen')}. Their only record of their money is a stream of ${pill('message','SMS')}, and every bank writes them differently.</p>
      <p>No product brings those messages together into one view of balance, spending and income, and there’s no way to connect a bank account directly.</p>` },
    { id: 'goals', title: 'Goals', list: [
      ['Nothing to type', 'Show balance, spending and income across every bank without asking people to enter anything.', 'keyboard'],
      ['Earn trust', 'Never ask for bank logins, never move money, and be plain about what Kash reads.', 'lock'],
      ['Fit real phones', 'Work on small, low-cost Android phones, often with slow or no internet.', 'phone'],
    ]},
    { id: 'look', title: 'The look: slate and sand', html: `
      <p>The first version was dark, with mint text and coral buttons. For launch I redesigned every screen into a calmer, lighter look.</p>
      <p>Every screen has two layers. A <b>slate</b> top area holds the headline number and actions, and a <b>light sheet</b> rises over it with the lists and details. <b>Sand</b> appears at most once per screen, only for the next thing to do.</p>`,
      gallery: { kind: 'phone', items: [
        [K + 'Welcome.webp', 'Welcome: the words roll through Spending, Income, Transfers, Bills and Trends'],
        [K + 'Home.webp', 'Home: one total, and a sand button for the one thing to do'],
        [K + 'History.webp', 'History: one line of detail per transaction'],
        [K + 'Transaction.webp', 'Transaction: everything else lives here'],
      ]}
    },
    { id: 'permission', title: 'Asking for SMS, honestly', html: `
      <p>Reading someone’s SMS is a big ask, and the permission screen decides whether Kash gets used at all. Before Android shows its system prompt, Kash explains exactly what it does: it reads ${pill('message','bank messages only')}, imports ${pill('clock','18 months of history')} at once, and ${pill('lock','personal chats stay private')}.</p>`,
      gallery: { kind: 'phone', items: [
        [K + 'AllowSMS.webp', 'Explain first, then ask'],
        [K + 'Privacy.webp', 'Privacy & data: what Kash keeps, and how to delete it'],
        [K + 'PinCreate.webp', 'A PIN keeps the app private on a shared phone'],
        [K + 'Unlock.webp', 'Unlock'],
      ]}
    },
    { id: 'review', title: 'A 30-second daily review', html: `
      <p>SMS say how much and from whom, but not what it was for. Instead of a form, new transactions wait in a short review queue. Kash suggests a category from the sender, and the user confirms with one tap or picks another.</p>
      <p>When a payment goes between two of the user’s own accounts, such as ${pill('transfer','CBE → Telebirr')}, Kash says so and leaves it out of spending. That keeps the totals honest.</p>`,
      gallery: { kind: 'phone', items: [
        [K + 'Review.webp', 'Review: confirm the suggestion with one tap'],
        [K + 'ReviewTransfer.webp', 'A move between your own accounts is flagged and left out of totals'],
        [K + 'ReviewDone.webp', 'Done for today'],
        [K + 'HomeCaughtUp.webp', 'Home once you’re caught up'],
      ]}
    },
    { id: 'insight', title: 'Where the money goes', html: `
      <p>Analytics answers three questions in order: how much went out this month, how that compares with last month, and which categories took it. Numbers come before adjectives: “8% less”, not “Great job!”.</p>`,
      gallery: { kind: 'phone', items: [
        [K + 'Analytics.webp', 'Analytics: money in and out, and where it goes'],
        [K + 'Summary.webp', 'Summary'],
        [K + 'Accounts.webp', 'Accounts: every bank and wallet in one place'],
      ]}
    },
    { id: 'small', title: 'Designed for small phones first', html: `
      <p>Most users have mid-range phones 360–412 dp wide. I drew key screens again at 360 × 780 to make sure nothing wraps, crowds or hides the main action. Button labels never wrap, and tab icons have no text under them.</p>`,
      gallery: { kind: 'phone', items: [
        [K + 'SmallHome.webp', 'Home on a 360 dp phone'],
      ]}
    },
    { id: 'system', title: 'Design system', html: `
      <p>Kash ships with a small system so every screen stays consistent: one font (Figtree), five corner sizes (sheet 28, card 20, control 16, field 14, chip 12), and no drop shadows. Money always has a sign and an arrow, so it never relies on colour alone.</p>`,
      swatches: [
        ['Slate', '#3D4859', 'Top areas, primary buttons'],
        ['Sand', '#E9DFC6', 'The next thing to do'],
        ['Sheet', '#F4F5F7', 'Lists and details'],
        ['Ink', '#222A36', 'Text'],
        ['Money in', '#3E7A4A', 'With + and ↙'],
        ['Money out', '#A3412F', 'With − and ↗'],
      ],
      stats: [['62', 'screens, with empty, loading and error states'], ['29', 'components'], ['23', 'icons']]
    },
    { id: 'outcome', title: 'Where it is now', html: `
      <p>Kash is in beta with testers, who get update notices inside the app. The next step is the Play Store launch.</p>` },
  ]
},
{
  id: 'afriwork',
  title: 'Afriwork sign-up & CV',
  kicker: 'Hiring platform · Telegram mini app',
  summary: 'Redesigning how job seekers join Afriwork: start from the job they want, answer three questions employers see first, and get clear reasons to finish the rest.',
  theme: { bg: 'linear-gradient(135deg,#F15732 0%,#F20F61 100%)', fg: '#FFFFFF', accent: '#FFFFFF' },
  cover: { kind: 'phone', imgs: [A + 'cv-1b.webp', A + 'tier-standard.webp', A + 'cv-ready.webp'] },
  tags: ['Product design', 'UX audit', 'Onboarding', 'Prototyping', 'Mobile'],
  snapshot: [
    ['Company', 'Afriwork'],
    ['My role', 'Product designer: audit, flows, UI and prototype. The wider Afriwork product is the team’s work.'],
    ['Platform', 'Telegram mini app and web'],
    ['Year', '2026'],
  ],
  sections: [
    { id: 'problem', title: 'The problem', html: `
      <p>Afriwork is an Ethiopian job and talent platform. Job seekers sign up and apply through a ${pill('send','Telegram')} bot and mini app, or on the ${pill('monitor','web')}, and jobs are posted to Afriwork’s Telegram channels.</p>
      <p>In my own tests, signing up took far too long, and new users didn’t land on the job feed afterwards. Most seekers didn’t understand how the product worked, and nothing told them what employers actually look at.</p>` },
    { id: 'audit', title: 'Auditing the current flow', html: `
      <p>I mapped both ways in, filling the form by hand and uploading a CV for the AI to read, screen by screen across every path. What I found:</p>
      <ul class="issues">
        <li>Sign-up didn’t end on the job the person came for</li>
        <li>Too many fields, and no progress indicator</li>
        <li>Skills and sectors were asked for twice</li>
        <li>A “maximum skills selected” bug that matched a real support complaint</li>
        <li>The bot’s name didn’t match, buttons were inconsistent, and a typo (“Filed of work”)</li>
        <li>CV level screens showed the wrong prompts, like “Complete my CV” on Gold</li>
      </ul>` },
    { id: 'goals', title: 'Goals', list: [
      ['Jobs first', 'Start from a job and end on that job, so signing up feels like part of applying.', 'briefcase'],
      ['Three things first', 'Get every seeker to the three answers employers see first, mostly by tapping.', 'list'],
      ['A reason to finish', 'Make the rest of the CV feel worth doing, without ever blocking an application.', 'star'],
    ]},
    { id: 'jobs-first', title: 'A jobs-first flow', html: `
      <p>The new flow starts where seekers already are: a job post. They view the details, tap Apply, and only then create an account. People whose CV already reaches Basic go straight to the cover letter. Everyone else fills in only what’s missing.</p>
      <p class="flowline"><span>Job post</span><i>→</i><span>Job details</span><i>→</i><span>Apply</span><i>→</i><span>Account info</span><i>→</i><span>Share phone</span><i>→</i><span>Upload CV or fill in</span><i>→</i><span>Cover letter</span><i>→</i><span>Done</span></p>
      <p>I built it as a clickable prototype, with a switch to try both results of a CV upload.</p>`,
      gallery: { kind: 'phone', items: [
        [A + 'js-01.webp', 'Job details, opened from a channel post'],
        [A + 'js-02.webp', 'Job details, from Explore jobs'],
        [A + 'js-03.webp', 'Account info 1 · name'],
        [A + 'js-04.webp', 'Account info · error'],
        [A + 'js-05.webp', 'Account info 2 · birth date, gender'],
        [A + 'js-06.webp', 'Account info 3 · location, terms'],
        [A + 'js-07.webp', 'Share phone number through Telegram'],
        [A + 'up-setup.webp', 'Upload a CV, or set it up by hand'],
        [A + 'js-09.webp', 'Bot messages, with rewritten copy'],
      ]}
    },
    { id: 'explore', title: 'Many ways to ask three questions', html: `
      <p>Occupation, field of work and skills are mandatory, so how they’re asked matters. I explored several directions side by side before choosing one.</p>
      <p>One question per screen won. It keeps the keyboard and the question together on a small phone, and each step can explain itself in one line.</p>`,
      gallery: { kind: 'phone', items: [
        [A + 'opt-01.webp', 'A · Inline hints'],
        [A + 'opt-03.webp', 'B · Info icons, hints on tap'],
        [A + 'opt-04.webp', 'C · One question per screen (chosen)'],
        [A + 'opt-05.webp', 'D · Sections as cards'],
        [A + 'opt-06.webp', 'E · One section open at a time'],
        [A + 'opt-07.webp', 'F · Full descriptions + example chips'],
        [A + 'opt-08.webp', 'G · Conversational, the bot explains'],
        [A + 'opt-09.webp', 'H · Explain all three once, up top'],
        [A + 'ex-10.webp', 'Chosen direction · occupation title'],
        [A + 'ex-11.webp', 'Occupation title · error'],
        [A + 'ex-12.webp', 'Field of work'],
        [A + 'ex-13.webp', 'Skills'],
        [A + 'ex-14.webp', 'All three done'],
      ]}
    },
    { id: 'flow', title: 'The Afriwork CV in three steps', html: `
      <p>Three steps with a progress bar. Each one has quick picks so most people tap rather than type: a ${pill('briefcase','role')}, a ${pill('layers','sector')} with its sub-sectors, then ${pill('star','skills')} with a level. The skills step says why it matters: most hires are skill-based.</p>
      <p>The last screen shows the three answers with an Edit link for each, then sends the person straight back to the job.</p>`,
      gallery: { kind: 'phone', items: [
        [A + 'cv-1.webp', '1 · What do you do?'],
        [A + 'cv-1b.webp', 'Picked from quick picks'],
        [A + 'cv-2.webp', '2 · Sector'],
        [A + 'cv-2b.webp', 'Sub-sectors'],
        [A + 'cv-3.webp', '3 · Search a skill'],
        [A + 'cv-3b.webp', 'Pick a level'],
        [A + 'cv-3c.webp', 'Skills added'],
        [A + 'cv-ready.webp', 'Your Afriwork CV is ready'],
      ]}
    },
    { id: 'levels', title: 'Basic, Standard, Gold', html: `
      <p>The CV has three levels, ${pill('star','Basic')} ${pill('star','Standard')} and ${pill('star','Gold')}, and each one shows exactly what it unlocks: a badge, the CV as a PDF, Super Apply for more visibility, or extra CVs. The progress sits right under the job, where the person is already looking.</p>
      <p>Finishing is always optional. Afriwork had already learned this: an earlier “complete your profile to apply” blocker cut applications sharply, and a soft nudge brought them back. So every prompt here has a “Not now”.</p>`,
      gallery: { kind: 'phone', items: [
        [A + 'tier-basic.webp', 'Basic'],
        [A + 'tier-standard.webp', 'Standard'],
        [A + 'tier-gold.webp', 'Gold'],
        [A + 'learn-basic.webp', 'What Standard unlocks'],
        [A + 'learn-standard.webp', 'What Gold unlocks'],
        [A + 'learn-gold.webp', 'Gold features'],
        [A + 'up-announce.webp', 'For existing users: your CV just got better'],
        [A + 'up-standard.webp', 'Standard reached'],
        [A + 'up-finish.webp', 'Finish your CV, or not now'],
      ]}
    },
    { id: 'apply', title: 'Applying, then what’s next', html: `
      <p>Applying stays short: the CV is already attached, the cover letter opens in place, and optional extras stay optional. After sending, the success screen changes with the CV level, so each person sees the one thing that would help their next application.</p>`,
      gallery: { kind: 'phone', items: [
        [A + 'page-05.webp', 'Job details'],
        [A + 'page-06.webp', 'Application · cover letter open'],
        [A + 'page-07.webp', 'Submitted · Basic'],
        [A + 'page-08.webp', 'Submitted · Standard'],
        [A + 'page-09.webp', 'Submitted · Gold'],
      ]}
    },
    { id: 'signup', title: 'One sign-up for everyone', html: `
      <p>On the web, sign-up starts with Telegram, the quickest way in, or email. One account can hold several profiles, so the same person can look for work and hire, and switch without logging in again.</p>`,
      gallery: { kind: 'phone', items: [
        [A + 'su-signup.webp', 'Join Afriwork'],
        [A + 'su-verify.webp', 'Verification code'],
        [A + 'su-18.webp', 'Wrong code'],
        [A + 'su-verified.webp', 'Verified'],
        [A + 'su-name.webp', 'Name and an optional photo'],
        [A + 'su-21.webp', 'Name · errors'],
        [A + 'su-24.webp', 'Password · empty'],
        [A + 'su-password.webp', 'Password, with rules checked as you type'],
        [A + 'su-26.webp', 'Password · valid'],
        [A + 'su-28.webp', 'Add a photo'],
        [A + 'su-photo.webp', 'Adjust the photo'],
        [A + 'su-30.webp', 'Photo added'],
        [A + 'su-31.webp', 'Change or remove'],
        [A + 'su-32.webp', 'Remove, confirm'],
        [A + 'su-33.webp', 'Photo too large'],
        [A + 'su-choose.webp', 'How will you use Afriwork?'],
        [A + 'su-telegram.webp', 'From Telegram, details come prefilled'],
        [A + 'su-35.webp', 'From Telegram, choose a profile'],
      ]}
    },
    { id: 'page', title: 'The CV page', html: `
      <p>The profile needed to show the CV level without crowding the job. I tried a progress bar, a stepper, and a badge with an Upgrade button, plus three ways to switch between CVs. The stepper stayed, because it shows the next level and what it unlocks at a glance.</p>`,
      gallery: { kind: 'phone', items: [
        [A + 'page-10.webp', 'Option 1 · Level as a progress bar'],
        [A + 'page-11.webp', 'Option 2 · Stepper kept, extras removed'],
        [A + 'page-12.webp', 'Option 3 · Level badge + Upgrade'],
        [A + 'page-15.webp', 'A · The role is the switcher'],
        [A + 'page-16.webp', 'B · CV row at the foot of the card'],
        [A + 'page-17.webp', 'C · Centred, Edit + Switch'],
        [A + 'page-13.webp', 'Option 2b · Pill button'],
        [A + 'page-14.webp', 'Option 2d · Missing sections inside the card'],
        [A + 'page-18.webp', 'Profile · Standard'],
        [A + 'js-15.webp', 'Profile · Latest in your sector'],
        [A + 'js-14.webp', 'Profile · Jobs for you'],
      ]}
    },
    { id: 'measure', title: 'Measuring it', html: `
      <p>There was no funnel data, so nobody could see where people dropped off. I wrote a request for step-by-step tracking of signing up, applying and posting a job. Once it’s live, the current flow becomes the baseline the redesign is measured against.</p>` },
  ]
},
{
  id: 'employer-research',
  title: 'Why employers miss good candidates',
  kicker: 'UX research · Afriwork',
  summary: 'Research into why good applicants on Afriwork were never seen by employers, and the fixes it led to.',
  theme: { bg: '#1D1B1A', fg: '#FFFFFF', accent: '#F2475A' },
  cover: { kind: 'stat', big: 'Attention, not supply.', text: '' },
  tags: ['UX research', 'Data analysis', 'Marketplace', 'Product strategy'],
  snapshot: [
    ['Company', 'Afriwork'],
    ['My role', 'Product designer & UX researcher'],
    ['Method', 'Product data on applications, shortlists and hires, plus hands-on testing'],
    ['Status', 'Fixes pitched, waiting on prioritisation'],
  ],
  sections: [
    { id: 'question', title: 'The question', html: `
      <p>What stops employers from consistently getting enough value from Afriwork, and what should change so they keep coming back?</p>
      <p>The research covered verified companies and private clients, such as individuals or people starting a business. I relied on what employers actually do in the product rather than what they say in surveys, and checked every finding against a second source before acting on it.</p>` },
    { id: 'attention', title: 'Finding 1: many applicants are never seen', html: `
      <p>A large share of applications are ${pill('eye','never opened')} by the employer. Only a minority of jobs get their whole applicant list reviewed, and some get none of it reviewed.</p>` },
    { id: 'volume', title: 'Finding 2: the busier the job, the less gets seen', html: `
      <p>Review drops as applications pile up. The busiest jobs hold a big share of all applications, and an even bigger share of the ones nobody opens. Good applicants were getting lost at the bottom of long lists.</p>` },
    { id: 'speed', title: 'Finding 3: employers who shortlist do it fast', html: `
      <p>Employers who shortlist usually do it within the first day or so, and almost always within the first couple of weeks. An applicant who hasn’t been looked at by then probably never will be, so the first days are the moment to help.</p>` },
    { id: 'hire-form', title: 'Finding 4: the hire form loses the ending', html: `
      <p>The hire form asks employers how a job ended: ${pill('check','Hired from Afriwork')} ${pill('briefcase','Hired elsewhere')} ${pill('clock','Still reviewing')} or ${pill('','Cancelled')}. It is the main way Afriwork records hires, but it often doesn’t capture what really happened.</p>
      <ul class="issues">
        <li>Many forms never get an answer.</li>
        <li>Afriwork is credited with only a minority of the hires employers report.</li>
        <li>After a set time the “still reviewing” option disappears, and that one rule causes most of the cancellations and “hired elsewhere” answers from then on.</li>
        <li>“Still reviewing” is usually real: most of those employers had already opened several applicants.</li>
        <li>Sending the form again lines up with more cancellations, not more hires.</li>
        <li>Seekers get a closing message after an Afriwork hire or a cancellation, but not after “hired elsewhere”.</li>
      </ul>` },
    { id: 'today', title: 'How employers see a candidate today', html: `
      <p>Employers review applicants in the Afriwork Employer Bot. The CV levels from my sign-up work show up here too, so a fuller CV is easier to spot in a long list.</p>`,
      gallery: { kind: 'phone', items: [
        [A + 'tier-basic.webp', 'A Basic CV, as the employer sees it'],
        [A + 'tier-standard.webp', 'Standard'],
        [A + 'tier-gold.webp', 'Gold'],
        [A + 'page-16.webp', 'Candidate card with the CV row at the foot'],
      ]}
    },
    { id: 'fixes', title: 'What I proposed', html: `<p>I wrote each fix as Problem, Evidence and Fix, so the team could weigh them side by side.</p>`,
      list: [
        ['Rank applicants by fit', 'Show the best-matching applicants first, and keep “newest first” as an option.', 'list'],
        ['Remind employers early', 'Tell employers about applicants they haven’t opened yet, in the first days, while they still shortlist.', 'bell'],
        ['Show how crowded a job is', 'Let seekers see how many people have already applied, so they can aim better.', 'eye'],
        ['Rework the hire form', 'Change the form so it records how each job really ended, and tells every seeker.', 'form'],
      ]
    },
    { id: 'learned', title: 'What I learned', html: `
      <p>The obvious story was “employers can’t find good candidates”. The data said the opposite: the candidates are there, and they get lost in long lists. That changed the fixes from finding more people to helping employers see the right ones in time.</p>` },
  ]
},
{
  id: 'loop',
  title: 'Loop',
  kicker: 'Productivity · Android & web',
  summary: 'A task app for phone and computer, built around a daily rhythm: capture anything fast, sort it later, and let a morning check-in deal with whatever was left from yesterday.',
  theme: { bg: '#E6ECF8', fg: '#141A2E', accent: '#2F62E9' },
  cover: { kind: 'phone', imgs: [L + 'phone-checkin.webp', L + 'phone-today.webp', L + 'VInbox.webp'] },
  tags: ['Product design', 'Mobile', 'Web app', 'Interaction design', 'Dark mode'],
  snapshot: [
    ['Role', 'Product designer: user flows, UI, prototype and brand mark'],
    ['Platform', 'Android app and web app, light and dark'],
    ['Deliverable', 'A clickable prototype of every screen'],
    ['Year', '2026'],
  ],
  sections: [
    { id: 'problem', title: 'The problem', html: `
      <p>Most to-do apps make you plan everything up front. Then a busy day happens, tasks pile up, and the list stops being useful.</p>
      <p>Loop is designed around how days actually go: write things down the moment you think of them, decide later, and get help each morning with whatever didn’t get done.</p>` },
    { id: 'goals', title: 'Goals', list: [
      ['Capture in seconds', 'Adding a task or a thought should never need a date, a list or a decision.', 'pen'],
      ['Leftovers handled', 'Unfinished tasks never silently pile up; Loop asks what to do with them.', 'clock'],
      ['Same Loop everywhere', 'Phone and computer share the same tasks and rules, each laid out for how it’s used.', 'monitor'],
    ]},
    { id: 'checkin', title: 'The morning check-in', html: `
      <p>Each morning Loop looks at yesterday. If tasks were left over, a ${pill('bell','notification')} offers to move them to today, mark them done or review them, and the full check-in deals with them in one go.</p>
      <p>With nothing left over it simply sends today’s plan, and an afternoon nudge only appears when tasks are still open.</p>`,
      gallery: { kind: 'phone', items: [
        [L + 'phone-checkin-notification.webp', 'The check-in notification on the lock screen'],
        [L + 'phone-checkin.webp', 'Full-screen check-in for yesterday’s leftovers'],
        [L + 'phone-today.webp', 'Today: tasks and Google Calendar events on one timeline'],
        [L + 'NSetupCheckins.webp', 'Check-ins are set up the first time they’re useful'],
        [L + 'NTodayDone.webp', 'All done for today'],
      ]}
    },
    { id: 'capture', title: 'Capture now, sort later', html: `
      <p>Quick add takes a task with or without a date. Anything undated lands in the Inbox, and an evening reminder walks through it one note at a time: make it a ${pill('check','task')}, keep it as a ${pill('pen','note')}, or ${pill('','delete it')}.</p>`,
      gallery: { kind: 'phone', items: [
        [L + 'phone-quick-add.webp', 'Quick add'],
        [L + 'VInbox.webp', 'Inbox: notes waiting to be sorted'],
        [L + 'phone-sort-note.webp', 'Sorting one note into a task, a note or the bin'],
        [L + 'phone-notes.webp', 'Free-form notes'],
      ]}
    },
    { id: 'setup', title: 'Learn by doing', html: `
      <p>There is no long onboarding. Sign-in leads into a short tutorial you learn by doing: add a task, tick it off, dump a note. Check-in times, full-screen alerts and Google Calendar are each set up the first time they become useful.</p>`,
      gallery: { kind: 'phone', items: [
        [L + 'NSignIn.webp', 'Sign in'],
        [L + 'phone-tutorial.webp', 'Tutorial: add your first task'],
        [L + 'NTut2.webp', 'Tutorial: tick it off'],
        [L + 'phone-calendar.webp', 'Calendar week, with Google events next to tasks'],
        [L + 'phone-widgets.webp', 'Home-screen widgets for Today and quick add'],
      ]}
    },
    { id: 'everyday', title: 'The everyday screens', html: `
      <p>The rest of the app stays quiet and predictable: one menu for every view, a task page where edits save on their own, search across tasks, notes and lists, and a clear offline state so nothing feels lost.</p>`,
      gallery: { kind: 'phone', items: [
        [L + 'NSideMenu2.webp', 'Menu: views, lists and tags'],
        [L + 'NNext7.webp', 'Next 7 Days'],
        [L + 'VTaskDetail.webp', 'Task details with subtasks'],
        [L + 'VSearch.webp', 'Search across tasks, notes and lists'],
        [L + 'NOffline.webp', 'Offline: changes wait and sync later'],
      ]}
    },
    { id: 'layout', title: 'On the computer: three columns', html: `
      <p>The web app keeps the same structure, laid out for a mouse and keyboard: a sidebar, the main list and a detail panel, with no icon rail. Edits in the panel save on their own. With nothing selected, the panel says what to do: “Pick a task to see it here”.</p>`,
      gallery: { kind: 'desktop', items: [
        [L + 'WToday.webp', 'Today: week strip, schedule, anytime tasks and the detail panel'],
      ]}
    },
    { id: 'checkins-desk', title: 'Check-ins that don’t interrupt', html: `
      <p>On the phone, a check-in about yesterday’s unfinished tasks takes over the screen. On a computer that would break someone’s focus, so it becomes a quiet card at the top of Today. Each task gets Today, Tomorrow or Pick day, and “Not now” leaves everything where it is.</p>`,
      gallery: { kind: 'desktop', items: [
        [L + 'WTodayCheckin.webp', 'The check-in card on Today'],
      ]}
    },
    { id: 'keyboard', title: 'Built for the keyboard', html: `
      <p>Press <kbd>Q</kbd> anywhere to open quick add, a command bar that turns “tomorrow 3pm #personal !high” into ${pill('calendar','Tomorrow, 15:00')} ${pill('','#personal')} ${pill('','High')} as you type. The Inbox can be sorted entirely with keys, one item at a time.</p>`,
      gallery: { kind: 'desktop', items: [
        [L + 'WQuickAdd.webp', 'Quick add, opened with Q'],
        [L + 'WInbox.webp', 'Sorting the Inbox: T, M, W for when; 1, 2, 3 for the list'],
        [L + 'WShortcuts.webp', 'Every shortcut on one sheet, opened with ?'],
      ]}
    },
    { id: 'translate', title: 'Phone patterns, translated', html: `<p>Each phone pattern got a computer equivalent instead of being copied over.</p>`,
      table: [
        ['Phone', 'Computer'],
        ['Bottom sheet', 'A dialog or an anchored pop-over'],
        ['Long press for quick actions', 'Right-click menu'],
        ['Swipe', 'Checkbox, keys or the menu'],
        ['Full-screen check-in', 'A card on Today, plus a browser notification'],
        ['Time wheel', 'Typed field with quick picks; ↑ ↓ in 15-minute steps'],
        ['Drag handle', 'Drag the row itself'],
      ],
      gallery: { kind: 'desktop', items: [
        [L + 'WContext.webp', 'Right-click a task for quick actions'],
        [L + 'WCalWeek.webp', 'Drag from “Not scheduled” onto a time in the week'],
        [L + 'WNext7.webp', 'Drag onto a day in Next 7 Days'],
      ]}
    },
    { id: 'edges', title: 'Narrow windows and edge cases', html: `
      <p>Under 1200 px the sidebar folds behind a menu button, and under 900 px the detail panel slides over the list. I also designed the states that usually get forgotten: offline with changes waiting, and browser notifications blocked, with how to fix it.</p>`,
      gallery: { kind: 'desktop', items: [
        [L + 'WNarrow.webp', 'A 1024 px window'],
        [L + 'WOffline.webp', 'Offline · changes waiting'],
        [L + 'WNotifBlocked.webp', 'Notifications blocked by the browser'],
      ]}
    },
    { id: 'dark', title: 'Dark mode', html: `<p>Every screen, on the phone and the computer, has a dark twin, and dark screens link to other dark screens in the prototype.</p>`,
      gallery: { kind: 'desktop', items: [
        [L + 'DWToday.webp', 'Today, dark'],
        [L + 'DWCalWeek.webp', 'Calendar week, dark'],
        [L + 'DWInbox.webp', 'Inbox, dark'],
      ]}
    },
    { id: 'brand', title: 'Brand', html: `
      <p>A simple four-part mark in white on the accent blue, drawn as an Android adaptive icon so it holds up under any mask shape.</p>`,
      gallery: { kind: 'phone', items: [
        [L + 'phone-splash.webp', 'Splash screen'],
        [L + 'phone-app-icon.webp', 'App icon sizes, masks and the themed icon'],
        [L + 'phone-today-dark.webp', 'Today in dark mode'],
      ]}
    },
  ]
},
];
