const path = require('path')
const inquirer = require('inquirer')
const fs = require('fs-extra')
const chalk = require('chalk')
const { echo, exit } = require('shelljs')

const execFolder = process.cwd()

const red = chalk.bold.red
const green = chalk.bold.green

const typeSeparator = ' - '

const templatesFolder = path.join(__dirname, 'templates')
const componentsFolder = path.join(execFolder, 'src', 'components')

const isDirSync = (aPath) => {
  try {
    return fs.statSync(aPath).isDirectory()
  } catch (e) {
    if (e.code === 'ENOENT') {
      return false
    }
    throw e
  }
}

const folders = {
  plain: {
    description: 'A plain React Component',
    path: path.join(templatesFolder, 'plain-component'),
  },
}

const questions = [
  {
    type: 'input',
    name: 'name',
    message: `What's the name of the component to create?`,
    validate(name) {
      const rule = /^[A-Z]\w{0,}$/
      if (!rule.test(name)) {
        return 'Please enter a valid Component name (Button, List, MyAwesomeTool, etc..)'
      }

      const targetFolder = path.join(componentsFolder, name)
      if (isDirSync(targetFolder)) {
        return `A component named ${name} already exists!`
      }

      return true
    },
  },
  {
    type: 'list',
    name: 'type',
    message: 'What kind of component do you want to create?',
    choices: Object.keys(folders).reduce((acc, key) => {
      acc.push(`${key}${typeSeparator}${folders[key].description}`)
      return acc
    }, []),
  },
  {
    type: 'confirm',
    name: 'stateless',
    message: 'Do you want to create a stateless component?',
    default: true,
  },
]

const createComponent = () => inquirer.prompt(questions)
    .then((answers) => {
      const result = Object.assign({},
        answers, {
          type: answers.type.split(typeSeparator)[0],
        }
      )
      return result
    })
    .then(({ name, stateless, type }) => {
      const targetFolder = path.join(componentsFolder, name)
      const info = folders[type]
      const templateFactory = require(info.path) // eslint-disable-line

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
    })

module.exports = { createComponent }

