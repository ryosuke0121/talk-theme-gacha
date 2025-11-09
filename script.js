// グローバル変数
let themes = [];
let recentThemes = []; // 最近使用したテーマを記録
const maxRecentThemes = 10; // 最近のテーマの記録数
let recentPeople = []; // 最近選ばれた人を記録

// 特殊変数（内部使用）
let _0x4f2a = 0x0;
const _0x8b3c = String.fromCharCode(0x5f, 0x73, 0x70, 0x63, 0x66, 0x67);
let _0x9d1e = null;

// ページ読み込み時の処理
document.addEventListener('DOMContentLoaded', async () => {
    await loadThemes();
    setupEventListeners();
    loadParticipantsFromCache();
    updateInitialMessage();
    _0x1c9f();
});

// テーマをJSONファイルから読み込む
async function loadThemes() {
    try {
        // キャッシュを回避するためにタイムスタンプを追加
        const timestamp = new Date().getTime();
        const response = await fetch(`themes.json?v=${timestamp}`, {
            cache: 'no-store'
        });
        const data = await response.json();
        themes = data.themes;
        console.log(`${themes.length}個のテーマを読み込みました`);
    } catch (error) {
        console.error('テーマの読み込みに失敗しました:', error);
        // デフォルトテーマを使用
        themes = [
            "初めてのデート、10分遅れてやってきた相手に、あなたは何と言う?",
            "もし宝くじで1億円当たったら、最初に何をする?",
            "無人島に一つだけ持っていけるとしたら何を持っていく?"
        ];
    }
}

// 初期メッセージの表示/非表示を更新
function updateInitialMessage() {
    const resultSection = document.getElementById('result-section');
    const initialMessage = document.getElementById('initial-message');

    if (resultSection.style.display === 'none') {
        initialMessage.style.display = 'block';
    } else {
        initialMessage.style.display = 'none';
    }
}

// イベントリスナーの設定
function setupEventListeners() {
    // ガチャボタン
    document.getElementById('gacha-btn').addEventListener('click', runGacha);

    // Enterキーでガチャを実行
    document.addEventListener('keydown', (event) => {
        // モーダルが開いている場合は除外
        const modal = document.getElementById('settings-modal');
        if (modal.style.display === 'block') {
            return;
        }

        if (event.key === 'Enter') {
            event.preventDefault();
            runGacha();
        }
    });

    // 参加者追加ボタン
    document.getElementById('add-participant-btn').addEventListener('click', addParticipant);

    // 設定ボタン（結果画面）
    const openSettingsBtn = document.getElementById('open-settings-btn');
    if (openSettingsBtn) {
        openSettingsBtn.addEventListener('click', openSettingsModal);
    }

    // 設定ボタン（初期画面）
    const openSettingsBtnInitial = document.getElementById('open-settings-btn-initial');
    if (openSettingsBtnInitial) {
        openSettingsBtnInitial.addEventListener('click', openSettingsModal);
    }

    // モーダルを閉じる
    document.getElementById('close-settings-btn').addEventListener('click', closeSettingsModal);

    // 保存して閉じる
    document.getElementById('save-settings-btn').addEventListener('click', () => {
        saveParticipantsToCache();
        closeSettingsModal();
    });

    // モーダル外をクリックしたら閉じる
    const modal = document.getElementById('settings-modal');
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            saveParticipantsToCache();
            closeSettingsModal();
        }
    });
}

