function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Minimal markdown: **bold**, *italic*, `code`, and "- " bullet lists. */
export function renderMarkdown(input: string): string {
  const lines = escapeHtml(input).split('\n');
  const html: string[] = [];
  let inList = false;

  for (const line of lines) {
    const isBullet = /^\s*-\s+/.test(line);
    if (isBullet && !inList) {
      html.push('<ul class="list-disc pl-5 space-y-0.5">');
      inList = true;
    }
    if (!isBullet && inList) {
      html.push('</ul>');
      inList = false;
    }

    const inline = line
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code class="rounded bg-muted px-1 py-0.5 text-[13px]">$1</code>');

    if (isBullet) {
      html.push(`<li>${inline.replace(/^\s*-\s+/, '')}</li>`);
    } else if (line.trim() === '') {
      html.push('<br/>');
    } else {
      html.push(`<p>${inline}</p>`);
    }
  }

  if (inList) html.push('</ul>');
  return html.join('');
}
