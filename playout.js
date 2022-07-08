export default class{
    constructor(ac, buffer, master_gain = ac.creatGain()){
        this.ac = ac 
        this.gain = gain
        this.buffer = buffer
        this.master_gain = master_gain
        this.destination = this.ac.destination
    }

    isPlaying(){ return this.source !== undefined }

    /**
     * 
     * @param {float} when 
     * @param {float} start 
     * @param {float} duration 
     */
    play(when, start, duration){
        this.source.start(when, start, duration)
    }

    /**
     * 
     * @param {float} when 
     */
    stop(when = 0){
        if(this.source){
            this.source.stop(when)
        }
    }


    setupSource(){
        this.source = this.ac.createBufferSource();
        this.source.buffer = this.buffer;


        const sourcePromise = new Promise((resolve) => {
            this.source.onended = () => {
                this.source.disconnect();
                this.volume_gain.disconnect();
                this.should_play_gain.disconnect();
                this.panner.disconnect()
                

            }
        })
    }
}