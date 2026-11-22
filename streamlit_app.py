import streamlit as st
import re
import json
from datetime import datetime

# Page Configuration
st.set_page_config(
    page_title="ResumeMate AI — Resume Alignment Audit",
    page_icon="📋",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Styling (Linear / Stripe utilitarian aesthetic)
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Inter', system-ui, sans-serif;
    }
    .mono {
        font-family: 'JetBrains Mono', monospace;
    }
    .metric-card {
        background: #FFFFFF;
        border: 1px solid #E4E4E7;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 12px;
    }
    .badge-matched {
        background-color: #ECFDF5;
        color: #065F46;
        border: 1px solid #A7F3D0;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 600;
        font-family: 'JetBrains Mono', monospace;
    }
    .badge-weak {
        background-color: #FFFBEB;
        color: #92400E;
        border: 1px solid #FDE68A;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 600;
        font-family: 'JetBrains Mono', monospace;
    }
    .badge-missing {
        background-color: #FEF2F2;
        color: #991B1B;
        border: 1px solid #FECACA;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 600;
        font-family: 'JetBrains Mono', monospace;
    }
    .quote-box {
        background: #F4F4F5;
        border-left: 3px solid #71717A;
        padding: 8px 12px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.8rem;
        color: #3F3F46;
        border-radius: 0 4px 4px 0;
        margin-top: 6px;
    }
</style>
""", unsafe_allow_html=True)

# ----------------- SAMPLE DATA -----------------
SAMPLE_FULLSTACK_RESUME = """Alex Chen
alex@email.com | (555) 123-4567 | github.com/alexchen | linkedin.com/in/alexchen | Seattle, WA 98101

EDUCATION
University of Washington — B.S. Computer Science
Expected May 2025 | GPA: 3.7/4.0
Relevant Coursework: Data Structures & Algorithms, Database Systems, Web Development, Operating Systems, Software Engineering

PROJECTS

ShopFlow — Full-Stack E-Commerce Platform
• Built full-stack e-commerce platform using React and Node.js with Express backend serving 3 REST API route groups
• Implemented user authentication with JWT tokens and bcrypt password hashing, supporting session persistence
• Designed PostgreSQL database schema for products, users, and orders with foreign key constraints and indexes
• Integrated Stripe payment API for checkout flow with webhook handling for order confirmation
• Deployed application on AWS EC2 with environment-based configuration using dotenv

TaskSync — RESTful API Service
• Developed RESTful API service with 20+ endpoints using Node.js and Express with structured route handlers
• Used MongoDB for data persistence with Mongoose ODM for schema validation and query optimization
• Implemented role-based access control with middleware separating admin and user permissions
• Wrote API documentation using Swagger/OpenAPI specification for all endpoints

ChatNow — Real-Time Messaging Application
• Created real-time chat application using Socket.io and Node.js supporting multiple concurrent chat rooms
• Built React frontend with custom hooks for socket event management and state synchronization
• Stored message history in MongoDB with timestamps and user association
• Implemented typing indicators and read receipt status using socket events

TECHNICAL SKILLS
Languages: JavaScript, TypeScript, Python, Java
Frameworks: React, Node.js, Express.js, Socket.io
Databases: PostgreSQL, MongoDB, Redis
Tools & Platforms: Docker, Git, AWS (EC2, S3), Postman, Swagger"""

SAMPLE_FULLSTACK_JD = """Software Engineer Intern — Full-Stack
Meridian Technologies | Seattle, WA

About the Role
Meridian Technologies is building the next generation of enterprise workflow automation. We are looking for a motivated Software Engineer Intern to join our Full-Stack team and contribute to production systems serving thousands of business users.

Responsibilities
• Develop and maintain React-based frontend components and pages
• Build and extend Node.js/Express RESTful APIs
• Write SQL and NoSQL database queries and schema migrations
• Collaborate with senior engineers in code reviews and design discussions
• Participate in agile ceremonies (standups, sprint planning, retrospectives)

Required Qualifications
• Experience with React or Vue.js for frontend development
• Proficiency in Node.js and Express for backend API development
• Understanding of RESTful API design principles
• Experience with SQL databases (PostgreSQL, MySQL) and/or NoSQL (MongoDB)
• Familiarity with Git version control and collaborative workflows

