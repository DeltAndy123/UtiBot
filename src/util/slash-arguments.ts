import { CommandInteraction } from "discord.js"

export default (interaction: CommandInteraction, options: { showTypes?: boolean } = { showTypes: false }) => {

  /** Example input args:
   * [
   *   {
   *     name: 'amount',
   *     type: 'INTEGER',
   *     value: 2
   *   },
   *   {
   *     name: 'slow',
   *     type: 'BOOLEAN',
   *     value: true
   *   }
   * ]
   *
   ** Example Output:
   * showTypes = true
   * {
   *   amount: { type: 'INTEGER', value: 2 },
   *   slow: { type: 'BOOLEAN', value: true }
   * }
   * showTypes = false or undefined
   * {
   *   amount: 2,
   *   slow: true
   * }
   */

  const interactionAny: any = interaction
  const args = interactionAny.options['_hoistedOptions']

  var output: any = {}

  if (options.showTypes) {
    args.forEach((arg: any) => {
      output[arg.name] = {
        type: arg.type,
        value: arg.value
      }
    })
  } else {
    args.forEach((arg: any) => {
      output[arg.name] = arg.value
    })
  }

  return output
}