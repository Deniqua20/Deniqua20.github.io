# Career explorer research and mapping

Reviewed October 12, 2026. This is an original interest explorer, not an implementation of the O*NET instrument, a psychometric assessment, a skills assessment, or an employment predictor. No external quiz wording or code was copied.

## Sources actually reviewed

- [O*NET Interest Profiler overview](https://www.onetcenter.org/IP.html). Describes its RIASEC interest categories, 30 item Mini IP and 60 item Short Form, research history, reliability and validity evidence, and linking interests to occupations. That evidence belongs to O*NET and **does not transfer to this custom questionnaire**.
- [Official O*NET Short Form](https://www.onetcenter.org/dl_tools/ipsf/Interest_Profiler.pdf). Reviewed the actual activity based prompts, instructions separating interest from education and money, and multiple interest results. Our prompts and categories are original rather than adapted O*NET items.
- [O*NET Mini IP research summary](https://www.onetcenter.org/reports/Mini-IP.html). Reviewed the report's summary, not the full research report.
- [NIST NICE resource center](https://www.nist.gov/itl/applied-cybersecurity/nice/nice-framework-resource-center) and [current versions](https://www.nist.gov/itl/applied-cybersecurity/nice/nice-framework-resource-center/nice-framework-current-versions). Reviewed the purpose and components of the framework.
- [NICE Framework Components v2.2.0 workbook](https://www.nist.gov/document/nice-framework-components-v220). Downloaded and inspected work role descriptions, competency areas, and task statements. The site categories below combine related work and are not official NICE work roles. NICE describes work, not occupational interest measurement.
- [CyberSeek career pathways](https://www.cyberseek.org/pathway.html). Reviewed its explanation of role relationships, common titles, employer requested skills, and related NICE work. This site's job examples are editorial examples, not extracted live vacancies or a complete job taxonomy.
- [BLS computer and IT occupations](https://www.bls.gov/ooh/computer-and-information-technology/) and [information security analysts](https://www.bls.gov/ooh/computer-and-information-technology/information-security-analysts.htm). Reviewed duties, differences between occupations, and education/experience context. No salary or growth numbers were imported into the site.

## Public quiz comparisons

Reviewed the published question and scoring source for:

- [CyberWings career quiz](https://github.com/cyberrahul26/cyberwings-career-quiz), a four track scenario quiz. It groups architecture, GRC and cloud together. Its source includes a proprietary notice; no wording, implementation, or presentation was copied.
- [University club cybersecurity career quiz](https://github.com/NouraAlGahtani/ClubsDayCyber.github.io), a yes/no quiz. Some broad personality and work preference questions are mapped directly to particular disciplines without an evident task based rationale.

Popularity was not verified. Neither example is described as the most popular. Search engines and some provider sites remained inaccessible in this environment. CISA's interactive tool and the NIST JSON endpoint returned access errors; the official NICE XLSX download worked. Links to outside learning platforms are suggestions, not claims that Dee personally used them. Provider availability, pricing, and course access may change.

## Content alignment

| Site area | Role and task references informing the original prompts |
| --- | --- |
| Security operations | PD-WRL-001 Defensive Cybersecurity; PD-WRL-003 Incident Response. Detection content, investigation, defensive analysis, response. |
| Offensive security | PD-WRL-007 Vulnerability Analysis; DD-WRL-005 Software Security Assessment. Finding weaknesses and reporting actionable results. This is an approximate connection; neither role is equated with red team operations. |
| Digital forensics | IN-WRL-002 Digital Evidence Analysis; PD-WRL-002 Digital Forensics. Collecting, preserving, comparing, analyzing evidence. |
| GRC | OG-WRL-002 Cybersecurity Policy and Planning; OG-WRL-012 Security Control Assessment; OG-WRL-016 Technology Program Auditing. Requirements, controls, evidence, risk and remediation. |
| Identity and access | NF-COM-001 Access Controls; IO-WRL-005 Systems Administration. Authorization, roles, access privileges, user account management. |
| Cloud security | IO-WRL-005 Systems Administration; IO-WRL-006 Systems Security Analysis; NF-COM-001 Access Controls. Combined cloud applications of access, secure configuration, networking, monitoring. Not a standalone NICE cloud role. |
| Security architecture | DD-WRL-001 Cybersecurity Architecture; DD-WRL-006 Systems Requirements Planning. Security requirements, architecture, integration, business needs. |
| Application security | DD-WRL-003 Secure Software Development; DD-WRL-005 Software Security Assessment; NF-COM-008 DevSecOps. Software security assessment, improvements, development workflows. |
| Software development | BLS software developers and web developers; DD-WRL-003. Feature development, APIs, debugging and tests. |
| Data and AI | BLS data scientists and IO-WRL-001 Data Analysis. Data preparation, analysis, models and evaluation. Matching this broad category does not establish qualification for machine learning engineering. |
| Networking and infrastructure | IO-WRL-004 Network Operations; IO-WRL-005 Systems Administration; BLS network and systems administrators. Connectivity diagnosis, network integration, availability. |
| IT support | IO-WRL-007 Technical Support; BLS computer support specialists. User support, troubleshooting, communication. |

The user requested no dashes in prose sentences. Code identifiers and necessary source URLs retain their spelling. Career labels describe work interests, not personality types. Experience, degrees, certifications, age, gender and current tool knowledge do not score interest.

## Revised eight question conversation

The owner requested everyday interests rather than security tasks, eight questions instead of 36, no career titles before the result, and a typography led experience without decorative icons. The earlier task questionnaire has been replaced.

Additional sources actually reviewed:

- [O*NET Work Activities](https://www.onetonline.org/find/descriptor/browse/4.A): broad work behaviors across jobs, including getting information, analysis, communication, organizing, helping and creative work.
- [O*NET Computer User Support Specialists](https://www.onetonline.org/link/summary/15-1232.00): customer communication, troubleshooting, explanation and support.
- [O*NET Technical Writers](https://www.onetonline.org/link/summary/27-3042.00): documentation, research, interviewing, editing, information organization and explanation.

The six interest dimensions are original editorial groupings, not renamed RIASEC scales: people, investigating, organizing, building, creating, explaining. They are not personality classifications. Each of eight prompts provides one primary option per dimension, with a second dimension for overlap. Wording addresses everyday work preferences without titles, security terminology, tool knowledge or qualification requirements. Visitors select one or two choices, or explicitly indicate uncertainty.

Each choice contributes two points to its primary dimension and one to its secondary dimension. Two choices split the contribution, so selecting more does not create more total evidence. Every primary dimension has the same number of opportunities. Normalize each dimension by twice the number of answered prompts. Require four answered prompts; uncertain prompts do not score. If the range between the strongest and weakest dimensions is below 0.1, describe broad interests rather than force a career assignment.

Role profiles use three dimensions, weights 3, 2 and 1. Require evidence for both leading interests in a role profile from at least two answered prompts each, so a single isolated choice cannot establish that connection. Compare the interest vector to eligible profiles using a weighted mean. Show the highest three positions, preserving ties at the cutoff with floating point tolerance. Identical profiles produce equal suggestions. For example, general preferences alone cannot reliably distinguish forensic investigation from data analysis; results should present both as possibilities rather than claim diagnostic precision. Explanations quote two relevant actual selections, not fabricated reasons. No percentages or aptitude grades are shown.

These dimensions, weights, threshold, role profiles and questions are editorial choices. They have no empirical validation. O*NET and NICE inform the content rationale, not a statistical endorsement. The short format trades specificity for approachable discovery. Job descriptions, practical trials and a qualified career adviser can help narrow a direction further.

Fifteen areas are available after the result, including technical writing, customer success and UX/design. Customer success and UX labels are broad editorial career areas, not direct O*NET taxonomy equivalents. Career suggestions may require additional education, technical skills or work experience. No job vacancies are represented as live results.

## Privacy and operation

Static JavaScript only. Answers remain in an in-memory object; no storage, analytics, network requests, email collection or external APIs. Reloading clears answers. Career titles and the complete library remain hidden until the result. Without JavaScript, the page provides a link to the established O*NET instrument rather than a nonfunctional quiz. Links are normal external navigation rather than live job listings. Back navigation, review and reset are available.

## Validation

Pure scoring checks cover eight prompts, equal primary opportunity, different everyday interests, uncertain answers, minimum evidence, two choices, invalid selections, broad interests, ties and explanations drawn from actual choices. Browser checks cover no visible career titles before completion, selection limit, complete results, back navigation, edits, reset, uncertainty, mobile/tablet/desktop layouts and accessibility.
