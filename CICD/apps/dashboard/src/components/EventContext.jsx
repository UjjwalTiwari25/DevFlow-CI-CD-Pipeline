import { createContext, useContext, useEffect, useState } from 'react';
import { getToken } from '../api/client';

const EventContext = createContext();
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function EventProvider({ children }) {
  const [lastEvent, setLastEvent] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    let eventSource;
    let reconnectTimer;

    const connect = () => {
      // Pass token in URL for SSE since EventSource doesn't support custom headers natively in browsers
      eventSource = new EventSource(`${API_BASE}/api/dashboard/events?token=${token}`, {
        withCredentials: true
      });

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastEvent({ ...data, timestamp: Date.now() });
        } catch (e) {}
      };

      eventSource.onerror = () => {
        eventSource.close();
        reconnectTimer = setTimeout(connect, 5000);
      };
    };

    connect();

    return () => {
      if (eventSource) eventSource.close();
      if (reconnectTimer) clearTimeout(reconnectTimer);
    };
  }, []);

  return (
    <EventContext.Provider value={{ lastEvent }}>
      {children}
    </EventContext.Provider>
  );
}

export function useAppEvents() {
  return useContext(EventContext);
}
