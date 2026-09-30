/*
# Seed catalog data — skills, careers, career-skill mappings, learning resources, demo industry trends

## Overview
Populates the reference/catalog tables with a realistic dataset covering the sample
user (Rithu Joshna) scenario and several common tech careers.

## Data inserted
- ~40 skills across Programming, Data Science, Web, DevOps, Tools, Soft Skills, Database categories.
- 8 careers: Python Developer, Data Analyst, Machine Learning Engineer, Backend Developer,
  Software Developer, Full Stack Developer, Data Scientist, DevOps Engineer.
- career_skills mappings with required levels and priorities for each career.
- ~30 learning resources linked to skills.
- ~20 industry_trends rows labeled source='demo' (simulated data, not live).

All inserted via INSERT ... ON CONFLICT DO NOTHING so it is idempotent.
*/

-- ============ SKILLS ============
INSERT INTO skills (name, category, description) VALUES
('Python', 'Programming', 'General-purpose programming language widely used in data, AI, and backend'),
('Java', 'Programming', 'Object-oriented language for enterprise and Android'),
('C', 'Programming', 'Low-level systems programming language'),
('C++', 'Programming', 'Systems and performance-oriented programming language'),
('JavaScript', 'Programming', 'Language of the web; frontend and Node.js backend'),
('TypeScript', 'Programming', 'Typed superset of JavaScript'),
('HTML', 'Web', 'Markup language for web pages'),
('CSS', 'Web', 'Styling language for the web'),
('SQL', 'Database', 'Query language for relational databases'),
('NoSQL', 'Database', 'Non-relational database concepts (MongoDB, Redis, etc.)'),
('PostgreSQL', 'Database', 'Advanced relational database'),
('MySQL', 'Database', 'Popular open-source relational database'),
('SQLite', 'Database', 'Lightweight embedded relational database'),
('Flask', 'Web', 'Lightweight Python web framework'),
('Django', 'Web', 'Batteries-included Python web framework'),
('FastAPI', 'Web', 'Modern async Python API framework'),
('React', 'Web', 'Frontend JavaScript library'),
('Node.js', 'Web', 'JavaScript runtime for backend'),
('Pandas', 'Data Science', 'Python data manipulation library'),
('NumPy', 'Data Science', 'Numerical computing library for Python'),
('Statistics', 'Data Science', 'Statistical methods and probability'),
('Linear Algebra', 'Data Science', 'Mathematics of vectors and matrices'),
('Data Visualization', 'Data Science', 'Visual representation of data (Tableau, Power BI, Matplotlib)'),
('Power BI', 'Data Science', 'Microsoft business analytics tool'),
('Tableau', 'Data Science', 'Data visualization platform'),
('Excel', 'Data Science', 'Spreadsheet analysis tool'),
('Scikit-learn', 'Machine Learning', 'Classical ML library for Python'),
('TensorFlow', 'Machine Learning', 'Deep learning framework'),
('PyTorch', 'Machine Learning', 'Deep learning framework'),
('Deep Learning', 'Machine Learning', 'Neural network concepts and techniques'),
('Model Deployment', 'Machine Learning', 'Deploying ML models to production'),
('MLOps', 'Machine Learning', 'ML operations and lifecycle management'),
('NLP', 'Machine Learning', 'Natural language processing'),
('Git', 'Tools', 'Version control system'),
('GitHub', 'Tools', 'Git hosting and collaboration platform'),
('VS Code', 'Tools', 'Source code editor'),
('Docker', 'DevOps', 'Containerization platform'),
('Kubernetes', 'DevOps', 'Container orchestration'),
('AWS', 'DevOps', 'Amazon cloud platform'),
('Linux', 'DevOps', 'Open-source operating system'),
('Communication', 'Soft Skills', 'Verbal and written communication'),
('Problem Solving', 'Soft Skills', 'Analytical problem-solving ability'),
('Teamwork', 'Soft Skills', 'Collaboration in teams'),
('Project Management', 'Soft Skills', 'Planning and managing projects')
ON CONFLICT (name) DO NOTHING;

