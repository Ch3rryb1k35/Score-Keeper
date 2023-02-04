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

    if (playersListArr.length >= 1) {
        playersListArr.forEach(el => {
            console.log(el, player.value);
            if (el == player.value) {
                document.querySelector('#duplicatePlayer').classList.add('is-active');
                isDuplicated = true;
            }
        })
    }

    if (player.value.length !== 0 && !isDuplicated) {
        liPlayer = document.createElement('LI');
        liPlayer.append(player.value);
        liButton = document.createElement('BUTTON');
        liButton.classList.add('delete');
        liPlayer.append(liButton);
        ulPlayer.append(liPlayer);
        playersListArr.push(player.value);
        
        isDuplicated = false;
        createPlayersTable(player);
    } else {
        document.querySelector('#emptyPlayerAddErr').classList.add('is-active');
        return false;
    }

    if (playersListVis === false && playersListArr.length === 0 ) {
        ulPlayer.parentElement.classList.add('is-hidden');
        playersListVis = false;
    } else {
        ulPlayer.parentElement.classList.remove('is-hidden');
        playersListVis = true;
    }


    player.value = '';
}

let checkPlayerDuplicate = (player) => {
    

}

/* Create results table. Use only once. */

const createPlayersTable = (player) => {

    updateResultsObject(playersListArr, resultsObject);

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
            if (i == 2) {
                td.classList.add('cell-playername')
            }
            tr.appendChild(td); 
        }
    }
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
    console.log(val, player);
    if (val == 'remove') {
        let resultsTableRows = document.querySelectorAll('#tableSection tbody .cell-playername');
        resultsTableRows.forEach(el => {
            if (el.innerText == player) {
                el.closest('tr').remove();
            }
        })
    } else {
        resultsTableRows.forEach(el => {
            if (!el.classList.contains('cell-playername') ) {
                el.innerHTML = '0';
            }
        })
    }
}

// Update results table
const updatePlayersTable = () => {

    clearPlayersTable();

    for (let i = 0; i<resultsTableRows.length; i++) {
        if (resultsTableRows[i].classList.contains('cell-playername') ) {
            player = resultsTableRows[i].innerHTML;
            resultsTableRows[i+1].innerHTML = resultsObject[player].playedRounds;
            resultsTableRows[i+2].innerHTML = resultsObject[player].wins;
            resultsTableRows[i+3].innerHTML = resultsObject[player].drawn;
            resultsTableRows[i+4].innerHTML = resultsObject[player].lose;
            resultsTableRows[i+5].innerHTML = resultsObject[player].points;
            resultsTableRows[i+6].innerHTML = resultsObject[player].level;
        }
    }
}

/**
 * Creates object with empty data based on the array that contains all player names
 */

let updateResultsObject = (array, object) => {

    if (array.length != Object.keys(object).length) {
        Object.keys(object).forEach(el => {
            if (!(array.includes(el))) {
                console.log(el, object[el]);
                delete object[el];
            }
        })
    }
    for (let i = 0; i < array.length; i++) {
        let plname = array[i]; 
        info = {};
        for(let y = 0; y < resultsObjectProperties.length; y++) {
            if (resultsObjectProperties[y] == 'level' && resultsObjectProperties[y] == 0) {
                info[resultsObjectProperties[y]] = 'Enter the Qualification';
            } else {
                info[resultsObjectProperties[y]] = 0;
            }
        }
        object[plname] = info;
    }
}


/**
 * END Functions
 */


/**
 * Events
 */

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
        updateResultsObject(playersListArr, resultsObject);
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
            evenGame();
        }
        else {
            console.log('Odd Game');
            isOddGame = true;
            afterStartBlocking();
            createOddArrays(playersListArr);
            oddNumberGame();
        }
        startComp.setAttribute('disabled', '');
    }
    funcNumberStages();
})

/**
 * END Events
 */