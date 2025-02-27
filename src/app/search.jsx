import { observer } from "mobx-react-lite"
import { reactiveModel } from "src/bootstrapping"
import { Search } from "src/presenters/searchPresenter"


export default observer(function SearchPage() {
  return (
        <Search model = {reactiveModel} />
  )
})
