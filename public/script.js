

const itemTemplates = document.querySelector('#item-template')
// const RemoveAll = document.querySelector('.removeAll')
const Username = document.querySelector('.Login > .UserLogin > .User > .Username')
const SignLogin = document.querySelector('.Login > .UserLogin > .LoginLink > .LoginSign')
const mediaQuery950 = window.matchMedia("(max-width:950px)")

const msg = document.querySelector('.list-items > ul')



const savedItems = []
let currentMenu = null;
let username = ''
const SignUpLoaded = () => {
    try {
        let data = JSON.parse(localStorage.getItem('Data'))

        console.log('work', data)
        data.map(Item => {
            msg.innerHTML = ""
            displayUser(Item)
            DefaultLoad(true, Item.Username)
        })
    }
    catch {
        console.log('next')
    }


}
const TimeFunc = (date) => {
    let Hours = date.getHours()
    let Minutes = date.getMinutes()
    let month = date.getMonth()
    let TodayDate = date.getDate()
    let AmPm = Hours >= 12 ? 'Pm' : 'Am'
    Hours = Hours % 12
    Hours = Hours ? Hours : 12
    const Add0 = (n) => {
        n = n < 10 ? '0' + n : n
        return n
    }
    Minutes = Add0(Minutes)
    month = Add0(month)
    TodayDate = Add0(TodayDate)
    let monthWord = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    month = month < 10 ? '0' + month : month
    let strTime = { date: TodayDate, month: monthWord[month], hours: Hours, minutes: Minutes, ampm: AmPm }
    return strTime
}


const LoginLoaded = () => {
    try {
        let Data = [JSON.parse(localStorage.getItem('LoginData'))]

        console.log('LoginData', Data)
        msg.innerHTML = ""
        Data.forEach(Item => {

            displayUser(Item)
            DefaultLoad(true, Item.Username)
            localStorage.setItem('Data', JSON.stringify(Item))

        })
    }
    catch {
        console.log('nexting')
        SignUpLoaded()
    }


}

setTimeout(() => {

    LoginLoaded()

}, 500);



const DefaultLoad = (ifData = false, username) => {

    fetch(`/app/${username}/`, {
        method: 'GET'
    })

        .then(response => response.json())
        .then(data => {

            if (ifData) {

                data.map(Item => {
                    displayItem(Item, true)
                })
            }

        })
        .catch(error => console.error('Error fetching data: ', error));
}
setTimeout(() => {
    // console.log('name',username)
    // DefaultLoad(ifData = true, username)

}, 501);


const displayUser = (name) => {
    Username.textContent = ""
    Username.textContent = name.Username

    SignLogin.textContent = 'Log Out'

    SignLogin.addEventListener('click', () => {
        Username.textContent = 'Username'
        localStorage.removeItem('Data')
        localStorage.removeItem('LoginData')
    })
}


const getAnimation = (node) => {
    const style = window.getComputedStyle(node)
    addTodobtn.style.transform = 'scale(0.8)'
    let duration = style.getPropertyValue('--animation-duration')
    duration = parseFloat(duration)

    return duration
}

const displayItem = (ItemsOnList, appear = false) => {

    savedItems.push(ItemsOnList)

    const itemNode = itemTemplates.content.firstElementChild
        .cloneNode(true);


    const itemTitle = itemNode.querySelector('.list-item__title > *')
    const itemMsg = itemNode.querySelector('#msg')
    const DeleteEl = itemNode.querySelector('.menu_wrapper > .menu_base > .DeleteBar')
    const MenuBtn = itemNode.querySelector('.menu_wrapper > .menuBar')
    const MenuBase = itemNode.querySelector('.menu_wrapper > .menu_base')
    const date = itemNode.querySelector('#time')

    date.textContent = `${ItemsOnList.TimeDate.date} ${ItemsOnList.TimeDate.month} ${ItemsOnList.TimeDate.hours}:${ItemsOnList.TimeDate.minutes} ${ItemsOnList.TimeDate.ampm}`
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



    if (appear) {
        itemNode.classList.add('appear')
    }


    msg.prepend(itemNode)

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

    DeleteEl.addEventListener('click', () => {
        if (itemNode.classList.contains('checked')) {
            console.dir(itemNode)
        }
        const __id = ItemsOnList._id

        const uname = Username.textContent

        deleteTask(uname, __id)
        const duration = getAnimation(DeleteEl)
        setTimeout(() => {
            const index = savedItems.indexOf(ItemsOnList)

            savedItems.splice(index, 1);
            // if (NumData % 2 == 0) {
            //     col_1.removeChild(itemNode)
            // }
            // else {
            //     col_2.removeChild(itemNode)
            // }
            msg.removeChild(itemNode)

        }, duration);
    })

}
const DataLoad = (data) => {

    fetch('/app', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },

        body: JSON.stringify({ data }),
    })
        .then(response => response.json())
        .then(responseData => {
            // console.log('Response from backend:', responseData);
            displayItem(responseData, true)
        })
        .catch(error => console.error('Error sending data:', error));


}
//deleDtaonDataBase
const deleteTask = async (data, ID) => {
    console.log('delete Loaded', data);
    const uname = ID
    const id = data
    fetch(`/app/${id}:${uname}`, {
        method: 'delete'

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
            username: Username.textContent,
            subject: subject,
            message: message,
            checked: false,
            TimeDate: TimeFunc(new Date)
        }

        DataLoad([data])

        addTodo.value = ''
        addMsg.value = ''
    }
})

const addButton = document.querySelector('.icons > .add-button');
const addPanel = document.querySelector('.addPanel');
const refresh = document.querySelector('.FormDatas > .list_header > .refresh');

refresh.addEventListener('click', () => {
    refresh.style.rotate += '360deg'
    refresh.style.transition = '0.50s'
    setTimeout(() => {
        refresh.style = null

    }, 500);

    LoginLoaded()
    console.log('run')
})
addButton.addEventListener('click', () => {
    addButton.classList.toggle('open');
    addPanel.classList.toggle('open');
})



const LoginLink = document.querySelector('.Login > .UserLogin > .LoginLink > .navLink')
const OpenNav = document.querySelector('.Login > .navBar > .navlist')
const overlay = document.querySelector('.overlay')

LoginLink.addEventListener('click', () => {
    OpenNav.classList.toggle('open')

    if (OpenNav.className == 'navlist open') {
        console.log('data')
        overlay.style.display = 'block'
        navbar.style.transform = 'translateX(0)';
    }
    else {
        overlay.style.display = 'none'
        navbar.style.transform = 'translateX(-100)';
    }

})


const preloader = document.getElementById('preloader')

console.log(preloader)


window.addEventListener('load', () => {
    setTimeout(() => {
        preloader.style.display = 'none'
    }, 2500);

})