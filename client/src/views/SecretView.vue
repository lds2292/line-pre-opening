<template>
  <div class="secret-container">
    <div class="content-card">
      <!-- Banner -->
      <div class="banner">
        <span class="banner-text">事前予約方法</span>
      </div>

      <!-- Logo -->
      <div class="logo-area">
        <div class="logo-circle">
          <span class="logo-text">Liné</span>
        </div>
        <h1 class="clinic-name">リネ美容外科</h1>
        <p class="clinic-sub">Liné Plastic Surgery Clinic</p>
      </div>

      <!-- Main message -->
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
            <span class="info-label">事前カウンセリング</span>
            <span class="info-value">予約受付中</span>
          </div>
          <div class="info-row">
            <span class="info-label">手術予約</span>
            <span class="info-value">受付中</span>
          </div>
        </div>
      </div>

      <!-- LINE CTA -->
      <div class="line-cta">
        <p class="line-desc">LINEで事前予約・カウンセリングのご相談を承っております</p>
        <a
          href="https://line.me/ti/p/~@line_account"
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
  padding: 0 0 40px;
  max-width: 480px;
  width: 100%;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  overflow: hidden;
  text-align: center;
}

.banner {
  background: linear-gradient(135deg, #6b4fa0 0%, #9b6dcc 100%);
  padding: 20px;
  margin-bottom: 32px;
}

.banner-text {
  color: #fff;
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 0.15em;
}

.logo-area {
  padding: 0 40px;
  margin-bottom: 32px;
}

.logo-circle {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #6b4fa0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
}

.logo-text {
  color: #fff;
  font-size: 20px;
  font-style: italic;
  font-weight: 300;
  letter-spacing: 1px;
}

.clinic-name {
  font-size: 20px;
  font-weight: 500;
  color: #2c2c2c;
  margin: 0 0 4px;
  letter-spacing: 0.05em;
}

.clinic-sub {
  font-size: 13px;
  color: #888;
  margin: 0;
}

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
}

.info-label {
  font-size: 13px;
  color: #777;
}

.info-value {
  font-size: 14px;
  color: #333;
  font-weight: 500;
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

.line-cta {
  padding: 0 40px;
  margin-bottom: 24px;
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
  gap: 8px;
  background: #06C755;
  color: #fff;
  padding: 14px 28px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  transition: background 0.2s;
  letter-spacing: 0.03em;
}

.line-btn:hover {
  background: #05a548;
}

.line-icon {
  width: 22px;
  height: 22px;
}

.footer-note {
  padding: 0 40px;
  font-size: 11px;
  color: #bbb;
  line-height: 1.7;
  margin: 0;
}
</style>
