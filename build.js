import { glob, readFile, cp, readdir, writeFile } from 'node:fs/promises'
import matter from 'gray-matter'
import markdownit from 'markdown-it'
import Handlebars from 'handlebars'

const md = markdownit()

// layouts

const layouts = {}

for (const layout_filename of await readdir('./layouts')) {
    const layout_path = './layouts/' + layout_filename
    const layout_name = layout_filename.replace('.html', '')
    const layout_content = await readFile(layout_path, 'utf-8')
    const layout_template = Handlebars.compile(layout_content);
    
    layouts[layout_name] = layout_template
}

// posts

const posts = []

for await (const page_path of glob('./posts/**/*.md')) {
    const page_markdown = await readFile(page_path, 'utf-8')
    const page_matter = matter(page_markdown)

    if (!page_matter.data.title)     throw new Error(`Missing frontmatter title on page "${page_path}"`)
    if (!page_matter.data.permalink) throw new Error(`Missing frontmatter permalink on page "${page_path}"`)
    if (!page_matter.data.date)      throw new Error(`Missing frontmatter date on page "${page_path}"`)
    if (!page_matter.data.tags)      throw new Error(`Missing frontmatter tags on page "${page_path}"`)

    if (!page_matter.data.layout) page_matter.data.layout = 'post'
    
    copyPostFolder: {
        const page_folder_source = page_path.replace('index.md', '')
        const page_folder_dest = './build' + page_matter.data.permalink
        await cp(page_folder_source, page_folder_dest, { recursive: true })
    }

    renderPage: {
        page_matter.content = md.render(page_matter.content)

        const page_layout = page_matter.data.layout
        const page_content = layouts[page_layout](page_matter)
        const page_path = './build' + page_matter.data.permalink + 'index.html'
        
        await writeFile(page_path, page_content)
    }

    addToPosts: {
        posts.push(page_matter.data)
    }
}

for await (const page_path of glob('./pages/**/*.html')) {
    const page_content = await readFile(page_path, 'utf-8')
    const page_matter = matter(page_content)
    
    if (!page_matter.data.layout) page_matter.data.layout = 'page'
    
    console.log(posts)
    
    page_matter.content = Handlebars.compile(page_matter.content)({ posts })
    
    const page_build = layouts[page_matter.data.layout](page_matter)
    const page_path_dest = page_path.replace('pages', 'build')

    await writeFile(page_path_dest, page_build)
}
