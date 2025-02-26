import { Stack } from "expo-router"

import {observer} from "mobx-react-lite"
import { reactiveModel } from "src/bootstrapping";

import {SuspenseView} from "src/views/suspenseView";

export default
observer(
function RootLayout() {
  return reactiveModel.ready ? (
    <Stack
      screenOptions={{
        title: "Dinner Planner",
      }}
    />
  ) : (
    <SuspenseView 
      promise = {"loading..."}
      error = {null} 
    />
  );
}
)  
