# `Branch App Frontend`

🌐💬 **Scalable Messaging Web Application - React Frontend**

## Table of Contents
- [`Branch App Frontend`](#branch-app-frontend)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Contributing](#contributing)
  - [License](#license)

## Introduction

**Branch App Frontend** is the React-based front end of a scalable messaging web application. It provides a user-friendly interface for agents to view, respond to, and manage customer messages.

## Features

- Clean and intuitive user interface for agents.
- Real-time updates through WebSocket for instant message delivery.
- Seamless integration with the NestJS backend API.

## Technologies Used

- **React:** A declarative and efficient JavaScript library for building user interfaces.
- **WebSocket (Socket.io):** Real-time communication for instant message delivery and updates.
- **Context API:** State management library for managing application state.
- **CSS Modules:**  Styling framework for styling components.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/branch-app.git
    ```

2. Install dependencies:

    ```bash
    cd branch-app
    npm install
    ```

3. Create a `.env` file in the root directory of your project:

    ```plaintext
    NEXT_PUBLIC_API_URL=http://localhost:9900
    NEXT_PUBLIC_SOCKET_URL=http://localhost:9902
    ```

    Replace the URLs with the appropriate values for your backend API.

4. Start the development server:

    ```bash
    npm start
    ```

    The application will be running at `http://localhost:3000`.

5. For test accounts use the following (both in prod and dev environments):
   ```plaintext
   AGENT Sign In: james@branch.com
   CUSTOMER Sign In: Any customer email that will be on the tickets listed on the agent dashboard.
   ```

## Contributing

Contributions are welcome! Please read the [Contributing Guidelines](CONTRIBUTING.md) for more details.

## License

This project is licensed under the [MIT License](LICENSE).
