const darkModeIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="#cccccc" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M20.958 15.325c.204-.486-.379-.9-.868-.684a7.684 7.684 0 0 1-3.101.648c-4.185 0-7.577-3.324-7.577-7.425a7.28 7.28 0 0 1 1.134-3.91c.284-.448-.057-1.068-.577-.936C5.96 4.041 3 7.613 3 11.862C3 16.909 7.175 21 12.326 21c3.9 0 7.24-2.345 8.632-5.675Z"/><path fill="currentColor" d="M15.611 3.103c-.53-.354-1.162.278-.809.808l.63.945a2.332 2.332 0 0 1 0 2.588l-.63.945c-.353.53.28 1.162.81.808l.944-.63a2.332 2.332 0 0 1 2.588 0l.945.63c.53.354 1.162-.278.808-.808l-.63-.945a2.332 2.332 0 0 1 0-2.588l.63-.945c.354-.53-.278-1.162-.809-.808l-.944.63a2.332 2.332 0 0 1-2.588 0l-.945-.63Z"/></svg>`;

const lightModeIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="#333" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M12 1.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0V2a.75.75 0 0 1 .75-.75Z"/><path fill="currentColor" fill-rule="evenodd" d="M6.25 12a5.75 5.75 0 1 1 11.5 0a5.75 5.75 0 0 1-11.5 0ZM12 7.75a4.25 4.25 0 1 0 0 8.5a4.25 4.25 0 0 0 0-8.5Z" clip-rule="evenodd"/><path fill="currentColor" d="M5.46 4.399a.75.75 0 0 0-1.061 1.06l.707.707a.75.75 0 1 0 1.06-1.06l-.707-.707ZM22.75 12a.75.75 0 0 1-.75.75h-1a.75.75 0 0 1 0-1.5h1a.75.75 0 0 1 .75.75Zm-3.149-6.54a.75.75 0 1 0-1.06-1.061l-.707.707a.75.75 0 1 0 1.06 1.06l.707-.707ZM12 20.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0v-1a.75.75 0 0 1 .75-.75Zm6.894-2.416a.75.75 0 1 0-1.06 1.06l.707.707a.75.75 0 1 0 1.06-1.06l-.707-.707ZM3.75 12a.75.75 0 0 1-.75.75H2a.75.75 0 0 1 0-1.5h1a.75.75 0 0 1 .75.75Zm2.416 6.894a.75.75 0 0 0-1.06-1.06l-.707.707a.75.75 0 0 0 1.06 1.06l.707-.707Z"/></svg>`;

document.addEventListener('DOMContentLoaded', function() {
  initializeMode();

  document.querySelectorAll('.action-icon').forEach(icon => {
    icon.src = '../res/empty.png';
    icon.setAttribute('data-action', '');
  });

  const defaults = ['last', 'second-last', 'third-last'];
  document.querySelectorAll('.instruction-set').forEach((set, index) => {
    const select = set.querySelector('.priority');
    if (select) {
      select.value = defaults[index] || '';
    }
  });

  document.getElementById('target-value').value = '';
  document.getElementById('result').classList.remove('visible');
});

// Event listener for the dark mode toggle switch
document.getElementById('mode-toggle-checkbox').addEventListener('change', function () {
  if (this.checked) {
    document.body.classList.remove('light-mode');
    document.body.classList.add('dark-mode');
    localStorage.setItem('darkMode', 'true');
    updateGitHubIconColor(true);
  } else {
    document.body.classList.remove('dark-mode');
    document.body.classList.add('light-mode');
    localStorage.setItem('darkMode', 'false');
    updateGitHubIconColor(false);
  }
  updateModeIcon();
});

// Function to update the mode icon
function updateModeIcon() {
  const isDarkMode = document.body.classList.contains('dark-mode');
  const modeIcon = document.getElementById('mode-icon');
  modeIcon.innerHTML = isDarkMode ? darkModeIcon : lightModeIcon;
}

