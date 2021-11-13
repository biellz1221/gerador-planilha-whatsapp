const mock = "O primeiro nome do [nome] é [pnome], o telefone é [telefone], o email [email] e quem vai atender é [pronome] [atendende]";

const msgVariables = [
	"[nome]", //
	"[pnome]",
	"[telefone]",
	"[pronome]",
	"[atendente]",
];

function formatMessage(message, data) {
	let msgWithVariables = message;
	msgVariables.forEach((variable) => {
		msgWithVariables = msgWithVariables.replaceAll(variable, data["variable"]);
		return true;
	});
	return msgWithVariables;
}
