/**
 * Different types of elements on page that cannot be changed
 */

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
const nextRound = document.querySelector('#next-round');
let activeMenuEl = document.querySelector('#menuSection li.is-active');


/**
 * Variables and arrays
 */

 const resultsObjectProperties = [
    'playedRounds',
    'wins',
    'drawn',
    'lose',
    'points',
    'level'
]

const firstOrderArr = [];
const secondOrderArr = [];
let nextRoundParticipants = [];

let playersListArr = [];
let playersListArrShift = [];
let roundParticipants = [];
let resultsObject = {};
let goalsToWin = 2;
let numbrOfStages = [];
let randMatches = [];

/**
 * Boolean Switchers
 */
let playersListVis = false;
let isDropdownActive = false;
let isPlayerSelected = false;

/**
 * Functions
 */

/**
 * Function funcNumberStages 
 * creates an array with the number of rounrs
 * based on the number of players
 */
let funcNumberStages = () => {
    numbrOfStages[0] = playersListArr.length;
    num = playersListArr.length;
    counter = 1;
    while (num > 3) {
        num = Math.round(num / 2);
        if (num == 1 ) { break; }
        numbrOfStages[counter] = num;
        counter++;
    }
}

/**
 * Function evenCompSingleWin
 * 
 * fire when one of players got the required number of goals 
 * must get a variable with player name
 * 
 * disable +1 an -1 buttons
 * if stage has only 2 players define a winner
 * add the results of round to the resultsObject 
 * define player that lost, fire the function that add results for the resultsObject
 * 
 * remove played participants from arrays that contains round and stage players
 * 
 * undisable the next round button
 * 
 */
const evenCompSingleWin = (name) => {
    document.querySelectorAll(".player-box .counter").forEach(el => {
        el.setAttribute('disabled', '');
    })

    if (numbrOfStages.length == 1) {
        resultsObject[name].level = 'Winner!';
    }

    resultsObject[name].playedRounds = resultsObject[name].playedRounds + 1;
    resultsObject[name].wins = resultsObject[name].wins + 1;
    if ( resultsObject[name].playedRounds > 1) {
        resultsObject[name].level = resultsObject[name].playedRounds;
    }
    
    
    nextRoundParticipants.push(name);

    roundParticipants = roundParticipants.filter(el => el !== name);

    playersListArr = playersListArr.filter(el => el !== name);  
    playersListArrShift = playersListArrShift.filter(el => el !== name);
    console.log(nextRoundParticipants.length, playersListArr.length)
    if(nextRoundParticipants.length == 2) {
        nextRoundParticipants.forEach(el => {
            resultsObject[el].level = 'Enter Final';
        })
    }

    if(nextRoundParticipants.length == 1 && playersListArr.length == 1 ) {
        resultsObject[name].level = 'Winner';
    }

    console.log(nextRoundParticipants, playersListArr)
    evenCompSingleLost(roundParticipants);
    nextRound.removeAttribute('disabled');

    
}

/**
 * Function evenCompSingleLost
 * 
 * usually used right after evenCompSingleWin function
 * save the player that lost results to the resultsObject
 * 
 * remove played participants from arrays that contains round and stage players
 * empty the roundParticipants array
 *  
 */
const evenCompSingleLost = (array) => {
    resultsObject[array[0]].playedRounds = resultsObject[array[0]].playedRounds + 1;
    resultsObject[array[0]].lose = resultsObject[array[0]].lose + 1;
    resultsObject[array[0]].level = resultsObject[array[0]].level + 1;

    if (resultsObject[array[0]].lose == '1' && resultsObject[array[0]].playedRounds == '1' ) {
        resultsObject[array[0]].level = 'Disqualified';
    }
    playersListArr = playersListArr.filter(el => el !== array[0]);
    playersListArrShift = playersListArrShift.filter(el => el !== array[0]);
    roundParticipants = [];


    if(playersListArr.length === 0) {
        playersListArr = nextRoundParticipants;
        playersListArrShift = playersListArr;
    }
    
    let compareArrays = arrayEquals(nextRoundParticipants, playersListArr);
    
    if (compareArrays ) {
        nextRoundParticipants = [];
    }
    console.log(nextRoundParticipants, playersListArr)
}

/**
 *  Function beforeStartCheck
 * 
 *  Check if the players is selected in the dropdown menus
 *  if all selected returns true, else - false
 *
 */
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

/**
 *  Function funcUpdateDropdownList
 * 
 *  For dropdown menus with players names
 *  Must get the parent element for the players list
 * 
 *  remove from the list the element that selected in other dropdown
 *  (the one player cannot play against himself)
 * 
 */
