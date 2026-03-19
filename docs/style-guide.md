# 스타일 가이드

## 브랜드 컬러

| 이름 | 코드 | 용도 |
|------|------|------|
| Primary Purple | `#6b4fa0` | 버튼, 강조 텍스트, 테두리 포커스 |
| Dark Purple | `#5a3e8a` | 버튼 hover |
| Light Purple BG | `#f8f4fd` | 정보 카드 배경 |
| Light Purple Border | `#e5ddf0` | 구분선 |
| Accent Purple | `#f0eaf8` | 태그, 배지 배경 |
| LINE Green | `#06C755` | LINE 버튼 |
| LINE Green Hover | `#05a548` | LINE 버튼 hover |
| Error Red | `#e05050` | 에러 메시지, 삭제 버튼 |
| Unused Green | `#2da86b` | 미사용 상태 배지 |

## 페이지 배경

```css
background: #faf9f7;  /* client 페이지 */
background: #f4f2f8;  /* admin 페이지 */
```

## 타이포그래피

- 기본 폰트: 시스템 폰트 (별도 웹폰트 없음)
- 코드 표시: `'Courier New', monospace`

### 폰트 사이즈 규칙

| 용도 | 크기 |
|------|------|
| input / search | `16px` (iOS Safari 자동 줌 방지를 위해 16px 미만 금지) |
| 버튼 | `14~15px` |
| 본문 | `13~14px` |
| 보조 텍스트 | `11~12px` |
| 코드 값 강조 | `17~18px`, font-weight 700 |

## 컴포넌트 패턴

### 카드

```css
background: #fff;
border-radius: 10px;          /* 내부 카드 */
border-radius: 16px;          /* 메인 카드 */
box-shadow: 0 4px 24px rgba(0,0,0,0.08);  /* 메인 카드 */
box-shadow: 0 1px 4px rgba(0,0,0,0.06);   /* 내부 카드 */
```

### 버튼

```css
/* Primary */
background: #6b4fa0;
color: #fff;
border-radius: 6~8px;
transition: background 0.2s;

/* 비활성화 */
opacity: 0.6;
cursor: not-allowed;
```

### 인풋

```css
border: 1.5px solid #ddd;
border-radius: 6~8px;
outline: none;
transition: border-color 0.2s;

/* 포커스 */
border-color: #6b4fa0;
```

### 배지 (상태 표시)

```css
/* 미사용 */
background: #e6f7ef;
color: #2da86b;

/* 사용됨 */
background: #f0f0f0;
color: #888;
```

### Toast 알림

```css
position: fixed;
bottom: 24px;
left: 50%;
transform: translateX(-50%);
background: #333;       /* 기본 */
background: #e05050;    /* 에러 */
border-radius: 8px;
z-index: 100;
```

## 반응형 브레이크포인트

| 브레이크포인트 | 용도 |
|--------------|------|
| `max-width: 480px` | client 모바일 (카드 전체 너비) |
| `max-width: 640px` | admin 모바일 (테이블 → 카드 전환) |

## client 레이아웃

- 최대 너비: `480px` (content-card)
- 헤더 이미지 높이: PC `200px` / 모바일 `180px`
- 좌우 패딩: `40px`

## admin 레이아웃

- 최대 너비: `960px` (dash-main)
- 헤더 높이: `52px`, sticky top
- 좌우 패딩: PC `16px` / 모바일 `12px`

## iOS Safari 주의사항

- input `font-size`는 반드시 `16px` 이상 (미만 시 자동 줌인 발생)
- `overflow: hidden` 부모 아래에서 `position: sticky` 동작 안 함
- 안전 영역: `viewport-fit=cover` + `env(safe-area-inset-bottom)` 사용

## 언어

- 페이지 UI: 일본어
- admin UI: 한국어 / 일본어 전환 지원 (`admin/src/i18n/index.js`)
- 코드 커밋 메시지 및 응답: 한국어
