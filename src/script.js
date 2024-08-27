document.getElementById("calculate-button").addEventListener("click", function() {
  const targetValue = parseInt(document.getElementById("target-value").value);

  // Collect and filter instructions
  const instructions = [];
  document.querySelectorAll(".instruction-set").forEach((set) => {
    const action = set.querySelector(".action").value;
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

  // Function to find the best "hit" tier for the given context
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
    // Calculate the sum of instruction values, adjusting for flexible hits
    let instructionSum = 0;
    instructions.forEach(instr => {
      if (instr.action === "hit") {
        const bestHit = selectBestHit(targetValue - instructionSum, ["hit1", "hit2", "hit3"]);
        instructionSum += actions[bestHit];
        instr.action = bestHit; // Replace "hit" with the best specific hit tier
      } else {
        instructionSum += actions[instr.action];
      }
    });

    console.log("Instruction Sum:", instructionSum);
    let preTargetValue = targetValue - instructionSum;
    console.log("Pre-Target Value:", preTargetValue);

    // Initialize dp array to handle up to preTargetValue
    const dp = Array(preTargetValue + 1).fill(Infinity);
    dp[0] = 0; // Starting point at 0

    // Dynamic Programming: Populate dp table
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

    // Backtrack to find the most efficient sequence of actions
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

    // The setupActions array now holds the most efficient sequence in reverse order
    setupActions.reverse();

    return setupActions;
  }

  // Sort instructions based on priority for the "Finally" section
  function sortInstructions(instructions) {
    // Separate instructions into different priority categories
    const last = instructions.filter(i => i.priority === 'last');
    const secondLast = instructions.filter(i => i.priority === 'second-last');
    const thirdLast = instructions.filter(i => i.priority === 'third-last');
    const notLast = instructions.filter(i => i.priority === 'not-last');
    const anyPriority = instructions.filter(i => i.priority === 'any');

    // Combine them in order of priority
    let sortedInstructions = [...thirdLast, ...secondLast, ...notLast, ...last];

    // Handle "any" priority for hits
    if (anyPriority.length > 0) {
      // If "any" actions exist, determine where to insert them
      const anyHits = anyPriority.map(i => i);

      // Determine the correct insertion point:
      // If there's a "last" and "second last", "any" must be third last
      // If there's only "last", "any" must be second last
      // If neither, "any" can be anywhere before the "last" actions
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

  // Display results
  document.getElementById("setup-actions").innerText = setupActions.join(", ");
  document.getElementById("final-actions").innerText = sortedInstructions.map(i => i.action).join(", ");
});
