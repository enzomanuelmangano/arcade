import React, { FC, useRef, useState } from "react"
import { Platform, View, ViewStyle } from "react-native"
import { DrawerLayout, DrawerState } from "react-native-gesture-handler"
import { useSharedValue, withTiming } from "react-native-reanimated"
import { Button, Header, Screen } from "./"
import { isRTL } from "../i18n"
import { colors, spacing } from "../theme"
import { useSafeAreaInsetsStyle } from "../utils/useSafeAreaInsetsStyle"
import { DrawerIconButton } from "./DrawerIconButton"
import { CompassIcon, HomeIcon, PlusIcon } from "lucide-react-native"
import { useNavigation } from "@react-navigation/native"

interface ScreenWithSidebarProps {
  title: string
  children: React.ReactNode
}

export const ScreenWithSidebar: FC<ScreenWithSidebarProps> = ({ title, children }) => {
  const [open, setOpen] = useState(false)
  const drawerRef = useRef<DrawerLayout>()
  // const listRef = useRef<SectionList>()
  const progress = useSharedValue(0)

  const { navigate } = useNavigation<any>()

  const toggleDrawer = () => {
    if (!open) {
      setOpen(true)
      drawerRef.current?.openDrawer({ speed: 2 })
    } else {
      setOpen(false)
      drawerRef.current?.closeDrawer({ speed: 2 })
    }
  }

  /*
  const handleScroll = (sectionIndex: number, itemIndex = 0) => {
    listRef.current.scrollToLocation({
      animated: true,
      itemIndex,
      sectionIndex,
    })
    toggleDrawer()
  }
  */

  const $drawerInsets = useSafeAreaInsetsStyle(["top"])

  return (
    <DrawerLayout
      ref={drawerRef}
      drawerWidth={Platform.select({ default: 70 })}
      drawerType={"slide"}
      drawerPosition={isRTL ? "right" : "left"}
      overlayColor={open ? colors.palette.overlay50 : "transparent"}
      onDrawerSlide={(drawerProgress) => {
        progress.value = open ? 1 - drawerProgress : drawerProgress
      }}
      onDrawerStateChanged={(newState: DrawerState, drawerWillShow: boolean) => {
        if (newState === "Settling") {
          progress.value = withTiming(drawerWillShow ? 1 : 0, {
            duration: 250,
          })
          setOpen(drawerWillShow)
        }
      }}
      renderNavigationView={() => (
        <View style={[$drawer, $drawerInsets]}>
          <View style={$pinList}>
            <Button
              onPress={() => navigate("Home")}
              style={$pinItem}
              LeftAccessory={() => <HomeIcon color="#fff" />}
            />
            <Button
              onPress={() => navigate("Discover")}
              style={$pinItem}
              LeftAccessory={() => <CompassIcon color="#fff" />}
            />
          </View>
          <View style={$divider} />
          <View style={$channelList}>
            <Button
              onPress={() => navigate("CreateChannel")}
              LeftAccessory={() => <PlusIcon style={{ color: colors.text }} />}
              style={$channelButton}
            />
          </View>
        </View>
      )}
    >
      <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$screenContainer}>
        <Header
          title={title}
          LeftActionComponent={<DrawerIconButton onPress={toggleDrawer} {...{ open, progress }} />}
          safeAreaEdges={[]}
        />
        {children}
      </Screen>
    </DrawerLayout>
  )
}

const $screenContainer: ViewStyle = {
  flex: 1,
}

const $drawer: ViewStyle = {
  backgroundColor: colors.background,
  flex: 1,
  alignItems: "center",
}

const $pinList: ViewStyle = {
  gap: spacing.small,
}

const $pinItem: ViewStyle = {
  backgroundColor: colors.palette.cyan400,
  borderWidth: 0,
  borderRadius: 100,
  width: 50,
  height: 50,
  minHeight: 50,
}

const $divider: ViewStyle = {
  width: "50%",
  height: 2,
  backgroundColor: colors.palette.cyan500,
  borderRadius: 2,
  marginVertical: spacing.small,
}

const $channelList: ViewStyle = {
  flex: 1,
}

const $channelButton: ViewStyle = {
  backgroundColor: colors.palette.cyan700,
  borderWidth: 0,
  borderRadius: 100,
  width: 50,
  height: 50,
  minHeight: 50,
  alignSelf: "center",
}
