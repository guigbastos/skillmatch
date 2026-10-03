export const showStatus = (message) => {
	document.getElementById("page-status").textContent = message;
};

export const setCatalogState = ({ isLoading, canAnalyse, canRetry }) => {
	document.getElementById("analyse-button").disabled =
		isLoading || !canAnalyse;
	document.getElementById("retry-button").hidden = !canRetry;
	document.getElementById("retry-button").disabled = isLoading;
};

export const onRetry = (handler) => {
	document.getElementById("retry-button").addEventListener("click", handler);
};
