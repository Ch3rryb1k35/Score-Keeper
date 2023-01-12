const getPlayer = document.querySelector('#add-player');
const getPlayerField = document.querySelector('#playersCont .control');
const ulPlayer = document.querySelector('#players-list');
const startComp = document.querySelector('#startComp');
const menuSwitch = document.querySelector('#menuSection ul');
const sections = document.querySelectorAll('section.section');
const dropdownsOn = document.querySelectorAll('.dropdown');
const dropdownsOff = document.querySelectorAll('.dropdown .dropdown-menu');

let playersListArr = [];
let goalsToWin = 6;
let activeMenuEl = document.querySelector('#menuSection li.is-active');
let playersListVis = false;
let isDropdownActive = false;

dropdownsOn.forEach(el => {
    el.addEventListener('click', function() {
        if ( playersListArr.length !== 0 && isDropdownActive === false) {
            el.classList.add('is-active');
            isDropdownActive = true;
        }
    });
})

dropdownsOff.forEach(el => {
    el.addEventListener('click', function(e) {
        el.parentElement.classList.remove('is-active');
        isDropdownActive = false;
        console.log(e.target.innerText);
        console.dir(this.parentElement);
        e.stopPropagation();
    })
})



menuSwitch.addEventListener('click', function(e) {

    activeMenuEl.classList.remove('is-active');
    e.target.parentElement.classList.add('is-active');

    activeMenuEl = e.target.parentElement;

    allLi = document.querySelectorAll('#menuSection li');
    let index = 0;

    for (var i = 0; i < allLi.length; i++) {
        if (allLi[i].classList.contains('is-active')) {
            index = i;
        }
    }

    sections.forEach(el => {
        el.classList.add('is-hidden');
    })
    
    sections[index].classList.remove('is-hidden');
})

const menuActivator = () => {

}

getPlayer.addEventListener('click', function() {
    getNewPlayer();
})

getPlayerField.addEventListener('keyUp', function() {
    getNewPlayer();
})



let getNewPlayer = () => {
    player = getPlayer.parentElement.firstElementChild.firstElementChild;
    createPlayersList(player);
    sectionVisibility(playersListVis, ulPlayer.parentElement);
}

ulPlayer.addEventListener('click', function(e) {
    if (e.target.matches('button')) {
        let item = e.target.parentElement.innerText;
        let itemArr = playersListArr;
        itemArr = playersListArr.filter(el => el !== item);
        e.target.parentNode.remove();
        playersListArr = itemArr;
    }
})

startComp.addEventListener('click', function() {
    check = checkNumPlayers();
    if (check) {
        document.querySelector('#playersCont').classList.add('is-hidden');
        removeButtons = document.querySelectorAll('#players-list li button');
        removeButtons.forEach(element => {
            element.classList.add('is-hidden');
        });
    }

    list = document.querySelectorAll('.dropdowwn-players .dropdown-content');

    list.forEach(li => {
        playersListArr.forEach(item => {
            newListPlayer = document.createElement('A');
            newListPlayer.classList.add('dropdown-item');
            newListPlayer.append(item);
            li.appendChild(newListPlayer);
        })
    })

})

const createPlayersList = (player) => {
    if (player.value !== '') {
        liPlayer = document.createElement('LI');
        liPlayer.append(player.value);
        liButton = document.createElement('BUTTON');
        liButton.classList.add('delete');
        liPlayer.append(liButton);
        ulPlayer.append(liPlayer);
        playersListArr.push(player.value);
        player.value = '';
    } else {
        document.querySelector('#emptyPlayerAddErr').classList.add('is-active');
    }
}

const checkNumPlayers = () => {
    if (playersListArr.length < 2 ) {
        document.querySelector('#notEnoughPlayersErr').classList.add('is-active');
        return false;
    }
    if (playersListArr.length % 2 != 0 ) {
        document.querySelector('#correctPlayersNumErr').classList.add('is-active');
        return false;
    } else {
        return true;
    }
}

const sectionVisibility = (v, el) => {
    if (v === false && playersListArr.length === 0 ) {
        el.classList.add('is-hidden');
        playersListVis = false;
    } else {
        el.classList.remove('is-hidden');
        playersListVis = true;
    }
}

