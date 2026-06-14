# MindCare 🧠💙

MindCare is a web-based **Voice User Interface (VUI)** application developed as part of the **Speech Interface (SWST 44042)** module at the **Faculty of Computing and Technology, University of Kelaniya**.

The application is designed to provide accessible mental health and wellbeing support for young adults by offering a simple conversational interface together with practical self-help resources. Users can interact with the system through voice or text without creating an account.

---

## ✨ Features

- 🎙️ Voice-based interaction using Speech-to-Text (STT) and Text-to-Speech (TTS)
- 💬 Rule-based conversational assistant
- 😊 Mood tracking and daily emotional check-ins
- 🫁 Guided breathing and relaxation exercises
- 😴 Sleep hygiene tips and guided sleep support
- 📚 Psychoeducation resources related to common mental health conditions
- 🚨 Emergency help section with useful contact information
- 🤖 Interactive 3D virtual assistant
- 🔒 No login required (mood history is stored locally using browser cache)

---

## 🏗️ System Overview

The user first enters the **Voice Hub**, where they can interact with the 3D virtual assistant using voice, typing, or on-screen buttons.

The application processes user input through a simple rule-based dialogue engine and keyword-based emotion detection mechanism. Depending on the user's request or emotional state, the system provides appropriate guidance, wellbeing resources, or emergency support information.

### Main Modules
- Voice Hub
- Mood Tracker
- Relaxation & Breathing Exercises
- Sleep Guidance
- Learn (Psychoeducation)
- Emergency Help

---

## ⚙️ Technology Stack

### Frontend
- React
- TypeScript
- HTML5
- CSS3
- Vite
- Tailwind CSS
- Framer Motion
- Three.js

### Backend
- Node.js
- Express.js
- TypeScript

### Database
- SQLite

### Other Technologies
- Speech-to-Text (STT)
- Text-to-Speech (TTS)
- Browser Cache Storage

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- Node.js (v18 or later recommended)
- npm (comes with Node.js)
- Git

### Clone the Repository

```bash
git clone https://github.com/Dulara07/MindCare_Webapp.git
cd MindCare_Webapp
```

### Install Dependencies

#### Frontend

```bash
cd Frontend
npm install
```

#### Backend

```bash
cd ../Backend
npm install
```

### Run the Application

Start the backend server:

```bash
cd Backend
npm run dev
```

Open another terminal and start the frontend:

```bash
cd Frontend
npm run dev
```

The application will be available at:

```
http://localhost:5173
```

*(If your project uses different folder names or startup commands, update the commands above accordingly.)*

---

## 📂 Project Structure

```text
MindCare_Webapp/
│
├── Frontend/          # React + Vite frontend
├── Backend/           # Node.js + Express backend
├── assets/            # Images and media resources
├── README.md
└── ...
```

---

## 🧩 How It Works

1. User enters the Voice Hub.
2. Voice or text input is provided.
3. Speech input is converted to text (STT).
4. The rule-based dialogue engine processes the request.
5. Keyword-based emotion detection identifies emotional cues.
6. The system retrieves the appropriate response or wellbeing resource.
7. The response is converted back to speech (TTS) and displayed to the user.

---

## 👥 Team Members

| Name | Student ID | Main Contribution |
|------|------------|------------------|
| Udayanga W.P.I. | CT/2020/007 | Frontend development & 3D model integration |
| Kumara G.T.S. | CT/2020/015 | Diagrams, database design & documentation |
| Adithya E.D.T.V. | CT/2020/018 | Backend development |
| Balahewa T.D.N. | CT/2020/038 | Testing and evaluation |
| Weerathunga B.B.R.D.L. | CT/2020/049 | Frontend development |

---

## 🎯 Academic Information

- **Module:** Speech Interface
- **Module Code:** SWST 44042
- **Assignment:** Voice User Interface (VUI) for Mental Health & Wellbeing Support
- **Faculty:** Faculty of Computing and Technology
- **Department:** Software Engineering
- **University:** University of Kelaniya

---

## ⚠️ Disclaimer

MindCare is developed as an academic project and is intended to provide general wellbeing guidance and educational resources only. It is **not a substitute for professional medical advice, diagnosis, or treatment**. If a user is experiencing a mental health crisis, they should immediately contact a qualified healthcare professional or an appropriate emergency support service.

---

## 📄 License

This project was developed for educational purposes as part of the SWST 44042 Speech Interface module.
