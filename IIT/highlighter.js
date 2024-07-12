 // Dark pattern detection on e-commerce site

// Fetch dark patterns from a dataset
var darkPatternFileUrl = chrome.runtime.getURL('dataset.txt');

fetch(darkPatternFileUrl)
    .then(response => response.text())
    .then(textContent => {
        // Extract and trim patterns from the content
        const darkPatterns = textContent.split('\n').filter(Boolean).map(currentPattern => currentPattern.trim());
        var bodyTextContent = document.body.innerHTML;
        var matchCounter = 0;

        // Loop through patterns to find matches and apply highlighting
        for (var i = 0; i < darkPatterns.length; i++) {
            var currentPattern = darkPatterns[i].trim();

            var { patternClass, tooltipTitle, additionalMessage, emoji, additionalMessageShape } = getPatternInfo(currentPattern);

            // Create a RegExp pattern for the current pattern
            var regex = new RegExp(`(?<!["'])\\b${currentPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b(?!>)`, 'gi');

            // Replace matches with highlighted containers
            bodyTextContent = bodyTextContent.replace(regex, function (match) {
                matchCounter++;
                return createHighlightContainer(match, patternClass, tooltipTitle, additionalMessage, emoji, additionalMessageShape);
            });
        }

        // Send the match counter to the background script
        sendMatchCounter(matchCounter);

        // Update the document body with highlighted content
        document.body.innerHTML = bodyTextContent;

        // Enable tooltips using Bootstrap
        $(document).ready(function () {
            $('[data-toggle="tooltip"]').tooltip();
        });

        // Add a button to tell the match count
        addTellCountButton(matchCounter);
    });

