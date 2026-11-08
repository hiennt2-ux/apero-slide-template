(async () => {
  await document.fonts.ready;
  const slide = document.querySelector('.pd-slide');
  if (!slide) throw new Error('No rendered pitch slide');
  const bounds = slide.getBoundingClientRect();
  const issues = [];
  const walker = document.createTreeWalker(slide, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    if (!node.textContent.trim()) continue;
    const range = document.createRange();
    range.selectNodeContents(node);
    for (const rect of range.getClientRects()) {
      if (rect.width === 0 || rect.height === 0) continue;
      let clipped = rect.top < bounds.top - 2 || rect.bottom > bounds.bottom + 2 || rect.left < bounds.left - 2 || rect.right > bounds.right + 2;
      for (let parent = node.parentElement; parent && parent !== slide; parent = parent.parentElement) {
        const css = getComputedStyle(parent), box = parent.getBoundingClientRect();
        if (/(hidden|clip|auto|scroll)/.test(css.overflowY) && (rect.top < box.top - 2 || rect.bottom > box.bottom + 2)) clipped = true;
        if (/(hidden|clip|auto|scroll)/.test(css.overflowX) && (rect.left < box.left - 2 || rect.right > box.right + 2)) clipped = true;
      }
      if (clipped) { issues.push({ type: 'clipped-text', text: node.textContent.slice(0,100) }); break; }
    }
  }
  for (const img of slide.querySelectorAll('img')) {
    if (!img.complete || !img.naturalWidth) issues.push({ type: 'broken-image', src: img.getAttribute('src') });
  }
  return {
    source: Number(document.querySelector('.pd-stage').dataset.sourceSlide),
    part: Number(document.querySelector('.pd-stage').dataset.part),
    title: slide.querySelector('h1,h2')?.textContent,
    rows: slide.querySelectorAll('tbody tr').length,
    bodyFonts: [...slide.querySelectorAll('.pd-card-body, td')].map(e => ({ size: parseFloat(getComputedStyle(e).fontSize), weight: getComputedStyle(e).fontWeight })),
    issues
  };
})()
