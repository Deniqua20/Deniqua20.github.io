"""Render resources.html (Resource Library) and holy-grail.html (Dee's Holy Grail).

Edit the lists below, then run:
    python3 scripts/build_resources.py && python3 scripts/build_shared.py

used=True marks a resource Dee personally used; fav=True marks one of her three favorites.
"""
import re
from html import escape
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]

LIBRARY = [
    ("funding", "Funding Opportunities", "Scholarships and programs that can help pay for training, certifications, and school.", [
        ("Last Mile Education Fund", "https://www.lastmile-ed.org/", "Financial support for students finishing tech degrees.", True, False),
        ("Center for Cyber Safety and Education", "https://www.iamcybersafe.org/", "Additional scholarship opportunities.", False, False),
        ("SANS Cyber Academies", "https://www.sans.org/cyber-academy", "Additional cybersecurity training and funding opportunities.", False, False),
    ]),
    ("study", "My Study Toolkit", "Courses, videos, and learning paths for building knowledge and preparing for certifications.", [
        ("Professor Messer", "https://www.professormesser.com/", "Free certification training videos. One of my favorites.", True, True),
        ("Jason Dion / Dion Training", "https://www.diontraining.com/", "Certification courses and practice exams.", True, False),
        ("Udemy", "https://www.udemy.com/", "Online courses on almost any tech topic.", True, False),
        ("YouTube", "https://www.youtube.com/", "Free lessons, walkthroughs, and explanations.", True, False),
        ("Certify Breakfast", "https://www.youtube.com/@CertifyBreakfast", "A YouTube channel I used while studying.", True, False),
        ("Microsoft Learn", "https://learn.microsoft.com/en-us/training/", "Free Microsoft training paths.", False, False),
        ("Cisco Networking Academy", "https://www.netacad.com/", "Networking and cybersecurity courses.", False, False),
        ("SANS Free Resources", "https://www.sans.org/security-resources", "Free security resources from SANS.", False, False),
    ]),
    ("practice", "Hands-On Practice", "Labs and challenges where you apply what you learn.", [
        ("TryHackMe", "https://tryhackme.com/", "Guided hands-on labs. One of my favorites.", True, True),
        ("LetsDefend", "https://letsdefend.io/", "Blue-team and SOC investigation practice. One of my favorites.", True, True),
        ("Hack The Box", "https://www.hackthebox.com/", "Hands-on labs and challenges.", True, False),
        ("CyberDefenders", "https://cyberdefenders.org/", "Blue-team investigation challenges.", False, False),
        ("PortSwigger Web Security Academy", "https://portswigger.net/web-security", "Free web security training and labs.", False, False),
        ("picoCTF", "https://picoctf.org/", "Free, beginner-friendly capture-the-flag challenges.", False, False),
    ]),
    ("community", "Cyber Communities", "Groups and spaces where you can learn from people further along.", [
        ("ISC2", "https://www.isc2.org/", "Professional cybersecurity association.", True, False),
        ("ISACA", "https://www.isaca.org/", "Professional association for audit, risk, and governance.", True, False),
        ("WiCyS", "https://www.wicys.org/", "Women in CyberSecurity community.", True, False),
        ("r/CompTIA", "https://www.reddit.com/r/CompTIA/", "Certification discussions, study experiences, and community advice.", False, False),
        ("r/cybersecurity", "https://www.reddit.com/r/cybersecurity/", "Industry discussions.", False, False),
        ("Discord", "https://discord.com/", "Study groups, discussions, and community support.", False, False),
        ("Blacks In Cybersecurity", "https://www.blacksincyberconf.com/", "Additional community.", False, False),
        ("OWASP Chapters", "https://owasp.org/chapters/", "Local application security meetups.", False, False),
    ]),
]