// Function to get pattern information
function getPatternInfo(currentPattern) {
    // Default values
    var patternClass = "";
    var tooltipTitle = "";
    var emoji = "⚠️"; // Default emoji
    var additionalMessage = "Scare Tactics: Verify the authenticity of security threats. ";
    var additionalMessageShape = "square"; // Default shape

    // Check each pattern for specific conditions and set appropriate values
    if (currentPattern.includes("Only left in stock.")) {
        patternClass = "only-left-class";
        tooltipTitle = "Urgency: Places deadlines on things to make them appear more desirable";
        additionalMessage = "False urgency: Be cautious about the urgency claim.";
        emoji = "⏰"; // Clock emoji for urgency
    } else if (currentPattern.includes("in stock") || currentPattern.includes("claimed")) {
        patternClass = "in-stock-class";
        tooltipTitle = "Scarcity: Tries to increase the value of something by making it appear to be limited in availability";
        additionalMessage = "Hidden cost: Check for any hidden costs before purchasing. Be cautious.";
        emoji = "🔥"; // Fire emoji for scarcity
    } else if (currentPattern.includes("Ends") && currentPattern.includes("in") || currentPattern.includes("Order within") || currentPattern.includes("Deal of the day") || currentPattern.includes("Only 3 left")) {
        patternClass = "ends-class";
        tooltipTitle = "Bait and Switch: Promising one thing and delivering another to boost sales.";
        additionalMessage = "Bait and Switch: Be cautious about the urgency claim.";
        emoji = "⏳"; // Hourglass emoji for urgency
    } else if (currentPattern.includes("bought in past month") || currentPattern.includes("Frequently bought together")) {
        patternClass = "last-class";
        tooltipTitle = "Social Proof: Gives the perception that a given action or product has been approved by other people";
        additionalMessage = "Social Proof: Consider the experiences of others before deciding.";
        emoji = "👥"; // People emoji for social proof
    } else if (currentPattern.includes("Bestseller") || currentPattern.includes("Best Seller") || currentPattern.includes("Best-selling")) {
        patternClass = "best-class";
        tooltipTitle = "Misdirection: Aims to deceptively incline a user towards one choice over the other";
        additionalMessage = "Misdirection: Investigate thoroughly before making a decision.";
        emoji = "🎭"; // Trophy emoji for bestseller
    } else if (currentPattern.includes("With Exchange") || currentPattern.includes("Add a Protection Plan") || currentPattern.includes("No Cost EMI") || currentPattern.includes("3 months Prime membership")) {
        patternClass = "exchange-class";
        tooltipTitle = "Sneaking: Coerces users to act in ways that they would not normally act by obscuring information";
        additionalMessage = "Sneaking: Be aware of potential hidden conditions.";
        emoji = "🕵️"; // Detective emoji for sneaking
    } else if (currentPattern.includes("Misleading Defaults")) {
        patternClass = "misleading-defaults-class";
        tooltipTitle = "Misleading Defaults: Setting options by default that benefit the service, not the user.";
        additionalMessage = "Misleading Defaults: Review default settings carefully.";
        emoji = "🔄"; // Arrow emoji for misleading defaults
    } else if (currentPattern.includes("Hidden Ticks")) {
        patternClass = "hidden-ticks-class";
        tooltipTitle = "Hidden Ticks: Automatically opting users into services with pre-checked boxes.";
        additionalMessage = "Hidden Ticks: Check for pre-checked boxes and be cautious.";
        emoji = "☑️"; // Check emoji for hidden ticks
    } else if (currentPattern.includes("Scare Tactics")) {
        patternClass = "scare-tactics-class";
        tooltipTitle = "Scare Tactics: Instilling fear to influence user behavior (e.g., security threats).";
        additionalMessage = "Scare Tactics: Verify the authenticity of security threats.";
        emoji = "😱"; // Screaming emoji for scare tactics
    } else if (currentPattern.includes("Difficult to Cancel")) {
        patternClass = "difficult-cancel-class";
        tooltipTitle = "Difficult to Cancel: Making it intentionally challenging for users to cancel subscriptions.";
        additionalMessage = "Difficult to Cancel: Review cancellation terms before subscribing.";
        emoji = "🤬"; // Angry emoji for difficult to cancel
    } else if (currentPattern.includes("Limited time") || currentPattern.includes("Limited offer")) {
        patternClass = "limited-time-class";
        tooltipTitle = "Limited Time/Offer: Creates a sense of urgency by implying that the offer is available for a short duration.";
        additionalMessage = "Limited Time/Offer: Verify the actual duration and terms of the offer.";
        emoji = "🤬"; // Hourglass emoji for limited time/offer
    } else if (currentPattern.includes("unbelievable results") || currentPattern.includes("changed my life overnight") ||
        currentPattern.includes("perfectly flawless") || currentPattern.includes("miracle product") ||
        currentPattern.includes("no drawbacks at all") || currentPattern.includes("absolutely faultless") ||
        currentPattern.includes("every claim is true") || currentPattern.includes("never seen anything better") ||
        currentPattern.includes("unrealistically positive") || currentPattern.includes("too perfect to be real") ||
        currentPattern.includes("instantly solved all my problems") || currentPattern.includes("100% guaranteed satisfaction") ||
        currentPattern.includes("no negative aspects whatsoever") || currentPattern.includes("exaggerated language") ||
        currentPattern.includes("overly positive") || currentPattern.includes("best thing ever") ||
        currentPattern.includes("amazing product with no flaws") || currentPattern.includes("perfect in every way") ||
        currentPattern.includes("nothing negative to say") || currentPattern.includes("flawless experience") ||
        currentPattern.includes("incredible results") || currentPattern.includes("unrealistic claims") ||
        currentPattern.includes("no downsides at all") || currentPattern.includes("life-changing product") ||
        currentPattern.includes("works like magic") || currentPattern.includes("never disappoints") ||
        currentPattern.includes("absolute perfection") || currentPattern.includes("flawlessly executed") ||
        currentPattern.includes("unmatched quality") || currentPattern.includes("nothing compares to it") ||
        currentPattern.includes("exceeded all expectations") || currentPattern.includes("truly exceptional")
    ) {
        patternClass = "fake-review-class";
        tooltipTitle = "Suspicious Review: May be overly positive or use exaggerated language";
        additionalMessage = "Fake Review: This review is created to attract users.";
        emoji = "🚫"; // Prohibited emoji for fake reviews
    }

    return { patternClass, tooltipTitle, additionalMessage, emoji, additionalMessageShape };
}

