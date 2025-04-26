# Law Document AI Assistant

## Overview
Welcome to the "Law Document AI Assistant" project! This platform allows users to upload complex legal PDFs and interact with an AI to simplify, summarize, and extract key information from them. The goal is to make law documents easier to understand and work with, even for those without legal expertise. Users can create chats around their documents and interact with an AI assistant that leverages powerful language models to provide meaningful insights and explanations about legal content. The application also includes a subscription feature that gives users access to premium capabilities through a seamless payment process.

## Key Features
- **PDF Upload & Management**: Upload legal documents and organize them within your workspace
- **AI-Powered Chat**: Interact with an intelligent assistant that understands legal terminology
- **Document Simplification**: Receive plain-language explanations of complex legal concepts
- **Key Information Extraction**: Automatically identify critical clauses, dates, parties, and obligations
- **Document Summarization**: Get concise overviews of lengthy legal documents
- **Subscription System**: Access premium features through a user-friendly subscription model

## Technologies and Frameworks
- **Next.js**: React framework for building the web application
- **React**: Frontend library for building user interfaces
- **TypeScript**: Type-safe JavaScript for improved code quality
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Clerk**: Authentication and user management
- **Drizzle ORM**: Database toolkit for TypeScript
- **PostgreSQL**: Relational database for storing user and document data
- **AWS SDK**: File storage for uploaded documents
- **OpenAI API**: Powers the AI assistant's understanding of legal documents
- **Stripe**: Payment processing for subscription management
- **Axios**: HTTP client for API requests
- **Pinecone**: Vector database for semantic search
- **Neon Database Serverless**: PostgreSQL database service
- **@tanstack/react-query**: Data fetching and state management
- **clsx & tailwind-merge**: Utilities for conditional class names

## Installation

Follow these steps to set up the project locally:

### 1. Clone the repository
```bash
git clone https://github.com/YOUR-USERNAME/law-document-ai-assistant.git
cd law-document-ai-assistant
```

### 2. Install dependencies
Make sure you have Node.js version 13.4.19 or later installed, then run:
```bash
npm install
```

### 3. Set up environment variables
Create a `.env` file in the root directory with the following variables:
```
# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Database (Neon)
DATABASE_URL=

# OpenAI
OPENAI_API_KEY=

# AWS S3
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
NEXT_PUBLIC_S3_BUCKET_NAME=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# App URL
NEXT_PUBLIC_URL=http://localhost:3000
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. **Sign Up/Login**: Create an account or sign in using Clerk authentication
2. **Upload Documents**: Add your legal PDFs to your workspace
3. **Create Chats**: Start conversations about specific documents
4. **Ask Questions**: Interact with the AI to understand your legal documents better
5. **Subscribe**: Upgrade to access premium features like bulk document processing

## Project Structure

```
/
├── app/                    # Next.js app directory
│   ├── api/                # API routes
│   ├── (auth)/             # Authentication pages
│   ├── (dashboard)/        # User dashboard pages
│   └── (marketing)/        # Landing page and marketing content
├── components/             # Reusable UI components
├── lib/                    # Utility functions and configuration
│   ├── db/                 # Database configuration
│   └── pinecone/           # Vector database setup
├── public/                 # Static assets
└── styles/                 # Global styles
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

### Team Members
- [Abdullah Khan](https://github.com/abdkhan-git) - Project Lead
- [Brian Niski](https://github.com/niskb) - Developer
- [Magdaleno Perez](https://github.com/MaggPerez) - Developer
- [Shivansh Kumar](https://github.com/Shivy40) - Developer

- Thanks to all the open-source libraries that made this project possible
- Special thanks to the legal professionals who provided feedback during development

---

💼 Happy document processing! ⚖️
