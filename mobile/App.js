import React from 'react';
import {StatusBar} from 'react-native';
import {AuthProvider} from './src/context/AuthContext';
import {CartProvider} from './src/context/CartContext';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <StatusBar barStyle="light-content" backgroundColor="#00C853" />
        <AppNavigator />
      </CartProvider>
    </AuthProvider>
  );
};

export default App;