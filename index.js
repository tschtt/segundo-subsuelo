import fs from 'fs';
import glob from 'fast-glob';
import matter from 'gray-matter';
import markdown from 'markdown-it';
import Handlebars from 'handlebars';

const md = markdown()

async function build () {
    console.log('BUILD START')
    const layouts = {}
    const tags = {}

    // load layouts
    console.log('\nLAYOUTS')
    for (const path of await glob('./layouts/*')) {
        console.log(`building: "${path}"`)

        const name = path.split('/').pop().split('.')[0]
        const input = fs.readFileSync(path, 'utf-8');
        const template = Handlebars.compile(input)

        layouts[name] = template
    }

    // build posts & load tags
    console.log('\nPOSTS')
    for (const path of await glob('./posts/**/index.*')) {
        console.log(`building: "${path}"`);

        let content = ''
        let post = {}

        content = fs.readFileSync(path, 'utf-8')
        content = matter(content)

        if(!content.data.title)     throw new Error(`missing title in post at: "${path}"`)
        if(!content.data.permalink) throw new Error(`missing permalink in post at: "${path}"`)
        if(!content.data.date)      throw new Error(`missing date in post at: "${path}"`)

        post = { ...content.data }
        post.title = content.data.title
        post.permalink = content.data.permalink
        post.date = content.data.date
        post.tags = content.data.tags || []
        post.intro = content.data.intro || ''
        post.layout = content.data.layout || 'base'
        post.content = md.render(content.content)

        // add post to tags
        for (const tag of post.tags) {
            if(!tags[tag]) tags[tag] = []
            tags[tag].push(post)
        }

        // copy entire post folder to output
        (() => {
            const source = path.split('/').slice(0, -1).join('/')
            const destination = `output/${post.permalink}`

            fs.cpSync(source, destination, {recursive: true})
        })();

        // build post
        (() => {
            const template = layouts[post.layout]
            const data = template(post)
            const path = './output' + post.permalink + 'index.html'

            fs.writeFileSync(path, data)
        })();
    }

    // build pages
    console.log('\nPAGES')
    for (const path of await glob('./pages/**/*')) {
        console.log(`building: "${path}"`, )

        const folder = path.split('/').slice(0, -1).join('/')
        const extension = path.split('.').slice(2).join('.')

        if(path === './pages/[tag]/index.html') {
            let content = ''

            content = fs.readFileSync(path, 'utf-8');
            content = matter(content)

            if(!content.data.title)     throw new Error(`missing title in page at: "${path}"`)

            for (const [tag, items] of Object.entries(tags)) {
                const page = {}

                page.title = content.data.title.replaceAll('{{tag}}', tag);
                page.layout = content.data.layout || 'base';
                page.permalink = path.replace('./pages', '').replace('[tag]', tag).replace('index.html', '')
                page.content = Handlebars.compile(content.content)({ ...page, tags, tag, items });    

                // build page
                const template = layouts[page.layout]
                const data = template(page)

                if(folder && !fs.existsSync(`./output${page.permalink}`)) {
                    fs.mkdirSync(`./output${page.permalink}`, { recursive: true })
                }
                fs.writeFileSync(`./output${page.permalink}index.html`, data)
            }
        }
        else 
        if(extension === 'html') {
            if(!path.endsWith('/index.html')) {
                throw new Error(`each page must be named index`)
            }
            
            let page = {}
            let content = ''

            content = fs.readFileSync(path, 'utf-8');
            content = matter(content)

            if(!content.data.title)     throw new Error(`missing title in page at: "${path}"`)

            page.title = content.data.title;
            page.layout = content.data.layout || 'base';
            page.permalink = path.replace('./pages', '').replace('index.html', '')
            page.content = Handlebars.compile(content.content)({ ...page, tags });

            // build page
            (() => {
                const template = layouts[page.layout]
                const data = template(page)

                if(folder && !fs.existsSync(`./output${page.permalink}`)) {
                    fs.mkdirSync(`./output${page.permalink}`, { recursive: true })
                }
                fs.writeFileSync(`./output${page.permalink}index.html`, data)
            })();
        }
        else {
            fs.cpSync(path, path.replace('pages', 'output'))
        }

    }
    
    // copy static folder
    console.log('\nSTATIC')
    for (const path of await glob('./static/**/*')) {
        console.log(`copying: "${path}"`, )
        fs.cpSync(path, path.replace('static', 'output'))
    }

    console.log('\nBUILD DONE')
}

build().catch(console.log)