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

let firstOrderArr = [];
let secondOrderArr = [];
let nextOddRoundParticipants = [];

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
let isOddGame = false;
let isGame = false;
let isResultsObgect = false;

/**
 * Functions
 */

/* Restart game */

const restartGame = () => {
    isGame = false;
    playersListVis = false;
    ulPlayer.parentElement.classList.add('is-hidden');
}

/* Get player name, add it to the resulta table, add players list visibility after first activation */

let getNewPlayer = () => {
    player = getPlayer.parentElement.firstElementChild.firstElementChild;
    let isDuplicated = false;

// check if entered name was added before
    if (playersListArr.length >= 1) {
        playersListArr.forEach(el => {
            if (el == player.value) {
                document.querySelector('#duplicatePlayer').classList.add('is-active');
                isDuplicated = true;
            }
        })
    }

// add new player if its name is unique
    if (player.value.length !== 0 && !isDuplicated) {
        liPlayer = document.createElement('LI');
        liPlayer.append(player.value);
        liButton = document.createElement('BUTTON');
        liButton.classList.add('delete');
        liPlayer.append(liButton);
        ulPlayer.append(liPlayer);
        playersListArr.push(player.value);
        fillResultsObject();
        isDuplicated = false;
        fillPlayersTable(player.value);
        player.value = '';
    } 
//display an error otherwise
    else {
        document.querySelector('#emptyPlayerAddErr').classList.add('is-active');
        return false;
    }

//display/hide the list of players
    if (playersListVis === false && playersListArr.length === 0 ) {
        ulPlayer.parentElement.classList.add('is-hidden');
        playersListVis = false;
    } else {
        ulPlayer.parentElement.classList.remove('is-hidden');
        playersListVis = true;
    }
}


/* Create results table. Accept player name and create row in atable for it */

const fillPlayersTable = (player) => {
//will append new TR to TBODY
    tr = document.createElement('TR');

    th = document.createElement('TH');
    th.append(playersListArr.length);
    tr.appendChild(th);
    
    td = document.createElement('TD');
    td.classList.add('playername');
    td.append(player);
    tr.appendChild(td);

    let array = Object.keys(resultsObject[player]);
    array.forEach(el => {
        td = document.createElement('TD');
        td.classList.add(`${el}`);
        td.append(resultsObject[player][el]);
        tr.appendChild(td);
    })
    resultsTable.querySelector('tbody').appendChild(tr);
}

/**
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

/* Remove val from given array and return new array */
let arrayFilter = (array, val) => {
    return array.filter(el => el !== val);
}

// Clear results table
const clearPlayersTable = (val, player) => {
    let resultsTableRows = document.querySelectorAll('#tableSection tbody tr td');
    if (val == 'remove') {
        let resultsTablePlayerCell = document.querySelectorAll('#tableSection tbody .playername');
        resultsTablePlayerCell.forEach(el => {
            if (el.innerText == player) {
                el.closest('tr').remove();
            }
        })
    } else {
        resultsTableRows.forEach(el => {
            if (!el.classList.contains('playername') ) {
                el.innerHTML = '---';
            }
        })
        console.log('clearPlayersTable usual clear');
    }
}

// Update results table playername data from resultsObject

const updatePlayersTable = (player) => {
    console.log('FUNC updatePlayersTable run');

    let resultsTableRowsTD = document.querySelectorAll('#tableSection tbody tr td');

    resultsTableRowsTD.forEach(el => {
        if (el.classList.contains('playername') && el.innerHTML == player) {
            currentTD = el.nextElementSibling;
            for(let i = 0; i < resultsObjectProperties.length; i++ ) {
                currentTD.innerHTML = resultsObject[player][currentTD.classList[0]];
                currentTD = currentTD.nextElementSibling;
            } 
        }
    });
}

/**
 * Creates object with empty data based on the array that contains all player names
 */

let removePlayerFromObject = (array, object) => {
// delete player from object
    if (array.length != Object.keys(object).length) {
        Object.keys(object).forEach(el => {
            if (!(array.includes(el))) {
                delete object[el];
            }
        })
    }

}

// hide fields where we can add players and choose the number of points to win and removo possibility of delete players
const afterStartBlocking = () => {
    document.querySelector('#playersCont').classList.add('is-hidden');
    removeButtons = document.querySelectorAll('#players-list li button');
    removeButtons.forEach(element => {
        element.classList.add('is-hidden');
    });
}

// fill dropdown lists with player names from playerlist array;
let fillDropdownLists = () => {
    isOddGame = false;
    list = document.querySelectorAll('.dropdowwn-players .dropdown-content');
    list.forEach(li => {
        playersListArr.forEach(item => {
            newListPlayer = document.createElement('A');
            newListPlayer.classList.add('dropdown-item');
            newListPlayer.append(item);
            li.appendChild(newListPlayer);
        })
    })
}

