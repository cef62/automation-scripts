const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk')
const { echo, exit } = require('shelljs')

const execFolder = process.cwd()

const red = chalk.bold.red
const green = chalk.bold.green

const typeSeparator = ' - '

const templatesFolder = path.join(__dirname, 'templates')
const componentsFolder = path.join(execFolder, 'src', 'components')


const createComponent = (name, stateless) => {
  const targetFolder = path.join(componentsFolder, name)
  const templateFactory = require(path.join(templatesFolder, 'plain-component'))

  const template = templateFactory(name)

  try {
    fs.ensureDirSync(targetFolder)
  } catch (e) {
    echo(red(`Impossible create the folder ${targetFolder}`))
    exit(1)
  }

  try {
    Object.keys(template).forEach((key) => {
      if (stateless && key === 'stateful') {
        return
      } else if (!stateless && key === 'stateless') {
        return
      }
      const { text, filename, ext } = template[key]
      const file = path.join(targetFolder, `${filename}.${ext}`)
      fs.writeFileSync(file, text.trimLeft(), 'utf8')
    })
  } catch (e) {
    echo(red('Something went wrong while writing component files, the folder will be removed'), e)
    fs.removeSync(targetFolder)
    exit(1)
  }

  echo(green(`Component <${name} /> it's been created in ${targetFolder}`))
}

module.exports = { createComponent }

