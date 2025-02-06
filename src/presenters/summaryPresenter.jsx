import { observer } from "mobx-react-lite"
import { SummaryView } from "src/views/summaryView"

export const Summary = observer(function SummaryRender(props) {
  return (
    <SummaryView
      people={"TODO pass the relevant field from props.model"}
      ingredients={
        "TODO call shoppingList imported from utilities, pass the model menu as parameter"
      }
    />
  )
})
