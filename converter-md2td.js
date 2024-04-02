document.addEventListener('DOMContentLoaded', function() {
  var markdownInput = document.getElementById('markdown-input');
  var tiddlywikiOutput = document.getElementById('tiddlywiki-output');

  markdownInput.addEventListener('input', function() {
    convertToTiddlyWiki();
  });

  function convertToTiddlyWiki() {
    const markdown = markdownInput.value;
    const tiddlyWikiOutputText = convertMarkdownToTiddlyWiki(markdown);
    tiddlywikiOutput.value = tiddlyWikiOutputText;
  }

function convertMarkdownToTiddlyWiki(markdown) {
  let tiddlyWikiOutput = '';
  const lines = markdown.split('\n');
  let insideCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // 代码块标记
    if (line.startsWith('```') && !insideCodeBlock) {
      insideCodeBlock = true;
      tiddlyWikiOutput += '```\n';
      continue;
    } else if (line.startsWith('```') && insideCodeBlock) {
      insideCodeBlock = false;
      tiddlyWikiOutput += '```\n';
      continue;
    }

    if (insideCodeBlock) {
      // 保持代码块内的文本不变
      tiddlyWikiOutput += line + '\n';
      continue;
    }

    // 替换标题
    line = line.replace(/^######\s+/g, '!!!!!! ')
               .replace(/^#####\s+/g, '!!!!! ')
               .replace(/^####\s+/g, '!!!! ')
               .replace(/^###\s+/g, '!!! ')
               .replace(/^##\s+/g, '!! ')
               .replace(/^#\s+/g, '! ');

    // 替换链接和图片
    line = line.replace(/!\[(.*?)\]\((.*?)\)/g, '[img[$2]]') 
           .replace(/\[(.*?)\]\((.*?)\)/g, '[[$1|$2]]'); 

    // 替换粗体和斜体
    line = line.replace(/\*\*(.*?)\*\*/g, "''$1''")
               .replace(/\*(.*?)\*/g, '//$1//');

    // 替换无序列表
    line = line.replace(/^(\s*)(?:\*|-)\s+/gm, (match, p1) => {
      const level = p1.length / 2 + 1;
      return '*'.repeat(level) + ' ';
    });

    // 替换有序列表
    line = line.replace(/^(\s*)\d+\.\s+/gm, (match, p1) => {
      const level = p1.length / 2 + 1;
      return '#'.repeat(level) + ' ';
    });

    // 替换引用
    if (line.startsWith('> ')) {
      line = line.substring(2);
      line = '<<<\n' + line + '\n<<<';
    }

    // 替换分隔线
    if (line.match(/^[-*_]{3,}\s*$/)) {
      line = '---';
    }

    // 替换行内代码
    line = line.replace(/`([^`]*)`/g, '`$1`');

    tiddlyWikiOutput += line + '\n';
  }

  // 移除多余的空行
  tiddlyWikiOutput = tiddlyWikiOutput.replace(/\n{3,}/g, '\n\n');

  return tiddlyWikiOutput.trim() + '\n'; // 确保输出以换行符结束
}
  
// convertToTiddlyWiki();
});