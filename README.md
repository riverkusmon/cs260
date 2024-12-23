## Elevator Pitch:
Nonprofits spend time and money on writing grants that often don't come to fruitiion.
My product will utilize AI to help them better organize their thoughts, and reduce turnaround time on their writing. Allowing them to focus more on their missions and less on fundraising.

## Key Features:
- User accounts
- A guided process to help nonprofits organize their thoughts
- A database of anonymized successful grant applications to help guide the writing process
- AI generated applications based on the user's input
- Ability to see their past applications
## Technology Specification

- **HTML**: Structure for login, dashboard, application process, and past applications pages.

- **CSS**: Responsive design, professional color scheme, accessible styling.

- **JavaScript**: Dynamic content loading, interactivity for guided process.

- **React**: SPA architecture, componentized UI, state management for user progress.

- **Web Service**:
    - API endpoints for user auth, application CRUD operations, AI suggestions.
    - External API: OpenAI's GPT for generating grant content.

- **Authentication**: User registration, login, JWT sessions, display user info post-login.

- **Database**: Store user profiles, and previous applications.

- **WebSocket**: Livestream AI-generated content to the user interface, showing real-time typing effect as the AI writes.

![rough outline of site design](public/draft_of_site.png)

## Deliverables Sep 28
- I learned how to deploy code to AWS
- I learned how to build out a basic html app
- I updated my project to have a bunch of HTML pages
- I gave those pages scaffolding for the content I want to add
- I provided links to each page with a navbar
- I served my github links to the footer


## Deliverables Oct 12
- I learned how to organize elements with css
- I learned how to get a better font for my site
- I learned how to style elements with css
- I learned how to use grids
- I learned how to use css for image manipulation
- I learned how much better css makes a site look

## Startup react learnings
- i learned how to deploy a react app to AWS
- i learned how to convert html to vite
- i learned we need the base index.html for the page to initially inject all our stuff
- i learned how to use react router
- i learned how to use react hooks

## Startup service learnings
- i learned how to deploy a server to aws
- i learned how to implement express in my project
- i learned how to use routes in express
- i learned how to proxy a fetch through my server to an external api
- i learned how to use an external api
- i learned how important components are to scalability
- figured out that you need a separate package.json for the server

## Startup login learnings
- I learned how to add mongoDB to my project
- I learned how to connect to mongoDB
- I learned how to set up a mongoDB database
- I learned how to use bcrypt to hash passwords
- figured out i need to import json super weirdly
- learned about context in react
- learned how to use context in react
- learned how to protect routes in react
- learned how to use cookies in react

## Startup web socket learnings
- I learned how to set up a web socket server
- I learned how to connect to a web socket server
- I learned how to use web sockets to send messages
- I learned that I need to have a separate server for web sockets
- I learned how to make things essentially real time with web sockets
- I learned how to use openai's api
- I learned how to stream data from openai's api to the client
- I learned how to display markdown in react