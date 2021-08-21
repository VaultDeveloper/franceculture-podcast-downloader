/** Identifiant de log pour le content-script. */
const logId = "FCPD.C: ";
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
			console.log(logId, "Download button clicked.");
			downloadRequestPort.postMessage({ url: getFileUrl(domButtons) });
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

// TODO Mettre un id en premier paramètre pour déployer l'extension: https://developer.mozilla.org/fr/docs/Mozilla/Add-ons/WebExtensions/Content_scripts
const onUrlChangedPort = browser.runtime.connect("", {
	name: "franceculture-on-navigation-changed",
});

// TODO Mettre un id en premier paramètre pour déployer l'extension: https://developer.mozilla.org/fr/docs/Mozilla/Add-ons/WebExtensions/Content_scripts
const downloadRequestPort = browser.runtime.connect("", {
	name: "franceculture-download-request",
});

onUrlChangedPort.onMessage.addListener(function (m) {
	addDownloadButton();
});
