import { ScrollView, View } from "react-native"
import { observer } from "mobx-react-lite"
import { reactiveModel } from "src/bootstrapping"
import { Sidebar } from "src/presenters/sidebarPresenter"
import { Search } from "src/presenters/searchPresenter"
import { Details } from "src/presenters/detailsPresenter"
import { Summary } from "src/presenters/summaryPresenter"

export default observer(function IndexPage() {
  return (
    /*<ScrollView>
      <View>*/
        <Sidebar model = {reactiveModel} />
      /*</View>
      <View>
        <Search model = {reactiveModel} />
        <Details model = {reactiveModel} />
        <Summary model = {reactiveModel} />
      </View>
    </ScrollView>*/
  )
})




