document.getElementById('year').textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => backToTop.classList.toggle('show', window.scrollY > 550), { passive: true });

document.querySelectorAll('#mainNav .nav-link').forEach(link => link.addEventListener('click', () => {
  const nav = document.getElementById('mainNav');
  if (nav.classList.contains('show')) bootstrap.Collapse.getOrCreateInstance(nav).hide();
}));

const tabs = [...document.querySelectorAll('.story-tab')];
const panels = [...document.querySelectorAll('[data-chapter-panel]')];
function activateChapter(name) {
  tabs.forEach(tab => { const selected = tab.dataset.chapter === name; tab.classList.toggle('active', selected); tab.setAttribute('aria-selected', selected); });
  panels.forEach(panel => { const selected = panel.dataset.chapterPanel === name; panel.hidden = !selected; panel.classList.toggle('active', selected); });
}
tabs.forEach(tab => tab.addEventListener('click', () => activateChapter(tab.dataset.chapter)));
tabs.forEach((tab, index) => tab.addEventListener('keydown', event => {
  if (!['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(event.key)) return;
  event.preventDefault(); const next = (index + (event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
  tabs[next].focus(); activateChapter(tabs[next].dataset.chapter);
}));

if (!reduceMotion && 'IntersectionObserver' in window) {
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
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('pointermove', event => { const r = card.getBoundingClientRect(); const x = (event.clientX-r.left)/r.width-.5; const y = (event.clientY-r.top)/r.height-.5; card.style.transform = `perspective(900px) rotateX(${-y*4}deg) rotateY(${x*5}deg) translateY(-4px)`; });
    card.addEventListener('pointerleave', () => card.style.transform = '');
  });
}
