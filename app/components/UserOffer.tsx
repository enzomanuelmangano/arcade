import React, { useContext, useEffect, useState } from "react"
import { AutoImage, RelayContext, Text } from "app/components"
import { ImageStyle, Pressable, TextStyle, View, ViewStyle } from "react-native"
import { colors, spacing } from "app/theme"
import { shortenKey } from "app/utils/shortenKey"
import { useNavigation } from "@react-navigation/native"

export function UserOffer({ pubkey }: { pubkey: string }) {
  const pool: any = useContext(RelayContext)
  const [profile, setProfile] = useState(null)
  const navigation = useNavigation<any>()

  useEffect(() => {
    async function fetchProfile() {
      const list = await pool.list([{ kinds: [0], authors: [pubkey] }], true)
      if (list.length > 0) {
        const content = JSON.parse(list[0].content)
        setProfile(content)
      } else {
        console.log("user profile not found", pubkey)
      }
    }

    fetchProfile().catch(console.error)
  }, [pubkey])

  return (
    <Pressable onPress={() => navigation.navigate("User", { id: pubkey })} style={$user}>
      <AutoImage
        source={{ uri: profile?.picture || "https://void.cat/d/HxXbwgU9ChcQohiVxSybCs.jpg" }}
        style={$userAvatar}
      />
      <View>
        <Text
          text={profile?.display_name || shortenKey(pubkey)}
          preset="bold"
          size="xs"
          style={$userName}
        />
        <Text text="Rep.: 90%" preset="bold" size="xs" style={$userRep} />
      </View>
    </Pressable>
  )
}

const $user: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  alignItems: "flex-start",
  gap: spacing.extraSmall,
  zIndex: 10,
}

const $userAvatar: ImageStyle = {
  width: 40,
  height: 40,
  borderRadius: 100,
  flexShrink: 0,
}

const $userName: TextStyle = {
  lineHeight: 0,
  color: colors.palette.cyan500,
}

const $userRep: TextStyle = {
  lineHeight: 0,
  color: colors.palette.cyan700,
}