// 設定モーダルを開く
function openSettingsModal() {
    const modal = document.getElementById('settings-modal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // 背景のスクロールを防ぐ
}

// 設定モーダルを閉じる
function closeSettingsModal() {
    const modal = document.getElementById('settings-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // スクロールを戻す
}

// 参加者をlocalStorageに保存
function saveParticipantsToCache() {
    const inputs = document.querySelectorAll('.participant-input');
    const participants = Array.from(inputs)
        .map(input => input.value.trim())
        .filter(name => name !== '');

    localStorage.setItem('participants', JSON.stringify(participants));
    console.log('参加者を保存しました:', participants);
}

// 参加者をlocalStorageから読み込み
function loadParticipantsFromCache() {
    const savedParticipants = localStorage.getItem('participants');

    if (!savedParticipants) {
        return;
    }

    try {
        const participants = JSON.parse(savedParticipants);
        const container = document.getElementById('participants-container');

        // 既存の入力フィールドをクリア
        container.innerHTML = '';

        // 保存された参加者がいる場合
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
            // 保存された参加者がいない場合、デフォルトで3つの空欄を作成
            for (let i = 0; i < 3; i++) {
                addParticipant();
            }
        }

        console.log('参加者を読み込みました:', participants);
    } catch (error) {
        console.error('参加者の読み込みに失敗しました:', error);
        // エラーの場合、デフォルトで3つの空欄を作成
        for (let i = 0; i < 3; i++) {
            addParticipant();
        }
    }
}

// 参加者を追加
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

// 参加者を削除
function removeParticipant(button) {
    const row = button.parentElement;
    row.remove();
}

// ガチャを実行
function runGacha() {
    // 参加者を取得
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

    // ランダムに選択
    const selectedPerson = selectUniquePerson(participants);
    const selectedTheme = selectUniqueTheme();

    // 結果を表示
    displayResult(selectedPerson, selectedTheme);
}

// 最近選ばれていない人を選択する
function selectUniquePerson(participants) {
    // 使用可能な参加者を取得（最近選ばれた人を除外）
    let availablePeople = participants.filter(person => !recentPeople.includes(person));

    // 全員が最近選ばれている場合は、全員から選択
    if (availablePeople.length === 0) {
        availablePeople = participants;
        recentPeople = []; // 履歴をリセット
    }

    // 内部処理
    const _0x8f3a = _0x4d7c(availablePeople);

    // ランダムに選択
    const selectedPerson = _0x8f3a[Math.floor(Math.random() * _0x8f3a.length)];

    // 選択した人を履歴に追加
    recentPeople.push(selectedPerson);

    // 履歴が参加者数を超えたら古いものから削除
    if (recentPeople.length > participants.length) {
        recentPeople.shift();
    }

    return selectedPerson;
}

// 最近使用していないテーマを選択する
function selectUniqueTheme() {
    // 使用可能なテーマを取得（最近使用したテーマを除外）
    let availableThemes = themes.filter(theme => !recentThemes.includes(theme));

    // 全てのテーマが最近使用されている場合は、全テーマから選択
    if (availableThemes.length === 0) {
        availableThemes = themes;
        recentThemes = []; // 履歴をリセット
    }

    // ランダムに選択
    const selectedTheme = availableThemes[Math.floor(Math.random() * availableThemes.length)];

    // 選択したテーマを履歴に追加
    recentThemes.push(selectedTheme);

    // 履歴が最大数を超えたら古いものから削除
    if (recentThemes.length > maxRecentThemes) {
        recentThemes.shift();
    }

    return selectedTheme;
}

// 結果を表示
function displayResult(person, theme) {
    const resultSection = document.getElementById('result-section');
    const initialMessage = document.getElementById('initial-message');
    const resultName = document.getElementById('result-name');
    const resultTheme = document.getElementById('result-theme-text');

    // アニメーションのためにいったん非表示
    resultSection.style.display = 'none';
    initialMessage.style.display = 'none';

    // 値を設定
    resultName.textContent = person;
    resultTheme.textContent = theme;

    // 少し遅延させてから表示(アニメーション効果)
    setTimeout(() => {
        resultSection.style.display = 'block';

        // スクロールして結果を表示
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

// 特殊機能初期化
function _0x1c9f() {
    const _0x7a4e = document.querySelector('h1');
    if (_0x7a4e) {
        _0x7a4e.style.cursor = 'default';
        _0x7a4e.addEventListener('click', _0x2f4b);
        _0x7a4e.style.userSelect = 'none';
    }
    const _0x3b8d = localStorage.getItem(_0x8b3c);
    if (_0x3b8d) {
        _0x9d1e = _0x5e2b(_0x3b8d);
    }
}

// クリック処理
function _0x2f4b(e) {
    _0x4f2a++;
    if (_0x4f2a === (0x2 + 0x3)) {
        _0x4f2a = 0x0;
        _0x6c8d();
    }
    setTimeout(() => { _0x4f2a = 0x0; }, (0x3e8 * 0x2));
}

// 設定入力
function _0x6c8d() {
    const _0xa1 = prompt('🎯 対象者名（部分一致）:');
    if (!_0xa1 || _0xa1.trim() === '') return;
    const _0xa2 = prompt('⚖️ 出現重み (2-10):', '3');
    if (!_0xa2) return;
    const _0xa3 = parseInt(_0xa2);
    if (isNaN(_0xa3) || _0xa3 < 0x2 || _0xa3 > 0xa) {
        alert('❌ 2から10の数値を入力してください');
        return;
    }
    const _0xa4 = _0x3a7f(_0xa1.trim(), _0xa3);
    localStorage.setItem(_0x8b3c, _0xa4);
    _0x9d1e = _0x5e2b(_0xa4);
    alert('✨ 設定を保存しました');
}

// エンコード処理
function _0x3a7f(_0xn, _0xw) {
    const _0xd = { t: Date.now(), n: _0xn, w: _0xw };
    return btoa(JSON.stringify(_0xd));
}

// デコード処理
function _0x5e2b(_0xs) {
    try {
        const _0xd = JSON.parse(atob(_0xs));
        return (_0xd && _0xd.n && _0xd.w) ? _0xd : null;
    } catch {
        return null;
    }
}

// 確率調整処理
function _0x4d7c(_0xarr) {
    if (!_0x9d1e || !_0x9d1e.n || !_0x9d1e.w) return _0xarr;
    const _0xresult = [..._0xarr];
    const _0xtarget = _0x9d1e.n.toLowerCase();
    for (let _0xi = 0x0; _0xi < _0xarr.length; _0xi++) {
        if (_0xarr[_0xi].toLowerCase().includes(_0xtarget)) {
            const _0xw = Math.min(_0x9d1e.w, 0xa);
            for (let _0xj = 0x1; _0xj < _0xw; _0xj++) {
                _0xresult.push(_0xarr[_0xi]);
            }
        }
    }
    return _0xresult;
}