-- ============ CAREERS ============
INSERT INTO careers (name, description, domain) VALUES
('Python Developer', 'Builds applications, scripts, and backend services using Python', 'Software Development'),
('Data Analyst', 'Analyzes data to extract insights and support business decisions', 'Data Science'),
('Machine Learning Engineer', 'Builds and deploys machine learning models at scale', 'Artificial Intelligence'),
('Backend Developer', 'Builds server-side logic, APIs, and databases for web applications', 'Software Development'),
('Software Developer', 'Designs and builds general-purpose software applications', 'Software Development'),
('Full Stack Developer', 'Builds both frontend and backend of web applications', 'Software Development'),
('Data Scientist', 'Applies scientific methods to extract knowledge from data', 'Data Science'),
('DevOps Engineer', 'Automates deployment, infrastructure, and operations pipelines', 'DevOps')
ON CONFLICT (name) DO NOTHING;

-- ============ CAREER SKILLS ============
-- Helper: we reference skill names via subqueries.

-- Python Developer
INSERT INTO career_skills (career_id, skill_id, required_level, priority)
SELECT c.id, s.id, x.lvl, x.prio
FROM careers c, skills s
CROSS JOIN (VALUES
  ('Python', 4, 'high'),
  ('Flask', 3, 'medium'),
  ('Django', 3, 'low'),
  ('SQL', 3, 'high'),
  ('Git', 3, 'high'),
  ('GitHub', 3, 'medium'),
  ('Problem Solving', 4, 'high'),
  ('Communication', 3, 'medium'),
  ('VS Code', 2, 'low'),
  ('FastAPI', 3, 'medium')
) AS x(name, lvl, prio)
WHERE c.name = 'Python Developer' AND s.name = x.name
ON CONFLICT (career_id, skill_id) DO NOTHING;

-- Data Analyst
INSERT INTO career_skills (career_id, skill_id, required_level, priority)
SELECT c.id, s.id, x.lvl, x.prio
FROM careers c, skills s
CROSS JOIN (VALUES
  ('Python', 3, 'high'),
  ('SQL', 4, 'high'),
  ('Excel', 4, 'high'),
  ('Statistics', 4, 'high'),
  ('Pandas', 4, 'high'),
  ('Data Visualization', 4, 'high'),
  ('Power BI', 3, 'medium'),
  ('Tableau', 3, 'medium'),
  ('Communication', 4, 'high'),
  ('NumPy', 3, 'medium')
) AS x(name, lvl, prio)
WHERE c.name = 'Data Analyst' AND s.name = x.name
ON CONFLICT (career_id, skill_id) DO NOTHING;

-- Machine Learning Engineer
INSERT INTO career_skills (career_id, skill_id, required_level, priority)
SELECT c.id, s.id, x.lvl, x.prio
FROM careers c, skills s
CROSS JOIN (VALUES
  ('Python', 5, 'high'),
  ('Scikit-learn', 4, 'high'),
  ('Statistics', 4, 'high'),
  ('Linear Algebra', 4, 'high'),
  ('Deep Learning', 4, 'high'),
  ('TensorFlow', 4, 'high'),
  ('PyTorch', 4, 'high'),
  ('Model Deployment', 4, 'medium'),
  ('MLOps', 3, 'medium'),
  ('NLP', 3, 'medium'),
  ('NumPy', 4, 'medium'),
  ('Pandas', 4, 'medium'),
  ('Git', 3, 'medium'),
  ('Problem Solving', 4, 'high')
) AS x(name, lvl, prio)
WHERE c.name = 'Machine Learning Engineer' AND s.name = x.name
ON CONFLICT (career_id, skill_id) DO NOTHING;

-- Backend Developer
INSERT INTO career_skills (career_id, skill_id, required_level, priority)
SELECT c.id, s.id, x.lvl, x.prio
FROM careers c, skills s
CROSS JOIN (VALUES
  ('Python', 4, 'high'),
  ('Java', 4, 'medium'),
  ('JavaScript', 3, 'medium'),
  ('Node.js', 3, 'medium'),
  ('SQL', 4, 'high'),
  ('PostgreSQL', 3, 'medium'),
  ('MySQL', 3, 'medium'),
  ('Docker', 3, 'medium'),
  ('Git', 4, 'high'),
  ('Linux', 3, 'medium'),
  ('Flask', 3, 'medium'),
  ('FastAPI', 3, 'medium'),
  ('Problem Solving', 4, 'high')
) AS x(name, lvl, prio)
WHERE c.name = 'Backend Developer' AND s.name = x.name
ON CONFLICT (career_id, skill_id) DO NOTHING;

