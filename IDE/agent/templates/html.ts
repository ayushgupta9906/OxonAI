// HTML/CSS/JS Starter Template
module.exports = {
    name: 'HTML/CSS/JS Starter',
    description: 'Simple HTML, CSS, and JavaScript project',
    icon: '🌐',
    language: 'javascript',

    files: {
        'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Website</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>Welcome to My Website</h1>
            <p>A simple HTML, CSS, and JavaScript starter</p>
        </header>

        <main>
            <section class="card">
                <h2>Counter Demo</h2>
                <div class="counter">
                    <button id="decrementBtn">-</button>
                    <span id="count">0</span>
                    <button id="incrementBtn">+</button>
                </div>
            </section>

            <section class="card">
                <h2>About</h2>
                <p>
                    This is a starter template with HTML, CSS, and vanilla JavaScript.
                    Edit the files to build your own website!
                </p>
            </section>
        </main>

        <footer>
            <p>&copy; 2024 My Website. Built with ❤️</p>
        </footer>
    </div>

    <script src="script.js"></script>
</body>
</html>`,

        'styles.css': `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

.container {
    max-width: 800px;
    width: 100%;
    background: white;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    overflow: hidden;
}

header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 60px 40px;
    text-align: center;
}

header h1 {
    font-size: 2.5em;
    margin-bottom: 10px;
}

header p {
    font-size: 1.1em;
    opacity: 0.9;
}

main {
    padding: 40px;
}

.card {
    background: #f8f9fa;
    border-radius: 10px;
    padding: 30px;
    margin-bottom: 20px;
}

.card h2 {
    margin-bottom: 15px;
    color: #764ba2;
}

.counter {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
}

button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 15px 30px;
    font-size: 1.5em;
    border-radius: 10px;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
}

button:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
}

button:active {
    transform: translateY(0);
}

#count {
    font-size: 3em;
    font-weight: bold;
    color: #764ba2;
    min-width: 100px;
    text-align: center;
}

footer {
    background: #f8f9fa;
    text-align: center;
    padding: 20px;
    color: #666;
}`,

        'script.js': `// Counter functionality
let count = 0;

const countElement = document.getElementById('count');
const incrementBtn = document.getElementById('incrementBtn');
const decrementBtn = document.getElementById('decrementBtn');

function updateDisplay() {
    countElement.textContent = count;
    
    // Add animation
    countElement.style.transform = 'scale(1.2)';
    setTimeout(() => {
        countElement.style.transform = 'scale(1)';
    }, 200);
}

incrementBtn.addEventListener('click', () => {
    count++;
    updateDisplay();
});

decrementBtn.addEventListener('click', () => {
    count--;
    updateDisplay();
});

// Add smooth transition
countElement.style.transition = 'transform 0.2s ease';

console.log('🚀 Website loaded successfully!');`,

        'README.md': `# HTML/CSS/JS Starter

A simple starter template with HTML, CSS, and vanilla JavaScript.

## Features

- Modern, responsive design
- Gradient background
- Interactive counter demo
- Clean, semantic HTML
- Smooth animations

## Getting Started

Simply open \`index.html\` in your browser!

Or use a local server:

\`\`\`bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve
\`\`\`

Then visit \`http://localhost:8000\``
    }
};
