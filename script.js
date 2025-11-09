let themes = [];
let recentThemes = [];
const maxRecentThemes = 10;
let recentPeople = [];

let _0x4f2a = 0x0;
let _0x9d1e = false;
let _0x7b3f = {};

document.addEventListener('DOMContentLoaded', async () => {
    await loadThemes();
    setupEventListeners();
    loadParticipantsFromCache();
    updateInitialMessage();
});

async function loadThemes() {
    try {
        const timestamp = new Date().getTime();
        const response = await fetch(`themes.json?v=${timestamp}`, {
            cache: 'no-store'
        });
        const data = await response.json();
        themes = data.themes;
        console.log(`${themes.length}個のテーマを読み込みました`);
    } catch (error) {
        console.error('テーマの読み込みに失敗しました:', error);
        themes = [
            "初めてのデート、10分遅れてやってきた相手に、あなたは何と言う?",
            "もし宝くじで1億円当たったら、最初に何をする?",
            "無人島に一つだけ持っていけるとしたら何を持っていく?"
        ];
    }
}

function updateInitialMessage() {
    const resultSection = document.getElementById('result-section');
    const initialMessage = document.getElementById('initial-message');

    if (resultSection.style.display === 'none') {
        initialMessage.style.display = 'block';
    } else {
        initialMessage.style.display = 'none';
    }
}

function setupEventListeners() {
    document.getElementById('gacha-btn').addEventListener('click', runGacha);

    document.addEventListener('keydown', (event) => {
        const modal = document.getElementById('settings-modal');
        if (modal.style.display === 'block') {
            return;
        }

        if (event.key === 'Enter') {
            event.preventDefault();
            runGacha();
        }
    });

    document.getElementById('add-participant-btn').addEventListener('click', addParticipant);

    const openSettingsBtn = document.getElementById('open-settings-btn');
    if (openSettingsBtn) {
        openSettingsBtn.addEventListener('click', openSettingsModal);
    }

    const openSettingsBtnInitial = document.getElementById('open-settings-btn-initial');
    if (openSettingsBtnInitial) {
        openSettingsBtnInitial.addEventListener('click', openSettingsModal);
    }

    document.getElementById('close-settings-btn').addEventListener('click', closeSettingsModal);

    document.getElementById('save-settings-btn').addEventListener('click', () => {
        saveParticipantsToCache();
        closeSettingsModal();
    });

    const modal = document.getElementById('settings-modal');
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            saveParticipantsToCache();
            closeSettingsModal();
        }
    });
}

function openSettingsModal() {
    const modal = document.getElementById('settings-modal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    if (_0x9d1e) {
        _0x8c4f();
    }
}

