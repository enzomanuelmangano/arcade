import 'text-encoding-polyfill'
import 'expo-dev-client'

import { useFonts } from 'expo-font'
import { FC } from 'react'
import { LogBox } from 'react-native'

import { NativeNavigation } from './navigation'
import { Provider } from './provider'

LogBox.ignoreLogs([
  'Constants.platform.ios.model',
  'Require cycle',
  'Warning, duplicate ID',
])

const App: FC = () => {
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  })

  if (!loaded) {
    return null
  }

  return (
    <Provider>
      <NativeNavigation />
    </Provider>
  )
}

export default App