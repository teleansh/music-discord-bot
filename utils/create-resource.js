const { FFmpeg, opus } = require('prism-media')
const play = require('play-dl')
const { createAudioResource } = require('@discordjs/voice')

module.exports = async function createResource(res) {
    let { stream, type } = await play.stream(res.link)

    let ffmped_args = [
        '-analyzeduration', '0',
        '-loglevel', '0',
        '-f', 's16le',
        '-ar', '48000',
        '-ac', '2',
    ]
    let encoderstr = ''
    if (!(res.bass === '0')) {
        encoderstr = encoderstr + `bass=g=${res.bass}`
    }
    if (!(res.treble === '0') && (res.bass === '0')) {
        encoderstr = encoderstr + `treble=g=${res.treble}`
    }else if(!(res.treble === '0') && !(res.bass === '0')){
        encoderstr = encoderstr + `,treble=g=${res.treble}`
    }

    if(!(res.bass === '0') || !(res.treble === '0')){
        encoder_args = ['-af', encoderstr]
        ffmped_args = ffmped_args.concat(encoder_args)
    }

    let transcoder = new FFmpeg({
        args: ffmped_args
    })
    let opusEncoder = new opus.Encoder({
        rate: 48000,
        channels: 2,
        frameSize: 960,
    })

    const output = stream.pipe(transcoder);
    const outputStream = output.pipe(opusEncoder);

    output.on('error', (e) => outputStream.emit('error', e));
    stream.on('error', (e) => outputStream.emit('error', e));

    outputStream.on('close', () => {
        transcoder.destroy();
        opusEncoder.destroy();
    });

    const resource = createAudioResource(outputStream, { type: type })

    return resource
}