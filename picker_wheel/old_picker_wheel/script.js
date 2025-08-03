window.onload = function () {
  console.log("Script.js loaded ✅");

  let rewards = JSON.parse(localStorage.getItem("rewards")) || [
    "Ice Cream",
    "Movie Night",
    "Bubble Tea",
    "Dance Break",
  ];

  const container = document.querySelector(".wheel-container");
  let wheel;

  function getFontSizeForSlices(count) {
    const sliceAngle = 360 / count;
    if (sliceAngle >= 60) return 22;
    if (sliceAngle >= 45) return 20;
    if (sliceAngle >= 30) return 18;
    if (sliceAngle >= 20) return 16;
    return 14;
  }
  const baseColors = ["#fff1f1", "#ffdddd", "#ffc7c6", "#ff9e9d", "#f98988"];
  function getNonRepeatingColors(length) {
    const colors = [];
    let lastColor = null;
    for (let i = 0; i < length; i++) {
      // Get a list excluding the last color used
      const options = baseColors.filter((c) => c !== lastColor);
      // Choose one randomly
      const chosen = options[Math.floor(Math.random() * options.length)];
      colors.push(chosen);
      lastColor = chosen;
    }
    return colors;
  }

  function createWheel() {
    const dynamicFontSize = getFontSizeForSlices(rewards.length);
    const backgroundColors = getNonRepeatingColors(rewards.length);

    const props = {
      radius: 1,
      isInteractive: true,
      pointerAngle: 0,
      items: rewards.map((reward) => ({ label: reward })),
      itemLabelColors: ["#882e2e"],
      itemBackgroundColors: backgroundColors,

      itemLabelFont: "Poppins Bold, sans-serif",
      itemLabelFontSizeMax: dynamicFontSize,
      itemLabelStrokeColor: "#882e2e",
      itemLabelStrokeWidth: 0.25,
      itemLabelAlign: "center", // ensures text is centered along its anchor point
      itemLabelRadius: 0.55, // pulls text inward
      itemLabelRadiusMax: 0.08, // controls text wrap width, feel free to play with 0.4–0.5
      itemLabelRotation: 0, // ensures upright (0° rotation)
      itemLabelBaselineOffset: -0.2, // fine-tune vertical positioning

      borderColor: "#ffffff", // outer circle border
      borderWidth: 4, // thickness of outer border

      lineColor: "#ffffff", // lines between slices
      lineWidth: 2,
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
      document.getElementById("winPopupModal").style.display = "block";

      // Inside wheel.onRest
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

  function displayRewards() {
    const rewardList = document.getElementById("rewardList");
    rewardList.innerHTML = "";
    rewards.forEach((reward, index) => {
      const li = document.createElement("li");
      li.textContent = reward;
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
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

  document.getElementById("editButton").onclick = () => {
    document.getElementById("popupModal").style.display = "block";
    displayRewards();
  };

  document.getElementById("closePopup").onclick = () => {
    document.getElementById("popupModal").style.display = "none";
  };

  document.getElementById("closeWinPopup").onclick = () => {
    document.getElementById("winPopupModal").style.display = "none";
  };

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

  createWheel(); // Initial wheel setup
  // Typing animation inside window.onload
  const message = "Spin the wheel to unlock your weekly win!";
  let index = 0;

  function typeText() {
    const typingTarget = document.getElementById("typing-text");
    if (!typingTarget) return; // element not found safeguard

    if (index < message.length) {
      typingTarget.textContent += message.charAt(index);
      index++;
      setTimeout(typeText, 50); // adjust speed here
    }
  }

  typeText(); // start typing
};