// Set dark mode as default and handle mode persistence
function initializeMode() {
  const storedMode = localStorage.getItem('darkMode');
  const darkModeEnabled = storedMode === null ? true : storedMode === 'true';
  const modeToggle = document.getElementById('mode-toggle-checkbox');

  if (darkModeEnabled) {
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
    modeToggle.checked = true;
    updateGitHubIconColor(true);
  } else {
    document.body.classList.add('light-mode');
    document.body.classList.remove('dark-mode');
    modeToggle.checked = false;
    updateGitHubIconColor(false);
  }
  updateModeIcon();
}

// Helper function to create an image element for a given action
function createActionImage(action) {
  const img = document.createElement("img");
  img.src = `../res/${action}.png`;  // Assuming all images are named after the action
  img.alt = action;
  const capitalizedAction = action.charAt(0).toUpperCase() + action.slice(1);
  img.title = capitalizedAction;
  img.classList.add("result-icon");
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

  function displayGroupedActions(container, actions) {
    let i = 0;
    while (i < actions.length) {
      const current = typeof actions[i] === "string" ? actions[i] : actions[i].action;
      let count = 1;
      while (i + count < actions.length &&
             (typeof actions[i + count] === "string" ? actions[i + count] : actions[i + count].action) === current) {
        count++;
      }

      const wrapper = document.createElement("div");
      wrapper.classList.add("action-with-count");
      const img = createActionImage(current);
      wrapper.appendChild(img);

      if (count > 1) {
        const countText = document.createElement("div");
        countText.classList.add("action-count");
        countText.textContent = `×${count}`;
        wrapper.appendChild(countText);
      }

      container.appendChild(wrapper);
      i += count;
    }
  }


  function calculateSetupActions(targetValue, instructions) {
    // --- helpers ---
  
    function findShortestPathTo(goal) {
      if (goal === 0) return [];
      const MAX_STEPS = 14;
      const q = [[0, []]];
      const seen = new Set([0]);
  
      while (q.length) {
        const [cur, path] = q.shift();
        if (cur === goal) return path;
        if (path.length >= MAX_STEPS) continue;
  
        const candidates = Object.entries(actions)
          .map(([a, v]) => ({ a, v, score: Math.abs(goal - (cur + v)) }))
          .sort((x, y) => x.score - y.score);
  
        for (const { a, v } of candidates) {
          const nxt = cur + v;
          if (!seen.has(nxt)) {
            seen.add(nxt);
            q.push([nxt, [...path, a]]);
          }
        }
      }
  
      // Greedy fallback
      let approx = [];
      let cur = 0;
      const LIMIT = 40;
      for (let i = 0; i < LIMIT && cur !== goal; i++) {
        let best = null, bestDist = Math.abs(goal - cur);
        for (const [a, v] of Object.entries(actions)) {
          const dist = Math.abs(goal - (cur + v));
          if (dist < bestDist) { bestDist = dist; best = a; }
        }
        if (!best) break;
        approx.push(best);
        cur += actions[best];
      }
      return approx.length ? approx : ["punch"];
    }
  
    function assignFinalHitsSmart() {
      const finals = [];
      finals.push(...instructions.filter(x => x.priority === "third-last"));
      finals.push(...instructions.filter(x => x.priority === "second-last"));
      finals.push(...instructions.filter(x => x.priority === "last"));
  
      const finalsAreFlexible = finals.some(f => f.action === "hit");
      if (!finalsAreFlexible) return null;
  
      const nonFinals = instructions.filter(x => !finals.includes(x));
      const nonFinalSum = nonFinals.reduce((s, i) => s + actions[i.action], 0);
  
      const optionsPerSlot = finals.map(f => {
        if (f.action === "hit") return ["hit1", "hit2", "hit3"];
        return [f.action];
      });
  
      function* cartesian(arrays, idx = 0, cur = []) {
        if (idx === arrays.length) { yield cur; return; }
        for (const opt of arrays[idx]) {
          yield* cartesian(arrays, idx + 1, [...cur, opt]);
        }
      }
  
      let best = { setupLen: Infinity, assign: null, setupPath: null };
  
      for (const assignment of cartesian(optionsPerSlot)) {
        if (!assignment.every(a => actions.hasOwnProperty(a))) continue;
        const finalsSum = assignment.reduce((s, a) => s + actions[a], 0);
        const remainder = targetValue - nonFinalSum - finalsSum;
        const setupPath = findShortestPathTo(remainder);
        const setupLen = setupPath.length;
        if (setupLen < best.setupLen) {
          best = { setupLen, assign: assignment, setupPath };
          if (setupLen === 0) break;
        }
      }
  
      if (best.assign) {
        for (let i = 0; i < finals.length; i++) {
          finals[i].action = best.assign[i];
        }
        return best.setupPath || [];
      }
      return null;
    }
  
    // --- MAIN BODY ---
  
    // Resolve non-final "hit" placeholders quickly
    instructions.forEach(instr => {
      if (["last", "second-last", "third-last"].includes(instr.priority)) return;
      if (instr.action === "hit") {
        const choices = ["hit1", "hit2", "hit3"];
        const pick = choices.reduce((best, a) => {
          const v = actions[a];
          const score = Math.abs(targetValue - v);
          if (!best || score < best.score) return { a, score };
          return best;
        }, null);
        instr.action = pick ? pick.a : "hit1";
      }
    });
  
    // Jointly assign finals
    const precomputedSetup = assignFinalHitsSmart();
    if (precomputedSetup !== null) {
      return precomputedSetup; // authoritative, don’t recompute remainder
    }
  
    // If no final hit placeholders, just compute normally
    const instructionSum = instructions.reduce((s, i) => s + actions[i.action], 0);
    const preTargetValue = targetValue - instructionSum;
    if (preTargetValue === 0) return [];
    return findShortestPathTo(preTargetValue);
  }
  
  function sortInstructions(instructions) {
    // Find fixed-position instructions (at most one each)
    const last = instructions.find(i => i.priority === "last");
    const secondLast = instructions.find(i => i.priority === "second-last");
    const thirdLast = instructions.find(i => i.priority === "third-last");

    // Flexible pools
    const flexAny = instructions.filter(i => i.priority === "any").slice();
    const flexNotLast = instructions.filter(i => i.priority === "not-last").slice();

    // Helper to take one item from an array (FIFO)
    const take = (arr) => arr.length ? arr.shift() : null;

    // Build the 3-slot tail [third-last, second-last, last]
    const tail = [null, null, null];
    if (thirdLast)  tail[0] = thirdLast;
    if (secondLast) tail[1] = secondLast;
    if (last)       tail[2] = last;

    // Fill LAST slot (index 2) if empty:
    // - Can use 'any'
    // - Must NOT use 'not-last'
    if (!tail[2]) {
      const fromAny = take(flexAny);
      if (fromAny) {
        tail[2] = fromAny;
      } else {
        // No legal candidate for last; constraints unsatisfiable with provided instructions
        // (keep going so validator can show a clear error later)
        console.warn("sortInstructions: No legal instruction available for 'last' slot (cannot use 'not-last').");
      }
    }

    // Fill SECOND-LAST slot (index 1) if empty:
    // - Can use 'any' or 'not-last'
    if (!tail[1]) {
      const candidate = take(flexAny) || take(flexNotLast);
      if (candidate) tail[1] = candidate;
    }

    // Fill THIRD-LAST slot (index 0) if empty:
    // - Can use 'any' or 'not-last'
    if (!tail[0]) {
      const candidate = take(flexAny) || take(flexNotLast);
      if (candidate) tail[0] = candidate;
    }

    // Whatever flexible instructions remain go BEFORE the tail
    const head = [...flexAny, ...flexNotLast];

    // Return final instruction objects in order: head + tail (filter nulls just in case)
    return [...head, ...tail.filter(Boolean)];
  }

  function validateRecipe(fullSeq) {
    const len = fullSeq.length;
    if (len === 0) throw new Error("Empty instruction sequence!");

    function logAndThrow(msg) {
      console.group("Recipe Constraint Violation");
      console.log("Error:", msg);
      console.log("Full recipe:", fullSeq.map(i =>
        typeof i === "string"
          ? `${i} (setup)`
          : `${i.action} (${i.priority})`
      ));
      console.groupEnd();
      throw new Error(msg);
    }

    fullSeq.forEach((item, idx) => {
      if (typeof item === "string") return; // setup step, skip
      switch (item.priority) {
        case "last":
          if (idx !== len - 1) logAndThrow("'last' not in last position");
          break;
        case "second-last":
          if (len >= 2 && idx !== len - 2) logAndThrow("'second-last' not in second-last position");
          break;
        case "third-last":
          if (len >= 3 && idx !== len - 3) logAndThrow("'third-last' not in third-last position");
          break;
        case "not-last":
          if (idx === len - 1) logAndThrow("'not-last' placed last");
          break;
      }
    });
  }


  const setupActions = calculateSetupActions(targetValue, instructions);
  const sortedInstructions = sortInstructions(instructions);

  const fullRecipe = [...setupActions, ...sortedInstructions];
  validateRecipe(fullRecipe);

  // Display results as images
  const setupContainer = document.getElementById("setup-actions");
  const finalContainer = document.getElementById("final-actions");

  // Clear previous results
  setupContainer.innerHTML = "";
  finalContainer.innerHTML = "";

  // Group and append setup actions
  displayGroupedActions(setupContainer, setupActions);

  // Group and append final instructions
  displayGroupedActions(finalContainer, sortedInstructions);

  // Show the result card with a transition
  const resultCard = document.getElementById("result");
  resultCard.classList.add("visible");
});

