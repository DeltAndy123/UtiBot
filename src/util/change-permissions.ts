import { GuildChannel, GuildMember, Role, User } from "discord.js"
import channelPermissions from "./channel-permissions"
const nodes = Object.values(channelPermissions)

export default (channel: GuildChannel, mentionable: GuildMember | Role | User , permObject: any) => {

  if (mentionable instanceof User) {
    mentionable = channel.guild.members.cache.get(mentionable.id)!
  }

  // If values in permObject.enabled are not valid, return an error
  if (permObject.enable && permObject.enable.length > 0) {
    for (const node of permObject.enable) {
      if (!nodes.includes(node)) {
        throw new SyntaxError(`Invalid permission node: ${node}`)
      }
    }
  }

  // Do the same for other values
  if (permObject.null && permObject.null.length > 0) {
    for (const node of permObject.null) {
      if (!nodes.includes(node)) {
        throw new SyntaxError(`Invalid permission node: ${node}`)
      }
    }
  }

  if (permObject.disable && permObject.disable.length > 0) {
    for (const node of permObject.disable) {
      if (!nodes.includes(node)) {
        throw new SyntaxError(`Invalid permission node: ${node}`)
      }
    }
  }


  // Create object to store permissions
  var perms: any = {}

  // If there are values in permObject arrays, add them to the object
  if (permObject.enable && permObject.enable.length > 0) {
    for (const node of permObject.enable) {
      perms[node] = true
    }
  }
  
  if (permObject.null && permObject.null.length > 0) {
    for (const node of permObject.null) {
      perms[node] = null
    }
  }

  if (permObject.disable && permObject.disable.length > 0) {
    for (const node of permObject.disable) {
      perms[node] = false
    }
  }
  
  // Update the channel's permissions
  channel.permissionOverwrites.edit(mentionable, perms)
  
  // channel.permissionOverwrites.edit(role, {
  //   VIEW_CHANNEL: perms.VIEW_CHANNEL,
  //   MANAGE_CHANNELS: perms.MANAGE_CHANNELS,
  //   MANAGE_ROLES: perms.MANAGE_ROLES,
  //   MANAGE_WEBHOOKS: perms.MANAGE_WEBHOOKS,
  //   CREATE_INSTANT_INVITE: perms.CREATE_INSTANT_INVITE,
  //   SEND_MESSAGES: perms.SEND_MESSAGES,
  //   EMBED_LINKS: perms.EMBED_LINKS,
  //   ATTACH_FILES: perms.ATTACH_FILES,
  //   ADD_REACTIONS: perms.ADD_REACTIONS,
  //   USE_EXTERNAL_EMOJIS: perms.USE_EXTERNAL_EMOJIS,
  //   MENTION_EVERYONE: perms.MENTION_EVERYONE,
  //   MANAGE_MESSAGES: perms.MANAGE_MESSAGES,
  //   READ_MESSAGE_HISTORY: perms.READ_MESSAGE_HISTORY,
  //   SEND_TTS_MESSAGES: perms.SEND_TTS_MESSAGES
  // })
}