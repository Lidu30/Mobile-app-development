import { Tabs } from "expo-router"
import { Text } from "react-native"

import { observer } from "mobx-react-lite"
import { reactiveModel } from "src/bootstrapping";

import { SuspenseView } from "src/views/suspenseView";
import { Auth } from "src/presenters/authPresenter"


export default
observer(
function RootLayout() {

  function renderIndexTabIconACB() {
    return <Text>🍽</Text>
  }

  function renderSearchTabIconACB() {
    return <Text>🔍</Text>
  }

  function renderSummaryTabIconACB() {
    return <Text>📝</Text>
  }

  function renderDetailsTabIconACB() {
    return <Text>📄</Text>
  }

  // Show loading while Firebase auth initializes
  if (reactiveModel.user === undefined) {
    return <SuspenseView promise="loading..." error={null} />
  }
  // Show auth screen if user is not logged in
  if (reactiveModel.user === null) {
    return <Auth model={reactiveModel} />
  }

  return reactiveModel.ready ? (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: renderIndexTabIconACB,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: renderSearchTabIconACB,
        }}
      />
      <Tabs.Screen
        name="summary"
        options={{
          title: "Summary",
          tabBarIcon: renderSummaryTabIconACB,
        }}
      />
      <Tabs.Screen
        name="details"
        options={{
          title: "Details",
          tabBarIcon: renderDetailsTabIconACB,
        }}
      />
    </Tabs>
  ) : (
    <SuspenseView 
      promise = {"loading..."}
      error = {null} 
    />
  );
}
)  