let funcUpdateDropdownList = (element) => {
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

/**
 * Function getNewPlayer
 * 
 * Get player names from the main form and save to separate list
 * Fire the function createPlayersList that builds the players list on the page
 * Fire the function createPlayersTable that builds the detailed table of results
 * Fire the function sectionVisibility that makes parent element that contains 
 * players list visible
 * Clean the form
 * 
 */
let getNewPlayer = () => {
    player = getPlayer.parentElement.firstElementChild.firstElementChild;
    createPlayersList(player);
    if (player.value.length !== 0) { 
        createPlayersTable(player);
    }
    sectionVisibility(playersListVis, ulPlayer.parentElement);
    player.value = '';
}

/**
 * Function createOrder
 * 
 * Creates two arrays. One of them has the shifted order. Arrays will be used for stages
 * where the manual choosing players will be unavailable
 */
let createOrder = (array) => {
    arrlength = array.length;

    for(let i = 0; i <= arrlength-1; i++) {
        firstOrderArr[i] = array[i];
        secondOrderArr[i] = array[i+1];
        if (i == arrlength-1) { secondOrderArr[i] = array[0]; }
    }
}

/**
 * Function createResultsArray
 * 
 * Creates object with empty data based on the array that contains all player names
 */

let createResultsArray = (array, object) => {
    for (let i = 0; i < array.length; i++) {
        let plname = array[i]; 
        info = {};
        for(let y = 0; y < resultsObjectProperties.length; y++) {
            if (resultsObjectProperties[y] == 'level') {
                info[resultsObjectProperties[y]] = 'Enter the Qualification';
            } else {
                info[resultsObjectProperties[y]] = 0;
            }
        }
        object[plname] = info;
    }
}

/**
 * Function listForDropdown
 * 
 * Creates full list of players for dropdown menus
 */

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

/**
 * Function createPlayersList
 * 
 * Creates full list of players for list of the players. Require player name
 */

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

/**
 * Function createPlayersTable
 * 
 * For frst results table creation. 
 */

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

/**
 * Function checkNumPlayers
 * 
 * Check if number of players is bigger than 1. Displays error
 */

const checkNumPlayers = () => {
    if (playersListArr.length < 2 ) {
        document.querySelector('#notEnoughPlayersErr').classList.add('is-active');
        return false;
    }
    else {
        return true;
    }
}

/**
 * Function sectionVisibility
 * 
 * Check if the main listh of players is visible or not.
 */

const sectionVisibility = (v, el) => {
    if (v === false && playersListArr.length === 0 ) {
        el.classList.add('is-hidden');
        playersListVis = false;
    } else {
        el.classList.remove('is-hidden');
        playersListVis = true;
    }
}

/**
 * Function afterStartBlocking
 * 
 * Disable the Start Competition button and block possibility of removing players
 */

const afterStartBlocking = () => {
    document.querySelector('#playersCont').classList.add('is-hidden');
    removeButtons = document.querySelectorAll('#players-list li button');
    removeButtons.forEach(element => {
        element.classList.add('is-hidden');
    });
}

/**
 * Function oddNumberGame
 * 
 * Remove the possibility of adding players manually. 
 */

const oddNumberGame = () => {
    dropdownsOn.forEach(el => {
        el.classList.add('is-hidden');
    })
}

/**
 * Function arrayEquals
 * 
 * compare two arrays 
 */

function arrayEquals(a, b) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}

/**
 * END Functions
 */

/**
 * Events
 */


goalsNumber.addEventListener('click', function(e) {
    e.preventDefault();
    goalsToWin = this.form[0].value;
})

nextRound.addEventListener('click', () => {
    dropdownsOn.forEach(el => {
        el.querySelector('.button').removeAttribute('disabled');
        el.querySelector('.button').setAttribute('is-choosen', false);
    });

    dropdownsOff.forEach(el => {
        element = el.children[0];
        funcUpdateDropdownList(element);
    })

    dropdownsOn.forEach(el => {
        el.querySelector('button span').innerText = '---';
    })

    nextRound.setAttribute('disabled', '');
    startRound.removeAttribute('disabled');
    
    document.querySelectorAll('.player-label').forEach(el => {
        el.classList.add('is-hidden');
    })
})

counterPlus.forEach(el => {
    el.addEventListener('click', function(e) {
        element = e.target.closest('.player-box').querySelector('.player-points').innerHTML;
        element++;

        playerEl = e.target.closest('.player-box').querySelector('.player-name').innerHTML;
        
        playerName = playerEl.slice(0, -2);
        resultsObject[playerName].points = element;

        if(element == goalsToWin ) {
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
    
    if (!beforeStartCheck() && playersListArr.length % 2  == 0) {
        choosenButtons.forEach(el => {
            player = el.querySelector('button[is-choosen] span').innerText;
            roundParticipants.push(player);

            playerName = el.children[0].innerText;

            el.closest('.player-box').querySelector('.player-name').innerHTML = `${playerName}: `;
            el.closest('.player-box').querySelector('.player-name + span').classList.remove('is-hidden')
            el.closest('.player-box').querySelector('.player-points ').innerHTML = 0;

            el.querySelector('button[is-choosen]').setAttribute('disabled', '');

            document.querySelectorAll('.player-label').forEach(el => {
                el.classList.remove('is-hidden');
            })
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

                funcUpdateDropdownList(element);
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
            afterStartBlocking();
            list = document.querySelectorAll('.dropdowwn-players .dropdown-content');
            listForDropdown(list, playersListArr);
        }
        else {
            afterStartBlocking();
            createOrder(playersListArr);

            oddNumberGame();
        }

        startComp.setAttribute('disabled', '');
    }

    funcNumberStages();

    createResultsArray(playersListArr, resultsObject);
})

/**
 * END Events
 */

/**
 * Console log for debugging
 */

