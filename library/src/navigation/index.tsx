import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import UnsafeRoutes from './unsafe.routes';
import { useAuth } from 'hooks/auth';
import SafeRoutes from './safe.routes';

export default function Routes() {
  const { isLoggedIn } = useAuth();

  return (
    <NavigationContainer>
      {isLoggedIn ? <SafeRoutes /> : <UnsafeRoutes />}
    </NavigationContainer>
  );
}