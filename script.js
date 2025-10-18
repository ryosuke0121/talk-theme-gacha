// グローバル変数
let themes = [];
let recentThemes = []; // 最近使用したテーマを記録
const maxRecentThemes = 10; // 最近のテーマの記録数
let recentPeople = []; // 最近選ばれた人を記録

// ページ読み込み時の処理
document.addEventListener('DOMContentLoaded', async () => {
    await loadThemes();
    setupEventListeners();
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
    document.getElementById('save-settings-btn').addEventListener('click', closeSettingsModal);

    // モーダル外をクリックしたら閉じる
    const modal = document.getElementById('settings-modal');
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
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
}// 参加者を追加
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

    // ランダムに選択
    const selectedPerson = availablePeople[Math.floor(Math.random() * availablePeople.length)];

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