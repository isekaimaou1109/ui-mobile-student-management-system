import * as React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Slot } from 'expo-router';

import { SocketContext } from '../socket'

export default function BaseLayout() {
  const socket = React.useContext(SocketContext)
  const [isConnected, setConnectionState] = React.useState(false);
  const [transport, setTransport] = React.useState('N/A');

  React.useEffect(() => {
    if (socket.connected) {
      console.log('haha')
      onConnect();
    } else {
      console.log('b1')
    }

    function onConnect() {
      console.log('connected')
      setConnectionState(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on('upgrade', (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setConnectionState(false);
      setTransport('N/A');
      console.log('disconnect')
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('get_me', (profile) => {
      console.log('profile:', profile)
    })

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);


  return <SafeAreaProvider>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Slot />
    </GestureHandlerRootView>
  </SafeAreaProvider>
}