FAVORITES = [
    ("TryHackMe", "https://tryhackme.com/", "Hands-on practice", "One of my favorite platforms for hands-on cybersecurity practice. It helped me apply what I was learning."),
    ("LetsDefend", "https://letsdefend.io/", "Blue team · SOC", "One of my favorite resources for practicing blue-team concepts, SOC investigations, and security analysis."),
    ("Professor Messer", "https://www.professormesser.com/", "Certification study", "Professor Messer has been with me throughout my studies and certification journey. His lessons have been one of my go-to resources for understanding technical concepts."),
]

METHODS = [
    ("Pomodoro Method", "I used focused study sessions with breaks in between instead of trying to study continuously for hours."),
    ("Active Recall", "I would study a topic, put my notes away, and try to remember what I had learned without looking at the answers. This helped me identify which concepts I understood and which ones needed more attention."),
    ("Teaching Myself the Lesson Back", "After learning something, I would explain it back to myself in my own words, almost as though I were teaching someone else. This helped me understand concepts rather than simply memorize them."),
    ("Creating My Own Quizzes", "I would create practice quizzes based on what I was studying. Quizzing myself helped me test my understanding, remember information, and identify weak areas."),
    ("Short Study Sessions", "I found that studying in shorter sessions worked better for me than forcing myself to sit for long periods. I focused on manageable amounts of information at a time."),
]

CERT_PREP = [
    ("Search Reddit and Discord", "I search Reddit and Discord for tips and to gather the study notes and resources people used when they passed. I’m currently in college, so these communities have been a big help."),
    ("Download the official exam objectives", "The objectives tell you exactly what can be on the exam. Everything on them is up for grabs."),
    ("Turn the objectives into a study plan", "I put the objectives into an AI tool like ChatGPT or Claude to create a study plan and clear up any gray areas. While I study, I have it break information down so simply that a toddler could understand it. You’re taking in a lot, so make it digestible for you."),
    ("Pair my notes with videos", "Once I have my study plan and notes, I pair them with YouTube videos. For Security+, I used Professor Messer’s videos, and he has study materials too."),
    ("Prefer not to use AI? Use reputable study material", "If you’d rather not use ChatGPT, Claude, or other AI tools, look at who offers trusted study material. I’ve used Jason Dion and Professor Messer, and there are plenty of others. Do your research."),
    ("Don’t overcomplicate it", "See what’s being covered, study, take practice tests, and give it a shot."),
]

PORTFOLIO = [
    ("Quality over quantity", "You don’t need a thousand labs. Two to four labs you can explain front to back will do more for you than a long list you can’t talk about."),
    ("Know it front to back", "Be ready to explain what you built, why you built it, the choices you made, what went wrong, and what you’d do differently. The first time an interviewer asked me to walk through my lab, I wasn’t ready. After that, I made sure I knew every step."),
    ("Practice “walk me through it” out loud", "Have a two-minute version of each lab: the problem, what you built, what you found, and what you learned. Say it out loud until it feels natural."),
    ("Document as you go", "Take screenshots and notes while you work. It’s much harder to recreate them later, and they become your evidence."),
    ("Write it up so others can follow", "For each lab, write the problem, the tools, the steps, the results, and your takeaways. Put it on GitHub or your own site so you can share one link."),
    ("Connect it to the job", "Read the job description and pick the lab that matches it. A SOC role? Talk about detection. An IAM role? Talk about identity."),
    ("Keep it current", "Add new labs as you grow and update the old ones. Your portfolio grows with you."),
]

COLLEGE = [
    "Finding study methods that fit how you learn.",
    "Breaking assignments and difficult topics into smaller pieces.",
    "Using short study sessions to avoid feeling overwhelmed.",
    "Taking breaks when needed.",
    "Testing your knowledge instead of only rereading material.",
    "Explaining concepts out loud to improve understanding.",
    "Finding supportive learning communities.",
    "Staying consistent without expecting perfection.",
    "Remembering that everyone’s learning journey is different.",
]

e = escape


def host(url):
    h = urlparse(url).netloc.removeprefix("www.")
    path = urlparse(url).path.rstrip("/")
    return h + (path if h in ("reddit.com", "youtube.com") else "")


