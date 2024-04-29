$(document).ready(function () {
  let deck,
    playerHand,
    dealerHand,
    balance = 500,
    currentBet;

  // Initializes the game and resets the table without dealing cards.
  function initializeGame() {
    balance = 500;
    updateMoneyDisplay();
    resetTable();
  }

  // Creates a new deck of cards and shuffles them.
  function newDeck() {
    const suits = ["hearts", "diamonds", "clubs", "spades"];
    const values = [
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "jack",
      "queen",
      "king",
      "ace",
    ];
    deck = [];
    suits.forEach((suit) => {
      values.forEach((value) => {
        deck.push(`${value}_of_${suit}`);
      });
    });
    shuffleDeck();
  }

  // Shuffles the deck of cards.
  function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  }

  // Resets the table for a new hand, clears cards and disables buttons.
  function resetTable() {
    playerHand = [];
    dealerHand = [];
    $("#playerCards, #dealerCards").empty();
    $("#playerScore, #dealerScore").text("Score: 0");
    $("#result").text("");
    $("#hitButton, #standButton").prop("disabled", true);
    newDeck();
  }

  // Updates the display of the player's balance.
  function updateMoneyDisplay() {
    $("#balanceDisplay").text(`Balance: $${balance}`);
  }

  // Handles placing a bet and starts a new hand by dealing cards.
  $("#betButton").click(function () {
    let betInput = $("#betAmount").val().trim();
    let bet = parseInt(betInput);
    if (betInput === "" || isNaN(bet) || bet < 50 || bet > balance) {
      alert(
        `Invalid bet amount. Please enter a bet between $50 and $${balance}.`
      );
      return;
    }
    currentBet = bet;
    balance -= bet;
    updateMoneyDisplay();
    resetTable();
    dealInitialCards();
  });

  // Deals initial cards to both player and dealer.
  function dealInitialCards() {
    dealCard(playerHand);
    dealCard(dealerHand, true);
    dealCard(playerHand);
    dealCard(dealerHand, true);
    $("#hitButton, #standButton").prop("disabled", false);
  }

  // Deals a single card to a specified hand.
  function dealCard(hand, isDealer = false) {
    if (deck.length > 0) {
      const card = deck.pop();
      hand.push(card);
      updateHandDisplay(isDealer ? "dealer" : "player", card);
      updateScores();
    }
  }

  // Updates the card display for a player or dealer.
  function updateHandDisplay(playerType, card) {
    const imageName = card.toLowerCase().replace(" ", "_") + ".png";
    const cardImage = $("<img>")
      .attr("src", `media/Cards/${imageName}`)
      .addClass("card-image");
    $(`#${playerType}Cards`).append(cardImage);
  }

  // Updates the score display for both player and dealer.
  function updateScores() {
    $("#playerScore").text("Player's Score: " + calculateScore(playerHand));
    $("#dealerScore").text("Dealer's Score: " + calculateScore(dealerHand));
  }

  // Calculates the score of a given hand.
  function calculateScore(hand) {
    let score = 0;
    let aceCount = 0;
    hand.forEach((card) => {
      let value = card.split("_")[0];
      if (["jack", "queen", "king"].includes(value)) {
        score += 10;
      } else if (value === "ace") {
        aceCount++;
        score += 11;
      } else {
        score += parseInt(value);
      }
    });
    while (aceCount > 0 && score > 21) {
      score -= 10;
      aceCount--;
    }
    return score;
  }

  // Player decides to hit, another card is dealt.
  $("#hitButton").click(function () {
    if (playerHand.length === 0) return;
    dealCard(playerHand);
    if (calculateScore(playerHand) > 21) endGame("Bust! Player loses.");
  });

  // Player decides to stand, dealer plays its hand.
  $("#standButton").click(function () {
    while (calculateScore(dealerHand) < 17) {
      dealCard(dealerHand, true);
      if (calculateScore(dealerHand) > 21) {
        endGame("Dealer busts! Player wins.");
        return;
      }
    }
    let playerScore = calculateScore(playerHand);
    let dealerScore = calculateScore(dealerHand);
    if (dealerScore >= playerScore) endGame("Player loses.");
    else endGame("Player wins.");
  });

  // Concludes the game with a result.
  function endGame(result) {
    $("#result").text(result);
    $("#hitButton, #standButton").prop("disabled", true);
    if (result.includes("wins")) balance += 2 * currentBet;
    updateMoneyDisplay();
  }

  // starts new game.
  $("#newGameButton").click(function () {
    balance = 500;
    updateMoneyDisplay();
    resetTable();
  });

  initializeGame(); // Initializes the game when the document is ready.
});
