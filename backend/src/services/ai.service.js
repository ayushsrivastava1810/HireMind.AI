const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });

// ── 1. Interview Plan Report (HireMind-1) ──────────────────────────────────
const interviewReportSchema = z.object({
  matchScore: z.number().describe("Score 0-100 matching candidate to job"),
  title: z.string().describe("Job title"),
  technicalQuestions: z.array(z.object({
    question: z.string(),
    intention: z.string(),
    answer: z.string(),
  })).min(4).max(6),
  behavioralQuestions: z.array(z.object({
    question: z.string(),
    intention: z.string(),
    answer: z.string(),
  })).min(4).max(6),
  skillGaps: z.array(z.object({
    skill: z.string(),
    severity: z.enum(["low", "medium", "high"]),
  })).min(3).max(7),
  preparationPlan: z.array(z.object({
    day: z.number(),
    focus: z.string(),
    tasks: z.array(z.string()).min(2).max(5),
  })).min(5).max(14),
});

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
  const prompt = `You are an expert technical interviewer and career coach. Generate a comprehensive interview report for this candidate.

Resume: ${resume || "Not provided"}
Self Description: ${selfDescription || "Not provided"}  
Job Description: ${jobDescription}

Generate realistic, specific questions based on actual projects and skills mentioned. Make skill gaps actionable.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(interviewReportSchema),
    },
  });
  return JSON.parse(response.text);
}

// ── 2. ATS Resume PDF (HireMind-1) ─────────────────────────────────────────
async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });
  const pdfBuffer = await page.pdf({
    format: "A4",
    margin: { top: "18mm", bottom: "18mm", left: "14mm", right: "14mm" },
  });
  await browser.close();
  return pdfBuffer;
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
  const schema = z.object({ html: z.string() });
  const prompt = `Generate a professional ATS-optimized resume as complete HTML.

Resume Content: ${resume || ""}
Self Description: ${selfDescription || ""}
Job Description: ${jobDescription}

Requirements:
- Clean, professional single-page HTML design
- ATS-parseable structure (no tables for layout, use divs)
- Tailored to the specific job description
- Highlight matching skills prominently
- Professional color scheme (dark blue header, clean body)
- All content in proper HTML tags
- Do NOT sound AI-generated
- Include: Contact info, Summary, Skills, Experience, Projects, Education
- Max 2 pages when printed

Return JSON with single field "html" containing the complete HTML document.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(schema),
    },
  });
  const { html } = JSON.parse(response.text);
  return generatePdfFromHtml(html);
}

// ── 3. AI Interview Questions (HireMind-AI) ─────────────────────────────────
async function generateInterviewQuestions({ role, experience, mode, resumeText }) {
  const schema = z.object({
    questions: z.array(z.string()).length(5),
  });

  const modeDesc = mode === "hr"
    ? "behavioral, situational, communication, teamwork, and leadership questions"
    : "deep technical questions testing practical knowledge, problem-solving, and system design";

  const prompt = `Generate exactly 5 interview questions for a ${experience} ${role}.
Mode: ${modeDesc}
${resumeText ? `Candidate resume highlights: ${resumeText.substring(0, 800)}` : ""}

Rules:
- Questions must be specific, not generic
- Progressively increase in difficulty
- Reference real technologies/scenarios
- For technical: include at least one system design or optimization question
- For HR: include at least one conflict resolution scenario

Return JSON with "questions" array of exactly 5 strings.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(schema),
    },
  });
  const { questions } = JSON.parse(response.text);
  return questions;
}

// ── 4. Evaluate Answer (HireMind-AI) ────────────────────────────────────────
async function evaluateAnswer({ question, answer, role, mode }) {
  const schema = z.object({
    score: z.number().min(0).max(10),
    feedback: z.string(),
    confidence: z.number().min(0).max(10),
    communication: z.number().min(0).max(10),
    correctness: z.number().min(0).max(10),
  });

  const prompt = `You are a strict but fair interviewer evaluating an answer for a ${role} position.

Question: ${question}
Candidate's Answer: ${answer || "No answer provided"}
Interview Mode: ${mode}

Evaluate on:
- Overall score (0-10): holistic quality
- Confidence (0-10): assertiveness, certainty in the answer
- Communication (0-10): clarity, structure, articulation
- Correctness (0-10): technical/factual accuracy

Provide brief, actionable feedback (2 sentences max). Be honest and constructive.
Return JSON.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(schema),
    },
  });
  return JSON.parse(response.text);
}

