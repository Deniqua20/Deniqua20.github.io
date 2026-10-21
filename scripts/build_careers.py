"""Rebuild the Paths in Tech teams section and path folders.

Keeps every .career-panel article (content and ids) exactly as it is. Writes "Meet the Teams"
(red, blue, purple photo cards plus a short quiz) and replaces the area index with folders of
path cards. Run, then python3 scripts/build_shared.py.
"""
from html import escape as e
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]

FIT = {
    "blue": "Love solving puzzles", "dfir": "Love a good mystery", "iam": "Like order and clear rules",
    "cloud": "Like building at scale", "red": "Like testing how things break", "appsec": "Like code and finding its flaws",
    "grc": "Like planning and writing", "architecture": "Like seeing the big picture", "software": "Like making things from scratch",
    "data": "Curious about patterns and AI", "network": "Like knowing how things connect", "design": "Care how things look and feel",
    "support": "Love helping people", "customer": "Like people and problem-solving", "writing": "Like explaining things clearly",
}

# Thin line icons (24×24, stroke only).
ICON = {
    "blue": '<path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6z"/><path d="M9 12l2 2 4-4"/>',
    "dfir": '<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/><path d="M8 10.5h5M10.5 8v5"/>',
    "iam": '<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 018 0v3"/><circle cx="12" cy="15" r="1.5"/>',
    "cloud": '<path d="M7 18h10a4 4 0 00.6-8 6 6 0 00-11.4 1.6A3.3 3.3 0 007 18z"/>',
    "red": '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>',
    "appsec": '<path d="M8 8l-4 4 4 4M16 8l4 4-4 4"/><path d="M13.5 6l-3 12"/>',
    "grc": '<rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4V3h6v1M9 10h6M9 14h6M9 18h3"/>',
    "architecture": '<path d="M4 20h16M6 20V10l6-5 6 5v10"/><path d="M10 20v-5h4v5"/>',
    "software": '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 10l3 2-3 2M12 15h5"/>',
    "data": '<path d="M5 19V11M10 19V6M15 19v-9M20 19V4"/><path d="M3 19h18"/>',
    "network": '<circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 7v5M12 12l-6 5.5M12 12l6 5.5"/>',
    "design": '<path d="M12 3a9 9 0 100 18c1 0 1.5-.8 1.2-1.6-.4-1 .3-2.4 1.6-2.4H17a4 4 0 004-4c0-5.5-4-10-9-10z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7.5" r="1"/>',
    "support": '<path d="M4 14v-2a8 8 0 0116 0v2"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/>',
    "customer": '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M16 5.5a3 3 0 010 5.5M18 14.5c1.8.8 3 2.6 3 5"/>',
    "writing": '<path d="M4 20l1-4L16 5l3 3L8 19z"/><path d="M14 7l3 3"/>',
}

# Path folders: (key, folder title, accent, description, path ids).
GROUPS = [
    ("blue", "Blue Team Paths", "#6fb0ff", "Defend, investigate, and protect accounts, systems, and the cloud.", ["blue", "dfir", "iam", "cloud"]),
    ("red", "Red & Purple Team Paths", "#ff4d62", "Test defenses the way an attacker would, with permission, and help the defense get better.", ["red", "appsec"]),
    ("lead", "More Cybersecurity Paths", "#ff8e98", "Cyber jobs outside the color teams: managing risk, following the rules, and designing how security fits together.", ["grc", "architecture"]),
    ("tech", "Other Paths That Aren’t Cyber", "#e8c27a", "Tech jobs outside of cybersecurity. Security teams work with them every day, and lots of people start here and move into cyber later.", ["software", "data", "network", "design", "support", "customer", "writing"]),
]

# Meet the Teams cards: (key, name, accent, photo, photo position, explanation, typical day, folder).
TEAM_CARDS = [
    ("red", "Red Team", "#ff4d62", "cyber-studio-hero.webp", "60% 30%", "Friendly hackers you hire, with permission, to test your locks before a real attacker shows up.",
     ["Try to break in the way an attacker would", "Find weak spots first", "Write up how to fix them"], "red"),
    ("blue", "Blue Team", "#6fb0ff", "hero-butterfly-laptop.webp", "50% 40%", "The security guards and detectives. They watch, investigate, and stop attacks.",
     ["Watch alerts for anything suspicious", "Investigate odd activity", "Stop an attack and clean up"], "blue"),
    ("purple", "Purple Team", "#c28cff", "cyber-studio-features.webp", "50% 50%", "Red and blue working together, so what attackers find makes the defense better.",
     ["Run attacks and see if they’re caught", "Turn every miss into a new alert", "Share lessons across both teams"], "red"),
]

# Quiz: each answer points at a folder.
QUIZ = [
    ("A mystery lands on your desk. You…", [
        ("Dig through the clues to find out what happened", "blue"),
        ("Try to recreate how they got in", "red"),
        ("Write the plan so it never happens again", "lead"),
        ("Build a tool that fixes it for good", "tech"),
        ("Check that everyone affected is okay and in the loop", "tech")]),
    ("Your perfect Saturday project…", [
        ("A puzzle or true-crime deep dive", "blue"),
        ("Taking something apart to see how it works", "red"),
        ("Organizing and planning everything out", "lead"),
        ("Making something from scratch", "tech"),
        ("Teaching a friend something new", "tech")]),
    ("Your friends call you the one who…", [
        ("Notices when something is off", "blue"),
        ("Finds the loophole in every rule", "red"),
        ("Always has a plan B", "lead"),
        ("Can build or fix anything", "tech"),
        ("Explains things so they finally make sense", "tech")]),
]
RESULT = {
    "blue": ("Blue Team", "You’re a defender. You notice details and love solving the case."),
    "red": ("Red & Purple Team", "You’re a tester. You see how things break so they can be made stronger."),
    "lead": ("More Cybersecurity Paths", "You’re a planner. You bring order, rules, and the big picture."),
    "tech": ("Paths That Aren’t Cyber", "You’re a builder and helper. You make tech work for real people."),
}