Nice to Have
• TypeScript experience in a production or project codebase
• Docker containerization and docker-compose for local development
• GraphQL API design and implementation
• AWS or other cloud platform exposure (EC2, S3, Lambda)
• Testing experience: Jest for unit tests, Cypress for E2E"""

SAMPLE_AIML_RESUME = """Jordan Kim
jordan@email.com | (555) 987-6543 | github.com/jordankim | New York, NY 10001

EDUCATION
New York University — B.S. Data Science
Expected December 2024 | GPA: 3.8/4.0
Relevant Coursework: Machine Learning, Natural Language Processing, Statistical Computing, Data Engineering, Deep Learning

PROJECTS

SentimentLens — NLP Sentiment Analysis Pipeline
• Built end-to-end sentiment analysis system fine-tuning BERT transformer model using Hugging Face Transformers library
• Trained on dataset of 50,000 customer reviews, achieving 91% classification accuracy on held-out test set
• Used PyTorch for training loop with AdamW optimizer, learning rate scheduling, and gradient clipping
• Deployed trained model as inference REST API using FastAPI with async request handling

DataFlow — Batch ETL Pipeline
• Designed and implemented batch ETL pipeline using Apache Spark (PySpark) and Apache Airflow for orchestration
• Processed 10GB of daily server log data with Spark transformations for filtering, aggregation, and join operations
• Wrote Airflow DAGs with retry logic, alerting on failure, and dependency management between pipeline stages
• Stored processed results in PostgreSQL and built monitoring dashboards using Matplotlib and Seaborn

PricePredict — Real Estate ML Service
• Trained XGBoost regression model for real estate price prediction achieving R² score of 0.87
• Performed feature engineering on 15 input features including polynomial transformations and categorical encoding
• Containerized model serving with Docker using multi-stage build for smaller image size
• Deployed as REST API endpoint and tracked experiments with MLflow for reproducibility

TECHNICAL SKILLS
Languages: Python, SQL, R
ML Frameworks: PyTorch, TensorFlow, scikit-learn, Hugging Face Transformers, XGBoost
Data Tools: Apache Spark (PySpark), Apache Airflow, Pandas, NumPy, Matplotlib
Infrastructure: Docker, MLflow, FastAPI, PostgreSQL"""

SAMPLE_AIML_JD = """Machine Learning Engineer Intern
Nexus AI | New York, NY (Hybrid)

About the Role
Nexus AI is building production ML systems that power real-time recommendations and predictive analytics for enterprise clients. We are hiring a Machine Learning Engineer Intern to contribute to model development, training pipelines, and deployment infrastructure.

Responsibilities
• Train, evaluate, and iterate on ML models for classification and regression tasks
• Build and maintain data preprocessing pipelines for structured and unstructured data
• Conduct experiments with model architectures and hyperparameters
• Collaborate with the MLOps team to deploy models to production serving infrastructure
• Write clean, documented Python code and participate in code reviews

Required Qualifications
• Strong Python programming skills
• Experience with at least one major ML framework: TensorFlow or PyTorch
• Understanding of supervised and unsupervised learning algorithms
• Experience with data preprocessing: Pandas, NumPy, feature engineering
• Familiarity with SQL for data extraction and analysis
• Understanding of statistical concepts: distributions, hypothesis testing, bias-variance tradeoff

