export function buildPrompt(resumeText, jdText) {
  const template = `You are an expert technical recruiter and senior software engineer conducting a structured resume alignment audit.

TASK: Analyze the candidate resume against the job description using the exact 4-pillar 100-point rubric below.

━━━ SCORING RUBRIC (100 POINTS TOTAL) ━━━

PILLAR 1 — Core Technical & Hard Skills Alignment (40 pts max)
• Exact match of required programming languages, frameworks, databases, tools → up to 40 pts
• Semantic/equivalent matches (e.g. PostgreSQL counted for "SQL databases") → partial credit
• Skills listed only in a Skills section header without any project/experience context → weakly_demonstrated, reduced points
• Required skills completely absent → 0 pts for that skill

PILLAR 2 — Project & Practical Experience Evidence (30 pts max)
• Deep technical detail: architectural decisions, design patterns, system components described → up to 30 pts
• Problem-to-solution framing: identifies a specific challenge and resolves it with technical depth
• Hands-on implementation proof: specific APIs, libraries, configuration, or integrations cited
• Surface mentions without depth → partial credit

PILLAR 3 — Impact, Ownership & Action-Verb Quality (20 pts max)
• Strong engineering verbs: built, architected, optimized, reduced, shipped, led, designed → up to 20 pts
• Quantified outcomes with numbers: response time %, user count, error rate reduction, throughput
• Ownership signals: sole engineer, end-to-end responsibility, led team
• Weak verbs (helped, worked on, assisted, was involved in) → reduced points

PILLAR 4 — Role & Domain Contextual Fit (10 pts max)
• Relevant coursework aligned with the role domain → up to 10 pts
• Testing exposure (unit tests, integration, E2E) where JD requires it
• Deployment / DevOps awareness (CI/CD pipelines, cloud platforms, containers)
• Industry or domain alignment

━━━ STRICT ANTI-HALLUCINATION RULES (MUST FOLLOW) ━━━

1. Every skill with status "matched" or "weakly_demonstrated" MUST have an evidence_quote: a verbatim excerpt copied directly from the resume text below. Do NOT paraphrase.
2. "matched" = skill is demonstrated in a project or experience bullet with concrete implementation detail.
3. "weakly_demonstrated" = skill appears ONLY in a Skills/Technologies section header with zero project/experience context.
4. "missing" = skill does not appear anywhere in the resume. Set evidence_quote to null for missing skills.
5. NEVER invent metrics, company names, technologies, or projects not present in the resume.
6. For bullet rewrites, insert explicit bracketed metric prompts wherever numbers are absent, e.g.: [insert metric, e.g., reducing API latency by X%]
7. The sum of all pillar earned_points MUST equal overall_score exactly.

━━━ OUTPUT FORMAT ━━━

Return ONLY valid JSON. No markdown code fences. No prose before or after. Exactly this schema:

{
  "overall_score": <integer 0-100, must equal sum of all earned_points>,
  "grade": <"A+" for 97-100 | "A" for 93-96 | "A-" for 90-92 | "B+" for 87-89 | "B" for 83-86 | "B-" for 80-82 | "C+" for 77-79 | "C" for 73-76 | "D" for 60-72 | "F" for 0-59>,
  "executive_summary": <2-3 sentences, evidence-grounded, no filler phrases>,
  "pillars": [
    { "id": "technical_skills", "label": "Core Technical & Hard Skills Alignment", "max_points": 40, "earned_points": <integer>, "justification": <2-3 sentences with specific skill evidence> },
    { "id": "project_evidence", "label": "Project & Practical Experience Evidence", "max_points": 30, "earned_points": <integer>, "justification": <2-3 sentences> },
    { "id": "impact_ownership", "label": "Impact, Ownership & Action-Verb Quality", "max_points": 20, "earned_points": <integer>, "justification": <2-3 sentences> },
    { "id": "contextual_fit", "label": "Role & Domain Contextual Fit", "max_points": 10, "earned_points": <integer>, "justification": <2-3 sentences> }
  ],
  "skill_matrix": [
    { "skill": <string>, "status": <"matched" | "weakly_demonstrated" | "missing">, "evidence_quote": <verbatim string from resume | null>, "gap_explanation": <string explaining the gap | null> }
  ],
  "bullet_rewrites": [
    { "original": <exact bullet from resume>, "improved": <XYZ/STAR rewritten version with [metric placeholders]>, "rationale": <why this rewrite is stronger>, "keywords_added": [<list of JD keywords woven in>] }
  ],
  "action_plan": [
    { "rank": <integer starting at 1>, "action": <specific, actionable instruction>, "score_lift_pts": <estimated integer>, "effort": <"Low" | "Medium" | "High"> }
  ]
}

Requirements: at least 6 skill_matrix items, 3 bullet_rewrites, 5 action_plan items.

━━━ RESUME TEXT ━━━
${resumeText}

━━━ JOB DESCRIPTION ━━━
${jdText}`;

  return template
    .replace('${resumeText}', resumeText)
    .replace('${jdText}', jdText);
}
