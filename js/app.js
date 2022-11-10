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
        addItem: function(name, calories) {
              let ID;
              if(data.items.length > 0) {
                  ID = data.items[data.items.length - 1].id + 1
              } else {
                  ID = 0
              }
              calories = parseInt(calories);
              // create item
            newItem = new Item(ID, name, calories);
            data.items.push(newItem)

            // return
            return newItem
        },
        getTotalCalories: function() {
            let calories = 0;

            data.items.forEach(function(item) {
                calories = calories + item.calories
            });
            // Set total calories
            data.total = calories;

            return data.total
        },
        logData: function() {
            return data
        }
    }
})();

// UI Controller
const UIController = (function() {
    const UISelectors = {
        itemList: '#item-list',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        addBtn: '.add-btn',
        totalCalories: '.total-calories'
    }
    return {
        populateItemList: function() {
            // create html content
            let html = '';
            const items = ItemController.getItems()

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

            const calories = ItemController.getTotalCalories()
            UIController.showTotalCalories(calories)
        },
        getSelectors: function() {
            return UISelectors
        },
        getItemInput: function() {
            return {
                name:document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        clearInput: function() {
            document.querySelector(UISelectors.itemNameInput)
                .value = ''
            document.querySelector(UISelectors.itemCaloriesInput)
                .value = ''
        },
        showTotalCalories: function(totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories
        }
    }
})();

// App Controller
const App = (function(ItemController, UIController) {
    const loadEventListeners = function() {
        // UI Selector setup
        const UISelectors = UIController.getSelectors();
        document.querySelector(UISelectors.addBtn).
            addEventListener('click', itemAddSubmit);
    }
    // Item add
    const itemAddSubmit = function(event) {
        const input = UIController.getItemInput()
        // prevent null being added to list
        if(input.name !== '' && input.calories !== '') {
            ItemController.addItem(input.name, input.calories)

            // We don't need to make another function just to redo the item list
            // when we already have a working function.
            UIController.populateItemList()

            // Clearing input values
            UIController.clearInput()
        }

        event.preventDefault()
    }
    return {
        init: function() {
            console.log('Initialization...')

            // Item setup
            UIController.populateItemList()

            // Event listener setup
            loadEventListeners()
        }
    }
})(ItemController, UIController);

// Initialize app
App.init()