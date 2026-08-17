import { canOpenCompare, parseIdsParam, serializeIdsParam, toggleSelection } from '~/utils/selection'

export function useCompareSelection(knownIds: MaybeRefOrGetter<readonly string[]>) {
  const route = useRoute()
  const router = useRouter()
  const notice = ref('')

  const selectedIds = computed(() => parseIdsParam(route.query.ids, toValue(knownIds)))

  function persist(ids: string[]) {
    const query = { ...route.query }
    if (ids.length) query.ids = serializeIdsParam(ids)
    else delete query.ids
    void router.replace({ query })
  }

  function toggle(id: string) {
    const result = toggleSelection(selectedIds.value, id)
    persist(result.ids)
    notice.value = result.status === 'blocked' ? (result.message ?? '') : ''
  }

  function remove(id: string) {
    persist(selectedIds.value.filter((item) => item !== id))
    notice.value = ''
  }

  function clear() {
    persist([])
    notice.value = ''
  }

  const compareReady = computed(() => canOpenCompare(selectedIds.value))

  return {
    selectedIds,
    notice,
    compareReady,
    toggle,
    remove,
    clear
  }
}
