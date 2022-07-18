const playlistName = "RadioKiwi Unofficial";
const playlistImage = `AAAAA.png`
const playlist = ['04 Coltellata (acustica).mp3', 'Blanco-Sfera-Ebbasta-Mi-fai-impazzire-Steelo-Blinding-Lights-Mashup-1103392750.mp3', 'Booba-ft-Sfera-Ebbasta-Telefono-1279394902.mp3', 'Davi-Gemitaiz-QVC8-551191386.mp3', 'EFFE-X-STAYIN-ALIVE-Tony-Effe-Bee-Gees-Jr-Stit-Mashup-1259800120.mp3', 'Escort-Lover-Sfera-Ebbasta-RMX-IG-socialsnitchboommm-1134794821.mp3', 'Gemitaiz-Fresco-RMX-Ft-Sfera-Ebbasta-589622226.mp3', 'Gigante-feat-Caneda-551289900.mp3', 'Ho Paura di Uscire 2 X Friday (Mashup by Sounder).mp3', 'Ho-Paura-Di-Uscire-Extended-RMX-646144173.mp3', 'LA DOLCE VITA x SCIROPPO x BLACK AND YELLOW (SAMUELE BRIGNOCCOLO MASHUP).mp3', 'LO SPORTSWEAR DEL CUOCO - Dark Polo Gang feat. FSK MASHUP.mp3', 'Maleducati-feat-Sfera-Ebbasta-603287547.mp3', 'Paky-Boogeyman-Loyalty-Means-Everything-RMX-ESSE-TV-698324416.mp3', 'Ridere X Scrivile Scemo (Pinguini Tattici Nucleari) [Jr Stit Mashup].mp3', 'Sfera Ebbasta - XNX (feat. Lazza & Guè Pequeno) [RMX].mp3', 'Sfera-Ebbasta-ft-PnB-Rock-Parigi-638048361.mp3', 'Sfera-Ebbasta-MAMMAMIA-RMX-feat-Lazza-Rosa-Chemical-Boro-Boro-1263281797.mp3', 'SOTTOGONNA-prod-Michelangelo-818270095.mp3', 'Taxi B - Still Dre RMX ft. Chiello (Audio).mp3', 'tha Supreme - Goosebumps (Audio)  blun7 a swishland RMX.mp3', 'Ti sta scomparendo il tanga - Sfera Ebbasta.mp3', 'TI-STA-SCOMPARENDO-IL-TANGA-X-DANZA-KUDURO-Jr-Stit-Mashup-1284955081.mp3', 'Troppo-Tardi-Per-Noi-Sfera-Ebbasta-600404814.mp3', 'TU-VUO-FA-L-ITALIANO-Sfera-Ebbasta-Rvssian-Jr-Stit-Mashup-1269144385.mp3', 'USCITO DI GALERA ROMPO - Lazza VillaBanks (Rastdj Mashup).mp3', 'Veleno-Pt-5-184580677.mp3', 'Wow-RMX-feat-Dani-Faiv-643378047.mp3']

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
                <div class="flex row card border button" onclick="play(\`${tag.tags.title}\`)" >
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

// blurred bg manager
function changeBg(newImage) {
    backgroundCover.style.opacity = 0

    setTimeout(() => {
        backgroundCover.style.backgroundImage = newImage

        setTimeout(() => {
            backgroundCover.style.opacity = 0.5            
        }, 50);
    }, 300);
}

// audio management
function play(title) {
    playerContainer.classList.remove('hidden')

    playerDownload.href = songs[title].songPath

    changeBg(`url("${songs[title].picture}")`)

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
