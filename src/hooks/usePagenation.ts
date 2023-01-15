import { Reducer, useCallback, useReducer } from 'react'

type Action = 'NEXT_PAGE' | 'PREV_PAGE' | 'RESET'
type State = number

const initialState: State = 1
const reducer: Reducer<State, Action> = (state, action) => {
  if (action === 'NEXT_PAGE') {
    return state + 1
  } else if (action === 'PREV_PAGE') {
    return state - 1
  } else if (action === 'RESET') {
    return initialState
  }
  throw new Error('Invalid action.')
}

export const usePagenation = () => {
  const [page, dispatch] = useReducer(reducer, initialState)

  const next = useCallback(() => dispatch('NEXT_PAGE'), [])
  const prev = useCallback(() => dispatch('PREV_PAGE'), [])

  return {
    page,
    next,
    prev,
  }
}
