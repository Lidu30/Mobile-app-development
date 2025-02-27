import { observer } from "mobx-react-lite"
import { reactiveModel } from "src/bootstrapping"
import { Summary } from "src/presenters/summaryPresenter"


export default observer(function SummaryPage() {
  return (
        <Summary model = {reactiveModel} />
  )
})
