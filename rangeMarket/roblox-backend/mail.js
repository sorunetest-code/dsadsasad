const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false,
  auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
});

async function sendMagicLink({ to, username, displayName, avatarUrl, magicLink, items, total }) {
  const itemsRows = items.map(i => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #1e1e2e;font-size:14px;color:#c4c4d4;">
        ${i.emoji ? `<span style="margin-right:6px">${i.emoji}</span>` : ''}${i.gameName} — ${i.name}
      </td>
      <td style="padding:10px 0;border-bottom:1px solid #1e1e2e;text-align:right;font-weight:600;font-size:14px;color:#f0f0f8;">
        ${i.price} ₽
      </td>
    </tr>`).join('');

  const avatarBlock = avatarUrl ? `
    <div style="display:flex;align-items:center;gap:14px;background:#0d0d18;border:1px solid #1e1e2e;border-radius:12px;padding:14px 18px;margin-bottom:24px;">
      <img src="${avatarUrl}" alt="" width="52" height="52" style="border-radius:10px;border:2px solid #7c5cfc;" />
      <div>
        <div style="font-size:16px;font-weight:700;color:#f0f0f8;">${displayName}</div>
        ${displayName !== username ? `<div style="font-size:13px;color:#6b6b85;">@${username}</div>` : ''}
      </div>
    </div>` : `
    <div style="background:#0d0d18;border:1px solid #1e1e2e;border-radius:12px;padding:12px 18px;margin-bottom:24px;font-size:14px;color:#c4c4d4;">
      👤 ${displayName}${displayName !== username ? ` (@${username})` : ''}
    </div>`;

  await transporter.sendMail({
    from: `"RBX Market" <${process.env.MAIL_USER}>`,
    to,
    subject: `Подтверди заказ — ${total} ₽`,
    html: `<!DOCTYPE html>
<html lang="ru">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>RBX Market</title></head>
<body style="margin:0;padding:0;background:#07070f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#07070f;padding:40px 20px;">
<tr><td align="center">
<table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;">

  <!-- Logo -->
  <tr><td style="padding-bottom:32px;">
    <div style="font-size:20px;font-weight:800;color:#f0f0f8;letter-spacing:-0.02em;">
      ◈ RBX<span style="color:#a78bfa;">Market</span>
    </div>
  </td></tr>

  <!-- Card -->
  <tr><td style="background:#111118;border:1px solid #1e1e2e;border-radius:16px;padding:32px;">

    <p style="margin:0 0 6px;font-size:22px;font-weight:800;color:#f0f0f8;letter-spacing:-0.02em;">
      Подтверди заказ
    </p>
    <p style="margin:0 0 28px;font-size:14px;color:#6b6b85;">
      Нажми кнопку ниже чтобы подтвердить email и перейти к оплате
    </p>

    <!-- Roblox аккаунт -->
    <p style="margin:0 0 10px;font-size:11px;font-weight:600;color:#6b6b85;text-transform:uppercase;letter-spacing:0.07em;">Аккаунт Roblox</p>
    ${avatarBlock}

    <!-- Товары -->
    <p style="margin:0 0 10px;font-size:11px;font-weight:600;color:#6b6b85;text-transform:uppercase;letter-spacing:0.07em;">Состав заказа</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
      ${itemsRows}
      <tr>
        <td style="padding:14px 0 0;font-size:16px;font-weight:700;color:#f0f0f8;">Итого</td>
        <td style="padding:14px 0 0;text-align:right;font-size:20px;font-weight:800;color:#a78bfa;">${total} ₽</td>
      </tr>
    </table>

    <!-- CTA -->
    <div style="margin-top:28px;">
      <a href="${magicLink}"
         style="display:block;background:#7c5cfc;color:#fff;text-decoration:none;text-align:center;padding:16px 24px;border-radius:10px;font-weight:700;font-size:16px;letter-spacing:-0.01em;">
        Открыть заказ →
      </a>
    </div>

    <p style="margin:20px 0 0;font-size:12px;color:#3d3d55;text-align:center;">
      Ссылка действует 30 минут · Если ты не делал этот заказ — просто проигнорируй письмо
    </p>
  </td></tr>

  <!-- Footer -->
  <tr><td style="padding-top:24px;text-align:center;">
    <p style="margin:0;font-size:12px;color:#3d3d55;">© ${new Date().getFullYear()} RBX Market · Не является продуктом Roblox Corporation</p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`,
  });
}

async function sendOrderConfirmation({ to, orderId, username, displayName, avatarUrl, items, total, chatLink }) {
  const itemsRows = items.map(i => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #1e1e2e;font-size:13px;color:#c4c4d4;">${i.emoji || ''} ${i.gameName} — ${i.name}</td>
      <td style="padding:8px 0;border-bottom:1px solid #1e1e2e;text-align:right;font-weight:600;font-size:13px;color:#f0f0f8;">${i.price} ₽</td>
    </tr>`).join('');

  await transporter.sendMail({
    from: `"RBX Market" <${process.env.MAIL_USER}>`,
    to,
    subject: `Заказ оплачен — менеджер уже работает`,
    html: `<!DOCTYPE html>
<html lang="ru">
<head><meta charset="UTF-8"><title>RBX Market</title></head>
<body style="margin:0;padding:0;background:#07070f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#07070f;padding:40px 20px;">
<tr><td align="center">
<table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;">
  <tr><td style="padding-bottom:32px;">
    <div style="font-size:20px;font-weight:800;color:#f0f0f8;">◈ RBX<span style="color:#a78bfa;">Market</span></div>
  </td></tr>
  <tr><td style="background:#111118;border:1px solid #1e1e2e;border-radius:16px;padding:32px;">
    <div style="font-size:32px;margin-bottom:12px;">✅</div>
    <p style="margin:0 0 8px;font-size:22px;font-weight:800;color:#f0f0f8;">Оплата прошла!</p>
    <p style="margin:0 0 24px;font-size:14px;color:#6b6b85;">Менеджер уже получил заказ и скоро выдаст геймпасс.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      ${itemsRows}
      <tr>
        <td style="padding:12px 0 0;font-weight:700;color:#f0f0f8;">Итого</td>
        <td style="padding:12px 0 0;text-align:right;font-weight:800;font-size:18px;color:#a78bfa;">${total} ₽</td>
      </tr>
    </table>
    <a href="${chatLink}" style="display:block;background:#7c5cfc;color:#fff;text-decoration:none;text-align:center;padding:14px;border-radius:10px;font-weight:700;font-size:15px;">
      Открыть чат с менеджером →
    </a>
    <p style="margin:16px 0 0;font-size:12px;color:#3d3d55;text-align:center;">Среднее время выдачи — 10–15 минут</p>
  </td></tr>
  <tr><td style="padding-top:24px;text-align:center;">
    <p style="margin:0;font-size:12px;color:#3d3d55;">© ${new Date().getFullYear()} RBX Market</p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`,
  });
}

module.exports = { sendMagicLink, sendOrderConfirmation };
