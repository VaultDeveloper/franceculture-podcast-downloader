const logId = "FCPD: ";

console.log(logId, "background.js loaded");

function logOnHistoryStateUpdated(details) {
	console.log(logId, "onHistoryStateUpdated: " + details.url);
	console.log(logId, "Transition type: " + details.transitionType);
	console.log(logId, "Transition qualifiers: " + details.transitionQualifiers);
}

const franceCulterFilter = {
  url:
  [
    {hostContains: "franceculture.fr"}
  ]
};

browser.webNavigation.onHistoryStateUpdated.addListener(
	logOnHistoryStateUpdated,
	franceCulterFilter
);
