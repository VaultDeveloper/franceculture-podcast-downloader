/** Identifiant de log pour le content-script. */
const logId = "FCPD.C: ";
document.body.style.border = "5px solid orange";

console.log(logId, "Plugin loaded.");

/** Retourne la balise HTML `<button>` à ajouter au `DOM`.
 * @returns Balise HTML `<button>` à ajouter au `DOM`.
*/
function buildDownloadButton() {
		/** Balise HTML `button` pour télécharger le podcast. */
		const downloadButton = document.createElement("button");
		// Ajoute la CSS et le texte.
		downloadButton.className =
			"replay-button paused aod playable blue textualized playing";
		downloadButton.style = "font-size: inherit;";
		downloadButton.innerHTML = "Télécharger";

		downloadButton.addEventListener("click", () => {
			console.log(logId, "Download button clicked.");
			downloadRequestPort.postMessage({ url: getFileUrl(domButtons) });
		});
}

/** Ajoute le bouton de téléchargement sur la page si elle contient un podcast téléchargeable. */
function addDownloadButton() {
	/** Div qui doit contenir le bouton `Écouter` et sur lequel il faut ajouter le bouton `Télécharger`. */
	const domButtons = document.querySelector("div.buttons");

	if (domButtons) {
		console.log(logId, "buttons detected");
		document.body.style.border = "5px solid green";

		domButtons.appendChild(buildDownloadButton());
	} else {
		console.log(logId, "buttons not detected, download unavailable.");
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

// Évènement qui permet d'être notifié des navigations sur les onglets de franceculture.fr.
onUrlChangedPort.onMessage.addListener(function () {
	addDownloadButton();
});