//define even game order behaviour

const evenGame = () => {
    if (!beforeStartCheckEvenCho() && playersListArr.length % 2 === 0) {
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
    }
}

/**
 * Define the game with the odd number of players
 * Remove the possibility of adding players manually and fill the player name and count fields. 
 */

 const oddGame = () => {
    isOddGame = true;
    dropdownsOn.forEach(el => {
        el.classList.add('is-hidden');
    })

    if( playersListArr % 2 != 0 && secondOrderArr.length == 0) {
        createOddArrays(playersListArr);
    }

    playerLabels[0].querySelector('.player-name').innerText = `${firstOrderArr[0]}: `;
    playerLabels[1].querySelector('.player-name').innerText = `${secondOrderArr[0]}: `;

    playerLabels[0].querySelector('.player-points').innerText = '0';
    playerLabels[1].querySelector('.player-points').innerText = '0';
}

/**
 * Creates two arrays. One of them has the shifted order. Arrays will be used for stages
 * where the manual choosing players will be unavailable
 */
 let createOddArrays = (array) => {
    arrlength = array.length;
    for(let i = 0; i <= arrlength-1; i++) {
        firstOrderArr[i] = array[i];
        secondOrderArr[i] = array[i+1];
        if (i == arrlength-1) { secondOrderArr[i] = array[0]; }
    }
}

// update dropdown list depending on player name choosen in another dropdown 
let funcUpdateDropdownList = (element, array) => {
    while(element.firstElementChild) {
        element.removeChild(element.lastElementChild);
    }
    array.forEach(item => {
        newListPlayer = document.createElement('A');
        newListPlayer.classList.add('dropdown-item');
        newListPlayer.append(item);
        element.appendChild(newListPlayer);
    })
}

