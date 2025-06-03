import {Stack} from "expo-router";
import {MD3LightTheme, PaperProvider} from "react-native-paper";

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#4395E6',
  },
};

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name="(tabs)"/>
      </Stack>
    </PaperProvider>
  )
}