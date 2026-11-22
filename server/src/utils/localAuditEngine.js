/**
 * Local Audit Engine — Privacy-first, zero-API-key fallback.
 * Generates an evidence-grounded, 4-pillar rubric audit directly from resume and JD text
 * with verbatim quote extraction, metric analysis, and XYZ bullet rewrites.
 */

// Common tech keywords to look for
const TECH_KEYWORDS = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin',
  'React', 'Vue', 'Angular', 'Next.js', 'Node.js', 'Express', 'Django', 'Flask', 'FastAPI', 'Spring Boot',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'GraphQL', 'REST', 'RESTful',
  'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'CI/CD', 'Git', 'GitHub Actions', 'Jenkins',
  'PyTorch', 'TensorFlow', 'scikit-learn', 'Pandas', 'Spark', 'Airflow', 'Kafka',
  'Jest', 'Cypress', 'Playwright', 'Selenium', 'Unit Testing', 'Tailwind', 'Redux'
];

const STRONG_VERBS = ['architected', 'spearheaded', 'engineered', 'optimized', 'designed', 'developed', 'built', 'implemented', 'shipped', 'automated', 'streamlined', 'scaled'];
const WEAK_VERBS = ['helped', 'assisted', 'worked on', 'was responsible for', 'participated in', 'handled'];

