const playlistName = "RadioKiwi";
const playlistImage = `AAAAA.png`
const playlist = ['LONDRA.mp3', 'USCITO DI GALERA.mp3', '04 Coltellata (acustica).mp3']

/*
*
*
*
*
*
*
*/

const backgroundCover = document.getElementById('backgroundPlaylistCover')
const playlistCover = document.getElementById('playlistCover')

const playlistTitle = document.getElementById('playlistTitle')
const songList = document.getElementById('songList')

const playerContainer = document.getElementById('playerContainer')
const playpause = document.getElementById('playpause')
const playerDownload = document.getElementById('download')
const player = document.getElementById('player')
const playerImage = document.getElementById('playerImg')
const playerSongTitle = document.getElementById('playerSongTitle')
const playerSongArtist = document.getElementById('playerSongArtist')

var songs = {}

playlistCover.style.backgroundImage = `url(${playlistImage})`
backgroundCover.style.backgroundImage = playlistCover.style.backgroundImage
playlistTitle.innerText = playlistName
document.title = playlistName

playlist.forEach(song => {
    let songPath = `${window.location.origin}/music/${song}`

    jsmediatags.read(songPath, {
        onSuccess: function(tag) {
            const { data, format } = tag.tags.picture;
            let base64String = "";
            for (let i = 0; i < data.length; i++) {
                base64String += String.fromCharCode(data[i]);
              }
            let picture = `data:${data.format};base64,${window.btoa(base64String)}`;

            // fetch data into an object
            let source = {}
            source[tag.tags.title] = {
                songPath: `./music/${song}`,
                author: tag.tags.artist,
                picture: picture
            }
            Object.assign(songs, source );

            // create HTML element
            songList.innerHTML += `
                <div class="flex row card border button" onclick="play('${tag.tags.title}')" >
                    <div class="img square" style="background-image: url('${picture}');"></div>
                    <div class="flex column">
                        <span class="songTitle">${tag.tags.title}</span>
                        <span class="songAuthor">${tag.tags.artist}</span>
                    </div>
                </div>
            `
        },
        onError: function(error) {
            console.log(error);
        }
    });
});

// audio management
function play(title) {
    playerContainer.classList.remove('hidden')

    playerDownload.href = songs[title].songPath

    player.src = songs[title].songPath
    playerSongTitle.innerHTML = title
    playerSongArtist.innerHTML = songs[title].author
    playerImage.style.backgroundImage = `url("${songs[title].picture}")`
    player.autoplay = true
}

// playpause button
playpause.addEventListener('click', () => {
    playpause.classList.toggle('paused')
    if (playpause.classList.contains('paused'))
        player.play()
    else
        player.pause()
})

function checkPlaying() {
    if (player.paused)
        playpause.classList.remove('paused')
    else
        playpause.classList.add('paused')
        
    setTimeout(() => {
        checkPlaying()
    }, 250);
}

checkPlaying()
