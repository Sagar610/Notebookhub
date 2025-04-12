# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```


# Notebookhub

A modern web application for sharing and managing handwritten notes in PDF format. This platform allows users to upload, view, and download handwritten notes while providing admin functionality for content moderation.

## Features

- 📚 Upload and share handwritten notes in PDF format
- 🔍 Browse and search through available notes
- 📊 Track views and downloads for each note
- 🔒 Admin panel for content moderation
- 📱 Responsive design for all devices
- 🔐 Secure authentication system
- 📈 Analytics tracking for note popularity

## Tech Stack

### Frontend
- React with TypeScript
- Material-UI for modern UI components
- React Router for navigation
- React Helmet for SEO optimization
- PDF.js for PDF rendering

### Backend
- Node.js with Express
- MongoDB for database
- JWT for authentication
- Multer for file uploads
- CORS for cross-origin requests

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Sagar610/Notebookhub.git
cd Notebookhub
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd backend
npm install
```

4. Create a `.env` file in the root directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3001
```

5. Create a `.env` file in the backend directory with the same variables.

### Running the Application

1. Start the backend server:
```bash
cd backend
npm start
```

2. Start the frontend development server:
```bash
cd ..
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
Notebookhub/
├── src/                    # Frontend source code
│   ├── components/         # Reusable components
│   ├── pages/             # Page components
│   ├── services/          # API services
│   ├── context/           # React context
│   └── App.tsx            # Main application component
├── backend/               # Backend source code
│   ├── server.ts          # Express server
│   └── uploads/           # PDF storage
└── public/                # Static assets
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Sagar Gondaliya - [GitHub](https://github.com/Sagar610)

Project Link: [https://github.com/Sagar610/Notebookhub](https://github.com/Sagar610/Notebookhub)
# Notebookhub
# Notebookhub
# Notebookhub
