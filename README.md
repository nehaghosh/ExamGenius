# ExamGenius
ExamGenius is an AI-powered quiz generator and tutor chatbot. It uses Google's Gemini 1.5 Pro API to create dynamic quizzes in Math, Science, and History, and includes an interactive chatbot for real-time explanations—perfect for learners and educators.
 
## 🌟 Features

- 🔢 **Quiz Generator**  
  Generate customized questions in:
  - **Math** (Algebra, Arithmetic, Geometry)
  - **Science** (Physics, Chemistry, Biology)
  - **History** (World, US, Ancient Civilizations)

- 🎯 **Difficulty Control**  
  Choose question difficulty: Easy, Medium, or Hard.

- 🤖 **AI Tutor Chatbot**  
  Ask questions about your quiz or general math concepts and receive clear explanations instantly.

- 🔄 **Fallback Logic**  
  In case of API failure, the app auto-generates questions locally.

- 💬 **Typing Animation**  
  The chatbot shows a smooth typing indicator for better user experience.

- 📱 **Responsive Design**  
  Mobile-friendly interface with clean navigation and smooth transitions.

- 📝 **Feedback Button**  
  A built-in button lets users share feedback, ideas, or report issues directly.

---

## 🛠️ Technologies Used

| Tech                          | Purpose                                   |
|-------------------------------|-------------------------------------------|
| **HTML5**                     | Structure of the app                      |
| **CSS3**                      | Styling and responsive layout             |
| **JavaScript (ES6)**          | App logic and interactivity               |
| **Google Gemini 1.5 Pro API** | AI-based question and response generation |

---

## 🧩 Core Functionalities

### 📘 Quiz Generation (`api-service.js`)
- Fetches questions from Gemini API.
- Accepts subject, difficulty, and count.
- Includes fallback logic for local generation.
- Validates and formats returned question sets.

### 💬 Chatbot Assistant (`chatbot.js`)
- Real-time AI tutor interaction.
- Maintains message context for continuity.
- Renders chatbot messages with UI styling.
- Shows new message notification when chat is closed.

### 🧪 Test Generator UI (`test-generator.js`)
- Renders questions with multiple-choice options.
- Tracks selected answers and reveals correct ones.
- Provides explanations after submission.

### 🔐 Authentication Placeholder (`auth.js`)
- Basic key management for Gemini API.
- Supports environment-based API key injection.

### 📂 Miscellaneous
- `main.js` handles app initialization.
- `styles.css` provides full styling and transitions.
- `index.html` ties everything together into a single-page app.
