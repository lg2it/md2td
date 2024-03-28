# Markdown to TiddlyWiki Coverter

I have a fondness for TiddlyWiki, and yet my inclination is towards employing markdown syntax for everyday note-taking. Despite having a markdown plugin installed on TiddlyWiki, there are times when I find myself partial to using WikiText — a TiddlyWiki-supported syntax — over markdown.

With this in mind, I crafted a nifty converter that boasts real-time preview capabilities. Upon typing your text into the left-hand textarea using markdown syntax, you'll witness it being rendered live in the corresponding textarea on the right.

## Available syntax conversions

`#` → `!`

`##` → `!!`

……

`######` → `!!!!!!`

`[text](url)` → `[[text|url]]`

`![](url)` → `[img[url]]`

`**Blod**` → `''Blod''`

`*Italic*` → `//Italic//`

`---` → `---`

``inline code`` → ``inline code``

And also code block, bullet list and number list.

## Roadmap

[X] Support for commonly used markdown syntax

[] Expansion with more comprehensive markdown syntax support

[] Bidirectional conversion capability between markdown and TiddlyWiki

[] Functionality to import markdown files