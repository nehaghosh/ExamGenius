document.addEventListener('DOMContentLoaded', () => {
    let currentSubject = '';
    let testQuestions = [];
    let userAnswers = [];
    let testStartTime = null;
    let timerInterval = null;
    let timeLimit = 30;
    let testEndTime = null;
    
    // Subject selection
    document.querySelectorAll('.subject-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentSubject = btn.getAttribute('data-subject');
            document.getElementById('subject-selection').classList.add('hidden');
            document.getElementById('test-config').classList.remove('hidden');
            
            // Update subject display with formatted name
            document.getElementById('selected-subject').textContent = formatSubjectName(currentSubject);
            
            // Update subject icon
            updateSubjectIcon(currentSubject);
        });
    });
    
    // Helper function to format subject name
    function formatSubjectName(subject) {
        const subjectNames = {
            math: "Mathematics",
            science: "Science",
            history: "History"
        };
        return subjectNames[subject] || subject;
    }
    
    // Helper function to update subject icon
    function updateSubjectIcon(subject) {
        const iconContainer = document.getElementById('subject-icon');
        iconContainer.innerHTML = '';
        iconContainer.className = 'w-6 h-6 rounded-full flex items-center justify-center';
        
        // Set different colors and icons for each subject
        let iconClass = '';
        let iconPath = '';
        
        if (subject === 'math') {
            iconContainer.classList.add('bg-blue-100');
            iconClass = 'text-blue-600';
            iconPath = 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z';
        } else if (subject === 'science') {
            iconContainer.classList.add('bg-green-100');
            iconClass = 'text-green-600';
            iconPath = 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z';
        } else {
            iconContainer.classList.add('bg-yellow-100');
            iconClass = 'text-yellow-600';
            iconPath = 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z';
        }
        
        const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        icon.setAttribute('class', `h-4 w-4 ${iconClass}`);
        icon.setAttribute('fill', 'none');
        icon.setAttribute('viewBox', '0 0 24 24');
        icon.setAttribute('stroke', 'currentColor');
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('d', iconPath);
        icon.appendChild(path);
        iconContainer.appendChild(icon);
    }
    
    // Question count selection
    document.querySelectorAll('.count-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.count-btn').forEach(b => {
                b.classList.remove('bg-blue-100', 'border-blue-500');
            });
            btn.classList.add('bg-blue-100', 'border-blue-500');
        });
    });
    
    // Difficulty selection
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.difficulty-btn').forEach(b => {
                b.classList.remove('bg-green-100', 'border-green-500');
            });
            btn.classList.add('bg-green-100', 'border-green-500');
        });
    });
    
    // Time limit adjustment
    document.getElementById('increase-time').addEventListener('click', () => {
        const timeInput = document.getElementById('time-limit');
        let value = parseInt(timeInput.value);
        if (value < 120) {
            timeInput.value = value + 5;
        }
    });
    
    document.getElementById('decrease-time').addEventListener('click', () => {
        const timeInput = document.getElementById('time-limit');
        let value = parseInt(timeInput.value);
        if (value > 5) {
            timeInput.value = value - 5;
        }
    });
    
    document.getElementById('time-limit').addEventListener('change', () => {
        let value = parseInt(document.getElementById('time-limit').value);
        if (value < 5) value = 5;
        if (value > 120) value = 120;
        document.getElementById('time-limit').value = value;
    });
    
    // Generate test
    document.getElementById('generate-test').addEventListener('click', async () => {
        const generateBtn = document.getElementById('generate-test');
        const generateText = document.getElementById('generate-btn-text');
        const generateSpinner = document.getElementById('generate-spinner');
        
        // Show loading state
        generateText.textContent = 'Generating...';
        generateSpinner.classList.remove('hidden');
        generateBtn.disabled = true;
        
        const questionCount = parseInt(document.querySelector('.count-btn.bg-blue-100').getAttribute('data-count'));
        const difficulty = document.querySelector('.difficulty-btn.bg-green-100').getAttribute('data-difficulty');
        timeLimit = parseInt(document.getElementById('time-limit').value);
        
        try {
            // Generate questions using AI
            testQuestions = await API_SERVICE.generateQuestions(currentSubject, questionCount, difficulty);
            userAnswers = new Array(questionCount).fill(null);
            
            // Display test
            displayTest(testQuestions);
            document.getElementById('test-config').classList.add('hidden');
            document.getElementById('test-interface').classList.remove('hidden');
            
            // Update test title with subject
            document.getElementById('test-title').textContent = `${formatSubjectName(currentSubject)} Test`;
            
            // Update difficulty badge
            const difficultyBadge = document.getElementById('test-difficulty');
            difficultyBadge.textContent = capitalizeFirstLetter(difficulty);
            difficultyBadge.className = 'text-sm px-2 py-0.5 rounded-full';
            
            if (difficulty === 'easy') {
                difficultyBadge.classList.add('bg-green-100', 'text-green-800');
            } else if (difficulty === 'medium') {
                difficultyBadge.classList.add('bg-yellow-100', 'text-yellow-800');
            } else {
                difficultyBadge.classList.add('bg-red-100', 'text-red-800');
            }
            
            // Update question counter
            document.getElementById('question-counter').textContent = `${questionCount} questions`;
            
            // Start timer
            testStartTime = new Date();
            testEndTime = new Date(testStartTime.getTime() + timeLimit * 60000);
            updateTimer();
            timerInterval = setInterval(updateTimer, 1000);
            
        } catch (error) {
            console.error('Error generating test:', error);
            alert('Failed to generate test. Please try again.');
        } finally {
            // Reset button state
            generateText.textContent = 'Generate Test';
            generateSpinner.classList.add('hidden');
            generateBtn.disabled = false;
        }
    });
    
    // Submit test
    document.getElementById('submit-test').addEventListener('click', () => {
        // Stop timer
        clearInterval(timerInterval);
        
        // Calculate score
        const score = calculateScore(testQuestions, userAnswers);
        
        // Show results
        showResults(score, testQuestions, userAnswers);
        document.getElementById('test-interface').classList.add('hidden');
        document.getElementById('results-section').classList.remove('hidden');
    });
    
    // New test button
    document.getElementById('new-test-btn').addEventListener('click', () => {
        document.getElementById('results-section').classList.add('hidden');
        document.getElementById('subject-selection').classList.remove('hidden');
    });
    
    function updateTimer() {
        const now = new Date();
        const elapsed = Math.floor((now - testStartTime) / 1000);
        const remaining = Math.max(0, Math.floor((testEndTime - now) / 1000));
        
        // Update timer display
        const minutes = Math.floor(remaining / 60).toString().padStart(2, '0');
        const seconds = (remaining % 60).toString().padStart(2, '0');
        document.getElementById('test-timer').innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="font-medium">${minutes}:${seconds}</span>
        `;
        
        // Change color when time is running low
        if (remaining < 300) { // 5 minutes
            document.getElementById('test-timer').classList.add('bg-red-100', 'border-red-300', 'text-red-600');
            document.getElementById('test-timer').classList.remove('bg-white', 'border-gray-300');
            
            // Blink when less than 1 minute
            if (remaining < 60) {
                document.getElementById('test-timer').classList.toggle('bg-red-200');
            }
        }
        
        // Auto-submit when time is up
        if (remaining <= 0) {
            clearInterval(timerInterval);
            document.getElementById('submit-test').click();
        }
    }
    
    function displayTest(questions) {
        const container = document.getElementById('test-questions');
        container.innerHTML = '';
        
        questions.forEach((question, index) => {
            const questionElement = document.createElement('div');
            questionElement.className = 'py-4';
            
            questionElement.innerHTML = `
                <div class="flex items-start mb-3">
                    <span class="bg-blue-100 text-blue-800 font-medium rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">${index + 1}</span>
                    <h3 class="font-medium text-gray-800">${question.question}</h3>
                </div>
                <div class="space-y-2 ml-9">
                    ${question.options.map((option, i) => `
                        <label class="flex items-center space-x-3 p-2 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer">
                            <input type="radio" name="q${index}" value="${i}" class="form-radio h-4 w-4 text-blue-600">
                            <span>${option}</span>
                        </label>
                    `).join('')}
                </div>
            `;
            
            // Add event listener to track answers
            const radioInputs = questionElement.querySelectorAll('input[type="radio"]');
            radioInputs.forEach(input => {
                input.addEventListener('change', () => {
                    userAnswers[index] = parseInt(input.value);
                    
                    // Highlight selected option
                    const allOptions = questionElement.querySelectorAll('label');
                    allOptions.forEach(opt => opt.classList.remove('border-blue-400', 'bg-blue-100'));
                    input.closest('label').classList.add('border-blue-400', 'bg-blue-100');
                });
            });
            
            container.appendChild(questionElement);
        });
    }
    
    function calculateScore(questions, answers) {
        let correct = 0;
        questions.forEach((question, index) => {
            if (answers[index] === question.correctAnswer) {
                correct++;
            }
        });
        return (correct / questions.length) * 100;
    }
    
    function showResults(score, questions, answers) {
        // Calculate time taken
        const timeTaken = Math.floor((new Date() - testStartTime) / 1000);
        const minutes = Math.floor(timeTaken / 60);
        const seconds = timeTaken % 60;
        
        // Update score display
        const roundedScore = Math.round(score);
        document.getElementById('test-score').textContent = `${roundedScore}%`;
        document.getElementById('score-bar').style.width = `${roundedScore}%`;
        
        // Update counts
        const correctCount = questions.reduce((count, q, i) => 
            answers[i] === q.correctAnswer ? count + 1 : count, 0);
        const incorrectCount = questions.length - correctCount;
        
        document.getElementById('correct-count').textContent = correctCount;
        document.getElementById('incorrect-count').textContent = incorrectCount;
        document.getElementById('time-taken').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Add feedback
        const feedback = document.getElementById('test-feedback');
        feedback.innerHTML = '';
        
        let feedbackText = '';
        if (score >= 90) {
            feedbackText = 'Outstanding performance! You have mastered this material.';
        } else if (score >= 75) {
            feedbackText = 'Great job! You have a strong understanding of this subject.';
        } else if (score >= 60) {
            feedbackText = 'Good effort! Review the questions you missed to improve.';
        } else if (score >= 40) {
            feedbackText = 'Keep practicing! Focus on the areas where you struggled.';
        } else {
            feedbackText = 'More study is needed. Review the material thoroughly before trying again.';
        }
        
        const feedbackElement = document.createElement('div');
        feedbackElement.className = 'p-3 bg-blue-50 rounded-lg border border-blue-100';
        feedbackElement.innerHTML = `
            <div class="font-medium text-blue-800 mb-1">${feedbackText}</div>
            <div class="text-sm text-blue-700">${getStudyTips(currentSubject)}</div>
        `;
        
        feedback.appendChild(feedbackElement);
        
        // Show question review
        const reviewContainer = document.getElementById('question-review');
        reviewContainer.innerHTML = '<h3 class="font-bold text-gray-800 mb-4">Question Review</h3>';
        
        questions.forEach((question, index) => {
            const isCorrect = answers[index] === question.correctAnswer;
            const reviewItem = document.createElement('div');
            reviewItem.className = `mb-4 p-4 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`;
            
            reviewItem.innerHTML = `
                <div class="flex justify-between items-start mb-2">
                    <div class="flex items-center">
                        <span class="mr-2 font-medium">Question ${index + 1}:</span>
                        <span class="${isCorrect ? 'text-green-600' : 'text-red-600'} font-medium">
                            ${isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                    </div>
                    ${!isCorrect ? `<span class="text-xs bg-white px-2 py-1 rounded-full border border-gray-200">
                        +${Math.floor(100 / questions.length)} points if correct
                    </span>` : ''}
                </div>
                <p class="mb-3 font-medium">${question.question}</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                        <div class="text-xs text-gray-500 mb-1">Your answer</div>
                        <div class="p-2 rounded bg-white border ${isCorrect ? 'border-green-200' : 'border-red-200'}">
                            ${answers[index] !== null ? question.options[answers[index]] : 'Not answered'}
                        </div>
                    </div>
                    <div>
                        <div class="text-xs text-gray-500 mb-1">Correct answer</div>
                        <div class="p-2 rounded bg-white border border-green-200">
                            ${question.options[question.correctAnswer]}
                        </div>
                    </div>
                </div>
                <div class="mt-2">
                    <div class="text-xs text-gray-500 mb-1">Explanation</div>
                    <div class="p-3 bg-gray-50 rounded text-sm">
                        ${question.explanation || 'No explanation provided.'}
                    </div>
                </div>
            `;
            
            reviewContainer.appendChild(reviewItem);
        });
    }
    
    function getStudyTips(subject) {
        const tips = {
            math: [
                "Practice daily with varied problems",
                "Focus on understanding concepts rather than memorization",
                "Review your mistakes to identify patterns",
                "Use visual aids for complex concepts"
            ],
            science: [
                "Create concept maps to connect ideas",
                "Focus on fundamental principles first",
                "Relate concepts to real-world examples",
                "Practice with diagrams and visual representations"
            ],
            history: [
                "Create timelines to visualize events",
                "Focus on cause-and-effect relationships",
                "Connect events to broader historical themes",
                "Use mnemonic devices to remember key dates"
            ]
        };
        
        const subjectTips = tips[subject] || tips.math;
        return subjectTips[Math.floor(Math.random() * subjectTips.length)];
    }
    
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
});