/**
 *  Check if the players is selected in the dropdown menus
 *  if all selected returns true, else - false
 */
 const beforeStartCheckEvenCho = () => {
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
 * Enable or disable the +1 and -1 buttons. 
 */

 let counterSwitcher = (state) => {
    document.querySelectorAll(".player-box .counter").forEach(el => {
        if (state == 'disable') {
            el.setAttribute('disabled', '');
        }
        if (state == 'enable') {
            el.removeAttribute('disabled');
        }
    })
}

let resultsObjectUpdater = (name, prop, val) => {
    console.log('FUNC resultsObjectUpdater run');
    resultsObject[name][prop] = resultsObject[name][`${prop}`] + val;

    resultsObjectLogic(name, prop, val);
    updatePlayersTable(name);
}

let resultsObjectLogic = (name, prop, val) => {
    console.log('FUNC resultsObjectLogic run', name, prop, val);
    if (resultsObject[name][prop] == '1' && resultsObject[name].playedRounds == '1' && prop == 'lose' && !isOddGame) {
        resultsObject[name].level = 'Disqualified';
    }
    if (resultsObject[name][prop] > 1 && resultsObject[name]['win'] > 1 && prop == 'level') {
        resultsObject[name].level = val;
    }
    if (prop == 'wins' && resultsObject[name]['playedRounds'] == 1 && resultsObject[name][prop] == 1 && !isOddGame) {
        resultsObject[name]['level'] = 'Pass the Qualification';
    }
    if (prop == 'lose' && resultsObject[name]['playedRounds'] == 1 &&resultsObject[name][prop] == 1 && !isOddGame) {
        resultsObject[name]['level'] = 'Disqualified';
    }
}

/**
 * fill ResultsObject with data based on the playerListArr that contains all player names
 */

 let fillResultsObject = () => {
    for (let i = 0; i < playersListArr.length; i++) {
        let plname = playersListArr[i]; 
        info = {};
        for(let y = 0; y < resultsObjectProperties.length; y++) {
            if (resultsObjectProperties[y] == 'level') {
                info[resultsObjectProperties[y]] = 'Enter the Qualification';
            } else {
                info[resultsObjectProperties[y]] = 0;
            }
        }
        resultsObject[plname] = info;
    }
}

//will run if some player get required points number
let singleWin = (player) => {
    console.log('Single win');
    console.log(player);
    if (isOddGame) {
        resultsObjectUpdater(firstOrderArr[0], 'playedRounds', 1);
        resultsObjectUpdater(firstOrderArr[0], 'wins', 1);
        firstOrderArr = arrayFilter(firstOrderArr, firstOrderArr[0]);
    }
    else {
        resultsObjectUpdater(player, 'playedRounds', 1);
        resultsObjectUpdater(player, 'wins', 1);
        playersListArr = arrayFilter(playersListArr, player);
    }
    counterSwitcher('disable');
    singleLost(player);
}

//will run for player that did not win round
let singleLost = (player) => {
    if (isOddGame) {
        resultsObjectUpdater(firstOrderArr[0], 'playedRounds', 1);
        resultsObjectUpdater(firstOrderArr[0], 'lose', 1);
        secondOrderArr = arrayFilter(secondOrderArr, secondOrderArr[0]);

        if(firstOrderArr.length == 0 && secondOrderArr.length == 0) {
            isOddGame = false;
        }
    }
    else {

    }

    nextRound.removeAttribute('disabled');
}

/**
 * END Functions
 */


/**
 * Events
 */

//Next round button functionality
nextRound.addEventListener('click', function() {
    if (isOddGame) {
        oddGame();
    }

    nextRound.setAttribute('disabled', '');
    startRound.removeAttribute('disabled');
})
/* Set the number of goals to win */
goalsNumber.addEventListener('click', function(e) {
    e.preventDefault();
    goalsToWin = this.form[0].value;
})

/* Get new player from player field with button */
getPlayer.addEventListener('click', function() {
    getNewPlayer();
})

/* Get new player from player field with Enter key */
getPlayerField.addEventListener('keypress', (event) => {
    if (event.keyCode === 13) {
        getNewPlayer();
    }
});

/**
 * Listener for remove players from list
 */
ulPlayer.addEventListener('click', function(e) {
    if (e.target.matches('button')) {
        let item = e.target.parentElement.innerText;
        let itemArr = playersListArr;
        itemArr = arrayFilter(playersListArr, item);
        e.target.parentNode.remove();
        playersListArr = itemArr;

        clearPlayersTable('remove', item);
        removePlayerFromObject(playersListArr, resultsObject);
    }
})

/**
 * start competition Button
 */
startComp.addEventListener('click', function() {
    isGame = true;
    if (checkNumPlayers()) {
        if ( playersListArr.length % 2  == 0) {
            console.log('Even Game');
            afterStartBlocking();
            fillDropdownLists();
        }
        else {
            console.log('Odd Game');
            afterStartBlocking();
            oddGame();
        }
        startComp.setAttribute('disabled', '');
    }
})

// players dropdown list activation
dropdownsOn.forEach(el => {
    el.addEventListener('click', function() {
        if ( playersListArr.length !== 0 && isDropdownActive === false) {
            el.classList.add('is-active');
            isDropdownActive = true;
        }
    });
})

// players dropdown list deactivation
dropdownsOff.forEach(el => {
    el.addEventListener('click', function(e) {
        dropdownChosen = this.parentElement.getElementsByTagName('span');
        dropdownChosen[0].innerText = e.target.innerText;

        playersListArrShift = arrayFilter(playersListArr, e.target.innerText);

        choosenAttr = this.parentElement.querySelector('[is-choosen]');
        choosenAttr.setAttribute('is-choosen', true);
     
        dropdownsOff.forEach(el => {

            if (!el.parentElement.classList.contains('is-active')) {
                element = el.firstElementChild;
                funcUpdateDropdownList(element, playersListArrShift);
            }
        })

        el.parentElement.classList.remove('is-active');
        isDropdownActive = false;
        e.stopPropagation();
    })
})

//Start round button
startRound.addEventListener('click', function() {

    if ( beforeStartCheckEvenCho() && !isOddGame) {
        document.querySelector('#startRoundWithOnePlayer').classList.add('is-active');
        return false;
    }
    
    if (isOddGame) {
        oddGame();
    } else {
        evenGame();
    }

    counterSwitcher('enable');
    
    document.querySelectorAll(".player-points").forEach(el => {
        el.classList.remove('is-hidden');
    })

    document.querySelectorAll(".player-label").forEach(el => {
        el.classList.remove('is-hidden');
    })

    startRound.setAttribute('disabled', '');
})

// +1 counter
counterPlus.forEach(el => {
    el.addEventListener('click', function(e) {
        playerEl = e.target.closest('.player-box').querySelector('.player-name').innerHTML;
        playerName = playerEl.slice(0, -2);
        playerPointsUpdater(e, 1);
    })
})

// -1 counter

counterMinus.forEach(el => {
    el.addEventListener('click', function(e) {
        playerPointsUpdater(e, -1);        
    })
})

// updade the visual counter
let playerPointsUpdater = (el, val) => {
    console.log('FUNC playerPointsUpdater run');
    element = el.target.closest('.player-box').querySelector('.player-points').innerHTML;

    player = el.target.closest('.player-box').querySelector('.player-name').innerHTML;
    player = player.slice(0, -2);
    element = parseInt(element) + val;

    el.target.closest('.player-box').querySelector('.player-points').innerHTML = element;
    resultsObjectUpdater(player, 'points', val);

    if (element == goalsToWin) {
        singleWin(player);
    }
}
/**
 * END Events
 */