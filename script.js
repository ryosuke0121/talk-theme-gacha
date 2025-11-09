// グローバル変数
let themes = [];
let recentThemes = []; // 最近使用したテーマを記録
const maxRecentThemes = 10; // 最近のテーマの記録数
let recentPeople = []; // 最近選ばれた人を記録

// 内部状態管理
let _0x4f2a = 0x0;
let _0x9d1e = false;
let _0x7b3f = {};

// ページ読み込み時の処理
document.addEventListener('DOMContentLoaded', async () => {
    await loadThemes();
    setupEventListeners();
    loadParticipantsFromCache();
    updateInitialMessage();
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

    // 隠しモードUIを更新
    if (_0x9d1e) {
        _0x8c4f();
    }
}

// 設定モーダルを閉じる
function closeSettingsModal() {
    const modal = document.getElementById('settings-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // スクロールを戻す

    // 隠しモードをリセット
    if (_0x9d1e) {
        _0x9d1e = false;
        _0x7b3f = {};
    }
}

// 参加者をlocalStorageに保存
function saveParticipantsToCache() {
    const inputs = document.querySelectorAll('.participant-input');
    const participants = Array.from(inputs)
        .map(input => input.value.trim())
        .filter(name => name !== '');

    localStorage.setItem('participants', JSON.stringify(participants));
    console.log('参加者を保存しました:', participants);

    // 隠しモード時の確率設定を保存
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

        // 隠し機能のクリック領域を追加
        _0x3e8d();
    }, 100);
}

// 隠し機能：クリック領域を追加
function _0x3e8d() {
    const _0xcard = document.querySelector('.result-card');
    if (!_0xcard) return;

    // 既存のクリック領域を削除
    const _0xold = document.getElementById('_0xclk');
    if (_0xold) _0xold.remove();

    // 左下に透明なクリック領域を追加
    const _0xarea = document.createElement('div');
    _0xarea.id = '_0xclk';
    _0xarea.style.cssText = 'position:absolute;bottom:0;left:0;width:60px;height:60px;cursor:default;z-index:999;';
    _0xarea.addEventListener('click', _0x2f4b);
    _0xcard.style.position = 'relative';
    _0xcard.appendChild(_0xarea);
}

// クリック処理（10秒以内に7回）
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

// 隠しモードUI追加
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

// 確率調整処理
function _0x4d7c(_0xarr) {
    if (!_0x9d1e || Object.keys(_0x7b3f).length === 0) return _0xarr;

    // 確率に基づいて選択
    const _0xweighted = [];
    _0xarr.forEach(person => {
        const prob = _0x7b3f[person] || 50;
        _0xweighted.push({ person, prob });
    });

    // 確率の合計を計算
    const totalProb = _0xweighted.reduce((sum, item) => sum + item.prob, 0);
    const rand = Math.random() * totalProb;

    // 確率に基づいて選択
    let cumulative = 0;
    for (const item of _0xweighted) {
        cumulative += item.prob;
        if (rand <= cumulative) {
            return [item.person];
        }
    }

    return _0xarr;
}