def explainer():
    cards = "".join(
        f'<article class="team-poster" style="--c:{c}"><img src="assets/images/{img}" alt="" loading="lazy" style="object-position:{pos}">'
        f'<p class="team-poster-n">{i + 1:02d}</p><h3>{e(name)}</h3><p>{e(text)}</p>'
        f'<ul>{"".join(f"<li>{e(d)}</li>" for d in day)}</ul><a class="team-jump" href="#team-{folder}">See the paths <span aria-hidden="true">↓</span></a></article>'
        for i, (key, name, c, img, pos, text, day, folder) in enumerate(TEAM_CARDS))
    qs = "".join(f'<fieldset class="quiz-q" data-step="{i}"{"" if i == 0 else " hidden"}><legend><span class="quiz-n">{i + 1}/{len(QUIZ)}</span> {e(q)}</legend>'
                 + "".join(f'<button type="button" class="quiz-a" data-team="{t}">{e(a)}</button>' for a, t in opts) + '</fieldset>'
                 for i, (q, opts) in enumerate(QUIZ))
    results = "".join(f'<div class="quiz-result" data-result="{k}" hidden><p class="quiz-match">Your match: <strong>{e(n)}</strong></p>'
                      f'<p>{e(t)} Every team needs you.</p><div class="quiz-actions"><a class="team-jump" href="#team-{k}">See your paths <span aria-hidden="true">↓</span></a>'
                      f'<button type="button" class="quiz-retry">Take it again</button></div></div>' for k, (n, t) in RESULT.items())
    return (f'<section class="world-shell team-explainer" aria-labelledby="teams-heading"><!-- built by build_careers.py -->'
            f'<div class="team-explainer-head"><p class="room-eyebrow">Teams 101</p><h2 id="teams-heading">Meet the Teams</h2>'
            f'<p>In cybersecurity you’ll hear about the red, blue, and purple teams. Here’s who does what, then explore every path below.</p></div>'
            f'<div class="team-posters">{cards}</div>'
            f'<details class="team-quiz" data-team-quiz><summary><span><strong>Which team are you?</strong><small>Three quick questions. Just for fun.</small></span>'
            f'<span class="quiz-start">Take the quiz <span aria-hidden="true">▶</span></span></summary>{qs}{results}</details></section>')


p = ROOT / "careers.html"
s = p.read_text()
titles = dict(re.findall(r'<article class="career-panel" id="career-([a-z]+)".*?<h2[^>]*>([^<]+)</h2>', s))
descs = dict(re.findall(r'<article class="career-panel" id="career-([a-z]+)".*?class="field-guide-description">([^<]+)</p>', s))
assert len(titles) == len(descs) == 15, titles


def card(cid, first):
    return (f'<button type="button" class="path-card" data-career-panel="career-{cid}" aria-controls="career-{cid}" '
            f'aria-pressed="{str(first).lower()}" aria-label="{e(titles[cid])}">'
            f'<svg class="path-icon" viewBox="0 0 24 24" aria-hidden="true">{ICON[cid]}</svg>'
            f'<span class="path-fit" aria-hidden="true">{e(FIT[cid])}</span>'
            f'<span class="path-name" aria-hidden="true">{e(titles[cid])}</span>'
            f'<span class="path-desc" aria-hidden="true">{descs[cid]}</span>'
            f'<span class="path-go" aria-hidden="true">Explore →</span></button>')


folders, first = [], True
for i, (key, name, c, desc, ids) in enumerate(GROUPS):
    cards = []
    for cid in ids:
        cards.append(card(cid, first))
        first = False
    folders.append(f'<details class="path-folder" id="team-{key}" style="--c:{c}"{" open" if i == 0 else ""}>'
                   f'<summary><span class="path-folder-dot" aria-hidden="true"></span><h3>{e(name)}</h3>'
                   f'<span class="path-folder-count">{len(ids)} paths</span><span class="path-folder-x" aria-hidden="true"></span></summary>'
                   f'<p class="path-folder-desc">{e(desc)}</p><div class="path-cards" role="group" aria-label="{e(name)}">{"".join(cards)}</div></details>')
assert sum(len(g[4]) for g in GROUPS) == 15

index = (f'<nav class="field-guide-index path-folders" aria-labelledby="paths-heading">'
         f'<h2 class="paths-heading" id="paths-heading">Explore the Paths</h2>{"".join(folders)}</nav>')
s = re.sub(r'<nav class="field-guide-index[^"]*"[^>]*>.*?</nav>', lambda m: index, s, count=1, flags=re.S)
s = re.sub(r'<section class="world-shell team-explainer".*?</section>', "", s, flags=re.S)
s = s.replace('<section class="world-shell field-guide"', explainer() + '<section class="world-shell field-guide"', 1)
if "assets/js/careers.js" not in s:
    s = s.replace("</head>", '<script src="assets/js/careers.js?v=1" defer></script>\n</head>', 1)
p.write_text(s)
print("rebuilt careers.html teams and path folders")
