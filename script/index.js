const nav = document.querySelector(".nav");
const icon = document.querySelector(".icon");
function toggleMenu() {
  if (!nav.style.top || nav.style.top === "-1100px") {
    nav.style.top = "0";
    icon.style.rotate = "180deg";
  } else {
    nav.style.top = "-1100px";
    icon.style.rotate = "0deg";
  }
}

document.querySelector(".footerText").innerHTML =
  `©️ ${new Date().getFullYear()} Ambu Nelly. All
            rights reserved.`;
