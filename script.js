document.addEventListener('DOMContentLoaded', () => {
    const quizForm = document.getElementById('quizForm');
    const quizContainer = document.getElementById('quizContainer');
    const quizContent = document.getElementById('quizContent');
    const loadingSpinner = document.getElementById('loadingSpinner');

    quizForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form values
        const topic = document.getElementById('topic').value;
        const numberOfQuestions = document.getElementById('questionCount').value;

        // Show loading spinner
        loadingSpinner.classList.remove('hidden');
        quizContainer.classList.add('hidden');

        try {
            // Send request to server
            const response = await fetch('/api/generate-quiz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    topic,
                    numberOfQuestions: parseInt(numberOfQuestions)
                })
            });

            const data = await response.json();

            if (data.success) {
                // Display the quiz
                quizContent.textContent = data.quiz;
                quizContainer.classList.remove('hidden');
            } else {
                alert('Failed to generate quiz. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        } finally {
            // Hide loading spinner
            loadingSpinner.classList.add('hidden');
        }
    });
});