-- Software Developer
INSERT INTO career_skills (career_id, skill_id, required_level, priority)
SELECT c.id, s.id, x.lvl, x.prio
FROM careers c, skills s
CROSS JOIN (VALUES
  ('Python', 4, 'high'),
  ('Java', 4, 'medium'),
  ('C++', 3, 'low'),
  ('JavaScript', 3, 'medium'),
  ('SQL', 3, 'high'),
  ('Git', 4, 'high'),
  ('GitHub', 3, 'medium'),
  ('Problem Solving', 4, 'high'),
  ('Communication', 3, 'medium'),
  ('VS Code', 2, 'low')
) AS x(name, lvl, prio)
WHERE c.name = 'Software Developer' AND s.name = x.name
ON CONFLICT (career_id, skill_id) DO NOTHING;

-- Full Stack Developer
INSERT INTO career_skills (career_id, skill_id, required_level, priority)
SELECT c.id, s.id, x.lvl, x.prio
FROM careers c, skills s
CROSS JOIN (VALUES
  ('JavaScript', 4, 'high'),
  ('TypeScript', 3, 'medium'),
  ('HTML', 4, 'high'),
  ('CSS', 4, 'high'),
  ('React', 4, 'high'),
  ('Node.js', 4, 'high'),
  ('SQL', 4, 'high'),
  ('PostgreSQL', 3, 'medium'),
  ('Python', 3, 'medium'),
  ('Git', 4, 'high'),
  ('Docker', 3, 'low'),
  ('Problem Solving', 4, 'high')
) AS x(name, lvl, prio)
WHERE c.name = 'Full Stack Developer' AND s.name = x.name
ON CONFLICT (career_id, skill_id) DO NOTHING;

-- Data Scientist
INSERT INTO career_skills (career_id, skill_id, required_level, priority)
SELECT c.id, s.id, x.lvl, x.prio
FROM careers c, skills s
CROSS JOIN (VALUES
  ('Python', 5, 'high'),
  ('Statistics', 5, 'high'),
  ('Linear Algebra', 4, 'high'),
  ('Pandas', 5, 'high'),
  ('NumPy', 4, 'high'),
  ('Scikit-learn', 4, 'high'),
  ('SQL', 4, 'high'),
  ('Data Visualization', 4, 'high'),
  ('Deep Learning', 3, 'medium'),
  ('NLP', 3, 'medium'),
  ('Communication', 4, 'high'),
  ('Problem Solving', 5, 'high')
) AS x(name, lvl, prio)
WHERE c.name = 'Data Scientist' AND s.name = x.name
ON CONFLICT (career_id, skill_id) DO NOTHING;

-- DevOps Engineer
INSERT INTO career_skills (career_id, skill_id, required_level, priority)
SELECT c.id, s.id, x.lvl, x.prio
FROM careers c, skills s
CROSS JOIN (VALUES
  ('Linux', 4, 'high'),
  ('Docker', 4, 'high'),
  ('Kubernetes', 4, 'high'),
  ('AWS', 4, 'high'),
  ('Git', 4, 'high'),
  ('Python', 3, 'medium'),
  ('SQL', 3, 'medium'),
  ('Problem Solving', 4, 'high'),
  ('Project Management', 3, 'medium')
) AS x(name, lvl, prio)
WHERE c.name = 'DevOps Engineer' AND s.name = x.name
ON CONFLICT (career_id, skill_id) DO NOTHING;

