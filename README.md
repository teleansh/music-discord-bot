# music-discord-bot
Discord music bot backend to play music from youtube and spotify

# Requirements
- Node >= v16
- Can be downloaded from official node [webpage]()

# Bot Permissons
![Required Permissions image](./images/permissions.png)

# Setup
- Login to discord developer portal to get your own bot client token
- Invite bot to your server with required server permissions, the url can be generated in discord developer portal. (token is found in Bot tab of your applications and invite url can be found in your oauth>URl generator)
- As this backend uses play-dl, read [instructions](https://github.com/play-dl/play-dl/blob/main/instructions/README.md) on how to authorise your bot to play music from spotify or add youtube cookies.
- Once all the keys are retrieved create a .env file in root directory.
### Example .env file
```
CLIENT_TOKEN=xxxx
CLIENT_ID=xxx
CLIENT_SECRET=xxx
REFRESH_TOKEN=xxx
```
# Running
- One can install nodemon globally and use it
```
sudo npm i -g nodemon
```
- Run nodemon in root directory
```
nodemon
```
- The backend can be launched using npm also
```
npm start
```

# Bot commands
- !help
- !play url or name
- !add  url or name
- !next
- !pause
- !resume
- !stop
- !leave
- !bass value between -20 to +20
- !treble value between -20 to +20

#### PS: Url can be any youtube video link or any spotify link(song,album,playlist)

# Support
Join my personal discord [server](https://discord.gg/cSuKhuEUtD) for support.

# Contributors
### [Darahas Kopparapu](https://github.com/darahask)