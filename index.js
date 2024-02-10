import fs from 'fs';
import glob from 'fast-glob'

async function build () {
    const pages = await glob('pages/**/*')

    for (const page of pages) {
        fs.cpSync(page, page.replace('pages', 'output'))
    }
    
    console.log(pages)
}

build().catch(console.log)