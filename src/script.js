// Helper function to create an image element for a given action
function createActionImage(action) {
  const img = document.createElement("img");
  img.src = `../res/${action}.png`;  // Assuming all images are named after the action
  img.alt = action;

  // Capitalize the first letter of the action for the tooltip
  const capitalizedAction = action.charAt(0).toUpperCase() + action.slice(1);
  img.title = capitalizedAction;

  img.classList.add("result-icon");  // Add a class for potential styling
  return img;
}

// Function to apply tooltips to existing action icons in the instruction set and popup
function applyTooltipToIcon(iconElement) {
  const action = iconElement.getAttribute("data-action");
  if (action) {
    const capitalizedAction = action.charAt(0).toUpperCase() + action.slice(1);
    iconElement.title = capitalizedAction;
  } else if (action === "") {
    iconElement.title = "None";
  }
}

document.getElementById("calculate-button").addEventListener("click", function() {
  const targetValue = parseInt(document.getElementById("target-value").value);

  // Collect and filter instructions
  const instructions = [];
  document.querySelectorAll("[class^='instruction-set']").forEach((set) => {
    const actionElement = set.querySelector(".action-icon");
    const action = actionElement.getAttribute("data-action");
    const priority = set.querySelector(".priority").value;
    if (action && priority) {
      instructions.push({ action, priority });
    }
  });
  console.log("Instructions:", instructions);

  // Action values
  const actions = {
    punch: 2,
    bend: 7,
    upset: 13,
    shrink: 16,
    hit1: -3,
    hit2: -6,
    hit3: -9,
    draw: -15
  };

  function selectBestHit(preTargetValue, remainingHits) {
    let bestHitAction = null;
    let minActions = Infinity;

    remainingHits.forEach(hit => {
      const hitValue = actions[hit];
      const actionsNeeded = Math.ceil(preTargetValue / hitValue);
      if (actionsNeeded < minActions && (preTargetValue % hitValue === 0 || preTargetValue + hitValue <= targetValue)) {
        minActions = actionsNeeded;
        bestHitAction = hit;
      }
    });

    return bestHitAction;
  }

  function calculateSetupActions(targetValue, instructions) {
    let instructionSum = 0;
    instructions.forEach(instr => {
      if (instr.action === "hit") {
        const bestHit = selectBestHit(targetValue - instructionSum, ["hit1", "hit2", "hit3"]);
        instructionSum += actions[bestHit];
        instr.action = bestHit;
      } else {
        instructionSum += actions[instr.action];
      }
    });

    console.log("Instruction Sum:", instructionSum);
    let preTargetValue = targetValue - instructionSum;
    console.log("Pre-Target Value:", preTargetValue);

    const dp = Array(preTargetValue + 1).fill(Infinity);
    dp[0] = 0;

    for (let i = 0; i <= preTargetValue; i++) {
      if (dp[i] !== Infinity) {
        for (let action in actions) {
          let nextValue = i + actions[action];
          if (nextValue <= preTargetValue) {
            dp[nextValue] = Math.min(dp[nextValue], dp[i] + 1);
          }
        }
      }
    }

    let setupActions = [];
    let currentValue = preTargetValue;

    while (currentValue > 0) {
      for (let action in actions) {
        let prevValue = currentValue - actions[action];
        if (prevValue >= 0 && dp[prevValue] === dp[currentValue] - 1) {
          setupActions.push(action);
          currentValue = prevValue;
          break;
        }
      }
    }

    setupActions.reverse();

    return setupActions;
  }

  function sortInstructions(instructions) {
    const last = instructions.filter(i => i.priority === 'last');
    const secondLast = instructions.filter(i => i.priority === 'second-last');
    const thirdLast = instructions.filter(i => i.priority === 'third-last');
    const notLast = instructions.filter(i => i.priority === 'not-last');
    const anyPriority = instructions.filter(i => i.priority === 'any');

    let sortedInstructions = [...thirdLast, ...secondLast, ...notLast, ...last];

    if (anyPriority.length > 0) {
      const anyHits = anyPriority.map(i => i);

      let insertionPoint = 0;
      if (last.length > 0 && secondLast.length > 0) {
        insertionPoint = sortedInstructions.length - last.length - secondLast.length;
      } else if (last.length > 0) {
        insertionPoint = sortedInstructions.length - last.length;
      } else {
        insertionPoint = sortedInstructions.length;
      }

      sortedInstructions.splice(insertionPoint, 0, ...anyHits);
    }

    return sortedInstructions;
  }

  const setupActions = calculateSetupActions(targetValue, instructions);
  console.log("Setup Actions:", setupActions.join(", "));

  const sortedInstructions = sortInstructions(instructions);
  console.log("Final Instructions:", sortedInstructions.map(i => i.action).join(", "));

  // Display results as images
  const setupContainer = document.getElementById("setup-actions");
  const finalContainer = document.getElementById("final-actions");

  // Clear previous results
  setupContainer.innerHTML = "";
  finalContainer.innerHTML = "";

  // Append setup actions as images
  setupActions.forEach(action => {
    setupContainer.appendChild(createActionImage(action));
  });

  // Append final instructions as images
  sortedInstructions.forEach(instr => {
    finalContainer.appendChild(createActionImage(instr.action));
  });

  // Show the result card with a transition
  const resultCard = document.getElementById("result");
  resultCard.classList.add("visible");
});

// Single function to manage icon selection
function setupInstructionListener(selector) {
  const icon = document.querySelector(selector + ' .action-icon');
  const container = document.querySelector('.container');
  icon.addEventListener('click', function() {
    const currentIcon = this;
    const popup = document.getElementById('action-popup');
    popup.classList.remove('hidden');
    container.classList.add('blurred');

    // Remove all existing listeners on popup icons
    document.querySelectorAll('.popup-action-icon').forEach(popupIcon => {
      popupIcon.onclick = null;
    });

    // Add listener to popup icons for the current selection
    document.querySelectorAll('.popup-action-icon').forEach(popupIcon => {
      // Apply tooltip to each popup icon
      applyTooltipToIcon(popupIcon);

      popupIcon.onclick = function() {
        currentIcon.src = this.src;
        currentIcon.setAttribute('data-action', this.getAttribute('data-action'));
        popup.classList.add('hidden');
        container.classList.remove('blurred');

        // Apply tooltip to the selected icon in the instruction set
        applyTooltipToIcon(currentIcon);
      };
    });

    document.getElementById('close-popup').onclick = function() {
      popup.classList.add('hidden');
      container.classList.remove('blurred');
    };
  });

  // Apply tooltip to the instruction set icon on load
  applyTooltipToIcon(icon);
}

// Apply listeners to each instruction set
setupInstructionListener('.instruction-set-1');
setupInstructionListener('.instruction-set-2');
setupInstructionListener('.instruction-set-3');
