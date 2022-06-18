import gestionnaire from './HistoryProxyManager.jsger.js'

class Smanager {
    constructor(){
        this.ac = null
        this.ee = null    

        // Tracks
        this.tracks = [];
        this.mutedTracks = [];
        // this.collapsedTracks = [];
        // this.playoutPromises = []; 
        
        this.history = {
            last_called_method: '',
            items: [],
            gestionnaire: gestionnaire
        }
    }

    /**
     * @summary When page is loaded try to get the AudioContext object
     *          and setup it in this.ac
     */
    initPlayer(){
        window.addEventListener('load', async () => {
            try{ 
                this.ac = new (window.AudioContext || window.webkitAudioContext)(); 
                this.history.items.pop() 
            }
            catch(e) { alert('Désoler la web audio API n\'est pas supporter par votre navigateur, veuillez le metre à jour ou changer de naviguateur !') }
        }, false);
    }   

    /**
     * @summary Format tracks on object array
     * @param {Object array} tracks - Lists of object that contain {url, name, options} of one track
     */
    async laodTracks(tracks){
        tracks.forEach(track => {
            if(track.src){
                track.volume = 5
                track.blob   = null
            }
        });
    }

    /**
     * 
     * @param {string} name 
     * @returns this.tracks[x => x.name = name]
     */
    getTrack(name){ if(name) return this.tracks.filter(track => track.name == name) }

    /**
     * 
     * @returns this.tracks
     */
    getTracks(){ return this.tracks }

    test(data = 'test'){ this.teste = data }



    // History method's implementation ------------------------------

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
}

export const smanager = new Proxy(new Smanager(), gestionnaire);