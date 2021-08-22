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

/** Valeur du téléchargement en cours. Si aucun téléchargement `undefined`.
 * @type {number}
 */
let currentDownloadId;

/** Prochains fichiers à télécharger.
 * @type {Array<DownloadRequestData>}
 */
const nextDownloads = [];

/** Callback qui disperse les écoute sur les différents ports en fonction de l'attribut `name` passé en paramètre du port.
 * @param p Port à écouter.
 */
function onPortConnected(p) {
	console.log(`${logId} port connexion received '${p.name}'.`);

	if (p.name === "franceculture-on-navigation-changed")
		onNavigationChangedPort = p;
	else if (p.name === "franceculture-download-request") {
		onDownloadRequestPort = p;
		onDownloadRequestPort.onMessage.addListener(onDownloadRequestReceived);
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
		(downloadId) => {
			console.log(
				`${logId} Download started (id: ${downloadId}, url: ${data.url}).`
			);
			currentDownloadId = downloadId;
		},
		(error) => {
			console.error(`${logId} Download failed: ${error}`);
		}
	);
}

/** Fonction appelée lorsqu'un téléchargement évolue.
 * @param {DownloadDelta} delta Objet `DownloadDelta` (WebAPI) qui indique l'évolution du téléchargement.
 */
function onDownloadChanged(delta) {
	console.log(`${logId} download changed:`);
	console.log(delta);

	if (
		currentDownloadId === delta.id &&
		(hasUserCanceled(delta) || hasDownloadJustFinished(delta))
	) {
		// Le téléchargement qui vient de terminer est celui de ce script.
		onCurrentDownloadCompleted();
	}
}

/** Retourne `true` si l'utilisateur a arrêté le téléchargement.
 * @param {DownloadDelta} delta Objet `DownloadDelta` (WebAPI) qui indique l'évolution du téléchargement.
 * @returns {boolean}
 */
function hasUserCanceled(delta) {
	return delta.error && delta.error.current === "USER_CANCELED";
}

/** Retourne `true` si le téléchargement vient de se terminer.
 * @param {DownloadDelta} delta Objet `DownloadDelta` (WebAPI) qui indique l'évolution du téléchargement.
 * @returns {boolean}
 */
function hasDownloadJustFinished(delta) {
	return (
		delta.state &&
		delta.state.current === "complete" &&
		delta.state.previous === "in_progress"
	);
}

/** Fonction appelée lorsque le téléchargement courant est terminé. */
function onCurrentDownloadCompleted() {
	currentDownloadId = undefined;
	startDownloadIfReady();
}

/** Fonction appelée lorsqu'une nouvelle demande de téléchargement est reçue.
 * @param {DownloadRequestData} data
 */
function onDownloadRequestReceived(data) {
	nextDownloads.push(data);
	startDownloadIfReady();
}

/** Démarre un téléchargement si aucun n'est en cours. */
function startDownloadIfReady() {
	console.log(`${logId} Checking if next download is ready.`);
	if (currentDownloadId === undefined && nextDownloads.length > 0) {
		// Si aucun élément n'est en cours de téléchargement et s'il reste des éléments à télécharger, on prend le premier (file).
		console.log(`${logId} Next download ready.`);
		downloadFile(nextDownloads.shift());
	} else {
		console.log(
			`${logId} Nothing to download (current: ${currentDownloadId}, next: ${nextDownloads.length}).`
		);
	}
}

// Ajoute les écoutes sur des événements.
browser.runtime.onConnect.addListener(onPortConnected);
browser.downloads.onChanged.addListener(onDownloadChanged);

/** Classe passé dans le port `onDownloadRequestPort` contenant les informations sur le fichier à télécharger. */
class DownloadRequestData {
	constructor(url, filename) {
    this.url = url;
    this.filename = filename;
  }
}
