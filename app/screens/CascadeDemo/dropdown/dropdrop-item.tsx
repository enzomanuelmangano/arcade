import React, { useCallback } from "react"
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { Image, StyleSheet, Text, View } from "react-native"
import Color from "color"
import { AntDesign, MaterialIcons } from "@expo/vector-icons"
import { typography } from "app/theme"

type DropdownOptionType = {
  label: string
  description: string
  iconName: string
  picture?: string
}

type DropdownItemProps = {
  onPress?: (
    item: DropdownOptionType & {
      isHeader: boolean
    },
  ) => void
  progress: Animated.SharedValue<number>
  isHeader: boolean
  index: number
  itemHeight: number
  maxDropDownHeight: number
  optionsLength: number
  picture?: string
} & DropdownOptionType

const DropdownItem: React.FC<DropdownItemProps> = React.memo(
  ({
    onPress,
    progress,
    isHeader,
    index,
    optionsLength,
    maxDropDownHeight,
    itemHeight,
    label,
    iconName,
    description,
    picture,
  }) => {
    // Creating a shared value that keeps track of the scale of the item when it's tapped
    const tapGestureScale = useSharedValue(1)

    const onTouchStart = useCallback(() => {
      tapGestureScale.value = withTiming(0.95)
    }, [tapGestureScale])

    const onTouchEnd = useCallback(() => {
      tapGestureScale.value = withTiming(1)
      onPress && onPress({ label, description, isHeader, iconName })
    }, [tapGestureScale, onPress, label, isHeader, iconName])

    // Calculating the background color of the item based on its index
    // That's kind of a hacky way to do it, but it works :)
    // Basically you can achieve a similar result by using the main color (in this case #1B1B1B)
    // as the background color of the item and than update the opacity of the item
    // However, this will update the opacity of the item's children as well (the icon and the text)
    // Note: the lighten values decrement as the index increases
    const lighten = 1 - (optionsLength - index) / optionsLength
    // Note: I really love the Color library :) It's super useful for manipulating colors (https://www.npmjs.com/package/color)
    const collapsedBackgroundColor = Color("#1B1B1B").lighten(lighten).hex()
    const expandedBackgroundColor = "#1B1B1B"

    const rItemStyle = useAnimatedStyle(() => {
      // Calculating the bottom position of the item based on its index
      // That's useful in order to make the items stack on top of each other (when the dropdown is collapsed)
      // and to make them spread out (when the dropdown is expanded)
      const bottom = interpolate(
        progress.value,
        [0, 1],
        [index * 15, maxDropDownHeight / 2 - index * (itemHeight + 10)],
      )

      // Calculating the scale of the item based on its index (note that this will only be applied when the dropdown is collapsed)
      const scale = interpolate(progress.value, [0, 1], [1 - index * 0.05, 1])

      // if progress.value < 0.5, the dropdown is collapsed, so we use the collapsedBackgroundColor
      // otherwise, the dropdown is expanded, so we use the expandedBackgroundColor (which is the same as the main color)
      const backgroundColor =
        progress.value < 0.5 ? collapsedBackgroundColor : expandedBackgroundColor

      return {
        bottom,
        backgroundColor,
        zIndex: optionsLength - index,
        transform: [
          {
            // Here we're considering both the scale of the item and the scale of the tap gesture
            scale: scale * tapGestureScale.value,
          },
        ],
      }
    }, [index, optionsLength])

    // When the dropdown is collapsed, we want to hide the icon and the text (except for the header)
    const rContentStyle = useAnimatedStyle(() => {
      const opacity = interpolate(progress.value, [0, 1], [isHeader ? 1 : 0, 1])
      return {
        opacity,
      }
    }, [])

    // When the dropdown is collapsed, we want to rotate the arrow icon (just for the header)
    const rArrowContainerStyle = useAnimatedStyle(() => {
      const rotation = interpolate(progress.value, [0, 1], [0, Math.PI / 2], Extrapolate.CLAMP)
      const rotateRad = `${rotation}rad`

      return {
        transform: [
          {
            rotate: isHeader ? rotateRad : "0deg",
          },
        ],
      }
    }, [])

    return (
      <Animated.View
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={[styles.item, { height: itemHeight }, rItemStyle]}
      >
        <Animated.View style={[styles.content, rContentStyle]}>
          <View style={styles.iconBox}>
            {picture ? (
              <Image source={{ uri: picture }} style={styles.image} />
            ) : (
              <>
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/* @ts-ignore */}
                <AntDesign name={iconName} color={"white"} size={20} />
              </>
            )}
            {/* <AntDesign name={iconName} color={"white"} size={20} /> */}
          </View>
          <View style={{ flexDirection: "column" }}>
            <Text style={styles.title}>{label}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
          <View
            style={{
              flex: 1,
            }}
          />
          <View style={styles.arrowBox}>
            <Animated.View style={rArrowContainerStyle}>
              {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
              {/* @ts-ignore */}
              <MaterialIcons
                name={isHeader ? "arrow-forward-ios" : "arrow-forward"}
                size={20}
                color={isHeader ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.5)"}
              />
            </Animated.View>
          </View>
        </Animated.View>
      </Animated.View>
    )
  },
)

const styles = StyleSheet.create({
  arrowBox: {
    alignItems: "center",
    height: "80%",
    justifyContent: "center",
    marginRight: 5,
  },
  content: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
  },
  description: {
    color: "rgba(255,255,255,0.5)",
    fontFamily: typography.primary.normal,
    fontSize: 12,
    letterSpacing: 1.2,
    marginTop: 2,
  },
  iconBox: {
    alignItems: "center",
    aspectRatio: 1,
    backgroundColor: "#0C0C0C",
    borderRadius: 10,
    height: "80%",
    justifyContent: "center",
    marginRight: 12,
  },
  image: {
    borderColor: "rgba(248,248,248,0.2)",
    borderRadius: 10,
    borderWidth: 2,
    height: "100%",
    width: "100%",
  },
  item: {
    borderRadius: 10,
    padding: 15,
    position: "absolute",
    width: "80%",
  },
  title: {
    color: "white",
    fontFamily: typography.primary.medium,
    fontSize: 16,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
})

export { DropdownItem }
export type { DropdownOptionType }
