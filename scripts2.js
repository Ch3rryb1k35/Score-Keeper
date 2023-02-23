/**
 * Different types of elements on page that cannot be changed
 */

const 
    getPlayer = document.querySelector('#add-player'),
    getPlayerField = document.querySelector('#playersCont input'),
    ulPlayer = document.querySelector('#players-list'),
    startComp = document.querySelector('#startComp'),
    menuSwitch = document.querySelector('#menuSection ul'),
    sections = document.querySelectorAll('section.section'),
    dropdownsOn = document.querySelectorAll('.dropdown'),
    dropdownsOff = document.querySelectorAll('.dropdown .dropdown-menu'),
    resultsTable = document.querySelector('#tableSection'),
    startRound = document.querySelector('#start'),
    choosenButtons = document.querySelectorAll('.dropdowwn-players .buttons.has-addons'),
    playerLabels = document.querySelectorAll('.player-label'),
    counterPlus = document.querySelectorAll('button.counter.plus'),
    counterMinus = document.querySelectorAll('button.counter.minus'),
    goalsNumber = document.querySelector('#goals-number'),
    playerCounters = document.querySelectorAll('.player-label > span'),
    nextRound = document.querySelector('#next-round'),
    activeMenuEl = document.querySelector('#menuSection li.is-active')

/**
 * Variables and arrays
 */

const resultsObjectProperties = [
    'playedRounds',
    'wins',
    'lose',
    'points',
    'level'
]

let firstOrderArr = [],
    secondOrderArr = [],
    nextOddRoundParticipants = [],
    playersListArr = [],
    playersListArrShift = [],
    roundParticipants = [],
    goalsToWin = 2,
    numbrOfStages = [],
    randMatches = [],
    levelCounter = 0,
    resultsObject = {}

/**
 * Boolean Switchers
 */
let playersListVis = false,
    isDropdownActive = false,
    isPlayerSelected = false,
    isOddGame = false,
    isGame = false,
    isResultsObgect = false

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

    let array = Object.keys(resultsObject['total'][player]);
    array.forEach(el => {
        td = document.createElement('TD');
        td.classList.add(`${el}`);
        td.append(resultsObject['total'][player][el]);
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
    }
}

// Update results table playername data from resultsObject

const updatePlayersTable = (player) => {

    let resultsTableRowsTD = document.querySelectorAll('#tableSection tbody tr td');

    resultsTableRowsTD.forEach(el => {
        if (el.classList.contains('playername') && el.innerHTML == player) {
            currentTD = el.nextElementSibling;
            for(let i = 0; i < resultsObjectProperties.length; i++ ) {
                currentTD.innerHTML = resultsObject['total'][player][currentTD.classList[0]];
                currentTD = currentTD.nextElementSibling;
            } 
        }
    });

    updateRoundTable(player);
}

