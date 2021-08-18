const logId = "France Culture podcast Downloader: ";
document.body.style.border = "5px solid green";

const domButtons = document.querySelector('div.buttons');
console.log(logId, "buttons loaded");

if (domButtons) {
	const downloadButton = document.createElement("button");
	downloadButton.classList.add(... ["replay-button", "paused" ,"aod" ,"playable" ,"blue" ,"textualized", "playing"]);
	downloadButton.innerHTML = "Télécharger";
	domButtons.appendChild(downloadButton);

	downloadButton.addEventListener("click", () => {
		console.log(logId, "Asking download.");
	});
}
