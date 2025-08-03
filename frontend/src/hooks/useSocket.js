import { useEffect, useRef, useCallback, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:4000';

export const useSocket = () => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  // Initialize socket connection
  const connect = useCallback(() => {
    if (socketRef.current?.connected) {
      return socketRef.current;
    }

    try {
      socketRef.current = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
      });

      socketRef.current.on('connect', () => {
        console.log('Socket connected:', socketRef.current.id);
        setIsConnected(true);
        setConnectionError(null);
      });

      socketRef.current.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        setIsConnected(false);
        if (reason === 'io server disconnect') {
          // Server disconnected, try to reconnect
          socketRef.current.connect();
        }
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setIsConnected(false);
        setConnectionError(error.message);
      });

      socketRef.current.on('reconnect', (attemptNumber) => {
        console.log('Socket reconnected after', attemptNumber, 'attempts');
        setIsConnected(true);
        setConnectionError(null);
      });

      socketRef.current.on('reconnect_error', (error) => {
        console.error('Socket reconnection error:', error);
        setConnectionError(error.message);
      });

      return socketRef.current;
    } catch (error) {
      console.error('Failed to create socket connection:', error);
      setConnectionError(error.message);
      return null;
    }
  }, []);

  // Join battle room
  const joinBattle = useCallback((battleId) => {
    const socket = connect();
    if (socket && battleId) {
      try {
        socket.emit('join-battle', battleId);
        console.log(`Joined battle room: ${battleId}`);
      } catch (error) {
        console.error('Error joining battle room:', error);
      }
    }
  }, [connect]);

  // Leave battle room
  const leaveBattle = useCallback((battleId) => {
    if (socketRef.current && battleId) {
      try {
        socketRef.current.emit('leave-battle', battleId);
        console.log(`Left battle room: ${battleId}`);
      } catch (error) {
        console.error('Error leaving battle room:', error);
      }
    }
  }, []);

  // Listen to vote updates
  const onVoteUpdate = useCallback((callback) => {
    const socket = connect();
    if (socket) {
      try {
        socket.on('vote-update', callback);
        return () => {
          try {
            socket.off('vote-update', callback);
          } catch (error) {
            console.error('Error removing vote update listener:', error);
          }
        };
      } catch (error) {
        console.error('Error setting up vote update listener:', error);
      }
    }
  }, [connect]);

  // Disconnect socket
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      try {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
        setConnectionError(null);
      } catch (error) {
        console.error('Error disconnecting socket:', error);
      }
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    socket: socketRef.current,
    isConnected,
    connectionError,
    connect,
    joinBattle,
    leaveBattle,
    onVoteUpdate,
    disconnect,
  };
}; 