function closeSettingsModal() {
    const modal = document.getElementById('settings-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';

    if (_0x9d1e) {
        _0x9d1e = false;
        _0x7b3f = {};
    }
}

function saveParticipantsToCache() {
    const inputs = document.querySelectorAll('.participant-input');
    const participants = Array.from(inputs)
        .map(input => input.value.trim())
        .filter(name => name !== '');

    localStorage.setItem('participants', JSON.stringify(participants));
    console.log('参加者を保存しました:', participants);

    if (_0x9d1e) {
        const _0x5e2c = document.querySelectorAll('._0xprob');
        _0x5e2c.forEach((input, idx) => {
            if (participants[idx]) {
                const val = parseInt(input.value) || 50;
                _0x7b3f[participants[idx]] = Math.max(1, Math.min(100, val));
            }
        });
    }
}

function loadParticipantsFromCache() {
    const savedParticipants = localStorage.getItem('participants');

    if (!savedParticipants) {
        return;
    }

    try {
        const participants = JSON.parse(savedParticipants);
        const container = document.getElementById('participants-container');

        container.innerHTML = '';

        if (participants.length > 0) {
            participants.forEach(name => {
                const newRow = document.createElement('div');
                newRow.className = 'participant-row';
                newRow.innerHTML = `
                    <input type="text" class="participant-input" placeholder="名前を入力" value="${name}">
                    <button class="remove-btn" onclick="removeParticipant(this)">削除</button>
                `;
                container.appendChild(newRow);
            });
        } else {
            for (let i = 0; i < 3; i++) {
                addParticipant();
            }
        }

        console.log('参加者を読み込みました:', participants);
    } catch (error) {
        console.error('参加者の読み込みに失敗しました:', error);
        for (let i = 0; i < 3; i++) {
            addParticipant();
        }
    }
}

function addParticipant() {
    const container = document.getElementById('participants-container');

    const newRow = document.createElement('div');
    newRow.className = 'participant-row';
    newRow.innerHTML = `
        <input type="text" class="participant-input" placeholder="名前を入力">
        <button class="remove-btn" onclick="removeParticipant(this)">削除</button>
    `;

    container.appendChild(newRow);
}

function removeParticipant(button) {
    const row = button.parentElement;
    row.remove();
}

function runGacha() {
    const inputs = document.querySelectorAll('.participant-input');
    const participants = Array.from(inputs)
        .map(input => input.value.trim())
        .filter(name => name !== '');

    if (participants.length === 0) {
        alert('参加者を少なくとも1人入力してください');
        return;
    }

    if (themes.length === 0) {
        alert('テーマが読み込まれていません');
        return;
    }

    const selectedPerson = selectUniquePerson(participants);
    const selectedTheme = selectUniqueTheme();

    displayResult(selectedPerson, selectedTheme);
}

function selectUniquePerson(participants) {
    let availablePeople = participants.filter(person => !recentPeople.includes(person));

    if (availablePeople.length === 0) {
        availablePeople = participants;
        recentPeople = [];
    }

    const _0x8f3a = _0x4d7c(availablePeople);

    const selectedPerson = _0x8f3a[Math.floor(Math.random() * _0x8f3a.length)];

    recentPeople.push(selectedPerson);

    if (recentPeople.length > participants.length) {
        recentPeople.shift();
    }

    return selectedPerson;
}

function selectUniqueTheme() {
    let availableThemes = themes.filter(theme => !recentThemes.includes(theme));

    if (availableThemes.length === 0) {
        availableThemes = themes;
        recentThemes = [];
    }

    const selectedTheme = availableThemes[Math.floor(Math.random() * availableThemes.length)];

    recentThemes.push(selectedTheme);

    if (recentThemes.length > maxRecentThemes) {
        recentThemes.shift();
    }

    return selectedTheme;
}

function displayResult(person, theme) {
    const resultSection = document.getElementById('result-section');
    const initialMessage = document.getElementById('initial-message');
    const resultName = document.getElementById('result-name');
    const resultTheme = document.getElementById('result-theme-text');

    resultSection.style.display = 'none';
    initialMessage.style.display = 'none';

    resultName.textContent = person;
    resultTheme.textContent = theme;

    setTimeout(() => {
        resultSection.style.display = 'block';

        resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        _0x3e8d();
    }, 100);
}

function _0x3e8d() {
    const _0xcard = document.querySelector('.result-card');
    if (!_0xcard) return;

    const _0xold = document.getElementById('_0xclk');
    if (_0xold) _0xold.remove();

    const _0xarea = document.createElement('div');
    _0xarea.id = '_0xclk';
    _0xarea.style.cssText = 'position:absolute;bottom:0;left:0;width:60px;height:60px;cursor:default;z-index:999;';
    _0xarea.addEventListener('click', _0x2f4b);
    _0xcard.style.position = 'relative';
    _0xcard.appendChild(_0xarea);
}

function _0x2f4b(e) {
    if (e) e.stopPropagation();
    _0x4f2a++;
    if (_0x4f2a === 0x7) {
        _0x4f2a = 0x0;
        alert('');
        _0x9d1e = true;
        return;
    }
    setTimeout(() => { _0x4f2a = 0x0; }, 0x2710);
}

function _0x8c4f() {
    const _0xrows = document.querySelectorAll('.participant-row');
    _0xrows.forEach(row => {
        if (row.querySelector('._0xprob')) return;

        const _0xinput = row.querySelector('.participant-input');
        const _0xname = _0xinput ? _0xinput.value.trim() : '';
        const _0xval = _0x7b3f[_0xname] || 50;

        const _0xprob = document.createElement('input');
        _0xprob.type = 'number';
        _0xprob.className = '_0xprob';
        _0xprob.min = '1';
        _0xprob.max = '100';
        _0xprob.value = _0xval;
        _0xprob.style.cssText = 'width:50px;margin-left:8px;';
        _0xprob.placeholder = '確率';

        row.appendChild(_0xprob);
    });
}

function _0x4d7c(_0xarr) {
    if (!_0x9d1e || Object.keys(_0x7b3f).length === 0) return _0xarr;

    const _0xweighted = [];
    _0xarr.forEach(person => {
        const prob = _0x7b3f[person] || 50;
        _0xweighted.push({ person, prob });
    });

    const totalProb = _0xweighted.reduce((sum, item) => sum + item.prob, 0);
    const rand = Math.random() * totalProb;

    let cumulative = 0;
    for (const item of _0xweighted) {
        cumulative += item.prob;
        if (rand <= cumulative) {
            return [item.person];
        }
    }

    return _0xarr;
}