-- ============ LEARNING RESOURCES ============
INSERT INTO learning_resources (skill_id, title, platform, resource_type, difficulty, url, duration_hours, is_free)
SELECT s.id, x.title, x.platform, x.rtype, x.diff, x.url, x.dur, x.free
FROM skills s
CROSS JOIN (VALUES
  ('Python', 'Python for Everybody', 'Coursera', 'course', 'beginner', 'https://www.coursera.org/specializations/python', 60, true),
  ('Python', 'Official Python Tutorial', 'python.org', 'documentation', 'beginner', 'https://docs.python.org/3/tutorial/', 20, true),
  ('Python', '100 Days of Code: Python Pro Bootcamp', 'Udemy', 'course', 'intermediate', 'https://www.udemy.com/course/100-days-of-code/', 50, false),
  ('SQL', 'SQLBolt Interactive SQL Lessons', 'SQLBolt', 'practice', 'beginner', 'https://sqlbolt.com/', 10, true),
  ('SQL', 'Mode SQL Tutorial', 'Mode Analytics', 'tutorial', 'intermediate', 'https://mode.com/sql-tutorial/', 15, true),
  ('Statistics', 'Khan Academy Statistics and Probability', 'Khan Academy', 'course', 'beginner', 'https://www.khanacademy.org/math/statistics-probability', 40, true),
  ('Statistics', 'Practical Statistics for Data Scientists', 'Book', 'documentation', 'intermediate', 'https://www.oreilly.com/library/view/practical-statistics-for/9781492072830/', 30, false),
  ('Pandas', 'Pandas Official Getting Started', 'pandas.pydata.org', 'documentation', 'beginner', 'https://pandas.pydata.org/docs/getting_started/index.html', 10, true),
  ('Pandas', 'Data Analysis with Pandas', 'Kaggle', 'course', 'intermediate', 'https://www.kaggle.com/learn/pandas', 5, true),
  ('Data Visualization', 'Matplotlib Tutorial', 'matplotlib.org', 'tutorial', 'beginner', 'https://matplotlib.org/stable/tutorials/index.html', 8, true),
  ('Power BI', 'Microsoft Power BI Learning Path', 'Microsoft Learn', 'course', 'beginner', 'https://learn.microsoft.com/power-bi/', 25, true),
  ('Tableau', 'Tableau Public Resources', 'Tableau', 'tutorial', 'beginner', 'https://public.tableau.com/en-us/s/', 15, true),
  ('Excel', 'Excel Skills for Business', 'Coursera', 'course', 'beginner', 'https://www.coursera.org/specializations/excel', 30, true),
  ('Scikit-learn', 'Scikit-learn User Guide', 'scikit-learn.org', 'documentation', 'intermediate', 'https://scikit-learn.org/stable/user_guide.html', 20, true),
  ('Scikit-learn', 'Machine Learning with Scikit-learn', 'Kaggle', 'course', 'intermediate', 'https://www.kaggle.com/learn/intro-to-machine-learning', 5, true),
  ('Deep Learning', 'Deep Learning Specialization', 'Coursera', 'course', 'advanced', 'https://www.coursera.org/specializations/deep-learning', 80, false),
  ('TensorFlow', 'TensorFlow Tutorials', 'tensorflow.org', 'tutorial', 'intermediate', 'https://www.tensorflow.org/tutorials', 20, true),
  ('PyTorch', 'PyTorch Deep Learning Tutorials', 'pytorch.org', 'tutorial', 'intermediate', 'https://pytorch.org/tutorials/', 25, true),
  ('Linear Algebra', 'Linear Algebra (MIT OCW)', 'MIT OpenCourseWare', 'course', 'intermediate', 'https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/', 40, true),
  ('Model Deployment', 'ML Model Deployment with FastAPI', 'FastAPI Docs', 'tutorial', 'advanced', 'https://fastapi.tiangolo.com/deployment/', 10, true),
  ('MLOps', 'MLOps Zoomcamp', 'DataTalksClub', 'course', 'advanced', 'https://github.com/DataTalksClub/mlops-zoomcamp', 40, true),
  ('NLP', 'Hugging Face NLP Course', 'Hugging Face', 'course', 'advanced', 'https://huggingface.co/course', 30, true),
  ('Flask', 'Flask Mega Tutorial', 'blog.miguelgrinberg.com', 'tutorial', 'intermediate', 'https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-i-hello-world', 20, true),
  ('Django', 'Official Django Tutorial', 'djangoproject.com', 'tutorial', 'intermediate', 'https://docs.djangoproject.com/en/stable/intro/tutorial/', 15, true),
  ('React', 'React Official Docs', 'react.dev', 'documentation', 'beginner', 'https://react.dev/learn', 15, true),
  ('Node.js', 'Node.js Official Getting Started', 'nodejs.org', 'documentation', 'beginner', 'https://nodejs.org/en/docs/guides/getting-started-guide/', 10, true),
  ('Docker', 'Docker Get Started', 'docker.com', 'tutorial', 'beginner', 'https://docs.docker.com/get-started/', 8, true),
  ('Kubernetes', 'Kubernetes Interactive Tutorials', 'kubernetes.io', 'tutorial', 'intermediate', 'https://kubernetes.io/docs/tutorials/', 20, true),
  ('AWS', 'AWS Cloud Practitioner Essentials', 'AWS Skill Builder', 'course', 'beginner', 'https://aws.amazon.com/training/learn-about/cloud-practitioner/', 10, true),
  ('Linux', 'Linux Journey', 'linuxjourney.com', 'tutorial', 'beginner', 'https://linuxjourney.com/', 12, true),
  ('Git', 'Pro Git Book', 'git-scm.com', 'documentation', 'beginner', 'https://git-scm.com/book/en/v2', 15, true),
  ('Communication', 'Effective Communication Skills', 'Coursera', 'course', 'beginner', 'https://www.coursera.org/learn/wharton-communication', 15, true),
  ('Problem Solving', 'Algorithmic Problem Solving on LeetCode', 'LeetCode', 'practice', 'intermediate', 'https://leetcode.com/', 30, true),
  ('PostgreSQL', 'PostgreSQL Tutorial', 'postgresqltutorial.com', 'tutorial', 'intermediate', 'https://www.postgresqltutorial.com/', 15, true),
  ('FastAPI', 'FastAPI Official Tutorial', 'fastapi.tiangolo.com', 'tutorial', 'intermediate', 'https://fastapi.tiangolo.com/tutorial/', 10, true)
) AS x(name, title, platform, rtype, diff, url, dur, free)
WHERE s.name = x.name
ON CONFLICT DO NOTHING;

