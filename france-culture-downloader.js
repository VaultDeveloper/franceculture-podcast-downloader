const logId = "FCPD: ";
document.body.style.border = "5px solid orange";

console.log(logId, "Plugin loaded.");

function addDownloadButton() {
	const domButtons = document.querySelector("div.buttons");

	if (domButtons) {
		console.log(logId, "buttons detected");
		document.body.style.border = "5px solid green";

		const downloadButton = document.createElement("button");
		downloadButton.className =
			"replay-button paused aod playable blue textualized playing";
		downloadButton.style = "font-size: inherit;";
		downloadButton.innerHTML = "Télécharger";
		domButtons.appendChild(downloadButton);

		downloadButton.addEventListener("click", () => {
			// Todo lancer un téléchargement.
			console.log(logId, "Download button clicked.");
			getFileUrl(domButtons);
		});
	} else {
		console.log(logId, "buttons not detected");
		document.body.style.border = "5px solid orange";
	}
}

/** Retourne l'adresse du fichier pour le div qui contient tous les boutons. */
function getFileUrl(buttons) {
	const fileUrl = buttons.firstChild.getAttribute("data-url");
	// Ne fonctionne que si c'est le premier button et que l'attribut pour stocker l'url du fichier est `data-url`.
	console.log(`${logId} File location: ${fileUrl}.`);
	return fileUrl;
}

addDownloadButton();

var onUrlChangedPort = browser.runtime.connect({
	name: "franceculture-on-navigation-changed",
});

onUrlChangedPort.onMessage.addListener(function (m) {
	addDownloadButton();
});
