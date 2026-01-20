# ♻️ ProNatura Waste Schedule Exporter

A modern, lightweight web application designed to help residents of **Bydgoszcz** effortlessly export their waste collection schedules from ProNatura directly to **Google Calendar**.

**[🚀 Live Demo on GitHub Pages](https://aoleszkiewicz.github.io/pronatura-waste-collection-schedule-exporter/)**

---

## ✨ Key Features

- **🔍 Smart Search**: Easily find your street and house number with an autocomplete search that handles Polish diacritics (e.g., type "lacznosc" to find "Łączność").
- **🏢 Detailed Addressing**: Automatically distinguishes between residential and non-residential (commercial) parts of the same building.
- **⏰ Custom Notifications**: Generates `.ics` files with built-in reminders:
  - **Evening Before (18:00)**: Plenty of time to put the bins out.
  - **Morning Of (07:00)**: A final reminder as you start your day.
- **📱 Responsive Design**: Fully optimized for mobile and desktop browsers with a clean, green-themed UI.
- **🔒 Privacy First**: No data is stored. All processing happens locally in your browser.

## 🛠️ Built With

- **Vanilla JavaScript (ES6+)**: No heavy frameworks, just clean and fast code.
- **HTML5 & CSS3**: Modern layouts using Flexbox/Grid and custom variables.
- **ProNatura API**: Reverse-engineered JSON API for real-time schedule data.
- **iCalendar Standard**: Custom-built `.ics` generator for maximum compatibility.

## 🚀 Getting Started

### Local Development
Since this is a static site, you don't need a complex setup:

1. Clone the repository:
   ```bash
   git clone https://github.com/aoleszkiewicz/pronatura-waste-collection-schedule-exporter.git
   ```
2. Open `index.html` in your favorite browser.
3. (Optional) Use a local server like `Live Server` in VS Code for a better experience.

## 📖 API Documentation
For technical details regarding the ProNatura JSON API used in this project, check out the [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

---

## 👨‍💻 Created by

**aoleszkiewicz**

Let's connect!
- [LinkedIn](https://www.linkedin.com/in/aoleszkiewicz/)
- [GitHub](https://github.com/aoleszkiewicz)

---
*Disclaimer: This project is an independent tool and is not officially affiliated with ProNatura Bydgoszcz.*
