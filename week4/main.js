import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?url";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const form = document.getElementById("coverForm");
const submitBtn = document.getElementById("submitBtn");
const btnText = document.getElementById("btnText");
const btnLoader = document.getElementById("btnLoader");
const outputCard = document.getElementById("outputCard");
const letterBox = document.getElementById("letterBox");
const copyBtn = document.getElementById("copyBtn");
const copyIcon = document.getElementById("copyIcon");
const errorBanner = document.getElementById("errorBanner");
const uploadZone = document.getElementById("uploadZone");
const resumeFileInput = document.getElementById("resumeFile");
const uploadLabel = document.getElementById("uploadLabel");

uploadZone.addEventListener("click", () => resumeFileInput.click());

uploadZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadZone.classList.add("dragover");
});

uploadZone.addEventListener("dragleave", () => uploadZone.classList.remove("dragover"));

uploadZone.addEventListener("drop", (e) => {
  e.preventDefault();
  uploadZone.classList.remove("dragover");
  const file = e.dataTransfer.files[0];
  if (file && file.type === "application/pdf") {
    resumeFileInput.files = e.dataTransfer.files;
    setFileSelected(file.name);
  }
});

resumeFileInput.addEventListener("change", () => {
  if (resumeFileInput.files[0]) setFileSelected(resumeFileInput.files[0].name);
});

function setFileSelected(name) {
  uploadLabel.innerHTML = `<i data-lucide="check-circle"></i> <strong>${name}</strong> — <u>change</u>`;
  lucide.createIcons();
  uploadZone.classList.add("has-file");
}

// loop through each page and grab text content
async function extractPdfText(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item) => item.str).join(" ") + "\n";
  }
  return text;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideError();
  setLoading(true);

  const name = document.getElementById("name").value.trim();
  const role = document.getElementById("role").value.trim();
  const company = document.getElementById("company").value.trim();
  const skills = document.getElementById("skills").value.trim();
  const jobDescription = document.getElementById("jobDescription").value.trim();
  const file = resumeFileInput.files[0];

  try {
    let resumeText = "";
    if (file) {
      btnText.textContent = "Parsing Resume...";
      resumeText = await extractPdfText(file);
    }

    btnText.textContent = "Generating...";

    // use resume if uploaded, fall back to skills field
    const resumeSection = resumeText
      ? `\n\nCandidate's Resume:\n${resumeText}`
      : skills
      ? `\n\nCandidate's Key Skills: ${skills}`
      : "";

    const prompt = `You are an expert career coach and professional writer. Write a highly personalized, compelling cover letter for the following:

Candidate Name: ${name}
Applying For: ${role} at ${company}
Job Description: ${jobDescription}${resumeSection}

Requirements:
- Address it to "Hiring Manager" at ${company}
- Write 3-4 well-structured paragraphs (opening, relevant experience/skills, why this company, closing)
- Match the candidate's background to the specific job requirements
- Keep a professional yet personable tone
- End with a confident call to action
- Do NOT use placeholder brackets like [X years] — infer naturally from context
- Format with clear paragraph breaks (blank line between each paragraph)

Write only the cover letter body, starting with "Dear Hiring Manager at ${company},"`;

    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "Generation failed");
    const letter = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!letter) throw new Error("Empty response from Gemini");

    showLetter(letter);
  } catch (err) {
    showError(err.message);
  } finally {
    setLoading(false);
  }
});

function setLoading(on) {
  submitBtn.disabled = on;
  btnLoader.classList.toggle("hidden", !on);
  if (!on) btnText.textContent = "Generate Cover Letter";
}

function showLetter(text) {
  letterBox.textContent = text;
  outputCard.classList.remove("hidden");
  outputCard.scrollIntoView({ behavior: "smooth", block: "start" });
}

function showError(msg) {
  errorBanner.textContent = "⚠ " + msg;
  errorBanner.classList.remove("hidden");
}

function hideError() {
  errorBanner.classList.add("hidden");
}

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(letterBox.textContent);
    copyIcon.innerHTML = '<i data-lucide="check"></i>';
    lucide.createIcons();
    copyBtn.classList.add("copied");
    setTimeout(() => {
      copyIcon.innerHTML = '<i data-lucide="clipboard"></i>';
      lucide.createIcons();
      copyBtn.classList.remove("copied");
    }, 2000);
  } catch {
    showError("Clipboard access denied. Please copy manually.");
  }
});
