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
        numbrOfStages[counter] = num;
        counter++;
    }
    console.log(numbrOfStages)
}

/**
 * Function counterSwitcher
 * 
 * Enable od disable the +1 and -1 buttons. 
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
    
    counterSwitcher('disable');

    resultsObjectUpdater(name, 'playedRounds', 1);
    resultsObjectUpdater(name, 'wins', 1);
    resultsObjectUpdater(name, 'level', 1);

    if (isOddGame) {
        console.log(`${name} win Odd`)
        firstOrderArr = firstOrderArr.slice(1, firstOrderArr.length);
        // playersListArrShift = secondOrderArr;
        evenCompSingleLost(secondOrderArr);
    } else {
        console.log(`${name} win Even`)
        nextOddRoundParticipants.push(name);

        roundParticipants = arrayFilter(roundParticipants, name);
        playersListArr = arrayFilter(playersListArr, name);
        playersListArrShift = arrayFilter(playersListArrShift, name);
console.log('11', playersListArr, nextOddRoundParticipants, roundParticipants);
        if(playersListArr.length == 2) {
            playersListArr.forEach(el => {
                resultsObject[el].level = 'Enter the Final';
            })
        }

        if(nextOddRoundParticipants.length == 1 && playersListArr.length == 1 ) {
            resultsObject[name].level = 'Winner';
        }
    console.log('2', playersListArr, nextOddRoundParticipants, roundParticipants);
        playersListArrShift = roundParticipants;
        evenCompSingleLost(playersListArrShift);
    }

    updatePlayersTable();
    nextRound.removeAttribute('disabled');  
}

let evenGame = () => {
    isOddGame = false;
    list = document.querySelectorAll('.dropdowwn-players .dropdown-content');
    listForDropdown(list, playersListArr);
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

    resultsObjectUpdater(array[0], 'playedRounds', 1);
    resultsObjectUpdater(array[0], 'lose', 1);
    resultsObjectUpdater(array[0], 'level', 1);

    if (isOddGame) {
        console.log(`${array[0]} lost Odd`)
        secondOrderArr = secondOrderArr.slice(1, secondOrderArr.length);

    } else {
        console.log(`${array[0]} lost Even`);
        console.log('E1', playersListArr, nextOddRoundParticipants, roundParticipants);
        playersListArr = arrayFilter(playersListArr, array[0]);
        playersListArrShift = arrayFilter(playersListArrShift, array[0]);
        roundParticipants = [];
        console.log('E2', playersListArr, nextOddRoundParticipants, roundParticipants);
        if (playersListArr.length == 0 && isGame) {
            playersListArr = nextOddRoundParticipants;
            playersListArrShift = playersListArr;
        }
        console.log('E3', playersListArr, nextOddRoundParticipants, roundParticipants);
        evenGame();
    }

    // if (firstOrderArr.length == 0 && secondOrderArr.length == 0) {
    //     oddNumberGameResults();
    // }

    updatePlayersTable();
}

let oddRoundResults = () => {

}

let arrayFilter = (array, val) => {
    return array.filter(el => el !== val);
}

let resultsObjectUpdater = (name, prop, val) => {
    resultsObject[name][prop] = resultsObject[name][prop] + val;

    resultsObjectLogic(name, prop);
}

let resultsObjectLogic = (name, prop, val) => {
    if (resultsObject[name][prop] == '1' && resultsObject[name].playedRounds == '1' && prop == 'lose' && !isOddGame) {
        resultsObject[name].level = 'Disqualified';
    }
    if (resultsObject[name][prop] > 1 && resultsObject[name]['win'] > 1 && prop == 'level') {
        resultsObject[name].level = 'val';
    }
}

/**
 *  Function beforeStartCheckEvenCho
 * 
 *  Check if the players is selected in the dropdown menus
 *  if all selected returns true, else - false
 *
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
 *  Function funcUpdateDropdownList
 * 
 *  For dropdown menus with players names
 *  Must get the parent element for the players list
 * 
 *  remove from the list the element that selected in other dropdown
 *  (the one player cannot play against himself)
 * 
 */

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
 * Function createOddArrays
 * 
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

/**
 * Function createResultsObject
 * 
 * Creates object with empty data based on the array that contains all player names
 */

