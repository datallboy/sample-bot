// Get the member count channel
const getMemberCountChannel = async (guild) => {
  return await guild.channels.cache.find(channel => channel.name.startsWith('Member Count:'))
}

module.exports = {
  name: 'membercount',
  description: 'Turn member count on or off',
  async update(guild) {
    const memberCountChannel = await getMemberCountChannel(guild)
    if (!memberCountChannel) {
      return
    }
    memberCountChannel.setName(`Member Count: ${guild.memberCount}`)
  },
  async execute(message, args) {

    const createMemberCountChannel = async () => {
      try {
        const channel = await message.guild.channels.create('Member Count:', {
          type: 'voice',
          reason: `membercount show command issued by ${message.author}`,
          permissionOverwrites: [{
            id: message.guild.roles.everyone,
            allow: ['VIEW_CHANNEL'],
            deny: ['CONNECT']
          }, {
            id: message.guild.roles.cache.find(botRole => botRole.name === message.client.user.username && botRole.managed === true),
            allow: ['CONNECT', 'MANAGE_CHANNELS']
          }]
        })
        return channel;
      } catch (e) {
        console.log(e)
        return message.reply('Oops! Check the server log for error')
      }
    }

    // Show or hide the member count
    const showMemberCountChannel = async visible => {
      console.log(message.guild)
      let memberCountChannel = await getMemberCountChannel(message.guild)
      if (visible) {
        if (memberCountChannel) {
          return message.reply("Member count channel is already showing!")
        }
        const channel = await createMemberCountChannel();
        channel.setName(`Member Count: ${message.guild.memberCount}`)
        return message.reply(`Showing member count channel...`)
      } else {
        if (!memberCountChannel) {
          return message.reply("Member count channel is already hidden!")
        }
        await memberCountChannel.delete(`membercount hide command issued by ${message.author}`)
        return message.reply("Hiding member count channel...")
      }
    }

    if (args[0] === 'show') {
      showMemberCountChannel(true)
    }

    if (args[0] === 'hide') {
      showMemberCountChannel(false);
    }
  }
}