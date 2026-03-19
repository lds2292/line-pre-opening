<template>
  <div class="secret-container">
    <div class="content-card">
      <!-- 스크롤 영역 -->
      <div class="scroll-area">
        <!-- 헤더 이미지 -->
        <div class="header-image-wrap">
          <img src="/header_970.jpg" alt="リネ美容外科" class="header-image" />
          <div class="header-overlay">
            <span class="banner-text">事前予約方法</span>
          </div>
        </div>

        <!-- 로고 -->
        <div class="logo-area">
          <img src="/logo.webp" alt="リネ美容外科ロゴ" class="logo-img" />
        </div>

        <!-- 메인 메시지 -->
        <div class="main-message">
          <p class="preparing-text">
            ホームページおよびSNSはオープン準備中でございます。
          </p>

          <div class="open-info">
            <div class="info-row">
              <span class="info-label">正式オープン日</span>
              <span class="info-value highlight">4月17日（木）〜</span>
            </div>
            <div class="divider"></div>
            <div class="info-row">
              <span class="info-label">事前カウンセリング・手術予約</span>
              <span class="info-value">受付中</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 하단 고정: LINE CTA + footer -->
      <div class="sticky-bottom">
        <div class="line-cta">
          <p class="line-desc">LINEで事前予約・カウンセリングのご相談を承っております</p>
          <a
            href="https://lin.ee/O9FGpS9"
            target="_blank"
            rel="noopener noreferrer"
            class="line-btn"
          >
            <svg class="line-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.15 2 11.275c0 2.812 1.4 5.32 3.594 7.004.157.12.252.307.252.505v2.366a.35.35 0 00.49.321l2.638-1.162c.16-.07.34-.08.508-.03.623.173 1.285.267 1.972.267C16.523 20.545 22 16.397 22 11.275 22 6.15 17.523 2 12 2zm-3.3 13.065H6.855a.52.52 0 01-.52-.52V9.457a.52.52 0 011.04 0v4.568h1.325a.52.52 0 010 1.04zm1.85 0a.52.52 0 01-1.04 0V9.457a.52.52 0 011.04 0v5.608zm4.875 0a.52.52 0 01-.424-.218l-2.42-3.3v3.00a.52.52 0 01-1.04 0V9.457a.52.52 0 01.942-.301l2.42 3.3V9.457a.52.52 0 011.04 0v5.607a.52.52 0 01-.518.001zm2.725 0h-1.846a.52.52 0 01-.52-.52V9.457a.52.52 0 01.52-.52H18.15a.52.52 0 010 1.04h-1.325v1.11h1.325a.52.52 0 010 1.04h-1.325v1.419h1.325a.52.52 0 010 1.04z"/>
            </svg>
            LINE で友だち追加
          </a>
        </div>

        <p class="footer-note">
          このページは招待された方限定のプレオープン情報です。<br>
          他の方への共有はご遠慮ください。
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
// SecretView – invite-only pre-opening page
</script>

<style scoped>
.secret-container {
  min-height: 100vh;
  background: #faf9f7;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 40px 20px;
}

.content-card {
  background: #fff;
  border-radius: 16px;
  padding: 0;
  max-width: 480px;
  width: 100%;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  overflow: hidden;
  text-align: center;
}


/* 헤더 이미지 */
.header-image-wrap {
  position: relative;
  width: 100%;
  line-height: 0;
}

.header-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  object-position: center;
  display: block;
}

.header-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(60,30,90,0.55) 100%);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 18px;
}

.banner-text {
  color: #fff;
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-shadow: 0 1px 4px rgba(0,0,0,0.4);
}

/* 로고 */
.logo-area {
  margin-top: 24px;
  margin-bottom: 28px;
}

.logo-img {
  width: 100%;
  display: block;
  object-fit: contain;
}

/* 메인 메시지 */
.main-message {
  padding: 0 40px;
  margin-bottom: 32px;
}

.preparing-text {
  font-size: 14px;
  color: #555;
  line-height: 1.8;
  margin: 0 0 24px;
}

.open-info {
  background: #f8f4fd;
  border-radius: 12px;
  padding: 20px 24px;
  text-align: left;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  gap: 12px;
}

.info-label {
  font-size: 13px;
  color: #777;
}

.info-value {
  font-size: 14px;
  color: #333;
  font-weight: 500;
  white-space: nowrap;
}

.info-value.highlight {
  color: #6b4fa0;
  font-size: 16px;
  font-weight: 600;
}

.divider {
  height: 1px;
  background: #e5ddf0;
  margin: 8px 0;
}

.sticky-bottom {
  background: #fff;
  border-top: 1px solid #f0eaf8;
  box-shadow: 0 -4px 16px rgba(107,79,160,0.07);
  padding: 20px 0 16px;
}

/* LINE CTA */
.line-cta {
  padding: 0 40px;
  margin-bottom: 12px;
}

.line-desc {
  font-size: 13px;
  color: #666;
  margin: 0 0 12px;
  line-height: 1.6;
}

.line-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #06C755;
  color: #fff;
  padding: 18px 36px;
  border-radius: 10px;
  text-decoration: none;
  font-size: 19px;
  font-weight: 500;
  transition: background 0.2s;
  letter-spacing: 0.03em;
}

.line-btn:hover {
  background: #05a548;
}

.line-icon {
  width: 28px;
  height: 28px;
}

.footer-note {
  padding: 0 40px;
  font-size: 11px;
  color: #bbb;
  line-height: 1.7;
  margin: 0;
}

@media (max-width: 480px) {
  .secret-container {
    padding: 0;
    align-items: stretch;
  }
  .content-card {
    border-radius: 0;
    box-shadow: none;
  }
  .header-image { height: 180px; }
}
</style>
