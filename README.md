# 📈 Stock Portfolio Tracker

A real-time stock portfolio tracker built with **React + Vite**, showing:
- Live stock prices from WebSocket (Finnhub)
- Automatic fallback to dummy data when WebSocket fails
- P/L calculation
- Sorting, filtering, searching
- Dark / Light mode

Deployed on **Vercel**.

---

## 🚀 Features

- Live WebSocket stock updates  
- Dummy fallback when WebSocket fails or API plan restricted  
- LocalStorage caching  
- Sorting (Company, Quantity, Current, AvgBuy, P/L)  
- Search bar with smooth expand animation  
- Mobile & Desktop responsive view  
- Dark mode support  

---

## 🛠 Tech Stack

- **React (Vite)**
- **Material UI**
- **Tailwind CSS**
- **WebSockets**
---

## 🔑 Environment Variables

This project uses environment variables.  
Vite requires all frontend variables to start with **`VITE_`**.

Create a `.env` file in the root (not committed to GitHub):

