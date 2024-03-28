document.addEventListener('DOMContentLoaded', function () {
  var tiddlywikiInput = document.getElementById('tiddlywiki-input');
  var markdownOutput = document.getElementById('markdown-output');

  tiddlywikiInput.addEventListener('input', function () {
    convertToMarkdown();
  });

  function convertToMarkdown() {
    const tiddlyWikiText = tiddlywikiInput.value;
    const markdown = convertTiddlyWikiToMarkdown(tiddlyWikiText);
    markdownOutput.value = markdown;
  }

  function convertTiddlyWikiToMarkdown(tiddlyWikiText) {
    let markdown = '';
    const lines = tiddlyWikiText.split('\n');
    let insideCodeBlock = false;
    let insideBlockQuote = false; 
    let listCounters = [];

    for (let line of lines) {
      // 检查代码块
      if (line.startsWith('```')) {
        insideCodeBlock = !insideCodeBlock;
      }

      if (!insideCodeBlock) {
        // 替换标题
        if (line.startsWith('!')) {
          let headingLevel = line.lastIndexOf('!') + 1;
          line = '#'.repeat(headingLevel) + ' ' + line.substring(headingLevel).trim();
          listCounters = []; // 当遇到新的标题时，重置列表计数器
        } else {
          // 替换有序列表
          let newListLevel = (line.match(/^#+/) || [''])[0].length;
          if (newListLevel > 0) {
            while (listCounters.length < newListLevel) {
              listCounters.push(0);
            }
            while (listCounters.length > newListLevel) {
              listCounters.pop();
            }
            listCounters[newListLevel - 1]++;
            line = '   '.repeat(newListLevel - 1) + listCounters[newListLevel - 1] + '. ' + line.substring(newListLevel).trim();
          } else {
            // 替换无序列表
            let bulletMatch = line.match(/^(\*+)\s/);
            if (bulletMatch) {
              let bulletLevel = bulletMatch[1].length;
              line = '  '.repeat(bulletLevel - 1) + '* ' + line.substring(bulletLevel).trim();
            }
            listCounters = []; // 当遇到非列表行时，重置列表计数器
          }
        }

        // 替换链接和图片
        line = line.replace(/\[\[(.*?)\|(.*?)\]\]/g, '[$1]($2)')
                   .replace(/\[img\[(.*?)\]\]/g, '![]($1)');

        // 替换粗体和斜体
        line = line.replace(/''(.*?)''/g, '**$1**')
                   .replace(/\/\/(.*?)\/\//g, '*$1*');

        // 替换引用
        if (line.startsWith('<<<')) {
          insideBlockQuote = !insideBlockQuote;
          continue;
        }
        if (insideBlockQuote) {
          line = '> ' + line;
        }

        // 替换分隔线
        if (line === '---' || line === '----') {
          line = '---';
        }

        // 替换行内代码
        line = line.replace(/`([^`]*)`/g, '`$1`');
      }

      markdown += line + '\n';
    }

    // 移除多余的空行
    markdown = markdown.replace(/\n{3,}/g, '\n\n');

    return markdown.trim() + '\n'; // 确保输出以换行符结束
  }
});