def card(name, url, note, used, fav):
    star = '<div class="lib-card-top"><span class="lib-fav" title="One of Dee’s three favorites">★ Favorite</span></div>' if fav else ""
    return (f'<li class="lib-card{" is-fav" if fav else ""}">{star}'
            f'<h4><a href="{e(url)}" target="_blank" rel="noopener">{e(name)}<span class="visually-hidden"> (opens in a new tab)</span></a></h4>'
            f'<p>{e(note)}</p><span class="lib-host" aria-hidden="true">{e(host(url))} ↗</span></li>')


def library():
    total = sum(len(items) for *_, items in LIBRARY)
    used = sum(1 for *_, items in LIBRARY for i in items if i[3])
    folders = "".join(
        f'<details class="lib-group" data-lib-group="{k}"{" open" if k == "practice" else ""}>'
        f'<summary class="lib-group-head"><h3 id="lib-{k}">{e(t)}</h3>'
        f'<span class="lib-count-pill">{len(items)} resources</span></summary>'
        f'<p class="lib-group-desc">{e(d)}</p><ul class="lib-grid">{"".join(card(*i) for i in items)}</ul></details>'
        for k, t, d, items in LIBRARY)
    return f'''<main id="main" class="resources-main">
<section class="world-shell room-intro"><p class="room-eyebrow">The resource library</p><h1>Resources.<br><em>What helped me grow.</em></h1><p class="room-lead">Cybersecurity resources from my own journey, plus a few more that others may find helpful.</p></section>
{grail()}
<section class="world-shell lib" id="library" aria-labelledby="lib-title">
<div class="lib-head"><h2 id="lib-title">Resource Library</h2><p class="lib-stats"><strong>{total}</strong> resources · <span class="lib-fav">★</span> = one of my favorites</p></div>
{folders}
<p class="suggest-nudge">Know a resource that should be here? <a href="contact.html#suggest">Drop it in the suggestion box →</a></p>
<p class="lib-note">These links go to other websites. Programs, prices, and offerings change, so check each site for current details. Nothing here is sponsored.</p>
</section>
</main>'''


