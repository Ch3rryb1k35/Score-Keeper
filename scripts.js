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
let isOddGame = false;
let isGame = false;

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
    console.log('single win')

    counterSwitcher('disable');

    if (numbrOfStages.length == 1 && !isOddGame) {
        resultsObject[name].level = 'Winner!';
    }

    objectUpdater(name, 'playedRounds', 1);
    // resultsObject[name].playedRounds = resultsObject[name].playedRounds + 1;
    resultsObject[name].wins = resultsObject[name].wins + 1;
    if ( resultsObject[name].playedRounds > 1) {
        resultsObject[name].level = resultsObject[name].playedRounds;
    }

    if (isOddGame) {
        console.log(`${name} win Odd`)
        firstOrderArr = firstOrderArr.slice(1, firstOrderArr.length);
        playersListArrShift = secondOrderArr;
    } else {
        console.log(`${name} win Even`)
        nextRoundParticipants.push(name);
        roundParticipants = roundParticipants.filter(el => el !== name);
        playersListArr = playersListArr.filter(el => el !== name);  
        playersListArrShift = playersListArrShift.filter(el => el !== name);

        if(nextRoundParticipants.length == 2) {
            nextRoundParticipants.forEach(el => {
                resultsObject[el].level = 'Enter Final';
            })
        }

        if(nextRoundParticipants.length == 1 && playersListArr.length == 1 ) {
            resultsObject[name].level = 'Winner';
        }

        playersListArrShift = roundParticipants;
    }

    updatePlayersTable();
    evenCompSingleLost(playersListArrShift);
    nextRound.removeAttribute('disabled');  
}

/**
 * Function evenCompSingleLost
 * 
 * usually used right after evenCompSingleLost function
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

    if (isOddGame) {
        console.log(`${array[0]} lost Odd`)
        secondOrderArr = secondOrderArr.slice(1, secondOrderArr.length);
    } else {
        console.log(`${array[0]} lost Even`)
        playersListArr = playersListArr.filter(el => el !== array[0]);
        playersListArrShift = playersListArrShift.filter(el => el !== array[0]);
        roundParticipants = [];
    
    
        if(playersListArr.length === 0) {
            playersListArr = nextRoundParticipants;
            playersListArrShift = playersListArr;
        }
    }

    if (firstOrderArr.length == 0 && secondOrderArr.length == 0) {
        oddNumberGameResults();
        isOddGame = false;
    }

    updatePlayersTable();
}

let objectUpdater = (name, prop, val) => {
    resultsObject[name][prop] = resultsObject[name][prop] + val;
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

let nextRoundDropdownList = (element) => {

    while(element.firstElementChild) {
        element.removeChild(element.lastElementChild);
    }

    playersListArr.forEach(item => {
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
            if (i == 2) {
                td.classList.add('cell-playername')
            }
            tr.appendChild(td); 
        }
    }
    resultsTable.querySelector('tbody').appendChild(tr);
}

const clearPlayersTable = () => {
    let resultsTableRows = document.querySelectorAll('#tableSection tbody tr td');
    resultsTableRows.forEach(el => {
        if (!el.classList.contains('cell-playername') ) {
            el.innerHTML = '0';
        }
    })
}

const updatePlayersTable = () => {

    clearPlayersTable();
    let resultsTableRows = document.querySelectorAll('#tableSection tbody tr td');
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
 * Remove the possibility of adding players manually and fill the player name and count fields. 
 */

const oddNumberGame = () => {
    dropdownsOn.forEach(el => {
        el.classList.add('is-hidden');
    })

    isOddGame = true;

    playerLabels[0].querySelector('.player-name').innerText = `${firstOrderArr[0]}: `;
    playerLabels[1].querySelector('.player-name').innerText = `${secondOrderArr[0]}: `;

    playerLabels[0].querySelector('.player-points').innerText = '0';
    playerLabels[1].querySelector('.player-points').innerText = '0';
}

/**
 * Function oddNumberGame
 * 
 * Collect the odd number game results and creates array of players for the next round; 
 */
let oddNumberGameResults = () => {
    let players = [];
    let wins = [];
    for(const [key, value] of Object.entries(resultsObject)) { 
        players.push(key);
        wins.push(value.wins);
    }
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

    if (!isOddGame) {
        dropdownsOn.forEach(el => {
            el.querySelector('.button').removeAttribute('disabled');
            el.querySelector('.button').setAttribute('is-choosen', false);
        });
        dropdownsOn.forEach(el => {
            el.querySelector('button span').innerText = '---';
        })
        dropdownsOff.forEach(el => {
            element = el.children[0];
            nextRoundDropdownList(element);
        })

        document.querySelectorAll('.player-label').forEach(el => {
            el.classList.add('is-hidden');
        })
    }

    if (arrayEquals(nextRoundParticipants, playersListArr) && playersListArr % 2 !== 0 && isGame ) {
        isOddGame = true;

        if (nextRoundParticipants.length >=2 ) {
            createOrder(nextRoundParticipants);
            nextRoundParticipants = [];
        }

        oddNumberGame();
    }
    
    nextRound.setAttribute('disabled', '');
    startRound.removeAttribute('disabled');
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

        updatePlayersTable();
    })
})

counterMinus.forEach(el => {
    el.addEventListener('click', function(e) {

        element = e.target.closest('.player-box').querySelector('.player-points').innerHTML;

        element--;
        e.target.closest('.player-box').querySelector('.player-points').innerHTML = element;
        updatePlayersTable()
    })
})

startRound.addEventListener('click', function() {

    if (!beforeStartCheck() && playersListArr.length % 2 === 0 && !isOddGame) {
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
    
    if ( beforeStartCheck() && !isOddGame) {
        document.querySelector('#startRoundWithOnePlayer').classList.add('is-active');
        return false;
    }
    counterSwitcher('enable');

    document.querySelectorAll(".player-points").forEach(el => {
        el.classList.remove('is-hidden');
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

/* 
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
*/

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
    isGame = true;
    check = checkNumPlayers();
    if (check) {

        if ( playersListArr.length % 2  == 0  && !isOddGame) {
            console.log('Even Game');
            afterStartBlocking();
            list = document.querySelectorAll('.dropdowwn-players .dropdown-content');
            listForDropdown(list, playersListArr);
        }
        else {
            console.log('Odd Game');
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

