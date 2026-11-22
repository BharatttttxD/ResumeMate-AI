export const SAMPLE_CASES = [
  {
    id: 'fullstack-sde',
    label: 'Full-Stack SDE Intern',
    resume: `Alex Chen
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
Tools & Platforms: Docker, Git, AWS (EC2, S3), Postman, Swagger`,
    jd: `Software Engineer Intern — Full-Stack
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
• Testing experience: Jest for unit tests, Cypress for E2E

What We Offer
• Competitive internship stipend
• Mentorship from senior engineers
• Opportunity to convert to full-time role
• Flexible hybrid schedule`,
  },
  {
    id: 'aiml-data',
    label: 'AI/ML & Data Intern',
    resume: `Jordan Kim
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
Infrastructure: Docker, MLflow, FastAPI, PostgreSQL`,
    jd: `Machine Learning Engineer Intern
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
• Distributed computing: Apache Spark, Dask for large-scale data processing
• A/B testing methodology and model monitoring in production`,
  },
];

export const SAMPLE_AUDIT_RESULT = {
  overall_score: 74,
  grade: 'B+',
  executive_summary:
    'The candidate demonstrates solid full-stack fundamentals with React and Node.js experience backed by concrete project evidence across three distinct applications. Core technical alignment is strong at 31/40, with direct matches for React, Node.js/Express, PostgreSQL, and MongoDB all evidenced in project bullets. The primary gap lies in quantified impact — zero metrics appear across all project descriptions — and TypeScript and Docker remain weakly demonstrated, appearing only in the skills header without project-level proof.',
  pillars: [
    {
      id: 'technical_skills',
      label: 'Core Technical & Hard Skills Alignment',
      max_points: 40,
      earned_points: 31,
      justification:
        'React, Node.js, Express, PostgreSQL, and MongoDB are directly evidenced in project bullets with implementation context. TypeScript and Docker are listed in the Skills section only, earning partial credit. GraphQL is entirely absent, and no CI/CD tooling is mentioned anywhere.',
    },
    {
      id: 'project_evidence',
      label: 'Project & Practical Experience Evidence',
      max_points: 30,
      earned_points: 21,
      justification:
        'ShopFlow provides the strongest evidence with authentication flows, payment integration, and AWS deployment described. TaskSync demonstrates API design depth with RBAC middleware. However, no project describes database query optimization strategies, caching rationale, or architectural tradeoffs — which senior reviewers prioritize.',
    },
    {
      id: 'impact_ownership',
      label: 'Impact, Ownership & Action-Verb Quality',
      max_points: 20,
      earned_points: 14,
      justification:
        'Action verbs are present (built, designed, implemented, created) but zero quantified outcomes appear across all bullets. No load figures, latency improvements, error rate reductions, or user counts are cited. The JD explicitly mentions measurable contributions as a differentiator.',
    },
    {
      id: 'contextual_fit',
      label: 'Role & Domain Contextual Fit',
      max_points: 10,
      earned_points: 8,
      justification:
        'CI/CD and Git workflow exposure is implied through project use and AWS EC2 deployment is mentioned. No explicit testing (Jest, Cypress) or agile process experience is described, which the JD mentions as requirements for the internship role.',
    },
  ],
  skill_matrix: [
    {
      skill: 'React',
      status: 'matched',
      evidence_quote:
        'Built full-stack e-commerce platform using React and Node.js with Express backend serving 3 REST API route groups',
      gap_explanation: null,
    },
    {
      skill: 'Node.js / Express',
      status: 'matched',
      evidence_quote:
        'Developed RESTful API service with 20+ endpoints using Node.js and Express with structured route handlers',
      gap_explanation: null,
    },
    {
      skill: 'PostgreSQL',
      status: 'matched',
      evidence_quote:
        'Designed PostgreSQL database schema for products, users, and orders with foreign key constraints and indexes',
      gap_explanation: null,
    },
    {
      skill: 'MongoDB',
      status: 'matched',
      evidence_quote:
        'Used MongoDB for data persistence with Mongoose ODM for schema validation and query optimization',
      gap_explanation: null,
    },
    {
      skill: 'TypeScript',
      status: 'weakly_demonstrated',
      evidence_quote: 'TypeScript',
      gap_explanation:
        'Listed in the Languages section only. No project or experience bullet demonstrates TypeScript usage. The JD lists TypeScript as a nice-to-have; without project evidence, this earns minimal credit.',
    },
    {
      skill: 'Docker',
      status: 'weakly_demonstrated',
      evidence_quote: 'Docker',
      gap_explanation:
        'Listed in Tools & Platforms section only. No Dockerfile, docker-compose, or containerization context appears in any project description.',
    },
    {
      skill: 'GraphQL',
      status: 'missing',
      evidence_quote: null,
      gap_explanation:
        'JD lists GraphQL as a nice-to-have. Not mentioned anywhere in the resume at any level.',
    },
  ],
  bullet_rewrites: [
    {
      original:
        'Built full-stack e-commerce platform using React and Node.js with Express backend serving 3 REST API route groups',
      improved:
        'Architected and shipped a full-stack e-commerce platform using React 18 + Redux Toolkit (frontend) and Node.js/Express (backend) with [insert metric, e.g., 15+ REST endpoints] supporting [insert metric, e.g., 500+ concurrent sessions], featuring JWT authentication, PostgreSQL order management, and Stripe payment integration with webhook handling',
      rationale:
        'Added architectural specificity, state management context (Redux Toolkit), quantified endpoint count, concurrency scale, and preserved all existing technical details while adding metric placeholders.',
      keywords_added: ['architected', 'Redux Toolkit', 'JWT authentication', 'webhook handling'],
    },
    {
      original:
        'Developed RESTful API service with 20+ endpoints using Node.js and Express with structured route handlers',
      improved:
        'Designed and implemented a RESTful API (20+ endpoints) using Node.js/Express with Mongoose input validation, role-based access control middleware, and Swagger/OpenAPI documentation, achieving [insert metric, e.g., <100ms p95 response time] under [insert metric, e.g., X concurrent users]',
      rationale:
        'Elevated the action verb to "designed and implemented", added engineering quality signals (validation, RBAC, documentation), and inserted latency metric prompts for quantified impact.',
      keywords_added: ['designed', 'Mongoose input validation', 'Swagger/OpenAPI', 'p95 response time'],
    },
    {
      original:
        'Created real-time chat application using Socket.io and Node.js supporting multiple concurrent chat rooms',
      improved:
        'Built a real-time messaging application using Socket.io and Node.js supporting [insert metric, e.g., 200+ concurrent WebSocket connections], with room-based routing, MongoDB message persistence with [insert metric, e.g., <50ms] delivery latency, typing indicators, and read receipt state management',
      rationale:
        'Replaced weak "created" with "built", quantified concurrency and latency with explicit metric prompts, and surfaced the specific technical features that demonstrate real-time engineering depth.',
      keywords_added: ['WebSocket connections', 'room-based routing', 'MongoDB message persistence'],
    },
  ],
  action_plan: [
    {
      rank: 1,
      action:
        'Add at least one quantified metric to every project bullet. Even conservative estimates work: "supporting ~500 monthly active users", "reducing checkout errors by ~30%", or bracket placeholders that signal metric-awareness to reviewers. This is a low-effort, high-impact change.',
      score_lift_pts: 7,
      effort: 'Low',
    },
    {
      rank: 2,
      action:
        'Move TypeScript into a real project context. Refactor one project (e.g., TaskSync API) to TypeScript, then add a bullet: "Migrated TaskSync REST API to TypeScript, adding strict type definitions for all request/response interfaces and eliminating a class of runtime type errors." This directly addresses the JD nice-to-have.',
      score_lift_pts: 5,
      effort: 'Medium',
    },
    {
      rank: 3,
      action:
        'Containerize one existing project with Docker. Write a multi-stage Dockerfile and docker-compose.yml, then add: "Containerized application with multi-stage Docker build (dev/prod), reducing image size by [X]% and enabling one-command local setup with docker-compose." This turns Docker from weakly-demonstrated to matched.',
      score_lift_pts: 4,
      effort: 'Medium',
    },
    {
      rank: 4,
      action:
        'Add a testing section to your strongest project. Write Jest unit tests for the Node.js API controllers and add: "Wrote 25+ Jest unit tests for API controllers achieving 80%+ branch coverage." This directly addresses the JD requirement for testing experience.',
      score_lift_pts: 3,
      effort: 'Medium',
    },
    {
      rank: 5,
      action:
        'Add a GraphQL layer to one project. Convert a subset of the ShopFlow REST endpoints to GraphQL with Apollo Server: "Implemented GraphQL API layer using Apollo Server for product catalog queries, reducing client-side data over-fetching by [X]%." This converts a missing JD nice-to-have to a matched skill.',
      score_lift_pts: 4,
      effort: 'High',
    },
  ],
};
