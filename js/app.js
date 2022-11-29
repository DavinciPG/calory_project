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
        updateList: function(items) {
            localStorage.setItem('items', JSON.stringify(items))
        }
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
        total: 0,
        currentItem: null
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
        getItem: function(ID) {
             let found = null;
             data.items.forEach(function(item, index) {
                if(item.id === ID) {
                    found = item;
                }
             });
            return found;
        },
        getTotalCalories: function() {
            let calories = 0;

            // somehow adding together as a string
            data.items.forEach(function(item) {
                calories = calories + parseInt(item.calories)
            });
            // Set total calories
            data.total = calories;

            return data.total
        },
        updateItem: function(ID, name, calories) {
            data.items.forEach(function(item) {
                if(item.id === ID) {
                    item.name = name
                    item.calories = calories
                }
            })
            UIController.populateItemList()
        },
        logData: function() {
            return data
        },
        getCurrentItem: function() {
            return data.currentItem
        },
        setCurrentItem: function(item) {
            data.currentItem = item
        },
        clearCurrentItem: function() {
            data.currentItem = null
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
        editBtn: '.change-btn',
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
                         <strong id="i-name">${item.name}: </strong><em id="i-calories">${item.calories} Calories</em>
                         <a href="#" class="secondary-content">
                            <i class="fa-solid fa-pencil"></i>
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
        setItemInput: function(name, calories) {
            document.querySelector(UISelectors.itemNameInput)
                .value = name
            document.querySelector(UISelectors.itemCaloriesInput)
                .value = calories
        },
        clearInput: function() {
            document.querySelector(UISelectors.itemNameInput)
                .value = ''
            document.querySelector(UISelectors.itemCaloriesInput)
                .value = ''
        },
        showTotalCalories: function(totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories
        },
        editMeal: function(event) {
            if(event.target.parentElement.parentElement.className === "collection-item")
            {
                document.querySelector(UISelectors.editBtn).style.display = 'inline';

                // easier to do with ID but meh
                const ID = parseInt(event.target.parentNode.parentNode.id.split("-")[1])
                const name = event.target.parentElement.parentElement.querySelector('#i-name').textContent.slice(0, -2)
                const calories = event.target.parentElement.parentElement.querySelector('#i-calories').textContent

                const Item = ItemController.getItem(ID)
                ItemController.setCurrentItem(Item)
                UIController.setItemInput(Item.name, Item.calories)
            }
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

        document.querySelector(UISelectors.itemList).addEventListener('click', UIController.editMeal)
        document.querySelector(UISelectors.editBtn).addEventListener('click', itemEditSubmit)

    }

    const itemEditSubmit = function(event) {
        const input = UIController.getItemInput();
        const UISelector = UIController.getSelectors().editBtn

        let items = StorageController.getItems()
        let ID = ItemController.getCurrentItem().id
        items.forEach(function(item) {
            if(item.id === ID) {
                item.name = input.name
                item.calories = input.calories
            }
        })
        StorageController.updateList(items)
        ItemController.updateItem(ID, input.name, input.calories)

        UIController.clearInput()
        ItemController.clearCurrentItem()
        document.querySelector(UISelector).style.display = 'none';
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