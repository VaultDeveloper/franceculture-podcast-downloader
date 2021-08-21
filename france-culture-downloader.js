const logId = "FCPD: ";
document.body.style.border = "5px solid orange";

console.log(logId, "Plugin loaded.");

const domButtons = document.querySelector("div.buttons");
console.log(logId, "buttons loaded");

if (domButtons) {
	document.body.style.border = "5px solid green";

	const downloadButton = document.createElement("button");
	downloadButton.className = "replay-button paused aod playable blue textualized playing";
	downloadButton.style = "font-size: inherit;"
	downloadButton.innerHTML = "Télécharger";
	domButtons.appendChild(downloadButton);

	downloadButton.addEventListener("click", () => {
		console.log(logId, "Asking download.");
	});
}
