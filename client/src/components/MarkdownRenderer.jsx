import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

export default function MarkdownRenderer({ content }) {
  return (
    <div className="prose prose-invert max-w-none text-sm">
      <ReactMarkdown
        children={content}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
              <SyntaxHighlighter
                {...props}
                children={String(children).replace(/\n$/, '')}
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                className="rounded-md"
              />
            ) : (
              <code {...props} className={`${className} bg-dark-lighter px-1.5 py-0.5 rounded text-primary`}>
                {children}
              </code>
            )
          }
        }}
      />
    </div>
  )
}
