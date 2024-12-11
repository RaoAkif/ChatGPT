# BotFusion

> BotFusion is a powerful solution designed to provide well-structured, Markdown-formatted answers to user queries. It integrates content scraping, mitigation of hallucinations through citation of sources, and rate-limiting for enhanced scalability and user experience.

![BotFusion](https://github.com/user-attachments/assets/8c57a3f9-7f7e-4ada-a396-6efdd6b97939)


## Built With

- **Node.js**, **Next.js**  
- **Puppeteer**, **Cheerio**  
- **Upstash Redis**  
- **Groq API**  
- **OpenAI API**  

## Live Demo

[Live Site](https://bot-fusion.vercel.app/)

## Getting Started

To get a local copy of BotFusion up and running, follow these steps:

### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/raoakif/botfusion.git
   ```

2. Navigate to the project directory:
   ```bash
   cd botfusion
   ```

3. Install the required dependencies:
   ```bash
   npm install
   ```

4. Configure environment variables:
   Create a `.env` file and add the following credentials:
   ```env
   GROQ_API_KEY=""
   UPSTASH_REDIS_REST_URL=""
   UPSTASH_REDIS_REST_TOKEN=""
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Visit [http://localhost:3000](http://localhost:3000) in your browser to access the application.

### Deployment
(Optional) You can deploy this project to platforms such as Netlify, Vercel, or others.

## Authors

👤 **Rao Akif**

- GitHub: [@raoakif](https://github.com/raoakif)
- Twitter: [@raoakif](https://twitter.com/raoakif)
- LinkedIn: [RaoAkif](https://linkedin.com/in/raoakif)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](../../issues/) for ongoing or open issues.

## Show your support

Give a ⭐️ if you like this project!

## Acknowledgments

- Inspiration from [Perplexity.ai](https://www.perplexity.ai)
- Thanks to the contributors and libraries used in this project.

## 📝 License

This project is licensed under the [MIT License](./MIT.md).

--- 

Feel free to modify the placeholders like **Project Name**, **URLs**, and others to tailor this template to any of your future projects.




# BotFusion

## Overview

BotFusion is a robust solution designed to provide well-structured, Markdown-formatted answers to user queries. This project is inspired by [Perplexity.ai](https://www.perplexity.ai) and features capabilities such as content scraping from websites, mitigating hallucinations through citation of sources, and rate-limiting to enhance scalability and usability.

## Getting Started

Follow the steps below to get the project running on your local machine:

### Clone the Repository

```bash
git clone https://github.com/raoakif/botfusion.git
```

### Navigate to the Project Directory

```bash
cd botfusion
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file in the project root directory and populate it with the following keys:

```env
GROQ_API_KEY=""
UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""
```

Replace the placeholder values with your actual API credentials.

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to access the application.

## Features

- **Query Handling:** Users can input queries, including URLs, and receive context-rich, Markdown-formatted answers.
- **Content Scraping:** Scrapes web pages using Puppeteer and Cheerio to extract relevant content.
- **Rate Limiting:** Ensures a smooth user experience by limiting excessive requests with Upstash Redis.
- **Source Citation:** Mitigates hallucinations by providing sources for generated answers.

## Core Files and TODOs

The key areas to focus on in the codebase include:

### 1. `src/app/page.tsx`
- Update the chat interface to display user and AI responses.
- Handle API responses dynamically.

### 2. `src/app/api/chat/route.ts`
- Implement the chat API using Groq for LLM integration.
- Add web scraping capabilities with Puppeteer and Cheerio.

### 3. `src/middleware.ts`
- Implement rate-limiting logic with Upstash Redis.

## Challenges to Explore

- Extend content scraping to handle various data sources, such as:
  - YouTube videos
  - PDFs
  - CSV files
  - Images
- Add data visualization capabilities (e.g., bar charts, line charts, histograms).
- Implement a hierarchical web crawler to identify and scrape content from relevant links on a page.

## API Keys

- Ensure to configure necessary API keys in `.env` for services like OpenAI, Upstash, and others.

## Learn More

To learn more about Next.js and related technologies, refer to:

- [Next.js Documentation](https://nextjs.org/docs) - Detailed documentation about Next.js features and APIs.
- [Learn Next.js](https://nextjs.org/learn) - An interactive Next.js tutorial.

---

For questions or feedback, feel free to open an issue on the repository. Let's build something amazing together!
