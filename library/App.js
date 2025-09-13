import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from 'hooks/auth';
import Routes from 'navigation';
import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
        <AuthProvider>
          <Routes/>
          <StatusBar style="auto" />
        </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
