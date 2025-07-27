# HealthWise AI 


HealthWise AI is your personal, intelligent medical assistant chatbot. Designed for clarity and ease of use, it provides instant, structured information on a wide range of health topics, from daily habits for well-being to understanding medical readings. Built with React and powered by the cutting-edge Google Gemini API, HealthWise AI aims to be a helpful resource for basic health inquiries.

---

## ✨ Features

* **Intelligent Medical Assistant:** Get clear, concise, and professionally formatted answers to your health-related questions.
* **Structured Responses:** Responses are formatted with **bold titles** for headings and bullet points (•) for lists, ensuring easy readability.
* **Quick Suggestions:** Pre-defined suggestions for common health topics allow for quick access to information.
* **Dark Mode Support:** A sleek dark mode option for comfortable viewing in different lighting conditions.
* **Copy to Clipboard:** Easily copy bot responses with a dedicated button for convenient sharing or note-taking.
* **Responsive Design:** Optimized for a smooth experience across various devices.
* **Typing Indicator:** A "Typing..." indicator provides a better user experience during AI response generation.

---

## 🚀 Live Demo

Experience HealthWise AI live in action!

➡️ [**Launch HealthWise AI Demo**](https://ssword-generator18.vercel.app/)

---

## 💻 Technologies Used

* **React.js:** For building the dynamic and interactive user interface.
* **Tailwind CSS:** For rapid and efficient styling, providing a modern and clean look.
* **Lucide React Icons:** For crisp and scalable SVG icons.
* **Google Gemini API:** The powerful backend providing intelligent responses to medical queries.

---

## ⚙️ Setup and Installation

To get HealthWise AI up and running on your local machine, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/YourGitHubUsername/HealthWise-AI.git](https://github.com/YourGitHubUsername/HealthWise-AI.git)
    cd HealthWise-AI
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Get your Google Gemini API Key:**
    * Go to the [Google AI Studio](https://aistudio.google.com/app/apikey) and create a new API key.
    * **Important:** For production environments, it is highly recommended to use environment variables or a backend proxy to handle your API key securely. **Never expose your API key directly in client-side code in a production application.**

4.  **Configure API Key:**
    * Open the `src/Chatbot.js` file.
    * Locate the `API_KEY` constant and replace `"AIzaSyBWkDcaP0O0D6NfTzFhYe9FVEsMGEtRvPc"` with your actual Gemini API key:
        ```javascript
        const API_KEY = "YOUR_GEMINI_API_KEY"; // <--- Replace this
        ```

5.  **Start the development server:**
    ```bash
    npm start
    # or
    yarn start
    ```

    The application will open in your browser at `http://localhost:3000`.

---

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements, new features, or bug fixes, please feel free to:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add new feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
