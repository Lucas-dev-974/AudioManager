import emitter  from './EventEmitter.js';
import gestionnaire from './HistoryProxyManager.js'
import Track from './Track.js'
// import { emitter } from './EventEmitter.js'

class Smanager {
    constructor(){
        this.ac = new (window.AudioContext || window.webkitAudioContext)()
        this.main_volume = 50
        

        // Tracks
        this.tracks = [];
        this.mutedTracks = [];
        // this.collapsedTracks = [];
        // this.playoutPromises = []; 
        
        this.history = {
            last_called_method: '',
            items: [],
            gestionnaire: gestionnaire
        },
        this.wait_events = []
        this.emitter = new emitter()
        this.setupEvents()
        this.initPlayer()
    }

    /**
     * @summary Set handler event listen on wait_events
     *          Boocle on wait_events var and if an event have method == data 
     *          so execute the method with params  
     */
    setupEvents(){
        this.emitter.on('wait_events', (data) => {
            this.wait_events.forEach((event, key) => {
                if(event.event_to_wait == data){
                    this[event.method]([...event.params ?? event.param])
                    delete this.wait_events[key]
                }
            })
        })

        this.emitter.on('play', (start, end) => {
            this.play()
        })
        
        this.emitter.on('pause', () => {
            this.pause()
        })
        
        this.emitter.on('stop', () => {
            this.stop()
        })


    }

    /**
     * @summary When page is loaded try to get the AudioContext object
     *          and setup it in this.ac
     */
    initPlayer(){
        window.addEventListener('load', () => {
            try{  
                if(this.ac == null){
                    this.setOutOfHistoryItems('main_volume', this.ac.createGain())  
                }
            }
            catch(e) { alert('Désoler la web audio API n\'est pas supporter par votre navigateur, veuillez le metre à jour ou changer de naviguateur !'); console.log(e); }
        }, false);
    }   

    /**
     * @summary Format tracks on object array
     * @param {Object array} tracks - Lists of object that contain {url, name, options} of one track
     */
    laodTracks(tracks){
        let _tracks = []
        if(this.ac != null){
            tracks.forEach(track => {
                if(track.src){
                    this.tracks.push(new Track(this, track))
                    console.log(this.tracks[0].buffer);
                }
            });
        }else{
            this.pushWaitEvents({
                method: this.history.last_called_method,
                param:  tracks,
                event_to_wait: 'ac-instancied'
            })
        }
    }

    addTrack(track){
        if(track.src && this.ac != null){
            this.tracks.push(new Track(this, track))
        }else if(this.ac == null){
            this.pushWaitEvents({
                method: this.history.last_called_method,
                param:  track,
                event_to_wait: 'ac-instancied'
            })
        }else{
            console.log('src must be specified !!');
        }
    }

    play(start_time, end_time){
        const current_time = this.ac.currentTime();
        const selected     = this.getTimeSelection();
        const playoutPromises = [];

        const start = start_time || this.pauseAt || this.cursor;
        let   end   = end_time

        if (!end && selected.end !== selected.start && selected.end > start) {
            end = selected.end;
        } 
      
        if (this.isPlaying()) {
        return this.restartPlayFrom(start, end);
        }
    
        // TODO refector this in upcoming modernisation.
        if (this.effectsGraph)
        this.tracks && this.tracks[0].playout.setMasterEffects(this.effectsGraph);
    
        this.tracks.forEach((track) => {
        track.setState("cursor");
        playoutPromises.push(
            track.schedulePlay(current_time, start, end, {
            shouldPlay: this.shouldTrackPlay(track),
            masterGain: this.masterGain,
            })
        );
        });
    
        this.lastPlay = current_time;
        // use these to track when the playlist has fully stopped.
        this.playoutPromises = playoutPromises;
        this.startAnimation(start);
    
        return Promise.all(this.playoutPromises);
    }
    /**
     * 
     * @param {string} name 
     * @returns this.tracks[x => x.name = name]
     */
    getTrack(name){ if(name) return this.tracks.filter(track => track.name == name) }

    /**
     * @returns this.tracks
     */
    getTracks(){ return this.tracks }

    // History method's implementation ---------------------------------------------------------

    /**
     * @summary Boocle on reversed array history item copy
     *           If item.active 
     *             Set lastvalue of modification on data Class
     * 
     *  @param {integer} goto go to position in the list of history items
     */
    historyBackward(position = 1){ 
        let tour = 0;
            [...this.history.items].reverse().forEach(item => {
                if(tour < position){
                    if(item.active){
                        this.historySetItem(item.prop, item.last_value, item.id, false)
                        tour += 1;
                    }
                }
            })
    }

    /**
     * @summary Boocle on reversed array history item copy
     *            If item.active = false
     *             Set newvalue of modification on data Class
     * 
     * @param {integer} goto go to position in the list of history items
     */
    historyForward(goto = 1){
        let tour = 0
        this.history.items.forEach(item => {
            if(tour < goto){
                if(item.active == false){
                    tour += 1
                    this.historySetItem(item.prop, item.new_value, item.id, true)
                }
            }
        })
    }

    /**
     * @summary Set an class data an remove its action in history.items
     * @param {string} prop         class property
     * @param {any}    value        value for the class property
     * @param {any}    hitemid      history item id
     * @param {any}    hitem_value  history item value for active property
     */
    historySetItem(prop, value, hitemid, hitem_value){
        this[prop] = value
        this.history.items.pop()
        this.history.items.forEach((item, index) => {
            if(item.id === hitemid) this.history.items[index].active = hitem_value
        })
    }

    /**
     * @summary Execute an event out of the history system
     * @param {string} prop 
     * @param {any} data 
     */
    setOutOfHistoryItems(prop, data){
        if(typeof(prop) == 'array'){
            this[prop[0]][prop[1]] = data
        }else{
            this[prop] = data
        }

        this.history.items.pop()
    }

    /**
     * @summary Push an event to be executed when wait_events is emited on emiter
     * @param {any} event 
     */
    pushWaitEvents(event){
        const events = this.wait_events
        events.push(event)
        this.setOutOfHistoryItems('wait_events', events)
    }
}

export const smanager = new Proxy(new Smanager(), gestionnaire);