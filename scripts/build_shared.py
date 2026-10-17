"""Render shared static navigation. Run python3 scripts/build_shared.py after page edits."""
from pathlib import Path
import re
import hashlib
ROOT=Path(__file__).resolve().parents[1]
VERSION=hashlib.sha256((ROOT/'assets/css/world.css').read_bytes()+(ROOT/'assets/js/world.js').read_bytes()).hexdigest()[:10]
ROOMS=hashlib.sha256((ROOT/'assets/css/rooms.css').read_bytes()+(ROOT/'assets/js/rooms.js').read_bytes()).hexdigest()[:10]
GAME=hashlib.sha256((ROOT/'assets/css/game.css').read_bytes()+(ROOT/'assets/js/game.js').read_bytes()).hexdigest()[:10]
EYES=hashlib.sha256((ROOT/'assets/css/hq-eyes.css').read_bytes()+(ROOT/'assets/js/hq-eyes.js').read_bytes()).hexdigest()[:10]
NAV=[('index.html','Home'),('about.html','About Me'),('labs.html','Projects'),('resources.html','Resources'),('blog.html','BLOG'),('contact.html','Contact')]
for path in [*ROOT.glob('*.html'),*ROOT.joinpath('projects').glob('*.html'),*ROOT.joinpath('stories').glob('*.html')]:
    text=path.read_text()
    if '<header class="site-header' not in text:continue
    prefix='../' if path.parent.name in ('projects','stories') else ''
    active=('blog.html' if path.parent.name=='stories' else 'labs.html') if prefix else ('resources.html' if path.name in ['careers.html','learn.html'] else path.name)
    def links(current=False):
        return ''.join(f'<a href="{prefix}{url}"'+(' aria-current="page"' if current and active==url else '')+f'>{label}</a>' for url,label in NAV)
    header=(ROOT/'components/header.html').read_text().strip().format(prefix=prefix,links=links(True))
    footer=(ROOT/'components/footer.html').read_text().strip().format(links=links())
    text=re.sub(r'<header class="site-header[^\"]*">.*?</header>',lambda _:header,text,count=1,flags=re.S)
    text=re.sub(r'<footer class="site-footer[^\"]*">.*?</footer>',lambda _:footer,text,count=1,flags=re.S)
    if 'cyber-world' not in text:text=re.sub(r'<body class="([^"]*)"',r'<body class="\1 cyber-world"',text,count=1)
    if 'assets/css/world.css' not in text:text=text.replace('</head>',f'<link rel="stylesheet" href="{prefix}assets/css/world.css?v=world-1" />\n</head>')
    if 'assets/js/world.js' not in text:text=text.replace('</head>',f'<script src="{prefix}assets/js/world.js?v=world-1" defer></script>\n</head>')
    if 'assets/css/game.css' not in text:text=text.replace('</head>',f'<link rel="stylesheet" href="{prefix}assets/css/game.css?v=game-1" />\n</head>')
    if 'assets/js/game.js' not in text:text=text.replace('</head>',f'<script src="{prefix}assets/js/game.js?v=game-1" defer></script>\n</head>')
    text=re.sub(r'game\.css\?v=[^"\s]+',f'game.css?v={GAME}',text)
    text=re.sub(r'game\.js\?v=[^"\s]+',f'game.js?v={GAME}',text)
    text=re.sub(r'rooms\.css\?v=[^"\s]+',f'rooms.css?v={ROOMS}',text)
    text=re.sub(r'hq-eyes\.(css|js)\?v=[^"\s]+',lambda m:f'hq-eyes.{m.group(1)}?v={EYES}',text)
    if 'cyber-home' not in text:
        if 'room-page' not in text:text=re.sub(r'<body class="([^"]*)"',r'<body class="\1 room-page"',text,count=1)
        if 'assets/css/rooms.css' not in text:text=text.replace('</head>',f'<link rel="stylesheet" href="{prefix}assets/css/rooms.css?v=rooms-1" />\n</head>')
        if 'assets/js/rooms.js' not in text:text=text.replace('</head>',f'<script src="{prefix}assets/js/rooms.js?v=rooms-1" defer></script>\n</head>')
        text=re.sub(r'rooms\.css\?v=[^"\s]+',f'rooms.css?v={ROOMS}',text)
        text=re.sub(r'rooms\.js\?v=[^"\s]+',f'rooms.js?v={ROOMS}',text)
    text=re.sub(r'world\.css\?v=[^"\s]+',f'world.css?v={VERSION}',text)
    text=re.sub(r'world\.js\?v=[^"\s]+',f'world.js?v={VERSION}',text)
    path.write_text(text)
