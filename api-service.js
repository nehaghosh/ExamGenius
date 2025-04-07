class ApiService {
    constructor() {
        this.geminiKey = this.getApiKey();
        this.baseUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent`;
    }

    getApiKey() {
        return window.ENV?.GEMINI_API_KEY || "AIzaSyAshIOkFEB7YKL9n-e0MHdGnxOrE-r5_vw";
    }

    async generateQuestions(subject, count, difficulty) {
        const subjectPrompts = {
            math: `Generate ${count} ${difficulty}-difficulty math questions on:
                   - Arithmetic (+, -, ×, ÷)
                   - Algebra (basic equations)
                   - Geometry (area, perimeter)
                   Format: {question, options: [4], correctAnswer: 0-3, explanation}`,

            science: `Generate ${count} ${difficulty}-difficulty science questions on:
                     - Physics (basic laws)
                     - Chemistry (elements, reactions)
                     - Biology (cell structure)
                     Format: {question, options: [4], correctAnswer: 0-3, explanation}`,

            history: `Generate ${count} ${difficulty}-difficulty history questions on:
                     - World History (major events)
                     - US History (presidents, wars)
                     - Ancient Civilizations
                     Format: {question, options: [4], correctAnswer: 0-3, explanation}`
        };

        const prompt = {
            contents: [{
                parts: [{
                    text: `${subjectPrompts[subject]}\n\nEXAMPLE for ${subject}:
                           ${this.getExampleQuestion(subject)}\n
                           Return ONLY valid JSON array. No Markdown.`
                }]
            }],
            generationConfig: {
                responseMimeType: "application/json"
            }
        };

        try {
            const response = await fetch(`${this.baseUrl}?key=${this.geminiKey}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(prompt)
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!responseText) {
                throw new Error("Empty response from API");
            }

            // Improved JSON extraction
            const jsonStart = responseText.indexOf('[');
            const jsonEnd = responseText.lastIndexOf(']') + 1;
            const jsonString = responseText.slice(jsonStart, jsonEnd);

            const questions = JSON.parse(jsonString);

            if (!Array.isArray(questions) || questions.length !== count) {
                throw new Error("Invalid question format or count");
            }

            // Validate each question
            questions.forEach(q => {
                if (!q.question || !q.options || q.correctAnswer === undefined || !q.explanation) {
                    throw new Error("Missing required question fields");
                }
                if (q.options.length !== 4 || q.correctAnswer < 0 || q.correctAnswer > 3) {
                    throw new Error("Invalid options or correctAnswer");
                }
            });

            return questions;
        } catch (error) {
            console.error("AI Generation Error:", error);
            console.log("Falling back to local question generation");
            return this.generateFallbackQuestions(count);
        }
    }
    getExampleQuestion(subject) {
        const examples = {
            math: `{
              "question": "Solve for x: 2x + 5 = 15",
              "options": ["x = 5", "x = 10", "x = 7.5", "x = 2.5"],
              "correctAnswer": 0,
              "explanation": "Subtract 5 from both sides: 2x = 10. Divide by 2: x = 5"
            }`,

            science: `{
              "question": "What is the chemical symbol for Gold?",
              "options": ["Go", "Gd", "Au", "Ag"],
              "correctAnswer": 2,
              "explanation": "Gold's symbol is Au from Latin 'Aurum'"
            }`,

            history: `{
              "question": "When did World War II end?",
              "options": ["1943", "1945", "1950", "1939"],
              "correctAnswer": 1,
              "explanation": "WWII ended in 1945 with V-J Day"
            }`
        };
        return examples[subject] || examples.math;
    }
    generateFallbackQuestions(count) {
        const questions = [];
        const operations = [
            { op: "+", func: (a, b) => a + b },
            { op: "-", func: (a, b) => a - b },
            { op: "×", func: (a, b) => a * b },
            { op: "÷", func: (a, b) => Math.floor(a / b) }
        ];

        for (let i = 0; i < count; i++) {
            const a = Math.floor(Math.random() * 50) + 10;
            const b = Math.floor(Math.random() * 50) + 10;
            const operation = operations[Math.floor(Math.random() * operations.length)];

            const question = `What is ${a} ${operation.op} ${b}?`;
            const answer = operation.func(a, b);

            let options = new Set([answer]);
            while (options.size < 4) {
                options.add(answer + (Math.floor(Math.random() * 20) - 10));
            }

            options = [...options];
            options.sort(() => Math.random() - 0.5); // Shuffle

            questions.push({
                question,
                options,
                correctAnswer: options.indexOf(answer),
                explanation: `The correct answer is ${answer}. ${question.replace('?', '')} = ${answer}`
            });
        }
        return questions;
    }

    async chatWithTutor(message, context = []) {
        const chatHistory = context.map(msg => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }]
        }));

        chatHistory.unshift({
            role: "user",
            parts: [{ text: "You are a helpful math tutor. Provide clear, concise explanations for math concepts and problems." }]
        });

        chatHistory.push({
            role: "user",
            parts: [{ text: message }]
        });

        try {
            const response = await fetch(`${this.baseUrl}?key=${this.geminiKey}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: chatHistory })
            });

            if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);

            const data = await response.json();
            return data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't fetch a response.";
        } catch (error) {
            console.error("Chat error:", error);
            return "I'm sorry, I'm having trouble connecting to the tutor service. Please try again later.";
        }
    }
}

const API_SERVICE = new ApiService();
