function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function spinnerHTML() {
  return `<span class="spinner"></span> Loading...`;
}

function icon(name) {
  return `<i data-lucide="${name}" class="icon"></i>`;
}

// score = (followers × 3) + (repos × 2) + (stars × 5)
function calculateScore(user, stars) {
  return user.followers * 3 + user.public_repos * 2 + stars * 5;
}

async function fetchUser(username) {
  const res = await fetch(`https://api.github.com/users/${username}`);
  if (res.status === 404) throw new Error(`User not found.`);
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.json();
}

async function fetchRepos(reposUrl) {
  const res = await fetch(`${reposUrl}?per_page=100&sort=pushed`);
  if (!res.ok) throw new Error('Could not fetch repositories.');
  return res.json();
}

function totalStars(repos) {
  return repos.reduce((sum, r) => sum + r.stargazers_count, 0);
}

function renderProfile(user) {
  return `
    <div class="profile-card">
      <img src="${user.avatar_url}" alt="${user.login}'s avatar" />
      <div class="profile-info">
        <h2>${user.name || user.login}</h2>
        <div class="username">@${user.login}</div>
        <div class="bio">${user.bio || 'No bio provided.'}</div>
        <div class="profile-meta">
          <span>${icon('users')} ${user.followers} followers</span>
          <span>${icon('package')} ${user.public_repos} repos</span>
          <span>${icon('calendar')} Joined ${formatDate(user.created_at)}</span>
        </div>
        ${user.blog
          ? `<a href="${user.blog.startsWith('http') ? user.blog : 'https://' + user.blog}" target="_blank" rel="noopener">${icon('link')} ${user.blog}</a>`
          : ''}
      </div>
    </div>`;
}

let allRepos    = [];
let repoPage    = 1;
const PAGE_SIZE = 10;

function renderRepos(repos, page) {
  if (!repos.length) return '<p style="color:#8b949e">No public repositories found.</p>';

  const total      = repos.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const start      = (page - 1) * PAGE_SIZE;
  const slice      = repos.slice(start, start + PAGE_SIZE);

  const items = slice.map(r => `
    <div class="repo-item">
      <div>
        <a href="${r.html_url}" target="_blank" rel="noopener">${r.name}</a>
        ${r.description ? `<div class="repo-desc">${r.description}</div>` : ''}
      </div>
      <div class="repo-meta">
        <span>${icon('star')} ${r.stargazers_count}</span>
        <span>${icon('git-fork')} ${r.forks_count}</span>
        <span>${icon('clock')} ${formatDate(r.pushed_at)}</span>
      </div>
    </div>`).join('');

  const pagination = totalPages > 1 ? `
    <div class="pagination">
      <button class="page-btn" id="prevBtn" ${page === 1 ? 'disabled' : ''}>
        ${icon('chevron-left')} Prev
      </button>
      <span class="page-info">Showing ${start + 1}–${Math.min(start + PAGE_SIZE, total)} of ${total} repositories &nbsp;&middot;&nbsp; Page ${page} of ${totalPages}</span>
      <button class="page-btn" id="nextBtn" ${page === totalPages ? 'disabled' : ''}>
        Next ${icon('chevron-right')}
      </button>
    </div>` : `<div class="page-info-simple">${total} repositories</div>`;

  return `<div class="repos-title">All Repositories</div>${items}${pagination}`;
}