// ── 5. Session Report PDF (HireMind-AI) ─────────────────────────────────────
async function generateSessionReportPdf(session) {
  const { role, mode, answers, overallScore, confidence, communication, correctness, createdAt } = session;

  const scoreColor = (s) => s >= 8 ? "#10b981" : s >= 6 ? "#f59e0b" : "#ef4444";

  const answersHtml = answers.map((a, i) => `
    <div style="margin-bottom:18px;padding:16px;background:#f8fafc;border-radius:10px;border-left:4px solid ${scoreColor(a.score)};">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
        <span style="color:#64748b;font-size:12px;font-weight:600;">Question ${i + 1}</span>
        <span style="background:${scoreColor(a.score)};color:#fff;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:700;">${a.score}/10</span>
      </div>
      <p style="font-weight:600;color:#0f172a;margin:0 0 8px;font-size:14px;">${a.question}</p>
      <p style="color:#475569;font-size:13px;margin:0 0 10px;line-height:1.5;">${a.userAnswer || "No answer provided"}</p>
      <div style="background:#fff;border:1px solid #e2e8f0;border-radius:7px;padding:10px 12px;">
        <span style="color:#10b981;font-size:11px;font-weight:700;display:block;margin-bottom:3px;">AI Feedback</span>
        <span style="color:#475569;font-size:12px;">${a.feedback}</span>
      </div>
    </div>
  `).join("");

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #0f172a; background: #fff; }
  .header { background: linear-gradient(135deg, #0a0f1e 0%, #1a2444 100%); padding: 32px 40px; color: #fff; }
  .header h1 { font-size: 26px; font-weight: 800; margin-bottom: 4px; }
  .header h1 span { color: #10b981; }
  .header p { color: rgba(255,255,255,0.6); font-size: 13px; }
  .body { padding: 32px 40px; }
  .metrics { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin-bottom: 28px; }
  .metric { text-align: center; padding: 16px; border-radius: 10px; border: 1px solid #e2e8f0; }
  .metric .val { font-size: 28px; font-weight: 800; display: block; }
  .metric .lbl { font-size: 11px; color: #64748b; margin-top: 4px; display: block; }
  h2 { font-size: 16px; font-weight: 700; margin-bottom: 16px; color: #0f172a; border-bottom: 2px solid #10b981; padding-bottom: 8px; }
</style>
</head>
<body>
  <div class="header">
    <h1>HireMind <span>Interview Report</span></h1>
    <p>${role} · ${mode.toUpperCase()} Mode · ${new Date(createdAt).toLocaleDateString()}</p>
  </div>
  <div class="body">
    <div class="metrics">
      <div class="metric"><span class="val" style="color:${scoreColor(overallScore)};">${overallScore.toFixed(1)}</span><span class="lbl">Overall Score</span></div>
      <div class="metric"><span class="val" style="color:${scoreColor(confidence)};">${confidence.toFixed(1)}</span><span class="lbl">Confidence</span></div>
      <div class="metric"><span class="val" style="color:${scoreColor(communication)};">${communication.toFixed(1)}</span><span class="lbl">Communication</span></div>
      <div class="metric"><span class="val" style="color:${scoreColor(correctness)};">${correctness.toFixed(1)}</span><span class="lbl">Correctness</span></div>
    </div>
    <h2>Question Breakdown</h2>
    ${answersHtml}
  </div>
</body>
</html>`;

  return generatePdfFromHtml(html);
}

module.exports = {
  generateInterviewReport,
  generateResumePdf,
  generateInterviewQuestions,
  evaluateAnswer,
  generateSessionReportPdf,
};
