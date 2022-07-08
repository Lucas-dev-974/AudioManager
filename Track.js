
export default class Track{
    constructor(manager, track, name = 'track'){
        this.volume = manager.ac.createGain();
        this.source = manager.ac.createBufferSource(); // Audio buffer
        this.ac     = manager.ac

        if(!track) {
            throw new Error('Url to audio track is required'); 
        }else if(track == 'micro'){
            console.log('is micro');
        }else{
            this.loadSource(track.src)
        }
    }
    
    loadSource(src){
        const request = new XMLHttpRequest()
        request.responseType = 'arraybuffer';

        request.onload =  () => {
            let _this = this
            this.ac.decodeAudioData(request.response, function(audio){
                _this.setSource(audio)                
            })
        }
        request.onerror = (error) => {console.log(error);}

        request.open('GET', src, true)
        request.send()
    }

    setSource(source){
        this.source.buffer = this.ac.createBuffer()
        console.log(this.source);
        this.source.connect(this.ac.destination)
        this.source.start(0)
    }
}
