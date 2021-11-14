const excel = require("excel4node");

const workbook = new excel.Workbook();
const worksheet = workbook.addWorksheet("Sheet 1");

const xlsHeader = [
	{ id: "nome", title: "Nome" },
	{ id: "pnome", title: "PNome" },
	{ id: "email", title: "Email" },
	{ id: "telefone", title: "Telefone" },
	{ id: "pronome", title: "Pronome" },
	{ id: "atendente", title: "Atendente" },
	{ id: "message", title: "Mensagem" },
	{ id: "link", title: "LinkZap" },
];

async function generateXLSFromCSV(rows, xlsName) {
	const outputOptions = {
		path: `./test-files/output-${xlsName}`,
		header: xlsHeader,
	};

	outputOptions.header.map((header, index) => {
		worksheet.cell(1, index + 1).string(header.title);
		return true;
	});

	rows.map((row, index) => {
		Object.keys(row).forEach((key, keyIndex) => {
			// if (key === "link") {
			// 	worksheet.cell(index + 2, keyIndex + 1).formula(`HYPERLINK("${row[key]}"; "Clique aqui")`);
			// } else {
			// 	worksheet.cell(index + 2, keyIndex + 1).string(row[key]);
			// }
			worksheet.cell(index + 2, keyIndex + 1).string(row[key]);
			return true;
		});
		return true;
	});

	workbook.write(outputOptions.path.replace(".csv", ".xlsx"));

	console.log("The XLS file was written successfully");
}

module.exports = {
	generateXLSFromCSV,
};
