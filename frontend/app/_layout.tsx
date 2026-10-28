import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="first" options={{ headerShown: false }} />
      <Stack.Screen name="second" options={{ headerShown: false }} />
      <Stack.Screen name="third" options={{ headerShown: false }} />
      <Stack.Screen name="call" options={{ headerShown: false }} />
      <Stack.Screen name="recordscam" options={{ headerShown: false }} />
      <Stack.Screen name="studyscam" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
