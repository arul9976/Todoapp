
const itemTemplates = document.querySelector('#item-template')
// const RemoveAll = document.querySelector('.removeAll')
const Username = document.querySelector('.Login > .UserLogin > .User > .Username')

const msg = document.querySelector('.list-items > ul')
const col_1 = msg.querySelector('.col_1')
const col_2 = msg.querySelector('.col_2')


const savedItems = []
let currentMenu = null;


const UserLoaded = () => {
    fetch('http://localhost:8000/app/submit-form')
        .then(response => response.json())
        .then(data => {
            console.log('datas', data);
            data.map(uname => {
                displayUser(uname)
            })
        })
        .catch(error => console.error('Error fetching data: ', error));

}
console.log('userLoad');
UserLoaded()

const DefaultLoad = (ifData = false) => {

    fetch('http://localhost:8000/app')
        .then(response => response.json())
        .then(data => {
            savedItems.length = 0
            savedItems.push(...data)

            console.log(savedItems.length)
            if (ifData) {
                // msg.innerHTML = ""
                col_1.innerHTML = ""
                col_2.innerHTML = ""
                data.map(Item => {
                    displayItem(Item, true)
                })
            }

            if (ifData === false) {
                console.log(savedItems.length)
                setTimeout(() => {
                    displayItem(savedItems[savedItems.length - 1], true)
                }, 500);

            }

        })
        .catch(error => console.error('Error fetching data: ', error));
}

DefaultLoad(ifData = true, Load = true)


const displayUser = (name) => {
    Username.textContent = ""
    Username.textContent = name.Username
}


const getAnimation = (node) => {
    const style = window.getComputedStyle(node)
    addTodobtn.style.transform = 'scale(0.8)'
    let duration = style.getPropertyValue('--animation-duration')
    duration = parseFloat(duration)

    return duration
}

const displayItem = (ItemsOnList, appear = false) => {
    const itemNode = itemTemplates.content.firstElementChild
        .cloneNode(true);


    const itemTitle = itemNode.querySelector('.list-item__title > *')
    const itemMsg = itemNode.querySelector('#msg')
    const DeleteEl = itemNode.querySelector('.menu_wrapper > .menu_base > .DeleteBar')
    const MenuBtn = itemNode.querySelector('.menu_wrapper > .menuBar')
    const MenuBase = itemNode.querySelector('.menu_wrapper > .menu_base')


    MenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();

        if (currentMenu) {
            currentMenu.classList.remove('open');
            currentMenu = null
        }
        MenuBase.classList.add('open')
        currentMenu = MenuBase
    })
    MenuBase.addEventListener('click', (e) => {
        e.stopPropagation();
        MenuBase.classList.remove('open')
        currentMenu = null
    })

    const UpperFont = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    let subjectName = UpperFont(ItemsOnList.subject)
    itemTitle.innerText = subjectName;
    itemMsg.innerText = ItemsOnList.message;
    itemTitle.id = ItemsOnList._id


    if (ItemsOnList.checked) {
        itemNode.classList.add('checked')
    }

    itemNode.addEventListener('click', (e) => {
        ItemsOnList.checked = !ItemsOnList.checked;

        if (ItemsOnList.checked) {
            itemNode.classList.add('checked')
        }
        else {
            itemNode.classList.remove('checked')
        }
    })
    let NumData = savedItems.indexOf(ItemsOnList)

    if (NumData % 2 == 0) {
        col_1.prepend(itemNode)
    }
    else {
        col_2.prepend(itemNode)
    }
    // msg.prepend(itemNode)
    if (appear) {
        itemNode.classList.add('appear')
    }
    // RemoveAll.addEventListener('click', () => {
    //     const checked = msg.querySelectorAll('.list-item.checked')
    //     checked.forEach(DataChecked => {
    //         const index = savedItems.indexOf(ItemsOnList)
    //         savedItems.splice(index, 1);
    //         const id = DataChecked.querySelector('.list-item__title > span').id
    //         deleteTask(id)
    //         msg.removeChild(DataChecked)
    //     })
    // })
    console.log(DeleteEl);
    DeleteEl.addEventListener('click', () => {
        if (itemNode.classList.contains('checked')) {
            console.dir(itemNode)
        }
        const __id = ItemsOnList._id
        deleteTask(__id)
        const duration = getAnimation(DeleteEl)
        setTimeout(() => {
            const index = savedItems.indexOf(ItemsOnList)

            savedItems.splice(index, 1);
            if (NumData % 2 == 0) {
                col_1.removeChild(itemNode)
            }
            else {
                col_2.removeChild(itemNode)
            }
            // msg.removeChild(itemNode)
        }, duration);
    })

}
const DataLoad = (data) => {

    fetch('http://localhost:8000/app', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },

        body: JSON.stringify({ data }),
    })
        .then(response => response.json())
        .then(responseData => {
            console.log('Response from backend:', responseData);
            // Handle the response from the backend here
        })
        .catch(error => console.error('Error sending data:', error));
    console.log('dataLoad')

}
//deleDtaonDataBase
const deleteTask = async (taskId) => {
    console.log('delete Loaded');

    const id = taskId;
    console.log(id);
    fetch(`http://localhost:8000/app/${id}`, {
        method: "DELETE",
    })
        .then((response) => {
            if (response.ok) {
                console.log("Item deleted successfully.");
            } else {
                console.error("Error deleting item.");
            }
        })
        .catch((error) => {
            console.error("Network error:", error);
        });
};



const addTodo = document.querySelector('.add-todo')
const addMsg = document.querySelector('.add_msg')
const addTodobtn = document.querySelector('.add-todo-btn')

addTodobtn.addEventListener('click', () => {
    addTodobtn.classList.add('sending');
    const duration = getAnimation(addTodobtn)
    setTimeout(() => {
        addTodobtn.classList.remove('sending')
    }, duration);
    setTimeout(() => {
        addTodobtn.style.transform = 'scale(1.0)'
    }, 200);

    if (addTodo.value === '' && addMsg.value === '') {
        console.log('super');
    }
    else {
        let subject = addTodo.value
        let message = addMsg.value

        const data =
        {
            subject: subject,
            message: message,
            checked: false
        }

        DataLoad([data])
        setTimeout(() => {
            DefaultLoad()
        }, 500);
        addTodo.value = ''
        addMsg.value = ''
    }
})

const addButton = document.querySelector('nav > .icons > .add-button');
const addPanel = document.querySelector('.addPanel');
const refresh = document.querySelector('.icons > .refresh');

refresh.addEventListener('click', () => {
    DefaultLoad(ifData = true)
    console.log('run')
})
addButton.addEventListener('click', () => {
    addButton.classList.toggle('open');
    addPanel.classList.toggle('open');
})



const LoginLink = document.querySelector('.Login > .UserLogin > .LoginLink > .navLink')
const OpenNav = document.querySelector('.Login > .navBar > .navlist')


LoginLink.addEventListener('click', () => {
    OpenNav.classList.toggle('open')
})
console.log(LoginLink);
console.log(OpenNav);
// setInterval(() => {
//     DefaultLoad(true)
// }, 30000);