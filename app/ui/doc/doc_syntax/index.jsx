import React from 'react'
import Code from 'app/ui/_lib/code'

export default class DocSyntax extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
    args: React.PropTypes.array
  }

  render() {
    const {name, args} = this.props

    const argsString = this._calculateArgsString(args)

    return <section className='doc-section'>
      <h3 className='doc-subheader'>
        Syntax
      </h3>

      <Code
        value={`${name}(${argsString})`}
        options={{
          readOnly: true,
          mode: 'javascript'
        }}
      />
    </section>
  }

  _calculateArgsString(args) {
    if (!args) return ''

    return args
      .filter((arg) => !arg.isProperty)
      .reduce((acc, arg, index, array) => {
        const isLast = index === array.length - 1
        const {argumentsString, nesting} = this._addArgumentSyntax(
          acc.result, arg, acc.nesting, isLast
        )

        acc.result = argumentsString
        acc.nesting = nesting
        return acc
      }, {nesting: 0, result: ''})
      .result
  }

  _addArgumentSyntax(argumentsString, arg, nesting, isLast) {
    if (!arg.optional && nesting > 0) {
      argumentsString += ']'.repeat(nesting) + ', '
    } else if (argumentsString !== '') {
      argumentsString += ', '
    }

    if (arg.optional) {
      nesting += 1
      argumentsString += '['
    }

    if (arg.variable) {
      argumentsString += '...'
    }

    argumentsString += arg.name

    if (arg.defaultvalue !== undefined) {
      argumentsString += '=' + arg.defaultvalue
    }

    if (isLast) {
      argumentsString += ']'.repeat(nesting)
    }

    return {argumentsString, nesting}
  }
}