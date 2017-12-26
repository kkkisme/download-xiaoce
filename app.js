const fs = require('fs')
const axios = require('axios')
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
    fs.open(
      outputDir + '/' + sectionData.d.title + '.md',
      'w',
      0644,
      (e, fd) => {
        if (e) throw e
        fs.writeFile(fd, sectionData.d.content, 'utf8', e => {
          if (e) throw e
          console.log(sectionData.d.title + ' 创建成功')
          fs.closeSync(fd)
        })
      }
    )
  }
}

load()
