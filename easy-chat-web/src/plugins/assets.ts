import 'katex/dist/katex.min.css'
import '@/styles/lib/tailwind.css'
import '@/styles/lib/highlight.less'
import '@/styles/lib/github-markdown.less'
import '@/styles/global.less'

/** Tailwind's Preflight Style Override */
// 如果使用了 tailwind 的 reset 样式，如果被插入 naive-ui 样式的后面，可能会覆盖按钮等组件的样式。
// 可以在 head 元素中加入一个 <meta name="naive-ui-style" /> 元素，naive-ui 会把所有的样式刚好插入这个元素的前面
// 静态 HTML 文件中加入 meta 标签没用（naive 的样式仍然可能被覆盖），因为你的工具链可能永远会把 tailwind 的样式插入 head 的尾部。
// 这种情况下，你需要在 app 挂载之前动态的插入 meta 标签。
function naiveStyleOverride() {
  const meta = document.createElement('meta')
  meta.name = 'naive-ui-style'
  document.head.appendChild(meta)
}

function setupAssets() {
  naiveStyleOverride()
}

export default setupAssets
