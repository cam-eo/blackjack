/*
Author: Cameron Wright
GitHub: https://github.com/cam-eo

This is version 1.1 of this game

Later versions I will incorporate the following:

1) Translate functional variables to JSON
2) Split gameplay attribute to split if delt 2 of the same cards (e.g. two aces)
3) Money & Beting
*/

//#############################################################
//# Uncomment all the references to audio if you want to use it
//#############################################################

// var audio = new Audio('static/audio/card.mp3');

var playerWins = -1;
var dealerWins = 0;
var draws = 0;

var playerCount = 0;
var dealerCount = 0;

var playedCards = new Array();

var dealerCards = new Array();
var playerCards = new Array();

var cardHouses = new Array('H', 'D', 'S', 'C');

function deal()
{
    // audio.play();
    document.getElementById("deal-button").disabled = true;
    document.getElementById("hit-button").disabled = false;
    document.getElementById("stay-button").disabled = false;
    reset();

    if(playerWins === -1)
    {
        playerWins = 0;
        document.getElementById('start-img').remove();
        document.getElementById('start-img').remove();
    }
    //deal the first two cards for the dealer, first dealer card is face down
    dealerCount += generateCardID('dealer');
    addCard('purple_back', 'dealer');
    dealCard('dealer');
    //deal the first two cards for the player
    dealCard('player');
    dealCard('player');
    //Assign card count to player box
    document.getElementById('player-blackjack-result').innerText = playerCount;

    //Automatic win/draw if the first two cards are blackjack
    if(playerCount == 21)
    {
        dealer();
    }
}

function dealCard(whoPlaying)
{
    if(whoPlaying == 'dealer')
    {
        dealerCount += generateCardID(whoPlaying);
    }
    else if(whoPlaying == 'player')
    {
        playerCount += generateCardID(whoPlaying);
    }
    addCard(playedCards[playedCards.length-1],whoPlaying);
}

function reset()
{
    //Reset variables
    playedCards = new Array();
    playerCount = 0;
    dealerCount = 0;
    //Clear dealer cards
    resetCardBoxDiv('dealer');
    //Clear player cards
    resetCardBoxDiv('player');
    //Reset the card counters
    document.getElementById('dealer-blackjack-result').innerText = dealerCount;
    document.getElementById('dealer-blackjack-result').style.color = 'whitesmoke';
    document.getElementById('player-blackjack-result').innerText = playerCount;
    document.getElementById('player-blackjack-result').style.color = 'whitesmoke';
}

function winner()
{
    //This function updates the score board
    if(playerCount ==21 && dealerCount == 21)
    {
        draws +=1;
        drawBanner();
    }
    else if(playerCount > 21 && dealerCount > 21)
    {
        draws +=1;
        drawBanner();
    }
    else if(playerCount <=21 && dealerCount <=21)
    {
        if(playerCount>dealerCount)
        {
            playerWins+=1;
            winBanner('player');
        }
        else if(dealerCount>playerCount)
        {
            dealerWins+=1;
            winBanner('dealer');
        }
        else
        {
            draws+=1;
            drawBanner();
        }
    }
    else
    {
        if(playerCount<dealerCount)
        {
            playerWins+=1;
            winBanner('player');
        }
        else if(dealerCount<playerCount)
        {
            dealerWins+=1;
            winBanner('dealer');
        }
        else if(dealerCount == 21)
        {
            dealerWins+=1;
            winBanner('dealer');
        }
        else if(playerCount == 21)
        {
            playerWins+=1;
            winBanner('player');
        }
    }
    document.getElementById('player-wins').innerText = playerWins;
    document.getElementById('dealer-wins').innerText = dealerWins;
    document.getElementById('dealer-draws').innerText = draws;
    document.getElementById('player-draws').innerText = draws;
}

function drawBanner()
{
    //remove div
    var im = document.getElementById('dealer-card-box');
    im.remove();
    //recreate the div that was deleted so that we can use it again
    var divPlayer = document.getElementById('dealer-box');
    var divPlayerCardBox = document.createElement('div');
    divPlayerCardBox.setAttribute('id', 'dealer-card-box');
    divPlayerCardBox.setAttribute('class', 'flex-box-draw');
    divPlayer.appendChild(divPlayerCardBox);
    //add banner
    var image = document.createElement('img');
    image.src = 'static/images/draw.gif';
    divPlayerCardBox.appendChild(image);

    //remove div
    var im = document.getElementById('player-card-box');
    im.remove();
    //recreate the div that was deleted so that we can use it again
    var divPlayer = document.getElementById('player-box');
    var divPlayerCardBox = document.createElement('div');
    divPlayerCardBox.setAttribute('id', 'player-card-box');
    divPlayerCardBox.setAttribute('class', 'flex-box-draw');
    divPlayer.appendChild(divPlayerCardBox);
    //add banner
    var image = document.createElement('img');
    image.src = 'static/images/draw.gif';
    divPlayerCardBox.appendChild(image);
}