def grail():
    favs = "".join(
        f'<li class="grail-fav"><span class="grail-rank">0{n}</span><p class="grail-tag">{e(tag)}</p><h4>{e(name)}</h4><p>{e(text)}</p>'
        f'<a class="grail-visit" href="{e(url)}" target="_blank" rel="noopener">Visit {e(name)} ↗<span class="visually-hidden"> (opens in a new tab)</span></a></li>'
        for n, (name, url, tag, text) in enumerate(FAVORITES, 1))
    methods = "".join(f'<li class="grail-method"><h4>{e(t)}</h4><p>{e(d)}</p></li>' for t, d in METHODS)
    prep = "".join(f'<li><strong>{e(t)}</strong><span>{e(d)}</span></li>' for t, d in CERT_PREP)
    tips = "".join(f"<li>{e(x)}</li>" for x in COLLEGE)
    folio = "".join(f'<li><strong>{e(t)}</strong><span>{e(d)}</span></li>' for t, d in PORTFOLIO)
    return _bold_adhd(f'''<section class="world-shell grail-box" id="holy-grail" aria-labelledby="grail-title">
<div class="grail-box-head"><p class="grail-kicker">What actually worked for me</p><h2 id="grail-title">Dee’s <em>Holy Grail</em></h2>
</div>
<h3 class="grail-sub">My three favorite resources</h3><ol class="grail-favs">{favs}</ol>
<details class="grail-part"><summary><span class="grail-part-n">01</span><span>As someone with ADHD, this is what helped me <small>The study methods that worked for me</small></span></summary>
<div class="grail-part-body"><p class="grail-intro">I have ADHD, and throughout college I had to discover study techniques that helped me stay focused, understand concepts, and retain information. These are the methods that personally helped me.</p>
<div class="grail-learn"><ul class="grail-methods">{methods}</ul>
<aside class="focus" aria-labelledby="focus-title"><p class="grail-kicker">Try it now</p><h4 id="focus-title">Focus session</h4><p class="focus-sub">A simple Pomodoro timer: focus, then take a short break.</p>
<div class="focus-modes" role="group" aria-label="Session type"><button type="button" data-focus="1500" aria-pressed="true">Focus 25</button><button type="button" data-focus="300" aria-pressed="false">Break 5</button></div>
<div class="focus-ring"><svg viewBox="0 0 120 120" aria-hidden="true"><circle class="focus-track" cx="60" cy="60" r="52"/><circle class="focus-bar" cx="60" cy="60" r="52"/></svg><p class="focus-time" id="focus-time" role="timer" aria-live="off">25:00</p></div>
<div class="focus-actions"><button type="button" class="world-button" id="focus-start">Start</button><button type="button" class="focus-reset" id="focus-reset">Reset</button></div>
<p class="focus-done" id="focus-done" role="status"></p></aside></div></div></details>
<details class="grail-part"><summary><span class="grail-part-n">02</span><span>How I prepared for certifications <small>My step-by-step process</small></span></summary>
<div class="grail-part-body"><p class="grail-intro">I hold over 12 industry certifications, so I feel like I’ve got cert prep down (until they change the exams, lol). When it came to certification, this is what I did.</p>
<div class="grail-certs"><ol class="grail-checklist grail-steps">{prep}</ol>
<aside class="grail-callout"><p class="grail-kicker">If you don’t pass</p><p>It isn’t the end-all be-all. I’ll let you know now: I have failed certifications multiple times, and guess what? I’m still in the industry. Go back to the drawing board, make some adjustments, and execute.</p><p class="grail-yougotthis">You got this. If it was easy, everyone would be doing it.</p></aside></div></div></details>
<details class="grail-part" id="portfolio"><summary><span class="grail-part-n">03</span><span>Build a portfolio you can speak to <small>It doesn’t have to be a thousand labs</small></span></summary>
<div class="grail-part-body"><p class="grail-intro">My Azure honeypot lab is the one hiring managers kept asking about. What made the difference wasn’t how many labs I had. It was being able to explain that one, step by step.</p>
<ol class="grail-checklist grail-steps">{folio}</ol>
<p class="grail-yougotthis">Depth beats a long list.</p></div></details>
<details class="grail-part"><summary><span class="grail-part-n">04</span><span>College survival tips <small>Lessons from finishing college with ADHD</small></span></summary>
<div class="grail-part-body"><p class="grail-intro">Lessons from completing college while managing ADHD and other responsibilities.</p><ul class="grail-tips">{tips}</ul></div></details>
</section>''')


def _bold_adhd(html):
    return html.replace("ADHD", '<strong class="adhd">ADHD</strong>')


def write(name, main, title, desc, body_class):
    src = (ROOT / "resources.html").read_text()
    head, rest = src.split('<main id="main"', 1)
    tail = rest.split("</main>", 1)[1]
    head = head.replace(head[head.index("<title>"):head.index("</title>") + 8], f"<title>{title}</title>", 1)
    head = re.sub(r'(<meta\s+name="description"\s+content=")[^"]*"', lambda m: m.group(1) + desc + '"', head, count=1)
    head = re.sub(r'<meta property="og:[^>]*>\n|<meta name="twitter:[^>]*>\n', "", head)
    head = re.sub(r'<body class="[^"]*"', f'<body class="{body_class}"', head, count=1)
    head = re.sub(r'\n?<link rel="stylesheet" href="assets/css/resources\.css[^>]*>|\n?<script src="assets/js/resources\.js[^>]*></script>', "", head)
    head = head.replace("</head>", '<link rel="stylesheet" href="assets/css/resources.css?v=9" />\n<script src="assets/js/resources.js?v=10" defer></script>\n</head>', 1)
    (ROOT / name).write_text(head + main + tail)


write("resources.html", library(), "Resources | Dee’s Cyber Corner",
      "Cybersecurity resources Dee has used and recommends: funding, study tools, hands-on practice, and communities.",
      "interior room-resources cyber-world room-page")
print("wrote resources.html")
