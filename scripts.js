const getPlayer = document.querySelector('#add-player');
const getPlayerField = document.querySelector('#playersCont input');
const ulPlayer = document.querySelector('#players-list');
const startComp = document.querySelector('#startComp');
const menuSwitch = document.querySelector('#menuSection ul');
const sections = document.querySelectorAll('section.section');
const dropdownsOn = document.querySelectorAll('.dropdown');
const dropdownsOff = document.querySelectorAll('.dropdown .dropdown-menu');
const resultsTable = document.querySelector('#tableSection');
const startRound = document.querySelector('#start');
const choosenButtons = document.querySelectorAll('.dropdowwn-players .buttons.has-addons');
const playerLabels = document.querySelectorAll('.player-label');
const counterPlus = document.querySelectorAll('button.counter.plus');
const counterMinus = document.querySelectorAll('button.counter.minus');
const goalsNumber = document.querySelector('#goals-number');
const playerCounters = document.querySelectorAll('.player-label > span');
const firstOrderArr = [];
const secondOrderArr = [];

let playersListArr = [];
let playersListArrShift = [];
let roundParticipants = [];
let resultsObject = {};
let goalsToWin = 6;
let numbrOfStages = [];
let randMatches = [];
let activeMenuEl = document.querySelector('#menuSection li.is-active');
let playersListVis = false;
let isDropdownActive = false;
let isPlayerSelected = false;


let playerCounter = () => {
    playerCounters.forEach(el => {
        el.addEventListener('click', function() {
            console.log(el)
        })
    })
}

goalsNumber.addEventListener('click', function(e) {
    e.preventDefault();
    goalsToWin = this.form[0].value;
})

let funcNumberStages = () => {
    numbrOfStages[0] = playersListArr.length;
    num = playersListArr.length;
    counter = 1;
    while (num > 3) {
        num = Math.round(num / 2);
        if (num == 1 || num ==2 ) { break; }
        numbrOfStages[counter] = num;
        counter++;
    }
}

const evenCompSingleWin = (name) => {
    document.querySelectorAll(".player-box .counter").forEach(el => {
        el.setAttribute('disabled', '');
    })

    if (numbrOfStages.length == 1) {
        resultsObject[name].level = 'Winner!';
    }

    resultsObject[name].playedRounds = resultsObject[name].playedRounds + 1;
    resultsObject[name].wins = resultsObject[name].wins + 1;
    
    roundParticipants = roundParticipants.filter(el => el !== name);
    
    evenCompSingleLost(roundParticipants);
}

const evenCompSingleLost = (array) => {
    resultsObject[array[0]].playedRounds = resultsObject[array[0]].playedRounds + 1;
    resultsObject[array[0]].lose = resultsObject[array[0]].lose + 1;
    resultsObject[array[0]].level = resultsObject[array[0]].level + 1;
    if (numbrOfStages.length == 1) {
        resultsObject[array[0]].level = 'Disqualified';
    }
}

counterPlus.forEach(el => {
    el.addEventListener('click', function(e) {
        element = e.target.closest('.player-box').querySelector('.player-points').innerHTML;
        element++;

        playerEl = e.target.closest('.player-box').querySelector('.player-name').innerHTML;
        
        playerName = playerEl.slice(0, -2);
        resultsObject[playerName].points = element;

        if(element == goalsToWin ) {
            console.log("Winner");
            evenCompSingleWin(playerName);
        }
          
        e.target.closest('.player-box').querySelector('.player-points').innerHTML = element;
    })
})

counterMinus.forEach(el => {
    el.addEventListener('click', function(e) {

        element = e.target.closest('.player-box').querySelector('.player-points').innerHTML;

        element--;
        e.target.closest('.player-box').querySelector('.player-points').innerHTML = element;
    })
})

startRound.addEventListener('click', function() {
    
    if (!beforeStartCheck()) {
        choosenButtons.forEach(el => {
            player = el.querySelector('button[is-choosen] span').innerText;
            roundParticipants.push(player);

            playerName = el.children[0].innerText;
            console.log(el.closest('.player-box').querySelector('.player-name'));
            el.closest('.player-box').querySelector('.player-name').innerHTML = `${playerName}: `;
            el.closest('.player-box').querySelector('.player-name + span').classList.remove('is-hidden')

            el.querySelector('button[is-choosen]').setAttribute('disabled', '');
        })
    } else {
        document.querySelector('#startRoundWithOnePlayer').classList.add('is-active');
        return false;
    }
    
    document.querySelectorAll(".player-box .counter").forEach(el => {
        el.removeAttribute('disabled');
    })

    startRound.setAttribute('disabled', '');
})

