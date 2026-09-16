🚀 HireMind.AI
AI-powered career preparation platform for interviews, resumes, performance analysis, and personalized learning roadmaps.

HireMind.AI is a full-stack AI career preparation platform designed to help students and job seekers prepare for the complete hiring journey.

The platform brings together AI-powered interview practice, resume building, interview performance analysis, and personalized learning roadmaps in a single application.

It uses a microservices-oriented backend, LangChain/LangGraph-based AI workflows, specialized AI agents, Redis caching, MongoDB persistence, Firebase authentication, and Razorpay payments.

✨ Features
🎤 AI Interview Simulator
Practice realistic interview sessions with AI-powered interview workflows.

HR and behavioral interviews
Technical interviews
Coding interview support
AI-generated interview questions
Timed interview sessions
Integrated code editor
Interview session management
AI-powered answer evaluation
Automated interview feedback
Performance scoring
Interview reports and analysis
🤖 AI Agent Architecture
Different career-related tasks are handled by specialized AI agents.

AI Agent	Responsibility
📝 Resume Agent	Assists with resume generation and improvement
🎤 Interview Agent	Generates and conducts interview questions
📊 Feedback Agent	Evaluates candidate responses and generates feedback
🗺️ Roadmap Agent	Generates personalized learning roadmaps
📚 Resource Agent	Finds relevant learning resources
This modular approach makes it easier to extend the platform with additional AI capabilities.

📄 AI Resume Builder
Create and manage professional resumes directly within HireMind.AI.

Structured resume editor
ATS-oriented resume format
Resume preview
PDF generation
AI-assisted resume creation
Resume data management
📊 Interview Analytics
Track interview preparation and performance from a centralized dashboard.

The platform provides information such as:

Total interviews
Questions answered
Completed interviews
Average interview score
HR/behavioral performance
Technical performance
Interview history
Performance visualizations
🗺️ Personalized Learning Roadmaps
Generate learning plans based on a candidate's career goal and current skills.

The roadmap system can:

Generate structured learning paths
Divide goals into learning modules
Recommend learning resources
Fetch relevant external learning resources
Present resources alongside the generated roadmap
The roadmap service integrates with the YouTube API to provide learning resources.

🔐 Authentication & User Management
HireMind.AI uses Firebase for authentication and Firebase Admin for backend verification.

Firebase Authentication
Firebase Admin SDK
Cookie-based authentication
Protected backend routes
User session management
User data persistence with MongoDB
💳 Subscription & Billing
Premium functionality is supported through Razorpay integration.

Razorpay payment integration
Payment processing
Billing records
User plan management
🏗️ System Architecture
HireMind.AI follows a microservices-oriented backend architecture.

                         ┌─────────────────────┐
                         │     React + Vite    │
                         │     Frontend UI     │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │     API Gateway     │
                         │   Node.js + Express │
                         └──────────┬──────────┘
                                    │
          ┌─────────────────────────┼─────────────────────────┐
          │                         │                         │
          ▼                         ▼                         ▼
 ┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
 │  Auth Service   │      │Interview Service│      │  Resume Service │
 │ Firebase +      │      │ AI Interview    │      │  AI Resume      │
 │ MongoDB         │      │ Workflows       │      │  Processing     │
 └─────────────────┘      └────────┬────────┘      └────────┬────────┘
                                   │                         │
                                   ▼                         ▼
                           ┌───────────────┐          ┌───────────────┐
                           │ LangGraph +   │          │ LangChain +   │
                           │ AI Agents     │          │ AI Agent      │
                           └───────────────┘          └───────────────┘

          ┌─────────────────────────┼─────────────────────────┐
          │                                                   │
          ▼                                                   ▼
 ┌─────────────────┐                                ┌─────────────────┐
 │ Roadmap Service │                                │ Billing Service │
 │ AI Roadmaps +   │                                │ Razorpay        │
 │YouTube Resources│                                │ Payments        │
 └────────┬────────┘                                └─────────────────┘
          │
          ▼
 ┌─────────────────┐
 │ YouTube API     │
 │ Learning        │
 │ Resources       │
 └─────────────────┘

                    ┌─────────────────────────┐
                    │     MongoDB + Redis     │
                    │ Persistence + Caching   │
                    └─────────────────────────┘
🧠 AI Architecture
The AI functionality is organized into structured workflows using LangChain and LangGraph.

Interview Workflow
User starts interview
        ↓
Interview Agent
        ↓
Question Generation
        ↓
Candidate Answer
        ↓
