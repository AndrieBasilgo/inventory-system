# 🖥️ IT Equipment Management

A lightweight, browser-based IT inventory system for tracking equipment across your organization — no backend required.

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap_5-7952B3?style=flat&logo=bootstrap&logoColor=white)

---

## ✨ Features

- 🔐 **Role-based login** — `admin` and `user` accounts with different permissions
- 📋 **Equipment tracking** — Add, edit, and delete inventory items
- 🏷️ **Status management** — Mark equipment as Available, Assigned, or In Maintenance
- 📤 **CSV Export** — Download your inventory as a spreadsheet
- 📥 **CSV Import** — Bulk-upload equipment from a CSV file
- 🌙 **Dark mode toggle**
- 💾 **Persistent storage** — Data saved in the browser via `localStorage`
- 📱 **Responsive design** — Works on desktop and mobile

---

## 🚀 Getting Started

No install or build step needed. Just open the files in a browser.

### Option 1 — Open directly

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/it-equipment-management.git

# Open the login page
open index.html
```

### Option 2 — Serve locally (recommended)

```bash
# Using Python
python -m http.server 8080

# Using Node.js (npx)
npx serve .
```

Then visit `http://localhost:8080` in your browser.

---

## 🔑 Default Credentials

| Role  | Username | Password |
|-------|----------|----------|
| Admin | `admin`  | `admin`  |
| User  | `user`   | `user`   |

> ⚠️ This is a demo system. Credentials are stored in plain text in `auth.js` and are **not suitable for production use**.

---

## 📁 Project Structure

```
it-equipment-management/
├── index.html       # Login page
├── dashboard.html   # Main inventory dashboard
├── auth.js          # Authentication logic
├── script.js        # Dashboard logic (CRUD, CSV, etc.)
└── style.css        # Custom styles
```

---

## 📊 Equipment Fields

Each inventory item tracks the following:

| Field         | Description                              |
|---------------|------------------------------------------|
| Name          | Device or item name                      |
| Model         | Manufacturer model                       |
| Serial Number | Unique hardware identifier               |
| Type          | Desktop / Laptop / Accessories / Other   |
| User          | Person the item is assigned to           |
| Status        | Available / Assigned / Maintenance       |

---

## 📤 CSV Format

When importing, your CSV should follow this column order:

```
Name,Model,Serial,Type,User,Status
Dell OptiPlex,7090,SN123456,Desktop,John Doe,Assigned
```

---

## 🛠️ Customization

- **Add users or roles** — Edit the `users` object in `auth.js`
- **Add equipment types** — Update the `<select id="type">` options in `dashboard.html`
- **Change styling** — Modify `style.css`; Bootstrap 5 utility classes are available throughout

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

## 🙌 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request
