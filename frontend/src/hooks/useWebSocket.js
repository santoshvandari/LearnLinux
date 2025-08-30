// WebSocket connection management hook
import { useState, useEffect, useRef, useCallback } from 'react';
import { RECONNECT_INTERVAL, MAX_RECONNECT_ATTEMPTS } from '../utils/constants';

const useWebSocket = (url, sessionId) => {
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [lastMessage, setLastMessage] = useState(null);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const shouldReconnectRef = useRef(true);

  const connect = useCallback(() => {
    // Don't create multiple connections
    if (wsRef.current && 
        (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
      console.log('WebSocket already connecting/connected, skipping');
      return;
    }

    // Clean up any existing connection
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setConnectionStatus('connecting');
    
    try {
      const wsUrl = sessionId ? `${url}?session=${sessionId}` : url;
      console.log('Creating WebSocket connection to:', wsUrl);
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        setConnectionStatus('connected');
        reconnectAttemptsRef.current = 0;
        console.log('WebSocket connected successfully');
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received WebSocket message:', data);
          setLastMessage(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error, 'Raw data:', event.data);
          setLastMessage({ error: 'Failed to parse message' });
        }
      };

      wsRef.current.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason, 'Was clean:', event.wasClean);
        
        // Clear the reference immediately
        const wasOpen = wsRef.current !== null;
        wsRef.current = null;
        setConnectionStatus('disconnected');
        
        // Only attempt to reconnect if the connection was established and we should reconnect
        if (wasOpen && shouldReconnectRef.current && event.code !== 1000 && reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttemptsRef.current += 1;
          const delay = Math.min(RECONNECT_INTERVAL * Math.pow(2, reconnectAttemptsRef.current - 1), 30000);
          
          console.log(`Attempting to reconnect in ${delay}ms (attempt ${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            if (shouldReconnectRef.current) {
              connect();
            }
          }, delay);
        } else if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
          setConnectionStatus('error');
          setLastMessage({ error: 'Maximum reconnection attempts reached' });
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus('error');
        setLastMessage({ error: 'Connection error occurred' });
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setConnectionStatus('error');
      setLastMessage({ error: 'Failed to create connection' });
    }
  }, [url, sessionId]);

  const sendMessage = useCallback((message) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      try {
        const payload = typeof message === 'string' ? { input: message } : message;
        console.log('Sending WebSocket message:', payload);
        wsRef.current.send(JSON.stringify(payload));
        return true;
      } catch (error) {
        console.error('Failed to send WebSocket message:', error);
        return false;
      }
    } else {
      console.warn('WebSocket is not connected. Cannot send message:', message, 'ReadyState:', wsRef.current?.readyState);
      return false;
    }
  }, []);

  const reconnect = useCallback(() => {
    reconnectAttemptsRef.current = 0;
    shouldReconnectRef.current = true;
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close();
    }
    
    connect();
  }, [connect]);

  const disconnect = useCallback(() => {
    shouldReconnectRef.current = false;
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    setConnectionStatus('disconnected');
  }, []);

  // Initialize connection on mount
  useEffect(() => {
    if (url && sessionId) {
      console.log('Initializing WebSocket connection for session:', sessionId);
      connect();
    }

    return () => {
      console.log('Cleaning up WebSocket connection');
      shouldReconnectRef.current = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close(1000, 'Component unmounting');
      }
    };
  }, [connect, url, sessionId]);

  return {
    connectionStatus,
    sendMessage,
    lastMessage,
    reconnect,
    disconnect
  };
};

export default useWebSocket;