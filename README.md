# WhisperCampus 

**WhisperCampus** is an interactive, Single Page Application (SPA) designed as an anonymous campus help and mood-sharing platform for university students. It fosters a low-pressure digital environment where students can share thoughts, ask for help, and connect with peers without the anxiety of public visibility.

---

##  Key Features

* **Secure Authentication & Authorization:** Secure user registration and login implemented using JWT and bcrypt password hashing.
* **Dynamic Feed (CRUD):** Users can seamlessly create, read, update, and delete posts across various categories (Confession, Discussion, Lost & Found, Carpool). The feed updates dynamically without page reloads.
* **Real-Time Interactivity:** Users can instantly like posts and add comments.
* **Ephemeral Direct Messaging:** Users can send private DM requests and chat privately. Messages automatically expire and are deleted after 24 hours using a native MongoDB TTL index.
* **Content Moderation:** Includes a robust reporting system that allows users to flag inappropriate posts or comments for review by moderators.

---

##  Tech Stack

### Front-End
* **Framework:** React (Single Page Application)
* **Styling:** Tailwind CSS for a responsive, modern UI
* **API Integration:** Native `fetch` API / Axios

### Back-End
* **Server:** Node.js / Express REST API
* **Database:** MongoDB with Mongoose ODM for schema validation and relationship management

---

##  REST API Reference

The backend exposes a structured REST API to handle business logic and database interactions. Here are the primary endpoints:

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/users/register` | Registers a new user and returns a JWT. |
| `POST` | `/api/users/login` | Authenticates user credentials. |

### Posts & Feed
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/posts` | Fetches the SPA feed (supports category filtering). |
| `POST` | `/api/posts` | Creates a new post. |
| `PUT` | `/api/posts/:id/like` | Toggles a like on a specific post. |
| `DELETE` | `/api/posts/:id` | Deletes a user's post. |

### Comments & Interactions
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/comments` | Adds a comment to a post. |
| `POST` | `/api/reports` | Submits a moderation report for a post/comment. |

### Ephemeral Messaging
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/chats/request` | Sends a private chat request to a post author. |
| `GET` | `/api/chats` | Retrieves the user's active inbox/chat list. |
| `GET` | `/api/chats/:id/messages` | Fetches active (unexpired) messages for a chat. |
| `POST` | `/api/chats/:id/messages` | Sends a new ephemeral message. |

---

##  Authors

* **Muhammad Soban** (CIIT/FA23-BSE-056/ISB)
* **Muhammad Ali** (CIIT/FA23-BSE-062/ISB)

**Institution:** COMSATS University Islamabad (CUI)  
**Program:** Bachelor of Science in Software Engineering (2023-2027)
