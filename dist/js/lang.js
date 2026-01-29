(() => {
  const btn = document.getElementById('lang-switch');
  if (!btn) return;

  const isChinese = location.pathname.includes('index_zh');

  btn.textContent = isChinese ? 'EN' : '中文';

  btn.addEventListener('click', () => {
    const target = isChinese ? 'index.html' : 'index_zh.html';
    location.href = target;
  });
})();