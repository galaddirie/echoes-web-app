# Echos Webapp Prototype

This project is a Yarn-based Vite application. 

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 12 or higher)
- [Yarn](https://yarnpkg.com/)

### Installation

Follow these steps to set up your development environment:

1. **Clone the Repository**

   ```bash
   git clone https://github.com/galaddirie/echoes-web-app.git
   cd  echoes-web-app
   ```

2. **Install Dependencies**

   ```bash
   yarn install
   ```

3. **Start the Development Server**

   ```bash
   yarn dev
   ```

   The development server should now be running at [http://localhost:5173](http://localhost:5173).


To test AI integration, you will need a valid API key for the follwoing services:
[OpenAI API](https://beta.openai.com/). 
[ElevenLabs API](https://elevenlabs.io/).


Once you have an API key, create a file named `.env` in the root directory of the project and add the following line to it:

```bash
OPENAI_API_KEY=<your-api-key>
OPENAI_ORG_ID=<your-org-id>
ELEVENLABS_API_KEY=<your-api-key>
```

   
