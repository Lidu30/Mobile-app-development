import type { ViewStyle } from "react-native"
import { View } from "react-native"

interface MockFlatListProps<T> {
  data: T[]
  renderItem: ({
    item,
    index,
  }: {
    item: T
    index: number
  }) => React.ReactElement
  keyExtractor?: (item: T, index: number) => string
  testID?: string
  ListHeaderComponent?: React.ReactElement | null
  ListFooterComponent?: React.ReactElement | null
  ListEmptyComponent?: React.ReactElement | null
  horizontal?: boolean
  refreshing?: boolean
  onRefresh?: () => void
  onEndReached?: () => void
  onEndReachedThreshold?: number
  style?: ViewStyle
  contentContainerStyle?: ViewStyle
}

function MockFlatList<T>({
  data,
  renderItem,
  keyExtractor,
  testID,
  ListHeaderComponent,
  ListFooterComponent,
  ListEmptyComponent,
  style,
  contentContainerStyle,
}: MockFlatListProps<T>): React.ReactElement {
  return (
    <View testID={testID} style={style}>
      <View style={contentContainerStyle}>
        {ListHeaderComponent}
        {data.length === 0 && ListEmptyComponent}
        {data.map((item, index) => (
          <View
            key={keyExtractor ? keyExtractor(item, index) : index.toString()}
          >
            {renderItem({ item, index })}
          </View>
        ))}
        {ListFooterComponent}
      </View>
    </View>
  )
}

// Create the Jest mock
jest.mock("react-native/Libraries/Lists/FlatList", () => {
  return MockFlatList
})

export default MockFlatList