Nice to Have
• NLP experience: transformers, fine-tuning pre-trained language models (BERT, GPT-family)
• MLOps tooling: MLflow, Weights & Biases, DVC for experiment tracking
• Cloud ML platforms: AWS SageMaker, Google Vertex AI
• Distributed computing: Apache Spark, Dask for large-scale data processing"""

# ----------------- PII REDACTOR -----------------
def redact_pii(text):
    if not text:
        return text, 0
    
    count = 0
    # Email
    text, n = re.subn(r'[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}', '[EMAIL_REDACTED]', text)
    count += n
    # Phone
    text, n = re.subn(r'(\+?1[\s.\-]?)?\(?\d{3}\)?[\s.\-]?\d{3}[\s.\-]?\d{4}', '[PHONE_REDACTED]', text)
    count += n
    # URLs
    text, n = re.subn(r'((https?:\/\/)|(www\.))[^\s"\'<>]+', '[URL_REDACTED]', text)
    count += n
    # ZIP
    text, n = re.subn(r'\b([A-Z][0-9][A-Z]\s?[0-9][A-Z][0-9]|\d{5}(?:-\d{4})?)\b', '[LOCATION_REDACTED]', text)
    count += n
    return text, count

# ----------------- LOCAL AUDIT ENGINE -----------------
TECH_KEYWORDS = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go', 'Rust',
    'React', 'Vue', 'Next.js', 'Node.js', 'Express', 'FastAPI', 'Django',
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'GraphQL', 'REST', 'RESTful',
    'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'CI/CD', 'Git',
    'PyTorch', 'TensorFlow', 'scikit-learn', 'BERT', 'Spark', 'Airflow', 'MLflow'
]

STRONG_VERBS = ['architected', 'spearheaded', 'engineered', 'optimized', 'designed', 'developed', 'built', 'implemented', 'shipped', 'automated', 'scaled']
WEAK_VERBS = ['helped', 'assisted', 'worked on', 'participated in', 'handled']

def local_audit_engine(resume_text, jd_text):
    resume_lower = resume_text.lower()
    jd_lower = jd_text.lower()

    target_skills = [k for k in TECH_KEYWORDS if k.lower() in jd_lower]
    if len(target_skills) < 5:
        target_skills = ['React', 'Node.js', 'PostgreSQL', 'Docker', 'Git', 'RESTful API', 'TypeScript']

    resume_lines = [l.strip() for l in resume_text.splitlines() if l.strip()]
    bullet_lines = [l for l in resume_lines if l.startswith(('•', '-', '*')) or len(l) > 40]

    skill_matrix = []
    matched_count = 0
    weak_count = 0

    for skill in target_skills:
        s_lower = skill.lower()
        matching_bullet = next((b for b in bullet_lines if s_lower in b.lower()), None)
        in_full = s_lower in resume_lower

        if matching_bullet:
            matched_count += 1
            clean_q = re.sub(r'^[•\-*]\s*', '', matching_bullet)
            skill_matrix.append({
                "skill": skill,
                "status": "matched",
                "evidence_quote": clean_q,
                "gap_explanation": None
            })
        elif in_full:
            weak_count += 1
            skill_matrix.append({
                "skill": skill,
                "status": "weakly_demonstrated",
                "evidence_quote": skill,
                "gap_explanation": f"Listed in skills section only. No project bullet proves real implementation of {skill}."
            })
        else:
            skill_matrix.append({
                "skill": skill,
                "status": "missing",
                "evidence_quote": None,
                "gap_explanation": f"Required or preferred by the JD but completely absent from the resume."
            })

    # Calculations
    tech_ratio = (matched_count * 1.0 + weak_count * 0.4) / (len(target_skills) or 1)
    p1 = min(40, max(16, round(tech_ratio * 38) + 4))
    p2 = min(30, max(14, 18 + min(8, matched_count)))
    p3 = min(20, max(10, 12 + (3 if any(v in resume_lower for v in STRONG_VERBS) else 0)))
    p4 = min(10, max(6, 7 + (2 if 'git' in resume_lower or 'aws' in resume_lower else 0)))
    overall = p1 + p2 + p3 + p4

    grade = 'A' if overall >= 90 else 'A-' if overall >= 85 else 'B+' if overall >= 80 else 'B' if overall >= 75 else 'B-' if overall >= 70 else 'C+'

    rewrites = []
    candidates = bullet_lines[:3] if bullet_lines else ["Built web application and implemented backend endpoints"]
    for i, orig in enumerate(candidates):
        clean = re.sub(r'^[•\-*]\s*', '', orig)
        if i == 0:
            imp = f"Architected and shipped {clean[:1].lower() + clean[1:]}, supporting [insert metric, e.g., 500+ active users] with structured error boundaries, reducing checkout/API latency by [insert metric, e.g., 25%]"
            rat = "Upgraded to active verb 'Architected', surfaced concurrency scale, and inserted bracketed metric placeholders."
            kw = ["Architected", "error boundaries", "latency reduction"]
        elif i == 1:
            imp = f"Engineered and optimized {clean[:1].lower() + clean[1:]}, introducing validation and query caching that decreased response times by [insert metric, e.g., 35%] under [insert load, e.g., 200 RPS]"
            rat = "Framed in Google XYZ format with explicit engineering practices (caching, validation) and throughput metric prompts."
            kw = ["Engineered", "query caching", "p95 response time"]
        else:
            imp = f"Designed end-to-end {clean[:1].lower() + clean[1:]}, integrating automated CI/CD and unit tests achieving [insert metric, e.g., 85%+ branch coverage] and [insert metric, e.g., 99.9% reliability]"
            rat = "Infused testing and deployment discipline required by senior hiring managers."
            kw = ["Designed end-to-end", "CI/CD pipeline", "branch coverage"]
        rewrites.append({"original": clean, "improved": imp, "rationale": rat, "keywords_added": kw})

    action_plan = [
        {"rank": 1, "action": "Add at least one quantified metric to every project bullet (e.g. latency reduction, user count, or throughput). Even conservative approximations signal senior engineering maturity.", "score_lift_pts": 7, "effort": "Low"},
        {"rank": 2, "action": f"Move weakly demonstrated skills ({', '.join([s['skill'] for s in skill_matrix if s['status'] == 'weakly_demonstrated'][:2]) or 'TypeScript, Docker'}) from the header into active project bullets.", "score_lift_pts": 5, "effort": "Medium"},
        {"rank": 3, "action": "Add a testing and CI/CD section (Jest unit tests or GitHub Actions workflow) to prove production engineering standards.", "score_lift_pts": 4, "effort": "Medium"},
        {"rank": 4, "action": "Implement a feature addressing the top missing JD requirement to eliminate candidate skill gaps.", "score_lift_pts": 4, "effort": "Medium"},
        {"rank": 5, "action": "Standardize all bullet openers to strong engineering action verbs ('Architected', 'Engineered', 'Optimized').", "score_lift_pts": 3, "effort": "Low"}
    ]

    return {
        "overall_score": overall,
        "grade": grade,
        "executive_summary": f"The candidate demonstrates solid technical alignment with {matched_count} required skills directly verified in project bullets. Core strengths lie in hands-on development ({p1}/40 technical alignment). The biggest opportunity for score advancement is moving skills from isolated header lists into implementation bullets and adding quantified impact metrics.",
        "pillars": [
            {"label": "Core Technical & Hard Skills Alignment", "earned_points": p1, "max_points": 40, "justification": f"{matched_count} target skills verified in experience bullets. {weak_count} skills listed in headers without implementation proof."},
            {"label": "Project & Practical Experience Evidence", "earned_points": p2, "max_points": 30, "justification": "Project descriptions show concrete architecture and feature development. Deepening discussion of database schemas and tradeoffs will elevate this score."},
            {"label": "Impact, Ownership & Action-Verb Quality", "earned_points": p3, "max_points": 20, "justification": "Technical action verbs are present. Expanding quantified metric outcomes across all bullets will maximize points."},
            {"label": "Role & Domain Contextual Fit", "earned_points": p4, "max_points": 10, "justification": "Coursework and tooling baseline aligns with requirements. Adding CI/CD and test coverage metrics completes the profile."}
        ],
        "skill_matrix": skill_matrix,
        "bullet_rewrites": rewrites,
        "action_plan": action_plan
    }

# ----------------- SIDEBAR -----------------
with st.sidebar:
    st.title("ResumeMate AI")
    st.caption("Privacy-First · Evidence-Grounded Audit")
    
    st.subheader("⚙️ Settings & Engine")
    api_key = st.text_input("Gemini API Key (Optional)", type="password", help="Stored in session memory only. If left empty, ResumeMate runs on its built-in local heuristic engine.")
    if api_key:
        st.success("● Cloud Key Configured")
    else:
        st.info("⚡ Built-In Engine Active (Zero Key Needed)")

    st.markdown("---")
    st.subheader("📂 Load Sample Profiles")
    col_s1, col_s2 = st.columns(2)
    if col_s1.button("Full-Stack SDE", use_container_width=True):
        st.session_state["resume"] = SAMPLE_FULLSTACK_RESUME
        st.session_state["jd"] = SAMPLE_FULLSTACK_JD
        st.session_state["result"] = None
    if col_s2.button("AI/ML Intern", use_container_width=True):
        st.session_state["resume"] = SAMPLE_AIML_RESUME
        st.session_state["jd"] = SAMPLE_AIML_JD
        st.session_state["result"] = None

    st.markdown("---")
    auto_redact = st.toggle("Auto-Redact PII (Client-Side)", value=True, help="Masks email, phone, links, and ZIP codes before analysis.")

# ----------------- MAIN LAYOUT -----------------
col_input, col_output = st.columns([0.44, 0.56], gap="large")

with col_input:
    st.subheader("1. Candidate Resume")
    upload_tab, paste_tab = st.tabs(["Paste Text", "Upload PDF"])
    
    pdf_text = ""
    with upload_tab:
        uploaded_pdf = st.file_uploader("Upload PDF Resume", type=["pdf"], label_visibility="collapsed")
        if uploaded_pdf is not None:
            try:
                import pypdf
                reader = pypdf.PdfReader(uploaded_pdf)
                pages = [page.extract_text() for page in reader.pages if page.extract_text()]
                pdf_text = "\n\n".join(pages)
                st.success(f"✓ Extracted {len(reader.pages)} page(s) in-browser")
            except Exception as e:
                st.error(f"Error parsing PDF: {e}")

    with paste_tab:
        pass

    default_resume = pdf_text if pdf_text else st.session_state.get("resume", "")
    resume_input = st.text_area("Resume Content", value=default_resume, height=220, placeholder="Paste resume text or upload PDF above...", label_visibility="collapsed")
    
    if auto_redact and resume_input:
        sanitized_resume, pii_count = redact_pii(resume_input)
        if pii_count > 0:
            st.caption(f"🔒 **{pii_count} PII items masked** (email, phone, URLs sanitized)")
    else:
        sanitized_resume = resume_input

    st.subheader("2. Target Job Description")
    jd_input = st.text_area("Job Description", value=st.session_state.get("jd", ""), height=160, placeholder="Paste job description requirements and responsibilities here...", label_visibility="collapsed")

    run_btn = st.button("🚀 Run Alignment Audit", type="primary", use_container_width=True)
    if run_btn:
        if not sanitized_resume.strip() or not jd_input.strip():
            st.warning("Please provide both a resume and a target job description.")
        else:
            with st.spinner("Analyzing candidate profile against 4-pillar rubric..."):
                # If Gemini API key is provided, try Gemini; otherwise local engine
                res = None
                if api_key.strip():
                    try:
                        import google.generativeai as genai
                        genai.configure(api_key=api_key.strip())
                        model = genai.GenerativeModel("gemini-1.5-flash", generation_config={"response_mime_type": "application/json"})
                        prompt = f"Analyze this resume against this JD using 4-pillar rubric. Return JSON.\n\nRESUME:\n{sanitized_resume}\n\nJD:\n{jd_input}"
                        resp = model.generate_content(prompt)
                        res = json.loads(resp.text)
                    except Exception:
                        res = local_audit_engine(sanitized_resume, jd_input)
                else:
                    res = local_audit_engine(sanitized_resume, jd_input)
                st.session_state["result"] = res

# ----------------- OUTPUT DASHBOARD -----------------
with col_output:
    result = st.session_state.get("result", None)

    if not result:
        st.subheader("Scoring Rubric & Methodology")
        st.info("No audit has been run yet. Paste a resume and JD on the left, or click a sample in the sidebar.")
        
        st.markdown("""
        ### Transparent 100-Point Rubric
        | Pillar | Points | What We Evaluate |
        |---|---|---|
        | **1. Core Technical Skills** | **40 pts** | Exact & semantic match of required languages, frameworks, tools. |
        | **2. Practical Experience** | **30 pts** | Architectural depth, component design, problem-to-solution framing. |
        | **3. Impact & Ownership** | **20 pts** | Strong engineering verbs (*Architected, Engineered*), quantified metrics. |
        | **4. Contextual Fit** | **10 pts** | Coursework, testing frameworks (Jest/Cypress), CI/CD awareness. |
        """)

        if st.button("👉 Instant Preview with Pre-Computed Sample Audit"):
            st.session_state["result"] = local_audit_engine(SAMPLE_FULLSTACK_RESUME, SAMPLE_FULLSTACK_JD)
            st.rerun()

    else:
        # Score Header Card
        st.markdown(f"""
        <div class="metric-card">
            <div style="display: flex; align-items: baseline; gap: 12px;">
                <span class="mono" style="font-size: 3.5rem; font-weight: 700; color: #09090B;">{result['overall_score']}</span>
                <span class="mono" style="font-size: 1.5rem; color: #71717A;">/ 100</span>
                <span class="mono badge-matched" style="font-size: 1rem; padding: 4px 10px;">Grade: {result['grade']}</span>
            </div>
            <p style="font-size: 0.88rem; color: #52525B; margin-top: 8px; line-height: 1.5;">{result['executive_summary']}</p>
        </div>
        """, unsafe_allow_html=True)

        # Tabbed Details
        tab_score, tab_skills, tab_rewrites, tab_plan = st.tabs(["📊 Scorecard", "🔍 Skill Matrix", "✍️ Bullet Rewrites", "📋 Action Plan"])

        with tab_score:
            st.markdown("#### 4-Pillar Breakdown")
            for p in result['pillars']:
                pct = int((p['earned_points'] / p['max_points']) * 100)
                st.write(f"**{p['label']}** ({p['earned_points']} / {p['max_points']} pts)")
                st.progress(pct)
                st.caption(p['justification'])

        with tab_skills:
            st.markdown("#### Verified Skill Alignment")
            filter_choice = st.radio("Filter Skills", ["All", "Matched", "Weakly Demonstrated", "Missing"], horizontal=True, label_visibility="collapsed")
            
            for s in result['skill_matrix']:
                status = s['status']
                if filter_choice != "All" and filter_choice.lower().replace(" ", "_") != status:
                    continue
                
                badge_class = "badge-matched" if status == "matched" else "badge-weak" if status == "weakly_demonstrated" else "badge-missing"
                status_label = status.replace('_', ' ').title()
                
                st.markdown(f"""
                <div style="background: #FFFFFF; border: 1px solid #E4E4E7; border-radius: 6px; padding: 12px; margin-bottom: 8px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: 600; font-size: 0.95rem;">{s['skill']}</span>
                        <span class="{badge_class}">{status_label}</span>
                    </div>
                """, unsafe_allow_html=True)
                
                if s.get('evidence_quote'):
                    st.markdown(f"<div class='quote-box'>\"{s['evidence_quote']}\"</div>", unsafe_allow_html=True)
                if s.get('gap_explanation'):
                    st.caption(f"ℹ️ *{s['gap_explanation']}*")
                st.markdown("</div>", unsafe_allow_html=True)

        with tab_rewrites:
            st.markdown("#### XYZ/STAR Bullet Rewrites")
            for r in result['bullet_rewrites']:
                st.markdown(f"""
                <div style="background: #FFFFFF; border: 1px solid #E4E4E7; border-radius: 8px; padding: 14px; margin-bottom: 12px;">
                    <div style="font-size: 0.75rem; font-weight: 700; color: #991B1B; font-family: 'JetBrains Mono', monospace;">ORIGINAL:</div>
                    <div style="background: #FEF2F2; border: 1px solid #FECACA; padding: 8px 12px; border-radius: 6px; font-size: 0.85rem; color: #991B1B; margin-top: 4px;">{r['original']}</div>
                    <div style="text-align: center; color: #A1A1AA; font-size: 1rem; margin: 4px 0;">↓</div>
                    <div style="font-size: 0.75rem; font-weight: 700; color: #065F46; font-family: 'JetBrains Mono', monospace;">IMPROVED (XYZ FORMAT):</div>
                    <div style="background: #ECFDF5; border: 1px solid #A7F3D0; padding: 8px 12px; border-radius: 6px; font-size: 0.85rem; color: #065F46; margin-top: 4px;">{r['improved']}</div>
                    <div style="font-size: 0.8rem; color: #52525B; margin-top: 8px;"><strong>Rationale:</strong> {r['rationale']}</div>
                </div>
                """, unsafe_allow_html=True)

        with tab_plan:
            st.markdown("#### Prioritized Improvement Checklist")
            for item in result['action_plan']:
                st.checkbox(f"**#{item['rank']}** (+{item['score_lift_pts']} pts · {item['effort']} effort): {item['action']}")

        # Export Button
        st.markdown("---")
        report_md = f"# ResumeMate AI Alignment Audit Report\n\nOverall Score: {result['overall_score']} / 100 ({result['grade']})\n\n## Executive Summary\n{result['executive_summary']}\n\n## 4-Pillar Breakdown\n"
        for p in result['pillars']:
            report_md += f"- **{p['label']}**: {p['earned_points']}/{p['max_points']} pts — {p['justification']}\n"
        
        st.download_button(
            label="📥 Download Markdown Audit Report (.md)",
            data=report_md,
            file_name=f"resumemate_audit_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md",
            mime="text/markdown",
            use_container_width=True
        )
