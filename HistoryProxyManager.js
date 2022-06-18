const gestionnaire = {
    /**
     * @summary When getter is called on cible execute
     * @param {any} cible 
     * @param {string} prop 
     * @param {any} recepteur 
     * @returns 
     */
    get(cible, prop, recepteur) {
        recepteur
        cible.history.last_called_method = prop
        return Reflect.get(...arguments);
    },

    /**
     * @summary When set property of object "obj" do next code
     *          hitem param is "history item"
     * @param {any} obj 
     * @param {string} prop 
     * @param {any} valeur 
     * @returns 
     */
    set(obj, prop, valeur){
        // console.log('--------', obj);
        const hitem = {
            id: obj.history.items.length + 1,
            date: Date.now(),
            prop: prop,
            last_value: obj[prop],
            new_value:  valeur,
            active:     true
        }
        obj[prop]   = valeur;
        obj.history.items.push(hitem);
        return true
    },
}


export default gestionnaire