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

const backgroundCover = document.getElementById('backgroundPlaylistCover');
const playlistCover = document.getElementById('playlistCover');

const playlistTitle = document.getElementById('playlistTitle');
const songList = document.getElementById('songList');

const playerContainer = document.getElementById('playerContainer');
const player = document.getElementById('player');

const playpause = document.getElementById('playpause');
const playerDownload = document.getElementById('download');
const volumeSlider = document.getElementById('volumeSlider');
const volumeSliderSmallWave = document.getElementById('volumeSmallWave');
const volumeSliderBigWave = document.getElementById('volumeBigWave');
const volumeSliderMuteBar = document.getElementById('volumeMuteBar');

const playerImage = document.getElementById('playerImg');
const playerSongTitle = document.getElementById('playerSongTitle');
const playerSongArtist = document.getElementById('playerSongArtist');

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

    // autoplay next song
    let currentIndex = Object.keys(songs).indexOf(title)
    let nextSong = Object.keys(songs)[ (currentIndex + 1) % Object.keys(songs).length ]
    player.addEventListener('ended', () => {
        setTimeout(() => {            
            play(nextSong)
        }, 1000);
    })
}

// volume slider
volumeSlider.addEventListener('input', () => {
    player.volume = volumeSlider.value / 100
    if (volumeSlider.value == 100) {
        volumeSliderBigWave.style.display = 'block';
        volumeSliderSmallWave.style.display = 'block';
        volumeSliderSmallWave.style.transform = 'scale(1)';
        volumeSliderMuteBar.style.display = 'none'
    }
    else if (volumeSlider.value > 50) {
        volumeSliderBigWave.style.display = 'none';
        volumeSliderSmallWave.style.display = 'block';
        volumeSliderSmallWave.style.transform = 'scale(1)';
        volumeSliderMuteBar.style.display = 'none'
    }
    else if (volumeSlider.value > 25) {
        volumeSliderBigWave.style.display = 'none';
        volumeSliderSmallWave.style.display = 'block';
        volumeSliderSmallWave.style.transform = 'scale(0.75) translate(25%, 20%)';
        volumeSliderMuteBar.style.display = 'none'
    }
    else {
        volumeSliderBigWave.style.display = 'none';
        volumeSliderSmallWave.style.display = 'block';
        volumeSliderMuteBar.style.display = 'none'

        if (volumeSlider.value == 0) {
            volumeSliderSmallWave.style.display = 'none';
            volumeSliderMuteBar.style.display = 'block'
        }
    }
})

// playpause button
playpause.addEventListener('click', () => {
    playpause.classList.toggle('paused')
    if (playpause.classList.contains('paused'))
        player.play()
    else
        player.pause()
})
//player.volume = 0.5

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
