/** Identifiant de log pour le background-script. */
const logId = "FCPD.B: ";

const franceCulterFilter = {
	url: [{ hostContains: "franceculture.fr" }],
};

console.log(logId, "background.js loaded");

function onHistoryStateUpdated(details) {
	console.log(logId, "historyStateUpdated " + details.url);
	onNavigationChangedPort.postMessage({});
}

browser.webNavigation.onHistoryStateUpdated.addListener(
	onHistoryStateUpdated,
	franceCulterFilter
);

/** Port pour communiquer avec les scripts de contenu. */
let onNavigationChangedPort;

/** Port pour communiquer les demandes de téléchargement. */
let onDownloadRequestPort;

/** Callback qui disperse les écoute sur les différents ports en fonction de l'attribut `name` passé en paramètre du port.
 * @param p Port à écouter.
 */
function onPortConnected(p) {
	console.log(`${logId} port connexion received '${p.name}'.`);

	if (p.name === "franceculture-on-navigation-changed")
		onNavigationChangedPort = p;
	else if (p.name === "franceculture-download-request") {
		onDownloadRequestPort = p;
		onDownloadRequestPort.onMessage.addListener(downloadFile);
	} else console.error(`${logId} Port name not recognized '${p.name}'.`);
}

/** Lance le téléchargement du fichier dont l'url est passé en direction du dossier de téléchargement par défaut.
 * @param {DownloadRequestData} data
 */
function downloadFile(data) {
	console.log(`${logId} Download request received.`);
	const downloading = browser.downloads.download({
		url: data.url,
		filename: data.filename,
	});
	downloading.then(
		() => {
			console.log(`${logId} Download started.`);
		},
		(error) => {
			console.error(`${logId} Download failed: ${error}`);
		}
	);
}

// Ajoute les écoutes sur des événements.
browser.runtime.onConnect.addListener(onPortConnected);

/** Classe passé dans le port `onDownloadRequestPort` contenant les informations sur le fichier à télécharger. */
class DownloadRequestData {
	url;
	filename;
}