Answer Evaluation
        ↓
Feedback Agent
        ↓
Performance Analysis
        ↓
Interview Report
The workflow separates question generation, response evaluation, feedback, and reporting into dedicated stages.

Roadmap Workflow
Career Goal
     ↓
Current Skills
     ↓
Roadmap Agent
     ↓
Learning Plan Generation
     ↓
Resource Agent
     ↓
External Learning Resources
     ↓
Personalized Roadmap
🛠️ Tech Stack
Frontend
React.js
Vite
Redux Toolkit
React Router
Axios
Recharts
Monaco Editor
Firebase Authentication
Motion
Backend
Node.js
Express.js
MongoDB
Mongoose
Redis
Docker
REST APIs
Microservices Architecture
AI
LangChain
LangGraph
Groq
AI Agents
Authentication & Payments
Firebase Authentication
Firebase Admin SDK
Razorpay
External Services
YouTube Data API
Developer Tools
Git
GitHub
Docker
npm
ESLint
Nodemon
📁 Project Structure
HireMind.AI/
│
├── backend/
│   │
│   ├── gateway/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   └── utils/
│   │
│   ├── services/
│   │   │
│   │   ├── auth-service/
│   │   ├── billing-service/
│   │   ├── interview-service/
│   │   ├── resume-service/
│   │   └── roadmap-service/
│   │
│   ├── shared/
│   │   └── redis/
│   │
│   └── docker-compose.yml
│
├── frontend/
│   │
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   └── utils/
│   │
│   └── public/
│
├── .gitignore
└── README.md
⚙️ Getting Started
Prerequisites
Make sure the following are installed:

Node.js
npm
Docker Desktop
MongoDB
Git
1. Clone the Repository
git clone https://github.com/harshp970/HireMind.AI.git
cd HireMind.AI
2. Install Frontend Dependencies
cd frontend
npm install
Start the frontend:

npm run dev
The frontend runs on the Vite development server.

3. Install Backend Dependencies
Each backend service maintains its own dependencies.

For example:

cd backend/services/auth-service
npm install
npm run dev
Install dependencies for the other services in the same way.

The backend consists of:

Gateway             → 8000
Auth Service        → 8001
Interview Service   → 8002
Resume Service      → 8003
Roadmap Service     → 8004
Billing Service     → 8005
4. Start Redis
From the backend directory:

cd backend
docker compose up -d
Redis is exposed on:

localhost:6379
🔑 Environment Variables
Each service uses its own .env file.

Example configuration files are provided as:

backend/services/auth-service/.env.example
backend/services/billing-service/.env.example
backend/services/interview-service/.env.example
backend/services/resume-service/.env.example
backend/services/roadmap-service/.env.example
frontend/.env.example
The example files contain placeholders only.

Typical configuration includes:

MONGODB_URL="your_mongodb_connection_string"
REDIS_URL="redis://localhost:6379"
GROQ_API_KEY="your_groq_api_key"
YOUTUBE_API_KEY="your_youtube_api_key"
RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
Frontend configuration includes the required Firebase and Razorpay public configuration.

For Firebase Admin authentication, configure the required service-account credentials locally using the provided example file as a reference.

Never commit real API keys, .env files, or Firebase service-account credentials to GitHub.

🔒 Security
Sensitive configuration is kept outside the source code through environment variables and local credential files.

The repository's .gitignore excludes:

.env
node_modules/
serviceAccountKey.json
.DS_Store
For production deployments:

Use environment variables or a secrets manager.
Never commit API keys.
Never commit Firebase service-account credentials.
Rotate credentials immediately if they are accidentally exposed.
Use separate credentials for development and production.
🚀 Future Improvements
Potential future improvements include:

Real-time voice interviews
Resume-to-job matching
Job description analysis
LinkedIn profile optimization
Additional programming languages for coding interviews
Adaptive interview difficulty
More advanced interview analytics
Personalized job recommendations
Real-time AI interviewer
Production-grade monitoring and observability
🎯 Why HireMind.AI?
The hiring process involves much more than interview preparation alone.

HireMind.AI combines several preparation stages into one platform:

        Resume
           ↓
      Skill Analysis
           ↓
   Learning Roadmap
           ↓
    Interview Practice
           ↓
       AI Feedback
           ↓
 Performance Analytics
           ↓
 Better Interview Preparation
The goal is to provide students and job seekers with a unified platform for continuous career preparation.


⭐ Project
If you find HireMind.AI useful, consider giving the repository a ⭐ on GitHub.
