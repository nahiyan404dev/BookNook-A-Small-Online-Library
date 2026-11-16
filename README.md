# 📚 BookNook – A Small Online Library

**BookNook** is a modern online library management platform where users can explore books, add their own books, borrow books for a limited period, and manage their borrowed collections. It provides a simple and user-friendly experience for managing books and encouraging reading.

🔗 **Live Website:** [Add Your Live Website URL]

---

## ✨ Key Features

- **User Authentication:** Secure registration and login using Better Auth with MongoDB Adapter, including Google authentication.
- **Browse Books:** Explore all available books with detailed information, including title, author, category, and description.
- **Add New Books:** Authenticated users can add books with images and descriptions.
- **Book Management:** Users can edit and delete books they have added.
- **Borrow Books:** Borrow books for a specific period and manage borrowing records.
- **My Books:** View and manage all books added by the logged-in user.
- **My Borrows:** Track borrowed books, borrowing dates, return dates, and return books.
- **Available Copies:** Automatically update book availability when books are borrowed or returned.
- **Responsive Design:** Optimized for mobile, tablet, and desktop devices.
- **Interactive UI:** Modern interface with loading states, toast notifications, confirmation dialogs, and smooth animations.

---

## 🛠️ Technologies Used

### Frontend
- Next.js (App Router)
- React.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Swiper.js
- Lucide React

### Authentication
- Better Auth
- MongoDB Adapter
- JWT

### Backend
- Node.js
- Express.js
- MongoDB

### Other Tools
- Git & GitHub
- Vercel
- imgbb / Postimage
- Framer Motion / AOS

---

## 📂 Main Application Pages

| Page | Route | Access |
|---|---|---|
| Home | `/` | Public |
| All Books | `/books` | Public |
| Book Details | `/books/:id` | Private |
| Add Book | `/add-book` | Private |
| My Books | `/my-books` | Private |
| My Borrows | `/my-borrows` | Private |
| Sign In | `/sign-in` | Public |
| Sign Up | `/sign-up` | Public |

---

## 🔐 Authentication System

BookNook uses Better Auth with the MongoDB Adapter for authentication and authorization.

Authentication features include:

- Email and password registration.
- Email and password login.
- Google social authentication.
- Protected routes for authenticated users.
- Session management.
- Logout functionality.
- Redirect users to their intended destination after login.
- Password validation with uppercase, lowercase, and minimum six characters.

---

## 📖 Book Management System

### Add Book
Authenticated users can add books by providing:
- Book title
- Author name
- Category
- Book image
- Short description
- Total available copies

### Update & Delete
Users can edit or delete books they have added. A confirmation dialog is displayed before deleting a book.

### Borrow & Return
- Users can borrow available books.
- Borrowing information is stored in the database.
- Available copies decrease when a book is borrowed.
- Available copies increase when a book is returned.
- Users cannot borrow the same book twice simultaneously.
- Borrowing records are available in the My Borrows section.

---

## 🔌 Backend API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/books` | Get all books |
| GET | `/books/:id` | Get a single book |
| POST | `/books` | Add a new book |
| PATCH | `/books/:id` | Update book information |
| DELETE | `/books/:id` | Delete a book |
| POST | `/borrows` | Borrow a book |
| GET | `/borrows` | Get logged-in user's borrowed books |
| DELETE | `/borrows/:id` | Return a borrowed book |

---

## ⚙️ Installation & Setup

Follow these steps to run BookNook locally.

**1. Clone the repository**

```bash
git clone YOUR_CLIENT_REPOSITORY_URL
```

**2. Navigate to the project directory**

```bash
cd booknook
```

**3. Install dependencies**

```bash
npm install
```

**4. Configure environment variables**

Create a `.env.local` file in your frontend project and configure your authentication, database, and API credentials.

Add the required environment variables according to your project configuration.

**5. Start the development server**

```bash
npm run dev
```

Open your browser and visit:

```text
http://localhost:3000
```

**Note:** The Express backend should also be configured and started separately if it is maintained in a separate directory or repository.

---

## 🚀 Future Improvements

- Advanced book search and filtering.
- Book reviews and ratings.
- Reading history and statistics.
- Wishlist functionality.
- Personalized book recommendations.
- Improved dashboard analytics.

---

## 👨‍💻 Developer

**Gopal Das**

Aspiring Full-Stack Developer | React, Next.js, TypeScript & Node.js

- GitHub: [@nahiyan404dev](https://github.com/nahiyan404dev)
- LinkedIn: [Gopal Das](https://www.linkedin.com/in/gopal-das-38676b391)

---

## 📄 License

This project was developed as part of a web development assignment and is intended for educational and learning purposes.
