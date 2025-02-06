import { ScrollView, View } from "react-native"
import { observer } from "mobx-react-lite"
import { reactiveModel } from "src/bootstrapping"
import { Summary } from "src/presenters/summaryPresenter"

export default observer(function IndexPage() {
  return (
    <ScrollView>
      <View>
        <Summary model={reactiveModel} />
      </View>
    </ScrollView>
  )
})