let createResultsObject = (array, object) => {
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
 * Function oddNumberGame
 * 
 * Collect the odd number game results and creates array of players for the next round; 
 */
// let oddNumberGameResults = () => {
//     let players = [];
//     let wins = [];
//     for(const [key, value] of Object.entries(resultsObject)) { 
//         players.push(key);
//         wins.push(value.wins);
//     }
// }


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

    if (playersListArr.length == 2 && !isOddGame && roundParticipants.length == 0) {
        console.log('we are here');
    }
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
            funcUpdateDropdownList(element, playersListArr);
        })
    
        document.querySelectorAll('.player-label').forEach(el => {
            el.classList.add('is-hidden');
        })
    } else {
    
    if (arrayEquals(nextOddRoundParticipants, playersListArr) && playersListArr % 2 !== 0 && isGame ) {
        isOddGame = true;

        if (nextOddRoundParticipants.length >=2 ) {
            createOddArrays(nextOddRoundParticipants);
            nextOddRoundParticipants = [];
        }

    }

    if(isOddGame && firstOrderArr.length == 0 && secondOrderArr == 0) {
        newArray = Object.keys(resultsObject);
        if (playersListArr.length == 3) {

            let oddWinsWin = [];
            let oddWinsPts = [];
            playersListArr.forEach(el => {
                oddWinsWin.push(parseInt(resultsObject[el].wins));
                oddWinsPts.push(parseInt(resultsObject[el].points));
            })

            console.log('win arrays', oddWinsWin, oddWinsPts)

            maxNumWins = Math.max(...oddWinsWin);
            console.log('maxNumWins', maxNumWins)
            counter = 0;
            oddWinsWin.forEach(el => {
                if (el == maxNumWins) {
                    counter++;
                }
            })

            console.log('counter', counter)
            
            if (counter == 1) {
                let winnerWins = playersListArr[oddWinsWin.indexOf(maxNumWins)];
                resultsObject[winnerWins].level = 'Winner';

                console.log(`${playersListArr[oddWinsWin.indexOf(maxNumWins)]} has won the competition`);
            }

            if (counter > 1) {
                maxNumPts = Math.max(...oddWinsPts);
                console.log('maxNumPts', maxNumPts)
                counterPts = 0;
                oddWinsPts.forEach(el => {
                    if (el == maxNumPts) {
                        counterPts++;
                    }
                })

                if (counterPts == 1 ) {
                    console.log('winner bt pts');
                    let winnerPts = playersListArr.indexOf(oddWinsPts.indexOf(maxNumPts));
                    resultsObject[winnerPts].level = 'Winner';
                }

                if (counterPts == playersListArr.length ) {
                    console.log('do odd game');
                    createOddArrays(playersListArr);
                    
                }
                    
                if (counterPts == 2 ) {
                    console.log('check the pts');
                    minWinPts = Math.min(...oddWinsPts);
                    playerName = playersListArr[oddWinsPts.indexOf(minWinPts)];
                    oddWinsPts.forEach(el => {
                        if (el == minWinPts) {
                            playersListArr = arrayFilter(playersListArr, minWinPts);
                            isOddGame = false;
                        }
                    })
                }
            }

            updatePlayersTable();
        } 
        if (playersListArr.length > 3) {



            minNumWins = Math.min(...oddlostWins);
            minNumPts = Math.min(...oddlostPts);

            counter = 0;
            oddlostWins.forEach(el => {
                if (el == minNumWins) {
                    counter++;
                }
            })

            if (counter == 1) {
                playerName = playersListArr[oddlostWins.indexOf(minNumWins)];
                playersListArr = arrayFilter(playersListArr, playerName);
            }

            if (counter > 1) {

                counterPts = 0;
                arrayLost =[];
                oddlostPts.forEach(el => {
                    if (el == minNumWins) {
                        counterPts++;
                        arrayLost.push(el);
                    }
                })

                if (counterPts == 1) {
                    playerName = playersListArr[oddlostPts.indexOf(minNumPts)];
                    playersListArr = arrayFilter(playersListArr, playerName);
                    isOddGame = false;
                }
                else {
                    arrayLost.forEach(el => {
                        playerName = playersListArr[oddlostPts.indexOf(minNumPts)];
                        playersListArr = arrayFilter(playersListArr, playerName);
                    })

                    if (playersListArr.length % 2 !==0) {
                        
                    } 
                    else {
                        isOddGame = false;
                    }
                }
            }
        } 
    }
    oddNumberGame();
}


    nextRound.setAttribute('disabled', '');
    startRound.removeAttribute('disabled');
})

counterPlus.forEach(el => {
    el.addEventListener('click', function(e) {
        playerPointsUpdater(e, 1);
        playerEl = e.target.closest('.player-box').querySelector('.player-name').innerHTML;
        playerName = playerEl.slice(0, -2);

        if(element == goalsToWin ) {
            evenCompSingleWin(playerName);
        }
        resultsObjectUpdater(playerName, 'points', 1);
        updatePlayersTable();
    })
})

counterMinus.forEach(el => {
    el.addEventListener('click', function(e) {
        playerPointsUpdater(e, -1);      
        resultsObjectUpdater(playerName, 'points', -1);
        updatePlayersTable()
    })
})

let playerPointsUpdater = (el, val) => {
    element = el.target.closest('.player-box').querySelector('.player-points').innerHTML;
    element = parseInt(element) + val;
    el.target.closest('.player-box').querySelector('.player-points').innerHTML = element;
}

startRound.addEventListener('click', function() {

    if ( beforeStartCheckEvenCho() && !isOddGame) {
        document.querySelector('#startRoundWithOnePlayer').classList.add('is-active');
        return false;
    }

    if (!beforeStartCheckEvenCho() && playersListArr.length % 2 === 0 && !isOddGame) {
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
    
    if (isOddGame) {
        oddNumberGame();
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
    createResultsObject(playersListArr, resultsObject);
})

/**
 * END Events
 */

/**
 * Console log for debugging
 */

