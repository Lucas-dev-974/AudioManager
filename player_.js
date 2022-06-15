import gestionnaire from './HistorySystem.js'

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
                track.color  = 'white'
                track.blob   = null
            }
        });
    }

    getTrack(name){ if(name) return this.tracks.filter(track => track.name == name) }

    getTracks(){ return this.tracks }

    test(data = 'test'){ this.teste = data }




    /**
     * @summary Boocle on reversed array history item copy
     *              If item.active 
     *                  Set lastvalue of modification on data Class
     */
    historyBackward(){ 
        [...this.history.items].reverse().every(item => {
            if(item.active){
                this.historySetItem(item.prop, item.last_value, false)
                return false
            }
        })
    }


    /**
     * @summary Browse history.items until find item.id = itemid
     *          If item.id = itemid also change class property with last_value of historique item
     *          Else change class property with last_value of historique item and update item as false
     * @param {integer} itemid 
     */
    historyBackTo(itemid){
        if(!isNaN(itemid)){
            [...this.history.items].reverse().forEach(item => {
                if(item.id === itemid){
                    this.historySetItem(item.prop, item.last_value, false)
                    return 
                }else{
                    this.historySetItem(item.prop, item.last_value, false)
                    this.historyUpdateItemState(item.id, 'active', false)
                }
            })
        }
    }

    historyGoTo(itemid){
        if(!isNaN(itemid)){
            [...this.history.items].reverse().forEach(item => {
                if(item.id === itemid){
                    this.historySetItem(item.prop, item.last_value, false)
                    return 
                }else{
                    this.historySetItem(item.prop, item.last_value, false)
                    this.historyUpdateItemState(item.id, 'active', false)
                }
            })
        }
    }



    /**
     * @summary Boocle on reversed array history item copy
     *              If item.active = false
     *                  Set newvalue of modification on data Class
     */
    historyForward(){
        [...this.history.items].reverse().every(item => {
            if(item.active == false){
                this.historySetItem(item.prop, item.new_value, true)
                return
            }
        })
    }

    /**
     * @summary Set an class data an remove its action in history.items
     * @param {string} item_name 
     * @param {any}    value 
     */
    historySetItem(item_name, value, active){
        this[item_name] = value
        this.history.items.pop()
        this.history.items.at(-1).active = active
    }


    /**
     * @summury Boocle on history.items
     *              If item.id = id
     *                  set history item property with value
     * @param {integer} id 
     * @param {string}  prop 
     * @param {any}     value 
     */
    historyUpdateItemState(id, prop, value){
        this.history.items.forEach((item, index) => {
            if(item.id == id) {
                this.history.items[index][prop] = value
            }
        })
    }

}

export const smanager = new Proxy(new Smanager(), gestionnaire);