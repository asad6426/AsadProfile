document.getElementById('year').textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Keep whole words together while revealing individual letters once on entry.
const heroTitle = document.querySelector('.hero-title');
heroTitle.setAttribute('aria-label', 'I build capable people and products.');
let letterOrder = 0;
heroTitle.querySelectorAll('.hero-word').forEach(word => {
  word.setAttribute('aria-hidden', 'true');
  const letters = [...word.textContent].map(character => {
    const letter = document.createElement('span');
    letter.className = 'hero-letter';
    letter.textContent = character;
    letter.style.setProperty('--letter-order', letterOrder++);
    return letter;
  });
  word.replaceChildren(...letters);
});
heroTitle.style.setProperty('--headline-duration', `${letterOrder * 95 + 450}ms`);
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => backToTop.classList.toggle('show', window.scrollY > 550), { passive: true });

document.querySelectorAll('#mainNav .nav-link').forEach(link => link.addEventListener('click', () => {
  const nav = document.getElementById('mainNav');
  if (nav.classList.contains('show') && window.bootstrap) bootstrap.Collapse.getOrCreateInstance(nav).hide();
}));

const tabs = [...document.querySelectorAll('.story-tab')];
const panels = [...document.querySelectorAll('[data-chapter-panel]')];
function activateChapter(name) {
  document.getElementById('story').dataset.activeChapter = name;
  document.querySelectorAll('.story-step').forEach(step => step.classList.toggle('active', step.dataset.chapter === name));
  tabs.forEach(tab => { const selected = tab.dataset.chapter === name; tab.classList.toggle('active', selected); tab.setAttribute('aria-selected', selected); });
  panels.forEach(panel => { const selected = panel.dataset.chapterPanel === name; panel.hidden = !selected; panel.classList.toggle('active', selected); });
}
tabs.forEach(tab => tab.addEventListener('click', () => {
  activateChapter(tab.dataset.chapter);
  if (document.getElementById('story').classList.contains('scroll-story')) document.getElementById(`step-${tab.dataset.chapter}`).scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
}));
tabs.forEach((tab, index) => tab.addEventListener('keydown', event => {
  if (!['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(event.key)) return;
  event.preventDefault(); const next = (index + (event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
  tabs[next].focus(); activateChapter(tabs[next].dataset.chapter);
}));

const revealTargets = document.querySelectorAll('.intro .row > div, .story-heading, .pathfinder-card, .section-head > *, .role-item, .expertise .row > div, .credential-row > div, .sqa-intro, .sqa-card, .contact-shell > *');
revealTargets.forEach((item, index) => { item.classList.add('reveal'); item.style.setProperty('--reveal-delay', `${index % 3 * 80}ms`); });
if (!reduceMotion && 'IntersectionObserver' in window) {
  document.body.classList.add('motion-ready');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('visible')), { threshold: .14 });
  document.querySelectorAll('.reveal').forEach(item => observer.observe(item));
} else document.querySelectorAll('.reveal').forEach(item => item.classList.add('visible'));

const results = {
  student: { icon: 'bi-lightbulb', title: 'A practical learning pathway', text: 'Explore structured training in Python, Django, Data Science and AI Automation—built around making, not memorising.' },
  recruiter: { icon: 'bi-check2-circle', title: 'A delivery-minded technical leader', text: 'See a blend of software development, training depth, stakeholder management and product delivery experience.' },
  institute: { icon: 'bi-diagram-3', title: 'Training designed for outcomes', text: 'Discuss course delivery, curriculum development, mentorship or a practical technology training partnership.' }
};
const result = document.getElementById('path-result');
document.querySelectorAll('.path-choice').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.path-choice').forEach(choice => choice.classList.toggle('selected', choice === button));
  const data = results[button.dataset.path];
  result.classList.remove('result-pop'); void result.offsetWidth; result.classList.add('result-pop');
  result.innerHTML = `<i class="bi ${data.icon}" aria-hidden="true"></i><div><strong>${data.title}</strong><p>${data.text}</p></div>`;
}));

if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('[data-tilt], .sqa-card').forEach(card => {
    card.addEventListener('pointermove', event => { const r = card.getBoundingClientRect(); const x = (event.clientX-r.left)/r.width-.5; const y = (event.clientY-r.top)/r.height-.5; card.style.transform = `perspective(900px) rotateX(${-y*4}deg) rotateY(${x*5}deg) translateY(-4px)`; });
    card.addEventListener('pointerleave', () => card.style.transform = '');
  });
}

// A sticky visual follows three chapters on desktop; mobile keeps direct tabs.
const story = document.getElementById('story');
const steps = document.createElement('div');
steps.className = 'story-steps';
const chapters = [
  ['build', '01 / Build', 'Start with the real need.', 'Understand the problem, shape the system and turn ideas into dependable software.'],
  ['teach', '02 / Teach', 'Make knowledge practical.', 'Turn complex concepts into clear learning steps and projects that build confidence.'],
  ['lead', '03 / Lead', 'Connect people to progress.', 'Align priorities, coordinate delivery and keep teams moving toward a shared outcome.']
];
steps.innerHTML = chapters.map(([name, label, title, copy]) => `<div class="story-step" id="step-${name}" data-chapter="${name}"><span>${label}</span><h3>${title}</h3><p>${copy}</p></div>`).join('');
story.querySelector('.story-layout').append(steps);
const desktopStory = window.matchMedia('(min-width: 992px)');
function syncStoryMode() { story.classList.toggle('scroll-story', desktopStory.matches && !reduceMotion); }
syncStoryMode();
desktopStory.addEventListener('change', syncStoryMode);
let framePending = false;
window.addEventListener('scroll', () => {
  if (framePending) return;
  framePending = true;
  requestAnimationFrame(() => {
    framePending = false;
    document.querySelector('.site-nav').classList.toggle('scrolled', window.scrollY > 24);
    if (!story.classList.contains('scroll-story')) return;
    const bounds = story.getBoundingClientRect();
    if (bounds.top > innerHeight || bounds.bottom < 0) return;
    const stepItems = [...steps.children];
    const nearest = stepItems.reduce((best, item) => Math.abs(item.getBoundingClientRect().top - innerHeight * .45) < Math.abs(best.getBoundingClientRect().top - innerHeight * .45) ? item : best);
    if (story.dataset.activeChapter !== nearest.dataset.chapter) activateChapter(nearest.dataset.chapter);
  });
}, { passive: true });
document.addEventListener('visibilitychange', () => document.body.classList.toggle('page-hidden', document.hidden));
if ('IntersectionObserver' in window) {
  const navObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    document.querySelectorAll('.nav-link').forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  }), { rootMargin: '-15% 0px -55% 0px' });
  document.querySelectorAll('main section[id]').forEach(section => navObserver.observe(section));
}
