import { ref } from 'vue'

/**
 * 首页搜索状态（模块级单例）
 * Hero 搜索框与"全部工具"区块共享同一 keyword，输入即联动过滤。
 */
const keyword = ref('')

export function useSearch() {
  const setKeyword = (kw) => {
    keyword.value = kw
  }
  const clear = () => {
    keyword.value = ''
  }
  return { keyword, setKeyword, clear }
}
