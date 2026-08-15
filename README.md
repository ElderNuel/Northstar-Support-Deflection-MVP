# 🌟 Northstar Support Deflection MVP

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-00a393.svg)](https://fastapi.tiangolo.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Status: MVP](https://img.shields.io/badge/Status-MVP-success.svg)]()

A lightweight, hybrid support deflection prototype built for **Northstar Retail Co.** This system is designed to intercept and autonomously resolve the three highest-volume customer support ticket categories:

- **Order Status**
- **Returns & Refunds**
- **Stock Availability**

Built as part of a **1-week industry working simulation by Group 36 - Team Syntactix**.

---

## 🌐 Live Demo

The MVP is deployed on **Render** and is publicly accessible:

👉 **[Launch Northstar Support Hub](https://northstar-support-deflection-mvp.onrender.com)**

> The live application provides order tracking, stock availability, returns & refunds, and an interactive support chatbot.

---

## 📖 Table of Contents

- [Live Demo](#live-demo)
- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [File Structure](#file-structure)
- [Installation & Setup](#installation--setup)
- [Usage Guide](#usage-guide)
- [API Endpoints](#api-endpoints)
- [Known Limitations (Go-Live Notes)](#known-limitations-go-live-notes)
- [Contributors](#contributors)

---

## 🎯 Project Overview

Northstar's customer support team is drowning in repetitive inquiries. This MVP provides immediate relief by routing users to an intelligent, self-serve dashboard and an interactive chatbot widget.

By leveraging offline **Regular Expression (Regex) parsing** instead of costly cloud LLMs, this system delivers instantaneous, zero-latency responses while maintaining data privacy.

---

## ✨ Key Features

- **Dual-Interface Deflection:** Users can choose between direct lookup cards on the Dashboard or conversational interactions through the Floating Chatbot.
- **Offline Natural Language Parsing:** Uses Python's built-in `re` module to parse intents and extract precise entities such as `NS-1001` and `RET-2001` from natural customer language.
- **Zero-Latency & Zero-Cost:** Runs entirely on local compute. No external API keys (Anthropic, OpenAI, or Gemini) are required, resulting in free operation and instant query resolution.
- **Responsive UI/UX:** A clean, accessible frontend built with Vanilla HTML/CSS/JS, ensuring compatibility across modern desktop and mobile browsers.

---

## 🛠 Architecture & Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Backend Server** | [FastAPI](https://fastapi.tiangolo.com/) (Python) | API server and request routing |
| **Frontend Client** | Vanilla HTML5, CSS3 & JavaScript | User interface and client-side interactions |
| **Database** | Local JSON (`northstar_data.json`) | Mock NoSQL-style document store |
| **Data Validation** | Pydantic | Strict typing and validation of incoming API payloads |
| **Parsing** | Python `re` module | Intent detection and entity extraction |

---

## 📂 File Structure

```text
📦 northstar-support-deflection-mvp
 ┣ 📜 main.py                 # FastAPI backend server & regex routing logic
 ┣ 📜 index.html              # Frontend user interface & dashboard layout
 ┣ 📜 script.js               # Client-side logic & API fetch requests
 ┣ 📜 northstar_data.json     # Mock database containing orders, returns, and stock
 ┗ 📜 README.md               # Project documentation
```

---

## 🚀 Installation & Setup

Follow these instructions to run the application locally.

### Prerequisites

Before you begin, make sure you have:

- **Python 3.8 or higher** installed on your system.
- Basic understanding of command-line interfaces.

### Step 1: Clone the Repository

Replace the placeholder repository URL with the actual GitHub repository URL:

```bash
git clone https://github.com/ElderNuel/Northstar-Support-Deflection-MVP.git
```

### Step 2: Create and Activate a Virtual Environment

A virtual environment is optional but recommended.

#### Windows

```bash
python -m venv venv
.\venv\Scripts\activate
```

#### macOS/Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Backend Dependencies

```bash
pip install fastapi uvicorn pydantic
```

### Step 4: Start the Local Development Server

```bash
uvicorn main:app --reload
```

### Step 5: Access the Application

Open your web browser and navigate to:

```text
http://localhost:8000
```

---

## 💻 Usage Guide

### 1. Dashboard — Direct Lookup

Use the dashboard cards to access specific support functions.

#### Track an Order

Click **"Track an order"** and enter:

```text
NS-1001
```

to view the shipping status.

#### Check Stock Availability

Click **"Check availability"** and enter:

```text
Earbuds
```

to check warehouse inventory.

#### Manage a Return

Click **"Manage returns"** and enter:

```text
RET-2001
```

to view the refund/return status.

### 2. Chatbot

Click the **"💬 Need Help? Chat with Us"** button in the bottom-right corner.

Try natural-language prompts such as:

```text
Where is my order NS-1003?
```

```text
Can I get an update on return ticket RET-2005?
```

```text
Do you have Yoga Mats in stock?
```

---

## 📡 API Endpoints

The FastAPI backend exposes the following RESTful routes for the frontend client.

| Method | Endpoint | Description | Payload Example |
|---|---|---|---|
| `GET` | `/` | Serves the main HTML interface | None |
| `POST` | `/api/lookup/order` | Retrieves specific order details | `{"order_id": "NS-1001"}` |
| `POST` | `/api/lookup/stock` | Queries inventory by product name | `{"product_name": "shoes"}` |
| `POST` | `/api/lookup/return` | Retrieves specific return details | `{"identifier": "RET-2001"}` |
| `POST` | `/chat` | Conversational parser for the chatbot UI | `{"message": "track NS-1004"}` |

---

## ⚠️ Known Limitations (Go-Live Notes)

As detailed in our **Go-Live Readiness Note**, this MVP currently has the following constraints.

### 1. Typo Sensitivity

Keyword matching is rigid. Severe misspellings of core trigger words, such as:

```text
whre is my ordr
```

may default to a fallback prompt.

### 2. Strict ID Formatting

The system expects exact identifier patterns.

For example:

```text
NS-1001
```

is accepted, while:

```text
Order 1001
```

may fail entity extraction.

### 3. Sequential Resolution

If a customer asks a multi-part question, the Regex parser resolves the **first intent it matches** and ignores secondary inquiries.

### Next Steps for Production

To improve production readiness, the following enhancements are recommended:

1. Implement a fuzzy-matching library such as `fuzzywuzzy` to improve typo tolerance.
2. Connect `load_database()` to Northstar's live CRM APIs.
3. Replace the mock JSON data source with a production-grade data store.
4. Expand intent classification to support multi-intent customer requests.
5. Add comprehensive authentication, authorization, logging, monitoring, and error handling before production deployment.

---

## 👥 Contributors

### Group 36 - Syntactix

This sprint was successfully executed collaboratively by:

- **Swaleh Rama**
- **Tracy Wangari**
- **Emmanuel Chijinkem Ukah**
- **Abraham Makur Mayor Nyidier**
- **Milkah Michira**

---

## 🏆 Project Context

Built for the **Power Learn Project — Northstar Sprint Simulation (August 2026)**.

---

## 📄 License

This project is licensed under the **MIT License**.

See the `LICENSE` file for the full license text.
