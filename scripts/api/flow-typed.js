const path = require('path')
const fs = require('fs-extra')
const Promise = require('bluebird')
const { echo, exec } = require('./helpers')

const execFolder = process.cwd()
const flowTypedCLI = path.join(execFolder, 'node_modules', '.bin', 'flow-typed')

const backupPackageJson = silent =>
  new Promise((resolve, reject) => {
    const src = path.join(execFolder, 'package.json')
    const target = path.join(execFolder, 'tmp.package.json')

    try {
      fs.copySync(src, target)

      echo(silent, `package.json backup done`)
      resolve()
    } catch (err) {
      echo(
        silent,
        `Something went wrong creating a backup of package.json.`,
        err
      )
      reject(err)
    }
  })

const restorePackageJson = silent =>
  new Promise((resolve, reject) => {
    const src = path.join(execFolder, 'tmp.package.json')
    const target = path.join(execFolder, 'package.json')

    try {
      fs.copySync(src, target)
      fs.removeSync(src)

      echo(silent, `package.json restored`)
      resolve()
    } catch (err) {
      echo(
        silent,
        `Something went wrong restoring package.json from a backup`,
        err
      )
      reject(err)
    }
  })

const preparePackageJson = (silent) =>
  new Promise((resolve, reject) => {
    try {
      const target = path.join(execFolder, 'package.json')
      const packageObj = fs.readJsonSync(target)
      delete packageObj.peerDependencies
      fs.writeJsonSync(target, packageObj)
      resolve()
    } catch (err) {
      echo(
        silent,
        `Something went wrong preparing package.json for flow-typed install`,
        err
      )
      reject(err)
    }
  })

const installFlowTypeDefinitions = silent => {
  const failOnError = false
  return backupPackageJson(silent)
    .then(() => preparePackageJson(silent))
    .then(() => exec(
      `"${flowTypedCLI}" install`,
      `Something could have gone wrong installing flow-typed definitions. Read above messages.`,
      silent,
      failOnError
    ))
    .then(msg => echo(silent, 'Flow type output:\n', msg))
    .then(() => restorePackageJson(silent))
}

module.exports = {
  installFlowTypeDefinitions,
}
