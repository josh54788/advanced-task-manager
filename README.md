# 📝 Advanced Task Manager & Productivity Dashboard

A robust, fully responsive web application that allows users to manage daily tasks, track productivity progress, and customize their workspace with advanced state filtering and theming.

## ✨ Features

* **Full CRUD Operations:** Instantly create, read, update (double-click to edit text), and delete tasks.
* **Persistent Data Tracking:** Utilizes the browser's native storage API to save tasks and theme preferences across sessions.
* **Dynamic Progress Dashboard:** A real-time visual progress bar that mathematically calculates task completion percentages.
* **Advanced Filtering & Priority:** Filter tasks by status (All, Active, Completed) and assign High, Medium, or Low priorities with custom visual badges.
* **Dark Mode Theming:** A clean, accessible light and dark mode interface driven seamlessly by CSS custom properties.

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)
* **Icons:** FontAwesome (Scalable Vector Graphics)
* **Storage:** Window.localStorage API
* **Deployment:** GitHub Pages (Ready for CI/CD)

## 🚀 Live Demo

*(Will add GitHub Pages live link here once deployed!)*

## ⚙️ Core Application Logic

Instead of a traditional backend, this application utilizes a single-source-of-truth state array and secure DOM manipulation:

* `handleAddTask()` - Validates input, generates a timestamp-based ID, and pushes a new task object to the state.
* `toggleTask(id)` / `editTask(id)` - Maps through the array to update specific boolean values or text strings based on user interaction.
* `renderTasks()` - Clears the DOM, applies active filters, and securely rebuilds the UI using `document.createElement()` and `.textContent` to prevent XSS vulnerabilities.

Developed as part of my full-stack development and front-end engineering portfolio.