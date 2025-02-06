import { Stack } from "expo-router"

//import {observer} from "mobx-react-lite"
//import { reactiveModel } from "src/bootstrapping";

export default
//observer(
function RootLayout() {
  return (
    <Stack
      screenOptions={{
        title: "Dinner Planner",
      }}
    />
  )
}
// )  