function attachPaginationEvents() {
  const prev = document.getElementById('prevBtn');
  const next = document.getElementById('nextBtn');
  if (prev) prev.addEventListener('click', () => {
    repoPage--;
    repoEl.innerHTML = renderRepos(allRepos, repoPage);
    lucide.createIcons();
    attachPaginationEvents();
    repoEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  if (next) next.addEventListener('click', () => {
    repoPage++;
    repoEl.innerHTML = renderRepos(allRepos, repoPage);
    lucide.createIcons();
    attachPaginationEvents();
    repoEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

function renderBattleCard(user, stars, result, reason) {
  const score = calculateScore(user, stars);
  return `
    <div class="battle-card ${result}">
      <img src="${user.avatar_url}" alt="${user.login}" />
      <h3>${user.name || user.login}</h3>
      <div class="username">@${user.login}</div>
      <div class="battle-stat">${icon('star')} Stars: <strong>${stars}</strong></div>
      <div class="battle-stat">${icon('users')} Followers: <strong>${user.followers}</strong></div>
      <div class="battle-stat">${icon('package')} Repos: <strong>${user.public_repos}</strong></div>
      <div class="battle-score">
        GitHub Strength: ${score}
        <span class="tooltip-wrap">
          <span class="info-icon">i</span>
          <span class="tooltip-text">
            Score = (Followers × 3) + (Repos × 2) + (Stars × 5)<br>
            = (${user.followers} × 3) + (${user.public_repos} × 2) + (${stars} × 5)<br>
            = ${score}
          </span>
        </span>
      </div>
      ${reason ? `<div class="winner-reason">${reason}</div>` : ''}
      <div class="verdict">
        ${result === 'winner'
          ? `${icon('trophy')} Winner`
          : result === 'loser'
          ? `${icon('x-circle')} Loser`
          : `${icon('handshake')} Draw`}
      </div>
    </div>`;
}

// single search
const searchForm  = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const searchError = document.getElementById('searchError');
const statusEl    = document.getElementById('status');
const profileEl   = document.getElementById('profileCard');
const repoEl      = document.getElementById('repoList');

searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = searchInput.value.trim();

  if (!username) {
    searchError.textContent = 'Please enter a username.';
    searchInput.classList.add('input-error');
    return;
  }

  searchError.textContent = '';
  searchInput.classList.remove('input-error');
  statusEl.innerHTML = spinnerHTML();
  profileEl.innerHTML = '';
  repoEl.innerHTML = '';

  try {
    const user  = await fetchUser(username);
    const repos = await fetchRepos(user.repos_url);
    allRepos = repos;
    repoPage = 1;
    statusEl.innerHTML  = '';
    profileEl.innerHTML = renderProfile(user);
    repoEl.innerHTML    = renderRepos(allRepos, repoPage);
    lucide.createIcons();
    attachPaginationEvents();
  } catch (err) {
    statusEl.innerHTML = '';
    searchError.textContent = err.message;
    searchInput.classList.add('input-error');
    profileEl.innerHTML = '';
    repoEl.innerHTML = '';
  }
});

// battle mode
const battleForm   = document.getElementById('battleForm');
const battleStatus = document.getElementById('battleStatus');
const battleArena  = document.getElementById('battleArena');
const battleBtn    = document.getElementById('battleBtn');
const user1Input   = document.getElementById('user1Input');
const user2Input   = document.getElementById('user2Input');

function validateBattleInputs() {
  battleBtn.disabled = !user1Input.value.trim() || !user2Input.value.trim();
}

user1Input.addEventListener('input', validateBattleInputs);
user2Input.addEventListener('input', validateBattleInputs);
validateBattleInputs();

// clear errors on typing
searchInput.addEventListener('input', () => {
  searchError.textContent = '';
  searchInput.classList.remove('input-error');
});
user1Input.addEventListener('input', () => {
  document.getElementById('error1').textContent = '';
  user1Input.classList.remove('input-error');
});
user2Input.addEventListener('input', () => {
  document.getElementById('error2').textContent = '';
  user2Input.classList.remove('input-error');
});

battleForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const u1 = user1Input.value.trim();
  const u2 = user2Input.value.trim();
  if (!u1 || !u2) return;

  battleStatus.innerHTML = spinnerHTML();
  battleArena.innerHTML  = '';
  battleBtn.disabled     = true;

  const error1El = document.getElementById('error1');
  const error2El = document.getElementById('error2');
  error1El.textContent = '';
  error2El.textContent = '';
  user1Input.classList.remove('input-error');
  user2Input.classList.remove('input-error');

  // fetch both independently for per-field errors
  const [res1, res2] = await Promise.allSettled([fetchUser(u1), fetchUser(u2)]);

  let user1 = null, user2 = null, hasError = false;

  if (res1.status === 'rejected') {
    error1El.textContent = 'User not found.';
    user1Input.classList.add('input-error');
    hasError = true;
  } else { user1 = res1.value; }

  if (res2.status === 'rejected') {
    error2El.textContent = 'User not found.';
    user2Input.classList.add('input-error');
    hasError = true;
  } else { user2 = res2.value; }

  if (hasError) {
    battleStatus.innerHTML = '';
    validateBattleInputs();
    return;
  }

  try {
    const [repos1, repos2] = await Promise.all([
      fetchRepos(user1.repos_url),
      fetchRepos(user2.repos_url)
    ]);

    const stars1 = totalStars(repos1);
    const stars2 = totalStars(repos2);
    const score1 = calculateScore(user1, stars1);
    const score2 = calculateScore(user2, stars2);

    let result1, result2, reason1, reason2;

    if (score1 > score2) {
      result1 = 'winner'; result2 = 'loser';
      const edges = [];
      if (user1.followers > user2.followers) edges.push('followers');
      if (user1.public_repos > user2.public_repos) edges.push('repositories');
      if (stars1 > stars2) edges.push('stars');
      reason1 = edges.length ? `Higher ${edges.join(', ')}` : 'Higher overall score';
      reason2 = null;
    } else if (score2 > score1) {
      result1 = 'loser'; result2 = 'winner';
      const edges = [];
      if (user2.followers > user1.followers) edges.push('followers');
      if (user2.public_repos > user1.public_repos) edges.push('repositories');
      if (stars2 > stars1) edges.push('stars');
      reason2 = edges.length ? `Higher ${edges.join(', ')}` : 'Higher overall score';
      reason1 = null;
    } else {
      result1 = 'draw'; result2 = 'draw';
      reason1 = reason2 = 'Identical scores';
    }

    battleStatus.innerHTML = '';
    battleArena.innerHTML = `
      <div class="battle-arena">
        ${renderBattleCard(user1, stars1, result1, reason1)}
        <div class="vs-badge">VS</div>
        ${renderBattleCard(user2, stars2, result2, reason2)}
      </div>`;
    lucide.createIcons();
  } catch (err) {
    battleStatus.innerHTML = `<span class="error-msg">${err.message}</span>`;
  } finally {
    validateBattleInputs();
  }
});

// tab switching
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

// init icons on load
lucide.createIcons();
