// Storage controller

// Item Controller
const ItemController = (function() {
    // Constructor
    const Item = function(id, name, calories) {
        this.id = id
        this.name = name
        this.calories = calories
    }

    // Struct
    const data = {
        items: [
            {id: 0, name: 'Steak Dinner', calories: 1200},
            {id: 1, name: 'Cookie', calories: 400},
            {id: 2, name: 'Egg', calories: 300}
        ],
        total: 0
    }

    return {
        logData: function() {
            return data
        }
    }
})();

// UI Controller
const UIController = (function() {

})();

// App Controller
const App = (function(ItemController, UIController) {

    return {
        init: function() {
            console.log('Initialization...')
        }
    }
})(ItemController, UIController);

// Initialize app
App.init()