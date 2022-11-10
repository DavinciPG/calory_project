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
        getItems: function() {
            return data.items
        },
        logData: function() {
            return data
        }
    }
})();

// UI Controller
const UIController = (function() {
    const UISelectors = {
        itemList: '#item-list'
    }
    return {
        populateItemList: function(items) {
            // create html content
            let html = '';

            // parse data
            items.forEach(function(item) {
                html += `<li class="collection-item" id="item-${item.id}">
                         <strong>${item.name}: </strong><em>${item.calories} Calories</em>
                         <a href="#" class="secondary-content">
                            <i class="edit-item fa-fa-pencil"></i>
                         </a>
                         </li>`
            });

            document.querySelector(UISelectors.itemList).
                innerHTML = html;
        }
    }
})();

// App Controller
const App = (function(ItemController, UIController) {

    return {
        init: function() {
            console.log('Initialization...')

            const items = ItemController.getItems()

            UIController.populateItemList(items)
        }
    }
})(ItemController, UIController);

// Initialize app
App.init()