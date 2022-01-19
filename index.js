require('dotenv').config(); //initialize dotenv
const { Client } = require('discord.js');
const { joinVoiceChannel,
    createAudioPlayer,
    AudioPlayerStatus } = require('@discordjs/voice')
const play = require('play-dl')
const createUrlList = require('./utils/audio-list')
const createResource = require('./utils/create-resource')
const { getHelpEmbed, getListEmbed } = require('./utils/message-embed')

play.setToken({
    spotify: {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        refresh_token: process.env.REFRESH_TOKEN,
        market: 'IN'
    }
})

let playerObj = new Map();
let resourceQueue = new Map();
let audioFilters = new Map();

function getResourceQueue(id) {
    let x = resourceQueue.get(id)
    if (x) {
        return x
    } else {
        return []
    }
}

function getaudioFilters(id) {
    let x = audioFilters.get(id)
    if (x) {
        return x
    } else {
        return { bass: '0', treble: '0' }
    }
}

// Discord client
const client = new Client({ intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES'] });

client.once('ready', () => {
    console.log('Connected !!!');
});

client.on("messageCreate", async msg => {
    try {
        if (msg.content === '!help') {
            msg.channel.send({ embeds: [getHelpEmbed()] })
        } else if (msg.content.startsWith('!play')) {
            if (!msg.member.voice.channel) return msg.reply("You're not in a voice channel?");

            let args = msg.content.split('!play')[1]
            if (!args) {
                msg.reply('Please enter song name or song url 🥺')
                return
            }

            let a = getaudioFilters(msg.guild.id)
            let res = await createUrlList(args.trim(), a.bass, a.treble)

            let temp = {
                connection: joinVoiceChannel({
                    channelId: msg.member.voice.channel.id,
                    guildId: msg.guild.id,
                    adapterCreator: msg.guild.voiceAdapterCreator
                }),
                audioPlayer: createAudioPlayer()
            }
            temp.connection.subscribe(temp.audioPlayer)

            temp.audioPlayer.play(await createResource(res.shift()))

            temp.audioPlayer.on('stateChange', async (oldState, newState) => {
                if (oldState.status === AudioPlayerStatus.Playing && newState.status === AudioPlayerStatus.Idle) {
                    let song_list = getResourceQueue(msg.guild.id)
                    if (song_list.length !== 0) {
                        temp.audioPlayer.play(await createResource(song_list.shift()))
                        resourceQueue.set(msg.guild.id, song_list)
                    } else {
                        console.log('Finished Playing songs!!!');
                    }
                }
            })
            temp.audioPlayer.on("error", (error) => { console.log(error) })

            playerObj.set(msg.guild.id, temp)
            resourceQueue.set(msg.guild.id, res)

        } else if (msg.content.startsWith('!add')) {
            let args = msg.content.split('add')[1]
            if (!args) {
                msg.reply('Please enter song name or song url 🥺')
                return
            }

            let a = getaudioFilters(msg.guild.id)
            let res = await createUrlList(args, a.bass, a.treble)
            let song_list = getResourceQueue(msg.guild.id)

            resourceQueue.set(msg.guild.id, [...song_list, ...res])

        } else if (msg.content === '!next') {
            let song_list = getResourceQueue(msg.guild.id)
            if (song_list.length !== 0) {
                playerObj.get(msg.guild.id).audioPlayer.play(await createResource(song_list.shift()))
                resourceQueue.set(msg.guild.id, song_list)
            } else {
                console.log('Finished Playing songs!!!');
            }

        } else if (msg.content === '!pause') {
            playerObj.get(msg.guild.id).audioPlayer.pause()

        } else if (msg.content === '!resume') {
            playerObj.get(msg.guild.id).audioPlayer.unpause()

        } else if (msg.content === '!stop') {
            playerObj.get(msg.guild.id).connection.destroy()
            
        } else if (msg.content.startsWith('!bass')) {
            let args = msg.content.split('bass')[1]
            if (!args) {
                msg.reply('Please enter song name or song url 🥺')
                return
            }
            let a = getaudioFilters(msg.guild.id)
            audioFilters.set(msg.guild.id, { ...a, bass: args.trim() })

        } else if (msg.content.startsWith('!treble')) {
            let args = msg.content.split('treble')[1]
            if (!args) {
                msg.reply('Please enter song name or song url 🥺')
                return
            }
            let a = getaudioFilters(msg.guild.id)
            audioFilters.set(msg.guild.id, { ...a, treble: args.trim() })
        } else if (msg.content === '!list') {
            msg.channel.send({ embeds: [getListEmbed(getResourceQueue(msg.guild.id))] })
        } else if (msg.content === '!delete') {
            await msg.delete()
            let msgs = await msg.channel.messages.fetch({ limit: 100 })
            msg.channel.bulkDelete(msgs)

        } else if (msg.content === '!clear') {
            resourceQueue.set(msg.guild.id, [])
        }
    } catch (error) {
        console.log(error)
    }
})

client.login(process.env.CLIENT_TOKEN);