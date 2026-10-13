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

## Scoring

Three original tasks per area, 36 tasks total. Scale 0 through 4, plus an excluded unsure answer. Equal weights within each area. Compute the mean of rated tasks; require at least two rated tasks and mean >= 2. Sort eligible means descending. Include the three highest positions plus every tie at the third position. Equal means are equally matched, regardless of display ordering. Show rated task count to make uncertainty visible. No positive qualified candidates produces a no clear match result, not an arbitrary career. Broadly equal interests can return many areas. No probabilities, population comparisons, statistical validation or salary predictions.

Results quote the visitor's higher rated tasks and separate starting titles from progression roles. Even starting titles may require experience; the page explains variation and directs visitors to actual role descriptions. Architecture and red team are not presented as guaranteed direct entry jobs.

## Privacy and operation

Static JavaScript only. Answers remain in an in-memory object; no storage, analytics, network requests, email collection or external APIs. Reloading clears answers. Without JavaScript, the complete career library remains available. Links are normal external navigation rather than live job listings. Back navigation, review and reset are available.

## Validation

Pure scoring tests cover each of the twelve paths, no interest, unsure, low interest, partial ratings, normalization, invalid input and cutoff ties. Browser checks cover completion, required answers, back navigation, edits, restart, no JavaScript, mobile/tablet/desktop widths and accessibility of intro/questions/results. Research and scoring should be reviewed with a qualified career practitioner before describing the custom instrument as validated.
