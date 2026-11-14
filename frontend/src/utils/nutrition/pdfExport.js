const escapeHtml = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[char]));

export function exportPlanPdf(plan) {
  if (!plan || !Array.isArray(plan.rows) || !plan.rows.length) {
    return;
  }

  const rows = plan.rows
    .map(
      (row) => `
        <tr>
          <td>День ${row.day}</td>
          <td>${row.calories}</td>
          <td>${row.macros.protein} г</td>
          <td>${row.macros.fat} г</td>
          <td>${row.macros.carbs} г</td>
        </tr>
      `
    )
    .join('');

  const html = `
    <!doctype html>
    <html lang="uk">
      <head>
        <meta charset="utf-8">
        <title>NutriPlan — персональний план</title>

        <style>
          * {
            box-sizing: border-box;
          }

          body {
            font-family: Arial, sans-serif;
            color: #344256;
            margin: 0;
            padding: 34px;
            background: #fff;
          }

          .header {
            padding: 28px;
            border-radius: 16px;
            background: #eaf5eb;
            margin-bottom: 24px;
          }

          .brand {
            font-size: 24px;
            font-weight: 800;
            color: #388e3c;
          }

          .eyebrow {
            font-size: 10px;
            letter-spacing: 1.5px;
            color: #64748b;
            text-transform: uppercase;
          }

          .header h1 {
            font-size: 28px;
            margin: 14px 0 6px;
          }

          .muted {
            color: #64748b;
            font-size: 12px;
          }

          .grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin: 20px 0;
          }

          .metric {
            padding: 16px;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
          }

          .metric span {
            display: block;
            color: #64748b;
            font-size: 11px;
            margin-bottom: 8px;
          }

          .metric strong {
            font-size: 21px;
            color: #388e3c;
          }

          h2 {
            font-size: 17px;
            margin: 26px 0 12px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
          }

          th {
            background: #f1f7f1;
            text-align: left;
            color: #344256;
          }

          th, td {
            padding: 10px 8px;
            border-bottom: 1px solid #e2e8f0;
          }

          .note {
            margin-top: 24px;
            padding: 14px;
            background: #f8fafc;
            border-radius: 10px;
            color: #64748b;
            font-size: 10px;
            line-height: 1.6;
          }

          .footer {
            margin-top: 26px;
            color: #94a3b8;
            font-size: 10px;
          }

          @media print {
            body {
              padding: 12mm;
            }

            .header {
              break-inside: avoid;
            }

            tr {
              break-inside: avoid;
            }

            @page {
              size: A4;
              margin: 12mm;
            }
          }
        </style>
      </head>

      <body>
        <header class="header">
          <div class="brand">NutriPlan</div>
          <div class="eyebrow">Personal nutrition report</div>

          <h1>Персональний план енергетичних потреб</h1>

          <div class="muted">
            Період: ${plan.days} днів ·
            Модель: ${escapeHtml(plan.modelName)} ·
            Шаблон: ${escapeHtml(plan.templateName)}
          </div>
        </header>

        <div class="grid">
          <div class="metric">
            <span>Середня калорійність</span>
            <strong>${plan.averageCalories} ккал</strong>
          </div>

          <div class="metric">
            <span>Загальна калорійність</span>
            <strong>${plan.totalCalories.toLocaleString('uk-UA')} ккал</strong>
          </div>

          <div class="metric">
            <span>Тривалість плану</span>
            <strong>${plan.days} днів</strong>
          </div>
        </div>

        <h2>План на обраний період</h2>

        <table>
          <thead>
            <tr>
              <th>День</th>
              <th>Калорії</th>
              <th>Білки</th>
              <th>Жири</th>
              <th>Вуглеводи</th>
            </tr>
          </thead>

          <tbody>
            ${rows}
          </tbody>
        </table>

        <div class="note">
          Значення є розрахунковими оцінками на основі обраної
          математичної моделі та заданого розподілу макронутрієнтів.
          Вони не є медичними рекомендаціями.
          Для збереження у PDF оберіть у діалозі друку браузера
          пункт «Зберегти як PDF».
        </div>

        <div class="footer">
          NutriPlan · Звіт сформовано ${new Date().toLocaleDateString('uk-UA')}
        </div>

        <script>
          window.onload = () => window.print();
        </script>
      </body>
    </html>
  `;

  const popup = window.open('', '_blank', 'width=900,height=700');

  if (!popup) {
    window.alert('Дозвольте спливаючі вікна для експорту PDF.');
    return;
  }

  popup.document.open();
  popup.document.write(html);
  popup.document.close();
}