const beforeStartCheck = () => {
    const isChoosenPlayers = [];

    choosenButtons.forEach(el => {
        if (el.querySelector('[is-choosen]').getAttribute('is-choosen') === 'true') {
            isChoosenPlayers.push(true);
        } else {
            isChoosenPlayers.push(false);
        }
    })

    return result = isChoosenPlayers.includes(false);
}

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
        dropdownChosen = this.parentElement.getElementsByTagName('span');
        dropdownChosen[0].innerText = e.target.innerText;
        playersListArrShift = playersListArr.filter(el => el !== e.target.innerText);

        choosenAttr = this.parentElement.querySelector('[is-choosen]');
        choosenAttr.setAttribute('is-choosen', true);
     
        dropdownsOff.forEach(el => {

            if (!el.parentElement.classList.contains('is-active')) {

                element = el.firstElementChild;
                while(element.firstElementChild) {
                    element.removeChild(element.lastElementChild);
                }

                playersListArrShift.forEach(item => {
                    newListPlayer = document.createElement('A');
                    newListPlayer.classList.add('dropdown-item');
                    newListPlayer.append(item);
                    element.appendChild(newListPlayer);
                })
            }
        })

        el.parentElement.classList.remove('is-active');
        isDropdownActive = false;
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

getPlayer.addEventListener('click', function() {
    getNewPlayer();
})

getPlayerField.addEventListener('keypress', (event) => {
    if (event.keyCode === 13) {
        getNewPlayer();
    }
});

let getNewPlayer = () => {
    player = getPlayer.parentElement.firstElementChild.firstElementChild;
    createPlayersList(player);
    if (player.value.length !== 0) { 
        createPlayersTable(player);
    }
    sectionVisibility(playersListVis, ulPlayer.parentElement);
    player.value = '';
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

        if ( playersListArr.length % 2  == 0 ) {
            document.querySelector('#playersCont').classList.add('is-hidden');
            removeButtons = document.querySelectorAll('#players-list li button');
            removeButtons.forEach(element => {
                element.classList.add('is-hidden');
            });
    
            list = document.querySelectorAll('.dropdowwn-players .dropdown-content');
    
            listForDropdown(list, playersListArr);
        }
        else {
            createOrder(playersListArr, randMatches);
        }

        startComp.setAttribute('disabled', '');
    }

    funcNumberStages();

    createResultsArray(playersListArr, resultsObject);
})

let createOrder = (array, object) => {
    arrlength = array.length;

    for(let i = 0; i <= arrlength-1; i++) {
        firstOrderArr[i] = array[i];
        secondOrderArr[i] = array[i+1];
        if (i == arrlength-1) { secondOrderArr[i] = array[0]; }
    }
console.log(firstOrderArr, secondOrderArr);
}



let createResultsArray = (array, object) => {
    for (let i = 0; i < array.length; i++) {
        plname = array[i]; 
        info = {};
        info.name = plname;
        info.playedRounds = 0;
        info.wins = 0;
        info.drawn = 0;
        info.lose = 0;
        info.points = 0;
        info.level = 'Enter the Qualification';
        object[plname] = info;
    }
}

let listForDropdown = (list, array) => {
    list.forEach(li => {
        array.forEach(item => {
            newListPlayer = document.createElement('A');
            newListPlayer.classList.add('dropdown-item');
            newListPlayer.append(item);
            li.appendChild(newListPlayer);
        })
    })
}

const createPlayersList = (player) => {

    if (player.value.length !== 0) {
        liPlayer = document.createElement('LI');
        liPlayer.append(player.value);
        liButton = document.createElement('BUTTON');
        liButton.classList.add('delete');
        liPlayer.append(liButton);
        ulPlayer.append(liPlayer);
        playersListArr.push(player.value);

    } else {
        document.querySelector('#emptyPlayerAddErr').classList.add('is-active');
        return false;
    }
}

const createPlayersTable = (player) => {
    tr = document.createElement('TR');
    for (let i = 1; i < 9; i++ ) {
        if (i == 1) {
            th = document.createElement('TH');
            th.append(playersListArr.length);
            tr.appendChild(th);
        } else {
            td = document.createElement('TD');
            let cont = (i === 2) ? player.value : (i === 8) ? 'Enter the Qualification' : '0';
    
            td.append(cont);
            tr.appendChild(td); 
        }
    }
    resultsTable.children[0].appendChild(tr);
}

const checkNumPlayers = () => {
    if (playersListArr.length < 2 ) {
        document.querySelector('#notEnoughPlayersErr').classList.add('is-active');
        return false;
    }
/*
    if (playersListArr.length % 2 != 0 ) {
        document.querySelector('#correctPlayersNumErr').classList.add('is-active');
        return false;
    }
*/ 
    else {
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

console.log(numbrOfStages);
console.log(resultsObject);
console.log()