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

async function generateXLSFromCSV(rows, xlsPath, callback) {
	const outputOptions = {
		path: xlsPath,
		header: xlsHeader,
	};

	outputOptions.header.map((header, index) => {
		worksheet.cell(1, index + 1).string(header.title);
		return true;
	});

	rows.map((row, index) => {
		Object.keys(row).forEach((key, keyIndex) => {
			// if (key === "link") {
			// 	// console.log(`LINK => ${row[key]}`);
			// 	let fm = `HYPERLINK("https://api.whatsapp.com/send?phone=5522992576349&text=%F0%9F%91%8DO%20primeiro%20nome%20de%20Gabriel%20Baptista%20%C3%A9%20Gabriel%2C%20o%20telefone%20%C3%A9%205522992576349%2C%20o%20email%20biellz1221%40gmail.com%20e%20quem%20vai%20atender%20%C3%A9%20o%20Gabriel")`;
			// 	worksheet.cell(index + 2, keyIndex + 1).formula(fm);
			// } else {
			// 	worksheet.cell(index + 2, keyIndex + 1).string(row[key]);
			// }
			worksheet.cell(index + 2, keyIndex + 1).string(row[key]);
			return true;
		});
		return true;
	});

	workbook.write(outputOptions.path, (err, stats) => {
		if (err) return console.log(`[ERROR] => `, err);
		// console.log("[STATS] => ", stats);
		callback();
	});

	console.log("The XLS file was written successfully");
}

module.exports = {
	generateXLSFromCSV,
};
