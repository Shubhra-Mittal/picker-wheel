window.onload = function () {
  console.log("Prototype script.js loaded ✅");

  // Load rewards from localStorage or default
  let rewards = JSON.parse(localStorage.getItem("rewards")) || [
    "Ice Cream",
    "Movie Night",
    "Bubble Tea",
    "Dance Break",
  ];

  const container = document.querySelector(".wheel-container");
  let wheel;

  // Adjust font size dynamically based on slice count
  function getFontSizeForSlices(count) {
    const sliceAngle = 360 / count;
    if (sliceAngle >= 60) return 22;
    if (sliceAngle >= 45) return 20;
    if (sliceAngle >= 30) return 18;
    if (sliceAngle >= 20) return 16;
    return 14;
  }

  // Generate pastel colors for slices
  const baseColors = ["#dbd5f9", "#c9c3f3", "#bbb3ed"];

  function getNonRepeatingColors(length) {
    const colors = [];
    let lastColor = null;
    for (let i = 0; i < length; i++) {
      const options = baseColors.filter((c) => c !== lastColor);
      const chosen = options[Math.floor(Math.random() * options.length)];
      colors.push(chosen);
      lastColor = chosen;
    }
    return colors;
  }

  // Build the wheel
  function createWheel() {
    const dynamicFontSize = getFontSizeForSlices(rewards.length);
    const backgroundColors = getNonRepeatingColors(rewards.length);

    const props = {
      radius: 1,
      isInteractive: true,
      pointerAngle: 0,
      items: rewards.map((reward) => ({ label: reward })),
      itemLabelColors: ["#333"],
      itemBackgroundColors: backgroundColors,

      itemLabelFont: "Quicksand, sans-serif",
      itemLabelFontSizeMax: dynamicFontSize,
      itemLabelStrokeColor: "#333",
      itemLabelStrokeWidth: 0.25,
      itemLabelAlign: "center",
      itemLabelRadius: 0.55,
      itemLabelRadiusMax: 0.08,
      itemLabelRotation: 0,
      itemLabelBaselineOffset: -0.2,

      borderColor: "#8f84ed",
      borderWidth: 2,
      lineColor: "#8f84ed",
      lineWidth: 1.5,
    };

    container.innerHTML = "";
    wheel = new spinWheel.Wheel(container, props);
    wheel.rotation = Math.random() * 2 * Math.PI;

    document.getElementById("spinButton").onclick = () => {
      wheel.spin(400);
    };

    wheel.onRest = () => {
      const index = wheel.getCurrentIndex();
      const rewardWon = rewards[index];
      document.getElementById("rewardText").textContent = rewardWon;
      document.getElementById("winPopupModal").style.display = "flex";

      // Confetti celebration
      const confettiCanvas = document.getElementById("confettiCanvas");
      const myConfetti = confetti.create(confettiCanvas, {
        resize: true,
        useWorker: true,
      });
      myConfetti({
        particleCount: 200,
        startVelocity: 60,
        spread: 90,
        ticks: 80,
        origin: { y: 0.7 },
      });
    };
  }

  // Display rewards in the panel
  function displayRewards() {
    const rewardList = document.getElementById("rewardList");
    rewardList.innerHTML = "";

    rewards.forEach((reward, index) => {
      const li = document.createElement("li");
      li.textContent = reward;

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "✕";
      deleteBtn.onclick = () => {
        rewards.splice(index, 1);
        localStorage.setItem("rewards", JSON.stringify(rewards));
        displayRewards();
        createWheel();
      };

      li.appendChild(deleteBtn);
      rewardList.appendChild(li);
    });
  }

  // Add new reward on Enter
  document
    .getElementById("newRewardInput")
    .addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        const newReward = event.target.value.trim();
        if (newReward) {
          rewards.push(newReward);
          localStorage.setItem("rewards", JSON.stringify(rewards));
          event.target.value = "";
          displayRewards();
          createWheel();
        }
      }
    });

  // Close win popup
  document.getElementById("closeWinPopup").onclick = () => {
    document.getElementById("winPopupModal").style.display = "none";
  };

  // Remove reward from popup
  document.getElementById("removeRewardBtn").onclick = () => {
    const rewardToRemove = document.getElementById("rewardText").textContent;
    const index = rewards.indexOf(rewardToRemove);
    if (index !== -1) {
      rewards.splice(index, 1);
      localStorage.setItem("rewards", JSON.stringify(rewards));
      displayRewards();
      createWheel();
    }
    document.getElementById("winPopupModal").style.display = "none";
  };

  // Initialize
  displayRewards();
  createWheel();

  // Typing animation (optional)
  const message = "Spin the wheel to unlock your weekly win!";
  let index = 0;
  function typeText() {
    const typingTarget = document.getElementById("typing-text");
    if (!typingTarget) return;
    if (index < message.length) {
      typingTarget.textContent += message.charAt(index);
      index++;
      setTimeout(typeText, 50);
    }
  }
  typeText();
};
