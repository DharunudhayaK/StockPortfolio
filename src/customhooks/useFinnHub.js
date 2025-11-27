import { useEffect, useState, useRef } from "react";
const API_KEY = import.meta.env.VITE_API_KEY;

const PORTFOLIO = {
  TSLA: { company: "Tesla", ticker: "TSLA", quantity: 5, avgPrice: 400 },
  AMZN: { company: "Amazon", ticker: "AMZN", quantity: 2, avgPrice: 3200 },
  MSFT: { company: "Microsoft", ticker: "MSFT", quantity: 8, avgPrice: 280 },
  GOOGL: {
    company: "Alphabet (Google)",
    ticker: "GOOGL",
    quantity: 3,
    avgPrice: 2600,
  },
  META: {
    company: "Meta (Facebook)",
    ticker: "META",
    quantity: 6,
    avgPrice: 320,
  },
  NVDA: { company: "NVIDIA", ticker: "NVDA", quantity: 4, avgPrice: 650 },
  NFLX: { company: "Netflix", ticker: "NFLX", quantity: 2, avgPrice: 500 },
  AAPL: { company: "Apple", ticker: "AAPL", quantity: 10, avgPrice: 150 },
  KO: { company: "Coca-Cola", ticker: "KO", quantity: 15, avgPrice: 60 },
};

// export function useFinnHub(
//   symbols = [
//     "TSLA",
//     "AMZN",
//     "MSFT",
//     "GOOGL",
//     "META",
//     "NVDA",
//     "NFLX",
//     "AAPL",
//     "KO",
//   ],
//   intervalMinutes = 3
// ) {
//   const [tickers, setTickers] = useState(() => {
//     const saved = localStorage.getItem("finnhubTickers");
//     if (saved) return JSON.parse(saved);

//     return symbols.reduce((acc, s) => {
//       acc[s] = {
//         price: null,
//         change: 0,
//         status: "neutral",
//         percentVariant: "0%",
//         company: PORTFOLIO[s]?.company,
//         quantity: 0,
//         avgPrice: PORTFOLIO[s]?.avgPrice,
//         timeStamp: 0,
//       };
//       return acc;
//     }, {});
//   });

//   const [loading, setLoading] = useState(true);
//   const [lastUpdate, setLastUpdate] = useState(null);

//   const socketRef = useRef(null);
//   const tickersRef = useRef({ ...tickers });

//   // Keep tickersRef updated
//   useEffect(() => {
//     tickersRef.current = tickers;
//   }, [tickers]);

//   // WebSocket connection
//   useEffect(() => {
//     let reconnectInterval;

//     const connectWebSocket = () => {
//       if (socketRef.current) return;

//       setLoading(true);

//       const socket = new WebSocket(`wss://ws.finnhub.io?token=${API_KEY}`);

//       socketRef.current = socket;

//       socket.onopen = () => {
//         console.log("🟢 WebSocket connected");

//         symbols.forEach((s) =>
//           socket.send(JSON.stringify({ type: "subscribe", symbol: s }))
//         );
//         setLoading(false);
//       };

//       socket.onmessage = (event) => {
//         const data = JSON.parse(event.data);
//         console.log(data);
//         if (data.type === "ping") return;

//         if (data.type === "trade") {
//           const updates = {};
//           data.data.forEach((trade) => {
//             const symbol = trade.s;
//             const price = trade.p;
//             const quantity = trade.v;
//             const timeStamp = trade.t;
//             const prev = tickersRef.current[symbol]?.price ?? price;
//             const change = prev ? ((price - prev) / prev) * 100 : 0;
//             const status =
//               price > prev ? "green" : price < prev ? "red" : "neutral";
//             const percentVariant = change.toFixed(2) + "%";

//             updates[symbol] = {
//               price,
//               change,
//               status,
//               percentVariant,
//               company: PORTFOLIO[symbol].company,
//               quantity: quantity,
//               avgPrice: PORTFOLIO[symbol].avgPrice,
//               profitLoss: (price - PORTFOLIO[symbol].avgPrice) * quantity,
//               timeStamp: timeStamp,
//             };
//           });

//           setTickers((prev) => {
//             const merged = { ...prev, ...updates };
//             tickersRef.current = merged;
//             localStorage.setItem("finnhubTickers", JSON.stringify(merged));
//             return merged;
//           });

//           setLastUpdate(new Date().toLocaleTimeString());
//         }
//       };

//       socket.onerror = (err) => console.error("WebSocket error:", err);

//       socket.onclose = (ev) => {
//         console.warn("WebSocket closed:", ev.code, ev.reason);
//         socketRef.current = null;
//         // Only reconnect if socket closed unexpectedly
//         if (!ev.wasClean) {
//           // setTimeout(connectWebSocket, 5000);
//         }
//       };
//     };

//     connectWebSocket();

//     // Optional: periodic reconnect every X minutes
//     reconnectInterval = setInterval(() => {
//       if (socketRef.current) socketRef.current.close();
//       connectWebSocket();
//     }, intervalMinutes * 60 * 1000);

