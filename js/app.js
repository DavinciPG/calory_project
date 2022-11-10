// Storage controller
const StorageController = (function() {
    // public
    return {
        storeItem: function(item) {
            let items;

            if(localStorage.getItem('items') === null) {
                items = []
                items.push(item)
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                items = JSON.parse(localStorage.getItem('items'));
                items.push(item)
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItems: function() {
            let items;
            if(localStorage.getItem('items') === null) {
                items = []
            } else {
                items = JSON.parse(localStorage.getItem('items'))
            }
            return items;
        },
    }
})();

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

        ],
        total: 0
    }

    return {
        includes: function(item) {
            if(data.items.includes(item))
                return true
            else
                return false
        },
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

            const items = StorageController.getItems()

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
const App = (function(StorageController, ItemController, UIController) {
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
            const newItem = ItemController.addItem(input.name, input.calories)
            StorageController.storeItem(newItem)

            // We don't need to make another function just to redo the item list
            // when we already have a working function.
            UIController.populateItemList()

            // Clearing input values
            UIController.clearInput()
        }

        event.preventDefault()
    }

    const fillItemList = function() {
        const items = StorageController.getItems()
        items.forEach(function(item) {
            if(!ItemController.includes(item)) {
                ItemController.addItem(item.name, item.calories)
            }
        })
    }

    return {
        init: function() {
            console.log('Initialization...')

            fillItemList()

            // Item setup
            UIController.populateItemList()

            // Event listener setup
            loadEventListeners()
        }
    }
})(StorageController, ItemController, UIController);

// Initialize app
App.init()