export function runLocalAudit(resumeText, jdText) {
  const resumeLower = resumeText.toLowerCase();
  const jdLower = jdText.toLowerCase();

  // 1. Identify Target Skills from JD
  const targetSkills = TECH_KEYWORDS.filter(k => jdLower.includes(k.toLowerCase()));
  if (targetSkills.length < 5) {
    // Add common defaults if JD is short
    ['React', 'Node.js', 'PostgreSQL', 'Docker', 'Git', 'RESTful API', 'TypeScript'].forEach(k => {
      if (!targetSkills.includes(k)) targetSkills.push(k);
    });
  }

  // 2. Split Resume into Lines & Bullets
  const resumeLines = resumeText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const bulletLines = resumeLines.filter(l => l.startsWith('•') || l.startsWith('-') || l.startsWith('*') || l.length > 40);

  // 3. Classify Skills: Matched, Weakly Demonstrated, or Missing
  const skillMatrix = [];
  let matchedCount = 0;
  let weakCount = 0;

  for (const skill of targetSkills) {
    const sLower = skill.toLowerCase();
    
    // Find bullet containing the skill
    const matchingBullet = bulletLines.find(b => b.toLowerCase().includes(sLower));
    const inFullText = resumeLower.includes(sLower);

    if (matchingBullet) {
      // Demonstrated in a project/experience bullet
      matchedCount++;
      const cleanQuote = matchingBullet.replace(/^[•\-*]\s*/, '').trim();
      skillMatrix.push({
        skill,
        status: 'matched',
        evidence_quote: cleanQuote,
        gap_explanation: null
      });
    } else if (inFullText) {
      // In resume but not in a detailed bullet (e.g. only in Skills section)
      weakCount++;
      skillMatrix.push({
        skill,
        status: 'weakly_demonstrated',
        evidence_quote: skill,
        gap_explanation: `Listed in Skills section only. No concrete project bullet demonstrates hands-on implementation of ${skill}.`
      });
    } else {
      skillMatrix.push({
        skill,
        status: 'missing',
        evidence_quote: null,
        gap_explanation: `Required/preferred by JD but no mention found anywhere in the submitted resume.`
      });
    }
  }

  // 4. Quantified Metric Analysis
  const metricRegex = /(\d+[%kKmMbB]?|\$\d+|\b\d+\b(?:\s*(?:users|ms|endpoints|requests|rps|fps|test|queries|%|percent)))/gi;
  let metricMatches = 0;
  bulletLines.forEach(b => {
    const m = b.match(metricRegex);
    if (m) metricMatches += m.length;
  });

  // 5. Verb Analysis
  let strongVerbCount = 0;
  let weakVerbCount = 0;
  bulletLines.forEach(b => {
    const firstWord = b.replace(/^[•\-*]\s*/, '').split(/\s+/)[0]?.toLowerCase();
    if (STRONG_VERBS.some(v => v.startsWith(firstWord) || firstWord.startsWith(v))) strongVerbCount++;
    if (WEAK_VERBS.some(v => v.startsWith(firstWord))) weakVerbCount++;
  });

  // 6. Calculate 4-Pillar Scores
  // Pillar 1: Technical Skills (Max 40)
  const totalTarget = targetSkills.length || 1;
  const techRatio = (matchedCount * 1.0 + weakCount * 0.4) / totalTarget;
  const p1_earned = Math.min(40, Math.max(16, Math.round(techRatio * 38) + 4));

  // Pillar 2: Project Evidence (Max 30)
  const projectDepth = bulletLines.length >= 6 ? 24 : bulletLines.length >= 3 ? 19 : 14;
  const p2_earned = Math.min(30, Math.max(12, projectDepth + Math.min(6, matchedCount)));

  // Pillar 3: Impact & Action Verbs (Max 20)
  let p3_earned = 10;
  if (strongVerbCount >= 3) p3_earned += 4;
  if (metricMatches >= 3) p3_earned += 4;
  else if (metricMatches >= 1) p3_earned += 2;
  p3_earned = Math.min(20, Math.max(8, p3_earned));

  // Pillar 4: Contextual Fit (Max 10)
  const hasCoursework = resumeLower.includes('coursework') || resumeLower.includes('education');
  const hasTools = resumeLower.includes('git') || resumeLower.includes('docker') || resumeLower.includes('ci/cd');
  let p4_earned = 6;
  if (hasCoursework) p4_earned += 2;
  if (hasTools) p4_earned += 2;
  p4_earned = Math.min(10, Math.max(5, p4_earned));

  const overall_score = p1_earned + p2_earned + p3_earned + p4_earned;

  // Grade mapping
  let grade = 'B';
  if (overall_score >= 95) grade = 'A+';
  else if (overall_score >= 90) grade = 'A';
  else if (overall_score >= 85) grade = 'A-';
  else if (overall_score >= 80) grade = 'B+';
  else if (overall_score >= 75) grade = 'B';
  else if (overall_score >= 70) grade = 'B-';
  else if (overall_score >= 65) grade = 'C+';
  else if (overall_score >= 60) grade = 'C';
  else grade = 'D';

  // 7. Bullet Rewrites in XYZ Format
  const candidatesForRewrite = bulletLines.slice(0, 3);
  const bulletRewrites = candidatesForRewrite.map((orig, idx) => {
    const clean = orig.replace(/^[•\-*]\s*/, '').trim();
    let improved = '';
    let rationale = '';
    let keywords = [];

    if (idx === 0) {
      improved = `Architected and delivered ${clean.charAt(0).toLowerCase() + clean.slice(1)}, supporting [insert metric, e.g., 500+ active users] with structured error boundaries, reducing checkout/API latency by [insert metric, e.g., 25%]`;
      rationale = 'Upgraded action verb to "Architected and delivered", added architectural scale context, and inserted bracketed metric placeholders for impact.';
      keywords = ['Architected', 'error boundaries', 'latency reduction'];
    } else if (idx === 1) {
      improved = `Engineered and optimized ${clean.charAt(0).toLowerCase() + clean.slice(1)}, introducing automated validation and caching that decreased query response times by [insert metric, e.g., 35%] under [insert load, e.g., 200 RPS]`;
      rationale = 'Framed implementation in STAR format with explicit engineering practices (validation, caching) and quantified outcome prompts.';
      keywords = ['Engineered', 'automated validation', 'query optimization'];
    } else {
      improved = `Designed end-to-end ${clean.charAt(0).toLowerCase() + clean.slice(1)}, integrating CI/CD pipelines and unit tests achieving [insert metric, e.g., 85%+ code coverage] and [insert uptime, e.g., 99.9% reliability]`;
      rationale = 'Infused testing and deployment context required by modern engineering standards while specifying verification metrics.';
      keywords = ['Designed end-to-end', 'CI/CD pipelines', 'code coverage'];
    }

    return {
      original: clean,
      improved,
      rationale,
      keywords_added: keywords
    };
  });

  // Default rewrites if resume had too few bullets
  if (bulletRewrites.length === 0) {
    bulletRewrites.push({
      original: 'Developed web application features and API endpoints',
      improved: 'Architected and shipped 15+ RESTful API endpoints using Node.js/Express, supporting [insert metric, e.g., 1,000+ daily requests] with [insert metric, e.g., <120ms p95 latency]',
      rationale: 'Converted vague responsibility into concrete XYZ outcome with scope and latency metrics.',
      keywords_added: ['Architected', 'RESTful API', 'p95 latency']
    });
  }

  // 8. Ranked Action Plan
  const actionPlan = [
    {
      rank: 1,
      action: 'Inject quantified business or performance metrics into every project bullet (e.g., latency reduction, throughput, user scale, or branch coverage). Even conservative approximations signal senior engineering maturity.',
      score_lift_pts: 7,
      effort: 'Low'
    },
    {
      rank: 2,
      action: weakCount > 0 
        ? `Elevate weakly demonstrated skills (${skillMatrix.filter(s => s.status === 'weakly_demonstrated').map(s => s.skill).slice(0, 2).join(', ')}) from the Skills header into active project bullets with implementation details.`
        : 'Highlight architectural decisions and trade-offs in your primary project (e.g. database indexing, state management patterns).',
      score_lift_pts: 5,
      effort: 'Medium'
    },
    {
      rank: 3,
      action: 'Add a dedicated testing and CI/CD section (e.g. Jest, Cypress, GitHub Actions workflows) to showcase production engineering discipline.',
      score_lift_pts: 4,
      effort: 'Medium'
    },
    {
      rank: 4,
      action: skillMatrix.some(s => s.status === 'missing')
        ? `Address key JD gaps: build a micro-feature integrating missing requirement "${skillMatrix.find(s => s.status === 'missing')?.skill || 'cloud deployment'}" to verify hands-on familiarity.`
        : 'Incorporate cloud deployment context (e.g., AWS EC2, S3, Docker multi-stage builds) for one existing repository.',
      score_lift_pts: 4,
      effort: 'Medium'
    },
    {
      rank: 5,
      action: 'Standardize bullet openers to high-impact technical action verbs ("Architected", "Engineered", "Optimized", "Automated") following the Google XYZ resume framework.',
      score_lift_pts: 3,
      effort: 'Low'
    }
  ];

  return {
    overall_score,
    grade,
    executive_summary: `The candidate demonstrates strong technical alignment with ${matchedCount} verified skills directly backed by project bullets. Core strengths lie in hands-on development (${p1_earned}/40 technical alignment), while the most significant opportunity for score advancement is replacing passive verbs with quantified impact metrics and moving skills from isolated header lists into implementation bullets.`,
    pillars: [
      {
        id: 'technical_skills',
        label: 'Core Technical & Hard Skills Alignment',
        max_points: 40,
        earned_points: p1_earned,
        justification: `${matchedCount} target skills verified in experience bullets (${skillMatrix.filter(s => s.status === 'matched').map(s => s.skill).slice(0, 3).join(', ')}). ${weakCount > 0 ? `${weakCount} skills are listed in headers without implementation context.` : 'Good breadth across required tools.'}`
      },
      {
        id: 'project_evidence',
        label: 'Project & Practical Experience Evidence',
        max_points: 30,
        earned_points: p2_earned,
        justification: `Project descriptions show concrete architecture and feature development. Deepening discussion of database schemas, caching, and design patterns will elevate this score.`
      },
      {
        id: 'impact_ownership',
        label: 'Impact, Ownership & Action-Verb Quality',
        max_points: 20,
        earned_points: p3_earned,
        justification: `Identified ${strongVerbCount} strong engineering verbs. Quantified impact is present in ${metricMatches} areas; expanding metrics across all bullets will maximize points.`
      },
      {
        id: 'contextual_fit',
        label: 'Role & Domain Contextual Fit',
        max_points: 10,
        earned_points: p4_earned,
        justification: `Coursework and tooling baseline aligns with target requirements. Adding testing frameworks (Jest/Cypress) and CI/CD pipelines will complete the profile.`
      }
    ],
    skill_matrix: skillMatrix,
    bullet_rewrites: bulletRewrites,
    action_plan: actionPlan
  };
}