let updateRoundTable = (player) => {

    let levelTableRowsTD = document.querySelectorAll('.level-runs tbody tr td');

    levelTableRowsTD.forEach(el => {
        if (el.classList.contains('playername') && el.innerHTML == player) {
            currentTD = el.nextElementSibling;
              for (let i = 0; i < 3; i++ ) {
                currentTD.innerHTML = resultsObject[levelCounter][player][currentTD.classList['0']];
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
            // roundParticipants.push(player);
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

    // fillRoundParticipants();
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
    resultsObject['total'][name][prop] = resultsObject['total'][name][prop] + val;
    resultsObject[levelCounter][name][prop] = resultsObject[levelCounter][name][prop] + val;

    updatePlayersTable(name);
}

// let resultsObjectLogic = (name, prop, val) => {
//     console.log('FUNC resultsObjectLogic run:', name, prop, val);
//     if (resultsObject[name][prop] == '1' && resultsObject[name].playedRounds == '1' && prop == 'lose' && !isOddGame) {
//         resultsObject[name].level = 'Disqualified';
//     }
//     if (resultsObject[name][prop] > 1 && resultsObject[name]['win'] > 1 && prop == 'level') {
//         resultsObject[name].level = val;
//     }
//     if (prop == 'wins' && resultsObject[name]['playedRounds'] == 1 && resultsObject[name][prop] == 1 && !isOddGame) {
//         resultsObject[name]['level'] = 'Pass the Qualification';
//     }
//     if (prop == 'lose' && resultsObject[name]['playedRounds'] == 1 &&resultsObject[name][prop] == 1 && !isOddGame) {
//         resultsObject[name]['level'] = 'Disqualified';
//     }
// }

/**
 * fill ResultsObject with data based on the playerListArr that contains all player names
 */

 let fillResultsObject = () => {
    resultsObject['total'] = {};
    resultsObject[levelCounter] = {};
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
        resultsObject['total'][plname] = structuredClone(info);
        resultsObject[levelCounter][plname] = structuredClone(info);
    }
}

//will run if some player get required points number
let singleWin = (player) => {
    console.log('Single win:', player);
    if (isOddGame) {
        resultsObjectUpdater(player, 'playedRounds', 1);
        resultsObjectUpdater(player, 'wins', 1);

        console.log('Win: ', player, ' Lose: ', secondOrderArr[0])
    }
    else {
        resultsObjectUpdater(player, 'playedRounds', 1);
        resultsObjectUpdater(player, 'wins', 1);
        playersListArr = arrayFilter(playersListArr, player);
    }
    roundParticipants = arrayFilter(roundParticipants, player);
    counterSwitcher('disable');
    singleLost(roundParticipants[0]);
}

let nextRoundParticipants = () => {
    levelCounter++;
    resultsObject[levelCounter] = structuredClone(resultsObject[levelCounter - 1]);
    
    let players = numberPlayersRound();
    let winners = numberWinnersRound(players);

    while( Object.keys(resultsObject[levelCounter]).length > winners ) {
        let mingoals = goalsToWin;
        let min;
        Object.keys(resultsObject[levelCounter]).forEach(el => {
            if (resultsObject[levelCounter][el]['wins'] < mingoals) {
                min = el;
                mingoals = resultsObject[levelCounter][el]['wins'];
            }
        })
        delete resultsObject[levelCounter][min];
    }

    playersListArr = [];
    Object.keys(resultsObject[levelCounter]).forEach(el => {
        playersListArr.push(el);
    })
}

let numberPlayersRound = () => {
    number = 0;
    Object.keys(resultsObject[levelCounter]).forEach(el => {
        number++;
    })

    return number;
}

let numberWinnersRound = (num) => {
   
    let number;
    if (num % 2 !=0) {
        number = (num - 1)/2;
    } else {
        number = num/2;
    }
    return number;
}

//will run for player that did not win round
let singleLost = (player) => {


    if (isOddGame) {
        resultsObjectUpdater(player, 'playedRounds', 1);
        resultsObjectUpdater(player, 'lose', 1);

        firstOrderArr = firstOrderArr.slice(1, firstOrderArr.length);
        secondOrderArr = secondOrderArr.slice(1, secondOrderArr.length);

        if(firstOrderArr.length == 0 && secondOrderArr.length == 0) {
            nextRoundParticipants();
        }
    }
    else {

    }
    roundParticipants = [];
    nextRound.removeAttribute('disabled');
}

let fillLevelRunTable = () => {
    let levelLabel = '';

    if (levelCounter == 0) {
        levelLabel = 'Qualification';
    } else {
        levelLabel = levelCounter; 
    }

    const table = document.querySelector('.level-runs tbody');
    trow = document.createElement('TR');
    th = document.createElement('TH');
    th.setAttribute('colspan', '4');
    th.innerText = `Current level: ${levelLabel}`;
    trow.append(th);
    trow.classList.add(levelCounter);
    table.append(trow);

    trow2 = document.createElement('TR');
    trow2.append(document.createElement('TD'));
    resultsObjectProperties.forEach(el => {
        if (el == 'wins' || el == 'lose' || el == 'points') {
            cell = document.createElement('TD');
            cell.innerText = el;
            trow2.append(cell);
        }

    })
    trow2.classList.add(levelCounter);
    table.append(trow2);

    Object.keys(resultsObject[levelCounter]).forEach(key => {
        let trowPlayer = document.createElement('TR');
        let cell = document.createElement('TD');
        cell.innerText = key;
        cell.classList.add('playername');
        trowPlayer.append(cell);
        trowPlayer.classList.add(`${key}`);
        trowPlayer.classList.add(levelCounter);
        resultsObjectProperties.forEach(el => {
            if (el == 'wins' || el == 'lose' || el == 'points') {
                cell = document.createElement('TD');
                cell.innerText = 0;
                cell.classList.add(el);
                trowPlayer.append(cell);
            }
        })
        table.append(trowPlayer);
    })
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
        removePlayerFromObject(playersListArr, resultsObject['total']);
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
    ulPlayer.classList.add('is-hidden');
    ulPlayer.closest('article.tile').querySelector('p.subtitle').classList.add('is-hidden');

    fillLevelRunTable();
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
    
    fillRoundParticipants();

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

// fill player participants array
let fillRoundParticipants = () => {
    if (isOddGame) {
        roundParticipants.push(firstOrderArr[0]);
        roundParticipants.push(secondOrderArr[0]);
    } else {
        let names = document.querySelectorAll('button[is-choosen="true"] > span:not(.icon)');
        names.forEach(el => {
            roundParticipants.push(el.innerHTML);
        })
    }
}

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