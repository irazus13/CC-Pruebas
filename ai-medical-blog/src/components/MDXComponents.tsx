import { ComponentPropsWithoutRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

type HeadingProps = ComponentPropsWithoutRef<'h1'>
type ParagraphProps = ComponentPropsWithoutRef<'p'>
type ListProps = ComponentPropsWithoutRef<'ul'>
type ListItemProps = ComponentPropsWithoutRef<'li'>
type AnchorProps = ComponentPropsWithoutRef<'a'>
type BlockquoteProps = ComponentPropsWithoutRef<'blockquote'>

export const mdxComponents = {
  h1: (props: HeadingProps) => (
    <h1
      className="text-3xl font-bold text-navy dark:text-white mt-8 mb-4"
      {...props}
    />
  ),
  h2: (props: HeadingProps) => (
    <h2
      className="text-2xl font-bold text-navy dark:text-white mt-8 mb-4"
      {...props}
    />
  ),
  h3: (props: HeadingProps) => (
    <h3
      className="text-xl font-bold text-navy dark:text-white mt-6 mb-3"
      {...props}
    />
  ),
  h4: (props: HeadingProps) => (
    <h4
      className="text-lg font-semibold text-navy dark:text-white mt-4 mb-2"
      {...props}
    />
  ),
  p: (props: ParagraphProps) => (
    <p
      className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4"
      {...props}
    />
  ),
  ul: (props: ListProps) => (
    <ul className="list-disc list-inside mb-4 space-y-2" {...props} />
  ),
  ol: (props: ListProps) => (
    <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />
  ),
  li: (props: ListItemProps) => (
    <li className="text-gray-700 dark:text-gray-300" {...props} />
  ),
  a: ({ href, ...props }: AnchorProps) => {
    if (href?.startsWith('/')) {
      return (
        <Link
          href={href}
          className="text-primary hover:underline"
          {...props}
        />
      )
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline"
        {...props}
      />
    )
  },
  blockquote: (props: BlockquoteProps) => (
    <blockquote
      className="border-l-4 border-primary pl-4 italic text-gray-600 dark:text-gray-400 my-4"
      {...props}
    />
  ),
  code: (props: ComponentPropsWithoutRef<'code'>) => (
    <code
      className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono"
      {...props}
    />
  ),
  pre: (props: ComponentPropsWithoutRef<'pre'>) => (
    <pre
      className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4 font-mono text-sm"
      {...props}
    />
  ),
  img: ({ src, alt }: ComponentPropsWithoutRef<'img'>) => (
    <span className="block my-6">
      <Image
        src={src || ''}
        alt={alt || ''}
        width={800}
        height={400}
        className="rounded-lg"
      />
    </span>
  ),
  hr: () => <hr className="my-8 border-gray-200 dark:border-gray-700" />,
  table: (props: ComponentPropsWithoutRef<'table'>) => (
    <div className="overflow-x-auto mb-4">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" {...props} />
    </div>
  ),
  th: (props: ComponentPropsWithoutRef<'th'>) => (
    <th
      className="px-4 py-2 text-left text-sm font-semibold text-navy dark:text-white bg-gray-50 dark:bg-gray-800"
      {...props}
    />
  ),
  td: (props: ComponentPropsWithoutRef<'td'>) => (
    <td
      className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700"
      {...props}
    />
  ),
}
