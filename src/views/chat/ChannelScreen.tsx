import { useEffect } from 'react'
import { ActivityIndicator } from 'react-native'
import { Channel } from 'stores/chat'
import { YStack } from 'tamagui'
import { Screen } from 'views/shared'
import { RouteProp, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MessageInput } from './MessageInput'
import { MessageList } from './MessageList'
import { useUserMetadataForChannel } from './useUserMetadataForChannel'

type ChannelScreenProps = {
  navigation: NativeStackNavigationProp<StackNavigatorParams, 'channel'>
  route: RouteProp<StackNavigatorParams, 'channel'>
}

export const ChannelScreen = ({ navigation, route }: ChannelScreenProps) => {
  const { channel } = route.params
  const { setOptions } = useNavigation()

  // useUserMetadataForChannel(channel?.id ?? '')

  useEffect(() => {
    setOptions({ title: channel?.metadata.name ?? 'Unnamed Channel' })
  }, [channel])

  if (!channel)
    return (
      <Screen>
        <ActivityIndicator />
      </Screen>
    )
  return (
    <YStack backgroundColor="#000" f={1}>
      <MessageList channelId={channel.id} />
      <MessageInput channelId={channel.id} />
    </YStack>
  )
}

export type StackNavigatorParams = {
  home: undefined
  create: undefined
  login: undefined
  channel: { channel: Channel }
}