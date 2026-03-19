import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useAuth} from '../context/AuthContext';
import {useCart} from '../context/CartContext';

// Screens
import HomeScreen from '../screens/HomeScreen';
import ProductsScreen from '../screens/ProductsScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrdersScreen from '../screens/OrdersScreen';
import OrderDetailScreen from '../screens/OrderDetailScreen';
import LoginScreen from '../screens/LoginScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AboutScreen from '../screens/AboutScreen';
import ContactScreen from '../screens/ContactScreen';
import FAQScreen from '../screens/FAQScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const PRIMARY_COLOR = '#00C853';
const SECONDARY_COLOR = '#111111';

function HomeTabs() {
  const {getCartCount} = useCart();
  const cartCount = getCartCount();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: PRIMARY_COLOR,
        tabBarInactiveTintColor: '#666',
        headerShown: false,
      }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProductsTab"
        component={ProductsScreen}
        options={{
          tabBarLabel: 'Products',
          tabBarIcon: ({color, size}) => (
            <Icon name="shopping-bag" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="CartTab"
        component={CartScreen}
        options={{
          tabBarLabel: 'Cart',
          tabBarBadge: cartCount > 0 ? cartCount : null,
          tabBarIcon: ({color, size}) => (
            <Icon name="shopping-cart" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({color, size}) => (
            <Icon name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const {user, loading} = useAuth();

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {backgroundColor: PRIMARY_COLOR},
          headerTintColor: '#fff',
          headerTitleStyle: {fontWeight: 'bold'},
        }}>
        {!user ? (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{headerShown: false}}
          />
        ) : (
          <>
            <Stack.Screen
              name="Main"
              component={HomeTabs}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ProductDetail"
              component={ProductDetailScreen}
              options={{title: 'Product Details'}}
            />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
            <Stack.Screen name="Orders" component={OrdersScreen} />
            <Stack.Screen
              name="OrderDetail"
              component={OrderDetailScreen}
              options={{title: 'Order Details'}}
            />
            <Stack.Screen name="About" component={AboutScreen} />
            <Stack.Screen name="Contact" component={ContactScreen} />
            <Stack.Screen name="FAQ" component={FAQScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}