//     return () => {
//       if (socketRef.current) socketRef.current.close();
//       clearInterval(reconnectInterval);
//     };
//   }, []);

//   return { tickers, loading, lastUpdate };
// }

export function useFinnHub(
  symbols = [
    "TSLA",
    "AMZN",
    "MSFT",
    "GOOGL",
    "META",
    "NVDA",
    "NFLX",
    "AAPL",
    "KO",
  ],
  intervalMinutes = 3
) {
  const [tickers, setTickers] = useState(() => {
    const saved = localStorage.getItem("finnhubTickers");
    if (saved) return JSON.parse(saved);

    return symbols.reduce((acc, s) => {
      acc[s] = {
        price: null,
        change: 0,
        status: "neutral",
        percentVariant: "0%",
        company: PORTFOLIO[s]?.company,
        quantity: 0,
        avgPrice: PORTFOLIO[s]?.avgPrice,
        timeStamp: 0,
      };
      return acc;
    }, {});
  });

  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  const socketRef = useRef(null);
  const tickersRef = useRef({ ...tickers });
  const dummyInterval = useRef(null);

  useEffect(() => {
    tickersRef.current = tickers;
  }, [tickers]);

  const startDummyData = () => {
    console.log("⚠️ Using Dummy Data Stream");

    dummyInterval.current = setInterval(() => {
      const updates = {};
      const now = Date.now();

      symbols.forEach((s) => {
        const prev = tickersRef.current[s]?.price ?? PORTFOLIO[s].avgPrice;
        const price = prev + (Math.random() * 10 - 5); // random fluctuation
        const change = prev ? ((price - prev) / prev) * 100 : 0;

        const randomOffset = Math.floor(Math.random() * 20 * 60 * 1000); // 0 - 20 min in ms
        const timeStamp = now - randomOffset;

        updates[s] = {
          price,
          change,
          status: change > 0 ? "green" : change < 0 ? "red" : "neutral",
          percentVariant: change.toFixed(2) + "%",
          company: PORTFOLIO[s].company,
          quantity: PORTFOLIO[s].quantity,
          avgPrice: PORTFOLIO[s].avgPrice,
          profitLoss: (price - PORTFOLIO[s].avgPrice) * PORTFOLIO[s].quantity,
          timeStamp: timeStamp,
        };
      });

      setTickers((prev) => {
        const merged = { ...prev, ...updates };
        tickersRef.current = merged;
        localStorage.setItem("finnhubTickers", JSON.stringify(merged));
        return merged;
      });

      setLastUpdate(new Date().toLocaleTimeString());
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    let reconnectInterval;

    const connectWebSocket = () => {
      if (socketRef.current) return;
      setLoading(true);

      const socket = new WebSocket(`wss://ws.finnhub.io?token=${API_KEY}`);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log("🟢 WebSocket connected");
        symbols.forEach((s) =>
          socket.send(JSON.stringify({ type: "subscribe", symbol: s }))
        );
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        // Ping only → fallback to dummy after delay
        if (data.type === "ping") return;
        if (data.status === "auth_failed") {
          socket.close();
          startDummyData();
          return;
        }

        if (data.type === "trade") {
          const updates = {};
          data.data.forEach((trade) => {
            const symbol = trade.s;
            const price = trade.p;
            const quantity = PORTFOLIO[symbol].quantity;
            const prev = tickersRef.current[symbol]?.price ?? price;
            const change = prev ? ((price - prev) / prev) * 100 : 0;
            const status =
              price > prev ? "green" : price < prev ? "red" : "neutral";

            updates[symbol] = {
              price,
              change,
              status,
              percentVariant: change.toFixed(2) + "%",
              company: PORTFOLIO[symbol].company,
              quantity,
              avgPrice: PORTFOLIO[symbol].avgPrice,
              profitLoss: (price - PORTFOLIO[symbol].avgPrice) * quantity,
              timeStamp: trade.t,
            };
          });

          setTickers((prev) => {
            const merged = { ...prev, ...updates };
            tickersRef.current = merged;
            localStorage.setItem("finnhubTickers", JSON.stringify(merged));
            return merged;
          });

          setLastUpdate(new Date().toLocaleTimeString());
          setLoading(false);
        }
      };

      socket.onerror = (err) => {
        console.error("WebSocket error:", err);
        startDummyData();
      };

      socket.onclose = (ev) => {
        console.warn("WebSocket closed:", ev.code, ev.reason);
        socketRef.current = null;
        if (!ev.wasClean) startDummyData();
      };
    };

    connectWebSocket();

    // Reconnect every intervalMinutes
    reconnectInterval = setInterval(() => {
      if (socketRef.current) socketRef.current.close();
      connectWebSocket();
    }, intervalMinutes * 60 * 1000);

    return () => {
      if (socketRef.current) socketRef.current.close();
      clearInterval(dummyInterval.current);
      clearInterval(reconnectInterval);
    };
  }, []);

  return { tickers, loading, lastUpdate };
}
