# 🚀 RepoMentor — Your AI Project Mentor

RepoMentor is an AI-powered project analysis and interview preparation platform designed to help developers, especially freshers, understand their GitHub projects and prepare for technical interviews.

Simply provide a GitHub repository URL, and RepoMentor analyzes the project structure, source code, technologies, architecture, project flow, and important files. It then generates an interview-friendly project explanation, questions, follow-up questions, and an AI-powered mock interview.

---

## 🎯 Problem Statement

Many students and freshers build projects but struggle to:

- Understand the complete flow of their project
- Explain their project confidently in interviews
- Remember the purpose of different files and folders
- Answer project-specific technical questions
- Handle follow-up questions from interviewers
- Practice explaining their project verbally

RepoMentor addresses these problems by turning a GitHub repository into an interactive project mentor.

---

## 💡 Solution

RepoMentor analyzes a GitHub repository and provides:

- Project overview
- Repository structure
- Technology stack
- Libraries and dependencies
- Architecture detection
- Project flow
- Real code-flow analysis
- Important source files
- AI-generated project explanation
- One-minute project explanation
- Project-specific interview questions
- Follow-up questions
- AI Project Assistant
- AI Mock Interview
- Answer evaluation and feedback
- Speech-to-text interview practice

---

## ✨ Features

### 🔍 GitHub Repository Analysis

Paste a public GitHub repository URL and RepoMentor analyzes the repository.

It retrieves:

- Repository metadata
- Files and folders
- Important project files
- Source code
- Project structure

---

### 🧠 AI Project Explanation

RepoMentor uses AI to generate an easy-to-understand explanation of the analyzed project.

It provides:

- Project overview
- Problem statement
- Solution
- Technology stack
- Architecture
- Project flow
- Important files
- One-minute project explanation

The explanations are designed to be simple and suitable for fresher-level interviews.

---

### 💬 AI Project Assistant

Users can ask questions about their analyzed project.

For example:

> How does authentication work in this project?

> What is the role of this controller?

> Explain the project flow.

> Which technologies are used in this project?

The assistant answers using the analyzed repository context.

---

### 🎤 AI Mock Interview

RepoMentor provides a project-based mock interview experience.

The system can:

1. Generate a project-specific interview question
2. Allow the candidate to answer
3. Evaluate the answer
4. Provide a score
5. Show what was explained correctly
6. Suggest improvements
7. Generate a better sample answer
8. Ask a follow-up question

---

### 🎙️ Speaking Mode

RepoMentor also supports voice-based interview practice.

Features include:

- Speech-to-text
- Microphone support
- Speaking timer
- Live listening indicator
- Editable transcript
- Interview answer submission
- Microphone error handling

This helps users practice speaking naturally instead of only typing answers.

---

## 🏗️ System Architecture

```text
                     USER
                       │
                       ▼
              ┌─────────────────┐
              │   React + Vite  │
              │    Frontend     │
              └────────┬────────┘
                       │
                       │ API Requests
                       ▼
              ┌─────────────────┐
              │ Node + Express  │
              │     Backend     │
              └───────┬─────────┘
                      │
          ┌───────────┼────────────┐
          │           │            │
          ▼           ▼            ▼
     GitHub API    Gemini AI    MongoDB
          │           │            │
          ▼           ▼            ▼
   Repository     AI Analysis    Database
    Analysis     & Interview
