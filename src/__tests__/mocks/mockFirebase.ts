type DatabaseReference = {
  db: unknown
  path: string
}

type SnapshotCallback = (snapshot: { val(): unknown }) => void

interface DatabaseState {
  refHistory: { db: unknown; path: string }[]
  getHistory: { ref: DatabaseReference; acb: SnapshotCallback }[]
  setHistory: { ref: DatabaseReference; val: unknown }[]
  onHistory: { ref: DatabaseReference; acb: SnapshotCallback }[]
  data: unknown
  onACB: SnapshotCallback | null
  initialized?: boolean
}

interface PersistenceProps {
  numberOfGuests: string
  dishes: string
  currentDishId: string
}

const state: DatabaseState = {
  refHistory: [],
  getHistory: [],
  setHistory: [],
  onHistory: [],
  data: null,
  onACB: null,
}

const mockDB = {}

const getDatabase = jest.fn(() => mockDB)

const initDB = jest.fn(
  (persistencePropNames: Partial<PersistenceProps>): boolean => {
    if (!persistencePropNames) return false
    const { numberOfGuests, dishes, currentDishId } = persistencePropNames
    if (!(numberOfGuests && dishes && currentDishId)) return false

    state.data = {
      [numberOfGuests]: 13,
      [dishes]: [45, 42, 22],
      [currentDishId]: 42,
    }
    state.initialized = true
    return true
  },
)

const ref = jest.fn((db: unknown, path: string): DatabaseReference => {
  state.refHistory.push({ db, path })
  return { db, path }
})

const get = jest.fn((rf: DatabaseReference, acb?: SnapshotCallback) => {
  if (!state.initialized) {
    console.warn("mock firebase get() used without initialization")
  }
  // Only add to history if callback is defined
  if (acb) {
    state.getHistory.push({ ref: rf, acb })
  }
  const ret = {
    val: () => state.data,
  }
  if (acb) acb(ret)
  return Promise.resolve(ret)
})

const set = jest.fn((rf: DatabaseReference, val: unknown) => {
  state.setHistory.push({ ref: rf, val })
  state.data = val
  return Promise.resolve()
})

const onValue = jest.fn((rf: DatabaseReference, acb: SnapshotCallback) => {
  state.onACB = acb
  state.onHistory.push({ ref: rf, acb })
})

// Helper function to reset all mocks and state
const resetMocks = () => {
  state.refHistory = []
  state.getHistory = []
  state.setHistory = []
  state.onHistory = []
  state.data = null
  state.onACB = null
  state.initialized = false

  getDatabase.mockClear()
  initDB.mockClear()
  ref.mockClear()
  get.mockClear()
  set.mockClear()
  onValue.mockClear()
}

export { getDatabase, ref, get, set, onValue, initDB, state, resetMocks }
