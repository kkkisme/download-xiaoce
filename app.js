const fs = require('fs')
const path = require('path')
const axios = require('axios')
const markdownpdf = require('markdown-pdf')
const config = require('./config')
const utils = require('./utils')

function get() {
  let url = config.urls.getUrl + '?' + utils.stringfyQueryString(config.params)
  return new Promise((resolve, reject) => {
    axios.get(url).then(res => {
      resolve(res.data)
    })
  })
}

function getSection(sectionId) {
  let params = Object.assign({}, config.params, {
    sectionId
  })
  let url = config.urls.getSectionUrl + '?' + utils.stringfyQueryString(params)
  return new Promise((resolve, reject) => {
    axios.get(url).then(res => {
      resolve(res.data)
    })
  })
}

async function load() {
  let data = await get()
  let outputDir = data.d.title

  fs.mkdirSync(outputDir, 0755)
  let section = data.d.section
  for (let i = 0; (len = section.length), i < len; i++) {
    let sectionData = await getSection(section[i])
    let fd = fs.openSync(
      outputDir + '/' + i + sectionData.d.title + '.md',
      'w',
      0644
    )
    fs.writeFileSync(fd, sectionData.d.content, 'utf8')
    console.log(sectionData.d.title + ' 下载成功')
    fs.closeSync(fd)
    markdownpdf({ cssPath: path.join(__dirname, 'pdf.css') })
      .from.string(sectionData.d.content)
      .to(outputDir + '/' + i + sectionData.d.title + '.pdf', function() {
        console.log('Created', outputDir + '/' + i + sectionData.d.title)
      })
  }
}

load()