function winBanner(whoPlaying)
{
    //remove div
    var im = document.getElementById(whoPlaying+'-card-box');
    im.remove();
    //recreate the div that was deleted so that we can use it again
    var divPlayer = document.getElementById(whoPlaying+'-box');
    var divPlayerCardBox = document.createElement('div');
    divPlayerCardBox.setAttribute('id', whoPlaying+'-card-box');
    divPlayerCardBox.setAttribute('class', 'flex-box-start-cards');
    divPlayer.appendChild(divPlayerCardBox);
    
    //add banner
    var image = document.createElement('img');
    image.src = 'static/images/winner.gif';
    divPlayerCardBox.appendChild(image);
}

function dealer()
{
    document.getElementById("hit-button").disabled = true;
    document.getElementById("stay-button").disabled = true;

    resetCardBoxDiv('dealer');
    
    //add the first two dealer cards face up
    addCard(playedCards[0],'dealer');
    addCard(playedCards[1],'dealer');
    //show dealer card count
    document.getElementById('dealer-blackjack-result').innerText = dealerCount;

    console.log('dealer score='+dealerCount);
    //dealer 
    while(dealerCount <= 15)
    {
        dealCard('dealer');
        document.getElementById('dealer-blackjack-result').innerText = dealerCount;
    }

    if(dealerCount > 21)
    {
        document.getElementById('dealer-blackjack-result').innerText = 'BUST';
        document.getElementById('dealer-blackjack-result').style.color = 'red';
        document.getElementById("deal-button").disabled = false;
        
    }
    else if(dealerCount == 21)
    {
        document.getElementById('dealer-blackjack-result').style.color = 'lightgreen';
        document.getElementById("deal-button").disabled = false;
    }
    else
    {
        console.log('safe');
        document.getElementById("deal-button").disabled = false;
    }
    winner();
}

function hitPlayer()
{
    // audio.play();
    dealCard('player');
    document.getElementById('player-blackjack-result').innerText = playerCount;
    if(playerCount > 21)
    {
        document.getElementById('player-blackjack-result').innerText = 'BUST';
        document.getElementById('player-blackjack-result').style.color = 'red';
        dealer();
    }
    else if(playerCount == 21)
    {
        document.getElementById('player-blackjack-result').style.color = 'green';
        dealer();
    }
    else
    {
        console.log('player safe');
    }
}

function generateCardID(whoPlaying)
{
    
    let newCard = false;
    let cardNum;

    while(newCard == false)
    {
        cardNum = Math.floor(Math.random()*12)+1;
        let cardHouseIndex = Math.floor(Math.random()*4);
        let card = ''+cardNum+cardHouses[cardHouseIndex];
        let checkCard = false;

        for(let i = 0;i<playedCards.length;i++)
        {
            if(playedCards[i] == card)
            {
                checkCard = true;
            }
        }
        if(checkCard == false)
        {
            newCard = true;
            playedCards.push(card);
        }
    }

    if(cardNum > 10)
    {
        return 10;
    }
    else if(cardNum<=10 && cardNum>1)
    {
        return cardNum;
    }
    else if(cardNum == 1)
    {
        if(whoPlaying == 'player')
        {

            if(playerCount <= 10)
            {
                return 11;
            }
            else
            {
                return 1;
            }

        }
        else if(whoPlaying == 'dealer')
        {
            if(dealerCount <= 10)
            {
                return 11;
            }
            else
            {
                return 1;
            }
        }
    }
}

function resetCardBoxDiv(whoPlaying)
{

    //remove div to clear space
    var divPlayer = document.getElementById(whoPlaying+'-card-box');
    divPlayer.remove();
    //recreate the div that was deleted so that we can use it again
    var divPlayer = document.getElementById(whoPlaying+'-box');
    var divPlayerCardBox = document.createElement('div');
    divPlayerCardBox.setAttribute('id', whoPlaying+'-card-box');
    divPlayerCardBox.setAttribute('class', 'flex-box-'+whoPlaying+'-cards');
    divPlayer.appendChild(divPlayerCardBox);
}

function addCard(cardID, whoPlaying)
{
    var image = document.createElement('img');
    var div = document.getElementById(''+whoPlaying+'-card-box');
    image.src = 'static/images/'+cardID+'.png';
    div.appendChild(image);
}