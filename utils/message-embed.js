const { MessageEmbed } = require('discord.js')

function getHelpEmbed() {
    let mainStr = `\`!play <url> or <song-name>\`\n\`!add <url> or <song-name>\`\n\`!list\`\n\`!next\`\n\`!pause\`\n\`!resume\`\n\`!stop\`\n\`!leave\`\n\`!bass <value between -20 to 20>\`\n\`!treble <value between -20 to 20>\``
    mainStr = mainStr + '\n\n**PS: ** url can be any youtube video link or any spotifylink(song,album,playlist)'
    const exampleEmbed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Sargam bot commands 🎵')
        .setAuthor({ name: "By Darahas" })
        .setThumbnail('https://cdn.discordapp.com/app-icons/895995785450250280/b4286700d1c294003e655523473a2403.png?size=512')
        .setDescription(mainStr)

    return exampleEmbed
}

function getListEmbed(data) {
    console.log(data)

    let fields = data.map((value) => {return{
        name:"Song",
        value:value.link
    }})

    const exampleEmbed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Songs in queue 🎵')
        .setAuthor({ name: "By Darahas" })
        .setThumbnail('https://cdn.discordapp.com/app-icons/895995785450250280/b4286700d1c294003e655523473a2403.png?size=512')
        .setFields(fields)

    return exampleEmbed
}

module.exports = { getHelpEmbed, getListEmbed }