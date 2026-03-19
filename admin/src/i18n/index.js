export const messages = {
  ko: {
    // 공통
    adminPanel: '관리 패널',
    logout: '로그아웃',

    // 로그인
    username: '사용자명',
    password: '비밀번호',
    login: '로그인',
    loggingIn: '로그인 중...',
    loginError401: '사용자명 또는 비밀번호가 올바르지 않습니다.',
    loginErrorDefault: '오류가 발생했습니다. 다시 시도해주세요.',

    // 통계
    totalCodes: '전체 코드',
    usedCodes: '사용됨',
    unusedCodes: '미사용',

    // 코드 생성
    createCode: '새 코드 생성',
    labelPlaceholder: '라벨 (선택) 예: 홍길동님',
    generate: '생성',
    generating: '생성 중...',
    noLabel: '라벨 없음',
    copy: '복사',

    // 테이블
    codeList: '코드 목록',
    loading: '불러오는 중...',
    empty: '아직 코드가 없습니다.',
    emptyFiltered: '검색 결과가 없습니다.',
    colCode: '코드',
    colLabel: '라벨',
    colStatus: '상태',
    colCreatedAt: '생성일',
    colUsedAt: '사용일',
    colActions: '작업',
    used: '사용됨',
    unused: '미사용 🟢',

    // 필터 / 검색
    filterAll: '전체',
    filterUnused: '미사용',
    filterUsed: '사용됨',
    searchPlaceholder: '코드 또는 라벨 검색...',
    btnCopy: '복사',
    btnReissue: '재발급',
    btnDelete: '삭제',

    // 토스트
    toastCopied: (code) => `${code} 복사됨`,
    toastCopyFail: '복사에 실패했습니다',
    toastCreated: (code) => `코드 ${code} 생성됨`,
    toastCreateFail: '코드 생성에 실패했습니다',
    errorDuplicateLabel: '이미 사용 중인 라벨입니다.',
    toastReissued: (code) => `새 코드: ${code}`,
    toastReissueFail: '재발급에 실패했습니다',
    toastDeleted: '삭제했습니다',
    toastDeleteFail: '삭제에 실패했습니다',
    toastFetchFail: '코드 조회에 실패했습니다',

    // confirm
    confirmReissue: (name) => `「${name}」의 코드를 재발급하겠습니까?`,
    confirmDelete: (name) => `「${name}」을(를) 삭제하겠습니까?`,
  },
  ja: {
    // 共通
    adminPanel: '管理パネル',
    logout: 'ログアウト',

    // ログイン
    username: 'ユーザー名',
    password: 'パスワード',
    login: 'ログイン',
    loggingIn: 'ログイン中...',
    loginError401: 'ユーザー名またはパスワードが正しくありません。',
    loginErrorDefault: 'エラーが発生しました。もう一度お試しください。',

    // 統計
    totalCodes: '全コード',
    usedCodes: '使用済み',
    unusedCodes: '未使用',

    // コード生成
    createCode: '新規コード生成',
    labelPlaceholder: 'ラベル（任意）例: 山田花子様',
    generate: '生成する',
    generating: '生成中...',
    noLabel: 'ラベルなし',
    copy: 'コピー',

    // テーブル
    codeList: 'コード一覧',
    loading: '読み込み中...',
    empty: 'コードがまだありません。',
    emptyFiltered: '検索結果がありません。',
    colCode: 'コード',
    colLabel: 'ラベル',
    colStatus: '状態',
    colCreatedAt: '生成日',
    colUsedAt: '使用日',
    colActions: '操作',
    used: '使用済み',
    unused: '未使用 🟢',

    // フィルター / 検索
    filterAll: '全て',
    filterUnused: '未使用',
    filterUsed: '使用済み',
    searchPlaceholder: 'コードまたはラベルを検索...',
    btnCopy: 'コピー',
    btnReissue: '再発急',
    btnDelete: '削除',

    // トースト
    toastCopied: (code) => `${code} をコピーしました`,
    toastCopyFail: 'コピーに失敗しました',
    toastCreated: (code) => `コード ${code} を生成しました`,
    toastCreateFail: 'コードの生成に失敗しました',
    errorDuplicateLabel: 'すでに使用されているラベルです。',
    toastReissued: (code) => `新コード: ${code}`,
    toastReissueFail: '再発急に失敗しました',
    toastDeleted: '削除しました',
    toastDeleteFail: '削除に失敗しました',
    toastFetchFail: 'コードの取得に失敗しました',

    // confirm
    confirmReissue: (name) => `「${name}」のコードを再発急しますか？`,
    confirmDelete: (name) => `「${name}」を削除しますか？`,
  },
}