function createHighlightContainer(match, patternClass, tooltipTitle, additionalMessage, emoji, additionalMessageShape) {
    var arrowSymbol = patternClass === 'dark-pattern' ? '<div class="arrow-container"><div class="arrow-symbol"></div></div>' : '';

    var circularMessageContainer = additionalMessage
        ? `<div class="unique-circular-message ai-theme" style="position: absolute; top: 100%; left: 50%; transform: translateX(-50%); white-space: nowrap; padding: 5px; box-sizing: border-box; 
            background-color: black; color: white; border: 2px solid red; border-radius: 50%; text-align: center;">${additionalMessage}${arrowSymbol}</div>`
        : '';
        var rectangularMessageContainer = additionalMessage
        ? `<div class="unique-rectangular-message ai-theme" style="position: absolute; top: 100%; left: 50%; transform: translateX(-50%); white-space: pre-wrap; padding: 5px; box-sizing: border-box; 
            background-color: darkred ; color: white; border: 2px solid blue; border-radius: 5px; text-align: center;">
            <span style="display: inline-block; margin-right: 5px;">🤖</span>${additionalMessage}${arrowSymbol}</div>`
        : '';
    

    var squareMessageContainer = additionalMessage
        ? `<div class="unique-square-message ai-theme" style="position: absolute; top: 100%; left: 50%; transform: translateX(-50%); white-space: nowrap; padding: 8px; box-sizing: border-box; 
            background-color: green; color: white; border: 2px solid yellow; border-radius: 5px; text-align: center;">${additionalMessage}${arrowSymbol}</div>`
        : '';

    var selectedMessageContainer;
    if (additionalMessageShape === 'circular') {
        selectedMessageContainer = circularMessageContainer;
    } else if (additionalMessageShape === 'rectangular') {
        selectedMessageContainer = rectangularMessageContainer;
    } else if (additionalMessageShape === 'square') {
        selectedMessageContainer = squareMessageContainer;
    } else {
        selectedMessageContainer = rectangularMessageContainer;
    }

    return `<div class="unique-highlight-container ai-theme" style="position: relative; display: inline-block;">
                <span class="${patternClass}" title="${tooltipTitle}" data-toggle="tooltip" data-placement="top" data-original-title="${match}" 
                    style="background-color: ${getHighlightColor(patternClass)}; color: black; position: relative; z-index: 1; padding: 5px; border-radius: 5px; text-align: center;">
                    <span style="background-color: black; padding: 2px; border-radius: 50%;">${emoji}</span>
                    ${match}
                </span>
                ${selectedMessageContainer}
            </div>`;
}

function sendMatchCounter(matchCounter) {
    chrome.runtime.sendMessage({ action: 'sendMatchCounter', matchCounter: matchCounter });
}

function addTellCountButton(matchCounter) {
    var buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'fixed';
    buttonContainer.style.bottom = '20px';
    buttonContainer.style.right = '20px';
    buttonContainer.style.zIndex = '1000';

    var tellCountButton = document.createElement('button');
    tellCountButton.innerText = 'Tell Match Count';
    tellCountButton.style.padding = '10px';
    tellCountButton.style.backgroundColor = 'blue';
    tellCountButton.style.color = 'white';
    tellCountButton.style.border = 'none';
    tellCountButton.style.borderRadius = '5px';
    tellCountButton.style.cursor = 'pointer';
    tellCountButton.onclick = function () {
        announceMatchCount(matchCounter);
    };

    buttonContainer.appendChild(tellCountButton);
    document.body.appendChild(buttonContainer);
}

function announceMatchCount(count) {
    var message = `There are ${count} highlighted patterns on this page.`;
    var speechSynthesis = window.speechSynthesis;

    var utterance = new SpeechSynthesisUtterance(message);

    utterance.voice = speechSynthesis.getVoices()[0];

    speechSynthesis.speak(utterance);
}

function getHighlightColor(patternClass) {
    switch (patternClass) {
        case 'only-left-class':
            return 'gold';
        case 'in-stock-class':
            return 'lightblue';
        case 'ends-class':
            return 'lightgreen';
        case 'last-class':
            return 'lightpink';
        case 'best-class':
            return 'lightcoral';
        case 'exchange-class':
            return 'red';
        case 'dark-pattern':
            return 'darkred'; 
        case 'misleading-defaults-class':
        case 'hidden-ticks-class':
        case 'scare-tactics-class':
        case 'difficult-cancel-class':
        case 'limited-time-class':
            return 'purple';  case 'fake-review-class':
        
        default:
            return 'yellow'; 
    }
}
