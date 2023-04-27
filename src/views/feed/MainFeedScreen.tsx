import React, { useEffect } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { palette } from 'views/theme'
// src/views/feed/MainFeedScreen.tsx
import { useNavigation } from '@react-navigation/native'
import { CreatePostButton } from './components/CreatePostButton'
import { PostItem } from './components/PostItem'

export const MainFeedScreen = () => {
  const { setOptions } = useNavigation()
  useEffect(() => {
    setOptions({
      headerTitle: 'Feed',
    })
  }, [])

  // Replace this with the actual data from your backend or state management
  const posts = [
    /* ... */
  ]

  const renderItem = ({ item }) => {
    // Customize the PostItem component as needed
    return <PostItem post={item} />
  }

  return (
    <View style={styles.container}>
      {/* <SearchBar placeholder="Search" onChangeText={() => {}} /> */}
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
      <CreatePostButton
        onPress={() => {
          // Navigate to the create post screen
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.almostBlack,
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  listContent: {
    padding: 10,
  },
})