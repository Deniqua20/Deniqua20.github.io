"""Rebuild the Paths in Tech navigation as team rows with line icons.

Keeps every .career-panel article (content and ids) exactly as it is and replaces only the
area index with rows grouped by security team color. Run, then python3 scripts/build_shared.py.
"""
from html import escape as e
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]

TEAMS = [
    ("blue", "Blue team", "Cyber Defense", "The defenders. They watch for threats, investigate incidents, and protect accounts, systems, and the cloud.", ["blue", "dfir", "iam", "cloud"]),
    ("red", "Red & purple team", "Offensive Operations", "Red teams test defenses the way an attacker would, with permission. Purple teams bring red and blue together so offense makes defense better.", ["red", "appsec"]),
    ("lead", "Risk & planning", "Rules, risk, and design", "The planners. They manage risk, make sure the company follows the rules, and design how security fits together. You don’t need to be a manager to work here.", ["grc", "architecture"]),
    ("tech", "Broader tech", "Build, support, and connect", "Not security roles, but security teams work with them every day. Lots of people start here and move into security later.", ["software", "data", "network", "design", "support", "customer", "writing"]),
]

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

# "Meet the teams" explainer: (key, color name, nickname, think-of-them-as, typical day, jump target row).
EXPLAIN = [
    ("blue", "Blue team", "The defenders", "the security guards and detectives of a company.",
     ["Watch alerts for anything suspicious", "Investigate odd logins and strange activity", "Stop an attack and clean up after it"], "blue"),
    ("red", "Red team", "The friendly hackers", "burglars you hire, with permission, to test your locks before a real one shows up.",
     ["Try to break in the way an attacker would", "Find weak spots before the bad guys do", "Write up what they found and how to fix it"], "red"),
    ("purple", "Purple team", "The coaches", "the coach who gets red and blue in the same room so both get better.",
     ["Run attacks and watch if defenders catch them", "Turn every miss into a new detection", "Share lessons across both teams"], "red"),
    ("lead", "Risk & planning", "The planners", "the planners and referees who make sure everything follows the rules and fits together.",
     ["Measure risk and decide what to fix first", "Check that security controls actually work", "Turn tech risks into plain-language plans"], "lead"),
    ("tech", "Broader tech", "The builders and helpers", "the people who build and run the tech everyone else protects.",
     ["Write code, build networks, and work with data", "Help coworkers and customers with tech problems", "Explain tricky things in plain words"], "tech"),
]


# Quiz: each answer points at a team row.
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
    "blue": ("Blue team", "You’re a defender. You notice details and love solving the case."),
    "red": ("Red & purple team", "You’re a tester. You see how things break so they can be made stronger."),
    "lead": ("Risk & planning", "You’re a planner. You bring order, rules, and the big picture."),
    "tech": ("Broader tech", "You’re a builder and helper. You make tech work for real people."),
}


def explainer():
    cards = []
    for key, name, nick, think, day, row in EXPLAIN:
        cards.append(f'<article class="team-card team-{key}"><p class="team-chip"><span class="team-dot" aria-hidden="true"></span>{e(name)}</p>'
                     f'<h3 class="team-nick">{e(nick)}</h3><p class="team-think"><span>Think of them as</span> {e(think)}</p>'
                     f'<ul class="team-day">{"".join(f"<li>{e(d)}</li>" for d in day)}</ul>'
                     f'<a class="team-jump" href="#team-{row}">See their paths <span aria-hidden="true">↓</span></a></article>')
    qs = "".join(f'<fieldset class="quiz-q" data-step="{i}"{"" if i == 0 else " hidden"}><legend><span class="quiz-n">{i + 1}/{len(QUIZ)}</span> {e(q)}</legend>'
                 + "".join(f'<button type="button" class="quiz-a" data-team="{t}">{e(a)}</button>' for a, t in opts) + '</fieldset>'
                 for i, (q, opts) in enumerate(QUIZ))
    results = "".join(f'<div class="quiz-result team-{k}" data-result="{k}" hidden><p class="team-chip"><span class="team-dot" aria-hidden="true"></span>Your match: {e(n)}</p>'
                      f'<p>{e(t)} Every team needs you.</p><div class="quiz-actions"><a class="team-jump" href="#team-{k}">See your paths <span aria-hidden="true">↓</span></a>'
                      f'<button type="button" class="quiz-retry">Take it again</button></div></div>' for k, (n, t) in RESULT.items())
    return (f'<section class="world-shell team-explainer" aria-labelledby="teams-heading"><!-- built by build_careers.py -->'
            f'<div class="team-explainer-head"><p class="room-eyebrow">Teams 101</p><h2 id="teams-heading">Meet the teams</h2>'
            f'<p>In cybersecurity you’ll hear about the red, blue, and purple teams. Here’s who does what, plus the risk and planning side and the broader tech roles security works with every day. '
            f'You don’t need to pick one forever. Lots of people move between teams over their career.</p></div>'
            f'<div class="team-cards">{"".join(cards)}</div>'
            f'<div class="team-quiz" data-team-quiz><h3>Which team are you?</h3><p class="quiz-sub">Three quick questions. Just for fun.</p>{qs}{results}</div></section>')


p = ROOT / "careers.html"
s = p.read_text()
titles = dict(re.findall(r'<article class="career-panel" id="career-([a-z]+)".*?<h2[^>]*>([^<]+)</h2>', s))
assert len(titles) == 15, titles


def tile(cid, first):
    return (f'<button type="button" class="path-tile" data-career-panel="career-{cid}" aria-controls="career-{cid}" '
            f'aria-pressed="{str(first).lower()}" aria-label="{e(titles[cid])}">'
            f'<svg class="path-icon" viewBox="0 0 24 24" aria-hidden="true">{ICON[cid]}</svg>'
            f'<span class="path-fit" aria-hidden="true">{e(FIT[cid])}</span>'
            f'<span class="path-name" aria-hidden="true">{e(titles[cid])}</span></button>')


rows, first = [], True
for key, name, sub, blurb, ids in TEAMS:
    tiles = []
    for cid in ids:
        tiles.append(tile(cid, first))
        first = False
    rows.append(f'<div class="team-row team-{key}" id="team-{key}"><div class="team-head"><p class="team-chip"><span class="team-dot" aria-hidden="true"></span>{e(name)}</p>'
                f'<h2 class="team-title">{e(sub)}</h2><p class="team-blurb">{e(blurb)}</p></div>'
                f'<div class="team-tiles" role="group" aria-label="{e(name)} paths">{"".join(tiles)}</div></div>')
assert sum(len(t[4]) for t in TEAMS) == 15

index = f'<nav class="field-guide-index team-rows" aria-label="Career areas by team">{"".join(rows)}</nav>'
s = re.sub(r'<nav class="field-guide-index[^"]*"[^>]*>.*?</nav>', lambda m: index, s, count=1, flags=re.S)
s = re.sub(r'<section class="world-shell team-explainer".*?</section>', "", s, flags=re.S)
s = s.replace('<section class="world-shell field-guide"', explainer() + '<section class="world-shell field-guide"', 1)
if "assets/js/careers.js" not in s:
    s = s.replace("</head>", '<script src="assets/js/careers.js?v=1" defer></script>\n</head>', 1)
p.write_text(s)
print("rebuilt careers.html team rows")
