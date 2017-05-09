const fence = '```'

module.exports = (name) => {
  const stateful = `
import React, { Component, PropTypes } from 'react'

/**
 * Add a description for ${name}
 */
export default class ${name} extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div >
        Placeholder content for ${name}
      </div>
    )
  }
}

${name}.propTypes = {}
`

  const stateless = `
import React, { PropTypes } from 'react'

/**
 * Add a description for ${name}
 */

export default function ${name}(props) {
  return (
    <div>
      Placeholder content for ${name}
    </div>
  )
}

${name}.propTypes = {}
`

  const index = `
import ${name} from './${name}'

export { default as ${name} } from './${name}'
export default ${name}
`

  const example = `
Example of ${name}, default export

${fence}example
const ${name} = require('./index').default;

<${name}></${name}>
${fence}

Example of ${name}, named export

${fence}example
const { ${name} } = require('./index');

<${name}></${name}>
${fence}
`
  return {
    index: {
      text: index,
      filename: 'index',
      ext: 'js',
    },
    stateful: {
      text: stateful,
      filename: name,
      ext: 'js',
    },
    stateless: {
      text: stateless,
      filename: name,
      ext: 'js',
    },
    example: {
      text: example,
      filename: `${name}.examples`,
      ext: 'md',
    },
  }
}
