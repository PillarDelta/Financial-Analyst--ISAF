# Installation Guide for Strategic Analyst Platform

This guide will walk you through setting up and running the Strategic Analyst Platform on your local machine.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js**: v18.x or higher (recommended)
- **npm**: v7.x or higher (comes with Node.js)
- **Git**: For cloning the repository

## Steps to Install

### 1. Clone the Repository

```bash
git clone https://github.com/PillarDelta/startegic_analyst.git
cd startegic_analyst
```

### 2. Install Dependencies

```bash
npm install
```

This will install all the required dependencies listed in the `package.json` file, including:
- Next.js
- React
- OpenAI SDK
- LangChain
- PDF.js for PDF processing
- Mammoth for Word document processing
- XLSX for spreadsheet processing
- TailwindCSS for styling

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# OpenAI API Key (Required)
OPENAI_API_KEY=your-openai-api-key-here

# Optional Configuration
# NODE_ENV=development
# NEXT_PUBLIC_API_URL=http://localhost:3000
```

**Important**: You must have a valid OpenAI API key to use the chat functionality. The API key must start with `sk-`.

### 4. Development Server

To start the development server with hot reloading:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### 5. Building for Production

To create an optimized production build:

```bash
npm run build
```

To start the production server:

```bash
npm run start
```

## Core Features

The Strategic Analyst Platform includes:

- **Chat Interface**: Advanced financial analysis through natural language interaction
- **Document Analysis**: Upload PDFs, Word documents, Excel files, and images for analysis
- **ISAF Analysis**: Integrated Strategic Analysis Framework for comprehensive business strategy evaluation
- **Visualization**: Data visualization for financial metrics and analysis results

## Troubleshooting

### API Key Issues

If you encounter errors about invalid API keys:
1. Verify your OpenAI API key is correct and active
2. Ensure the key is properly set in the `.env.local` file
3. Restart the development server after making changes

### NPM Installation Errors

If you encounter errors during `npm install`:
1. Try clearing the npm cache: `npm cache clean --force`
2. Ensure you're using a compatible Node.js version
3. Delete `node_modules` folder and `package-lock.json`, then run `npm install` again

### PDF Processing Issues

If document processing isn't working:
1. Ensure the document isn't password-protected
2. Check that the file format is supported
3. For large files, try reducing the file size

## Additional Configuration

### Customizing the Analysis Types

Analysis types are defined in the `src/contexts/ChatContext.tsx` file. You can modify the `AnalysisType` type to add or remove analysis options.

### Changing the UI Theme

The application supports light and dark themes. Theme definitions are located in the CSS variables in `src/app/globals.css`.

## Support

For support or questions about installation, please contact [info@pillardelta.com]. 