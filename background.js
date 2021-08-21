const logId = "FCPD: ";

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
var onNavigationChangedPort;

function connected(p) {
	console.log(logId, "onNavigationChanged port open.");
	onNavigationChangedPort = p;
}

browser.runtime.onConnect.addListener(connected);
