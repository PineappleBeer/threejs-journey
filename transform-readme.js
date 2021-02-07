const fs = require('fs')

const fileName = `${process.argv[2]}/README.md`
let text = fs.readFileSync(fileName, 'utf-8').replace(/ +/g, ' ')

const transform = ({
  str = text,
  tagName,
  openingTag: customOpeningTag,
  closingTag: customClosingTag,
  converter,
}) => {
  const openingTag = customOpeningTag ? customOpeningTag.slice(1, -1) : tagName
  const closingTag = customClosingTag ? customClosingTag : `</${tagName}>`
  const re = new RegExp(
    `(<${openingTag}>|<${openingTag} (.+?)>)(.+?)?${closingTag}`,
    'gs'
  )
  return str.replace(re, replacer(converter))
}

const replacer = converter => (...args) => {
  const [, , attrStr = '', innerText = ''] = args
  const attrs = (` ${attrStr}`.match(/\s+(.+?)\="([^"]*)"/g) || []).reduce(
    (obj, str) => {
      const attrStr = str.trim()
      const equalSymIndex = attrStr.indexOf('=')
      const key = attrStr.slice(0, equalSymIndex)
      const value = attrStr.slice(equalSymIndex + 2, -1)
      obj[key] = value
      return obj
    },
    {}
  )
  return converter(attrs, innerText.trim())
}

text = transform({
  tagName: 'section',
  converter: (attrs, innerText) => innerText.trim(),
})

text = transform({
  tagName: 'h2',
  converter: (attrs, innerText) => `## ${innerText}\n`,
})

text = transform({
  tagName: 'h3',
  converter: (attrs, innerText) => `### ${innerText}\n`,
})

text = transform({
  tagName: 'h4',
  converter: (attrs, innerText) => `#### ${innerText}\n`,
})

text = transform({
  tagName: 'p',
  converter: (attrs, innerText) => `${innerText}\n`,
})

text = transform({
  tagName: 'ul',
  converter: (attrs, innerText) =>
    `${transform({
      str: innerText,
      tagName: 'li',
      converter: (attrs, innerText) => `- ${innerText}`,
    })}\n`,
})

text = transform({
  tagName: 'ol',
  converter: (attrs, innerText) =>
    `${transform({
      str: innerText,
      tagName: 'li',
      converter: (attrs, innerText) => `1. ${innerText}`,
    })}\n`,
})

text = transform({
  tagName: 'a',
  converter: (attrs, innerText) => `[${innerText}](${attrs.href})`,
})

text = transform({
  tagName: 'strong',
  converter: (attrs, innerText) => `**${innerText}**`,
})

// CODE BLOCKS: must transform manually
text = transform({
  openingTag: '<div class="code-toolbar">',
  closingTag: '</div></div></div>',
  converter: (attrs, innerText) => '```js\n// CODE BLOCKS\n```\n',
})

// CODE
text = text.replace(/&lt;/g, '<')
text = text.replace(/&gt;/g, '>')
text = transform({
  tagName: 'code',
  converter: (attrs, innerText) => `\`${innerText}\``,
})

// IMAGE
text = transform({
  openingTag: '<span class="image-inner">',
  closingTag: '</span>',
  converter: (attrs, innerText) => {
    const src = innerText.split(/ /g).find(str => str.startsWith('src='))
    const [fileName, extension] = src
      .split('/')
      [src.split('/').length - 1].slice(0, -1)
      .split('.')
    return `![${fileName}](./files/${fileName}.${extension})`
  },
})

// VIDEO
text = transform({
  openingTag: '<div class="js-video video">',
  closingTag: '\n </div>\n </div>\n </p>\n<p>',
  converter: (attrs, innerText) => {
    let str = innerText.replace(/\s+/g, ' ')
    str = transform({
      str,
      tagName: 'div',
      converter: (attrs, innerText) => '',
    })
    str = transform({
      str,
      tagName: 'svg',
      converter: (attrs, innerText) => '',
    })
    str = transform({
      str,
      tagName: 'video',
      converter: (attrs, innerText) => {
        const src = attrs.src
        const [fileName] = src
          .split('/')
          [src.split('/').length - 1].slice(0, -1)
          .split('.')
        return `![${fileName}](./files/${fileName}.gif)\n\n_https://threejs-journey.xyz${src}_\n`
      },
    })
    return str
  },
})
text = text.replace(/  <div class="logo"> /g, '\n')

fs.writeFile(fileName, text, function (err) {
  if (err) return console.log(err)
  console.log('Done!')
})
