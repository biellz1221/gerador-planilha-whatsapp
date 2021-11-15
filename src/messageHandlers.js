// const mock = "O primeiro nome de [nome] é [pnome], o telefone é [telefone], o email [email] e quem vai atender é [pronome] [atendente]";

const msgVariables = [
	"[nome]", //
	"[pnome]",
	"[telefone]",
	"[pronome]",
	"[atendente]",
	"[email]",
];

function formatMessage(message, data) {
	let msgWithVariables = message;

	msgVariables.forEach((variable) => {
		let regEx = new RegExp(variable, "g");

		msgWithVariables = msgWithVariables.replace(regEx, data[variable]);

		return true;
	});

	return msgWithVariables;
}

module.exports = {
	formatMessage,
};