// Single function to manage icon selection
function setupInstructionListener(selector) {
  const icon = document.querySelector(selector + ' .action-icon');
  const container = document.querySelector('.container');
  const popup = document.getElementById('action-popup');
  const popupContent = document.querySelector('.action-popup-content');
  const header = document.querySelector('.app-header');


  icon.addEventListener('click', function() {
    const currentIcon = this;
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
        closePopup();
      };
    });

    // Close popup when clicking outside of it
    function handleOutsideClick(event) {
      if (!popupContent.contains(event.target) &&
          !icon.contains(event.target) &&
          !header.contains(event.target)) {
        closePopup();
      }
    }

    document.addEventListener('click', handleOutsideClick);

    function closePopup() {
      popup.classList.add('hidden');
      container.classList.remove('blurred');
      document.removeEventListener('click', handleOutsideClick);
    }

    document.getElementById('close-popup').onclick = closePopup;
  });

  // Apply tooltip to the instruction set icon on load
  applyTooltipToIcon(icon);
}

function resetPage() {
  // Reset target value input
  document.getElementById('target-value').value = '';

  // Reset instruction sets
  const defaults = ['last', 'second-last', 'third-last'];
  document.querySelectorAll('.instruction-set').forEach((set, index) => {
    const actionIcon = set.querySelector('.action-icon');
    actionIcon.src = '../res/empty.png';
    actionIcon.setAttribute('data-action', '');
    actionIcon.title = 'None';

    const prioritySelect = set.querySelector('.priority');
    if (prioritySelect) {
      prioritySelect.value = defaults[index] || '';
    }
  });

  // Hide result card
  const resultCard = document.getElementById('result');
  resultCard.classList.remove('visible');

  // Clear setup and final actions
  document.getElementById('setup-actions').innerHTML = '';
  document.getElementById('final-actions').innerHTML = '';
}

function updateGitHubIconColor(isDarkMode) {
  const githubIcon = document.getElementById('github-icon');
  if (githubIcon) {
    githubIcon.style.fill = isDarkMode ? '#ffffff' : '#24292f';
  }
}

// Call resetPage on window load
window.addEventListener('load', resetPage);

// Apply listeners to each instruction set
setupInstructionListener('.instruction-set-1');
setupInstructionListener('.instruction-set-2');
setupInstructionListener('.instruction-set-3');
