const play = require('play-dl')

function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}

async function createResourceList(args, bass, treble) {
    let resourceQueue = []

    if (validURL(args)) {
        if (args.includes('spotify')) {

            if (play.is_expired()) {
                await play.refreshToken()
            }
            let sp_data = await play.spotify(args)
            if (sp_data.type === 'track') {

                let yt_info = await play.search(sp_data.name, { limit: 1 })
                let audioResource = {
                    link: yt_info[0].url,
                    bass: bass,
                    treble: treble
                }
                resourceQueue.push(audioResource)

            } else if (sp_data.type === 'album') {

                let tracks = sp_data.fetched_tracks.get('1');
                for (var i = 0; i < tracks.length; i++) {
                    let yt_info = await play.search(tracks[i].name, { limit: 1 })
                    let audioResource = {
                        link: yt_info[0].url,
                        bass: bass,
                        treble: treble
                    }
                    resourceQueue.push(audioResource)
                }

            } else if (sp_data.type === 'playlist') {

                let tracks = sp_data.fetched_tracks.get('1');
                for (var i = 0; i < tracks.length; i++) {
                    let yt_info = await play.search(tracks[i].name, { limit: 1 })
                    let audioResource = {
                        link: yt_info[0].url,
                        bass: bass,
                        treble: treble
                    }
                    resourceQueue.push(audioResource)
                }

            }

        } else {

            let audioResource = {
                link: args,
                bass: bass,
                treble: treble
            }
            resourceQueue.push(audioResource)

        }

    } else {

        let yt_info = await play.search(args, { limit: 1 })
        let audioResource = {
            link: yt_info[0].url,
            bass: bass,
            treble: treble
        }
        resourceQueue.push(audioResource)

    }
    return resourceQueue
}

module.exports = createResourceList