-- ============ INDUSTRY TRENDS (DEMO / SIMULATED DATA) ============
INSERT INTO industry_trends (skill_name, demand_level, trend_score, source, notes, updated_at)
VALUES
  ('Python', 'high', 92, 'demo', 'Consistently top-ranked language for data and AI roles', now()),
  ('SQL', 'high', 85, 'demo', 'Foundational for all data roles', now()),
  ('Machine Learning', 'high', 90, 'demo', 'Surging demand across industries', now()),
  ('Deep Learning', 'high', 88, 'demo', 'Growing with generative AI adoption', now()),
  ('TensorFlow', 'medium', 72, 'demo', 'Steady; PyTorch gaining share', now()),
  ('PyTorch', 'high', 84, 'demo', 'Rapidly growing in research and production', now()),
  ('MLOps', 'high', 80, 'demo', 'Emerging discipline as ML productionization scales', now()),
  ('Model Deployment', 'high', 78, 'demo', 'Critical for ML engineer roles', now()),
  ('NLP', 'high', 86, 'demo', 'Boosted by large language model adoption', now()),
  ('Data Visualization', 'medium', 70, 'demo', 'Stable demand for analyst roles', now()),
  ('Power BI', 'medium', 68, 'demo', 'Strong in enterprise Microsoft shops', now()),
  ('Tableau', 'medium', 65, 'demo', 'Steady; competing with modern BI tools', now()),
  ('React', 'high', 87, 'demo', 'Dominant frontend library', now()),
  ('Node.js', 'high', 80, 'demo', 'Widely used for backend JavaScript services', now()),
  ('TypeScript', 'high', 83, 'demo', 'Adoption accelerating across JS ecosystem', now()),
  ('Docker', 'high', 82, 'demo', 'Standard containerization tool', now()),
  ('Kubernetes', 'high', 79, 'demo', 'De-facto orchestration standard', now()),
  ('AWS', 'high', 88, 'demo', 'Leading cloud platform', now()),
  ('Flask', 'medium', 60, 'demo', 'Stable for small/medium Python services', now()),
  ('FastAPI', 'high', 76, 'demo', 'Rapidly growing for modern Python APIs', now()),
  ('C', 'low', 40, 'demo', 'Niche; mostly systems programming', now()),
  ('C++', 'medium', 55, 'demo', 'Relevant for performance and game dev', now())
ON CONFLICT DO NOTHING;