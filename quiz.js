let allQuestions = [];
let questions = [];
let current = 0;
let score = 0;
let wrongCount = 0;
let skippedCount = 0;
let answered = false;

const letters = ['A','B','C','D','E','F','G'];

async function loadQuestions() {
  const res = await fetch('questions.json');
  allQuestions = await res.json();
  startQuiz();
}

function startQuiz() {
  const mode = document.getElementById('select-mode').value;
  const limitVal = parseInt(document.getElementById('input-limit').value);

  questions = [...allQuestions];
  if (mode === 'random') questions.sort(() => Math.random() - 0.5);
  if (!isNaN(limitVal) && limitVal > 0) questions = questions.slice(0, limitVal);

  current = 0;
  score = 0;
  wrongCount = 0;
  skippedCount = 0;

  document.getElementById('scoreboard').style.display = 'none';
  document.getElementById('quiz-card').style.display = 'block';
  document.getElementById('filter-bar').style.display = 'flex';

  renderQuestion();
}

function renderQuestion() {
  if (current >= questions.length) {
    showScore();
    return;
  }

  answered = false;
  const q = questions[current];
  const isMulti = Array.isArray(q.correct);

  document.getElementById('question-number').textContent = `Question ${current + 1}`;
  document.getElementById('question-text').textContent = q.question;

  const hint = document.getElementById('multi-hint');
  if (isMulti) {
    hint.style.display = 'inline-block';
    hint.textContent = `Choose ${q.correct.length} answers`;
  } else {
    hint.style.display = 'none';
  }

  const optionsEl = document.getElementById('options');
  optionsEl.innerHTML = '';

  const maxSelect = isMulti ? q.correct.length : 1;

  q.options.forEach((opt, i) => {
    const div = document.createElement('div');
    div.className = 'option';
    div.dataset.index = i;
    div.innerHTML = `
      <div class="option-marker">${letters[i]}</div>
      <div class="option-text">${opt}</div>
    `;
    div.addEventListener('click', () => toggleOption(div, isMulti, maxSelect));
    optionsEl.appendChild(div);
  });

  document.getElementById('feedback').style.display = 'none';
  document.getElementById('btn-confirm').disabled = true;
  document.getElementById('btn-confirm').style.display = 'inline-block';
  document.getElementById('btn-next').style.display = 'none';
  document.getElementById('btn-skip').style.display = 'inline-block';

  updateProgress();
}

function toggleOption(div, isMulti, maxSelect) {
  if (answered) return;

  if (!isMulti) {
    document.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
    div.classList.add('selected');
  } else {
    const alreadySelected = div.classList.contains('selected');
    const currentCount = document.querySelectorAll('.option.selected').length;

    if (!alreadySelected && currentCount >= maxSelect) return;
    div.classList.toggle('selected');
  }

  const selectedCount = document.querySelectorAll('.option.selected').length;
  document.getElementById('btn-confirm').disabled = selectedCount !== maxSelect;
}

document.getElementById('btn-confirm').addEventListener('click', () => {
  if (answered) return;
  answered = true;

  const q = questions[current];
  const isMulti = Array.isArray(q.correct);
  const correctSet = isMulti ? q.correct : [q.correct];

  const selected = [...document.querySelectorAll('.option.selected')].map(o =>
    q.options[parseInt(o.dataset.index)]
  );

  let allCorrect = true;

  document.querySelectorAll('.option').forEach(opt => {
    opt.classList.add('disabled');
    const text = q.options[parseInt(opt.dataset.index)];
    const isCorrectOpt = correctSet.includes(text);
    const isSelected = opt.classList.contains('selected');

    if (isCorrectOpt) {
      opt.classList.remove('selected');
      opt.classList.add('correct');
    } else if (isSelected && !isCorrectOpt) {
      opt.classList.remove('selected');
      opt.classList.add('wrong');
      allCorrect = false;
    }
  });

  const selectedSet = new Set(selected);
  const missedAny = correctSet.some(c => !selectedSet.has(c));
  if (missedAny) allCorrect = false;

  const feedback = document.getElementById('feedback');
  feedback.style.display = 'block';

  if (allCorrect) {
    score++;
    feedback.className = 'feedback correct';
    feedback.textContent = '✓ Correct!';
  } else {
    wrongCount++;
    feedback.className = 'feedback wrong';
    feedback.textContent = `✗ Wrong. Correct answer: ${correctSet.join(' / ')}`;
  }

  document.getElementById('btn-confirm').style.display = 'none';
  document.getElementById('btn-next').style.display = 'inline-block';
  document.getElementById('btn-skip').style.display = 'none';
  document.getElementById('score-text').textContent = `Score: ${score}`;
});

document.getElementById('btn-next').addEventListener('click', () => {
  current++;
  renderQuestion();
});

document.getElementById('btn-skip').addEventListener('click', () => {
  skippedCount++;
  current++;
  renderQuestion();
});

document.getElementById('btn-start-filter').addEventListener('click', startQuiz);
document.getElementById('btn-restart').addEventListener('click', startQuiz);

function updateProgress() {
  const pct = questions.length > 0 ? (current / questions.length) * 100 : 0;
  document.getElementById('progress-bar').style.width = pct + '%';
  document.getElementById('progress-text').textContent = `Question ${current + 1} of ${questions.length}`;
  document.getElementById('score-text').textContent = `Score: ${score}`;
}

function showScore() {
  document.getElementById('quiz-card').style.display = 'none';
  document.getElementById('filter-bar').style.display = 'none';

  const total = questions.length;
  const pct = Math.round((score / total) * 100);

  document.getElementById('progress-bar').style.width = '100%';
  document.getElementById('progress-text').textContent = `Completed ${total} of ${total}`;

  const scoreboard = document.getElementById('scoreboard');
  scoreboard.style.display = 'flex';
  document.getElementById('final-percent').textContent = pct + '%';
  document.getElementById('final-details').textContent =
    `You answered ${score} out of ${total} questions correctly`;
  document.getElementById('stat-correct').textContent = score;
  document.getElementById('stat-wrong').textContent = wrongCount;
  document.getElementById('stat-skipped').textContent = skippedCount;
}

loadQuestions();
