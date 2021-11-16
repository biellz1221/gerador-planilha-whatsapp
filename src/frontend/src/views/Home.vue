/* eslint-disable */
<template>
	<div class="home">
		<p>Faça upload de um arquivo seguindo <a href="/static/sample.csv" target="_blank" download>este exemplo</a>, insira a mensagem e clique em gerar</p>
		<div class="fields">
			<div class="formField">
				<label for="atendente"><b>Atendente</b></label
				><br />
				<input class="input" type="text" id="atendente" name="atendente" v-model="atendente" />
			</div>
			<div class="formField">
				<label for="pronome"
					><b>Pronome</b><br />
					<div class="radioGroup">
						<label class="radio"> <input type="radio" name="pronome" id="o" value="o" v-model="pronome" /> o </label>
						<label class="radio"> <input type="radio" name="pronome" id="a" value="a" v-model="pronome" /> a </label>
					</div>
				</label>
			</div>
		</div>
		<div class="messageField">
			<label for="message"><b>Mensagem</b></label>
			<div class="textControls">
				<ul>
					<li>
						<span class="button" @click="insertVariable(bold)"><b>Negrito</b></span>
					</li>
					<li>
						<span class="button" @click="insertVariable(italic)"><em>Itálico</em></span>
					</li>
					<li>
						<span class="button" @click="insertVariable(striketrough)"><del>Strike</del></span>
					</li>
					<li>
						<span class="button" @click="insertVariable(monospace)"><span class="is-family-monospace">Monospace</span></span>
					</li>
					<li v-for="(txtVar, index) in msgVariables" :key="index">
						<span @click="insertVariable(txtVar.variable)" class="button" :title="txtVar.description">{{ txtVar.variable }}</span>
					</li>
					<li>
						<emoji-picker @emoji="append" :search="search">
							<div class="emoji-invoker" slot="emoji-invoker" slot-scope="{ events: { click: clickEvent } }" @click.stop="clickEvent">
								<span class="button">
									<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
										<path d="M0 0h24v24H0z" fill="none" />
										<path
											d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"
										/>
									</svg>
								</span>
							</div>
							<div slot="emoji-picker" slot-scope="{ emojis, insert, display }">
								<div class="emoji-picker" :style="{ top: display.y + 'px', left: display.x + 'px' }">
									<div class="emoji-picker__search">
										<input type="text" v-model="search" v-focus />
									</div>
									<div>
										<div v-for="(emojiGroup, category) in emojis" :key="category">
											<h5>{{ category }}</h5>
											<div class="emojis">
												<span v-for="(emoji, emojiName) in emojiGroup" :key="emojiName" @click="insert(emoji)" :title="emojiName">{{ emoji }}</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</emoji-picker>
					</li>
				</ul>
			</div>
			<textarea
				placeholder="Digite a sua mensagem. Utilize os botões acima para inserir variáveis ou formatar o texto."
				@mouseup="detectTextSelection($event)"
				ref="msgTxt"
				name="message"
				id="message"
				class="textarea"
				v-model="message"
			></textarea>
		</div>

		<div class="uploadArea">
			<ul v-if="files.length">
				<li v-for="file in files" :key="file.id">
					<span>{{ file.name }}</span>
				</li>
			</ul>

			<div v-else>
				<div class="text-center p-5">
					<h4>Arraste e solte o arquivo aqui ou<br /><br /></h4>
					<label for="file" class="button">Selecione o arquivo</label>
				</div>
			</div>

			<div v-show="$refs.upload && $refs.upload.dropActive" class="drop-active">
				<h3>Solte os arquivos aqui para enviar</h3>
			</div>

			<div class="example-btn">
				<file-upload class="btn btn-primary" post-action="/upload/post" :multiple="false" :drop="true" :drop-directory="true" v-model="files" ref="upload">
					<label class="button">Selecionar Arquivos</label>
				</file-upload>
			</div>
		</div>
		<div class="is-flex is-justify-content-center">
			<button type="button" class="button is-primary" v-if="!$refs.upload || !$refs.upload.active" @click.prevent="postStuff">Gerar</button>
		</div>
	</div>
</template>

<script>
	import FileUpload from "vue-upload-component";
	import axios from "axios";
	import { nanoid } from "nanoid";
	import { EmojiPicker } from "vue-emoji-picker";

	export default {
		name: "Home",
		components: {
			FileUpload,
			EmojiPicker,
		},
		directives: {
			focus: {
				inserted(el) {
					el.focus();
				},
			},
		},
		data() {
			return {
				input: "",
				search: "",
				files: [],
				selectedText: "",
				msgVariables: [
					{ variable: "[nome]", description: "Nome completo" },
					{ variable: "[pnome]", description: "Primeiro nome" },
					{ variable: "[telefone]", description: "Telefone do lead" },
					{ variable: "[email]", description: "Email do lead" },
					{ variable: "[pronome]", description: "Pronome do atendente" },
					{ variable: "[atendente]", description: "Nome do atendente" },
				],
				atendente: "Gabriel",
				pronome: "o",
				message: "O primeiro nome de [nome] é [pnome], o telefone é [telefone], o email [email] e quem vai atender é [pronome] [atendente]",
			};
		},
		computed: {
			bold() {
				return `*${this.selectedText}*`;
			},
			italic() {
				return `_${this.selectedText}_`;
			},
			striketrough() {
				return `~${this.selectedText}~`;
			},
			monospace() {
				return `\`\`\`${this.selectedText}\`\`\``;
			},
		},
		methods: {
			detectTextSelection(e) {
				let selection = e.target.value.substring(e.target.selectionStart, e.target.selectionEnd);
				this.selectedText = selection;
				// console.log(selection);
			},
			append(emoji) {
				this.insertVariable(emoji);
			},
			insertVariable: function (insert) {
				const self = this;
				var tArea = this.$refs.msgTxt;

				console.log("VAriável", insert);
				// filter:
				if (0 == insert) {
					return;
				}
				if (0 == cursorPos) {
					return;
				}

				// get cursor's position:
				let startPos = tArea.selectionStart,
					endPos = tArea.selectionEnd,
					cursorPos = startPos,
					tmpStr = tArea.value;

				console.log({ startPos, endPos, cursorPos, tmpStr });
				// insert:
				self.message = tmpStr.substring(0, startPos) + insert + tmpStr.substring(endPos, tmpStr.length);

				// move cursor:
				setTimeout(() => {
					cursorPos += insert.length;
					tArea.selectionStart = tArea.selectionEnd = cursorPos;
				}, 10);
			},
			postStuff() {
				console.log("MSG => ", this.message);

				const formData = new FormData();
				formData.append("atendente", this.atendente);
				formData.append("pronome", this.pronome);
				formData.append("message", this.message);
				this.files.forEach((file) => formData.append("csv", file.file));

				axios
					.post("/xls", formData, {
						// .post("http://localhost:3000/xls", formData, {
						responseType: "blob",
						headers: {
							"Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
						},
					})
					.then((res) => {
						// console.log(res.headers);
						// console.log(res.data);

						const url = window.URL.createObjectURL(new Blob([res.data]));
						const link = document.createElement("a");
						link.href = url;
						link.setAttribute("download", `/downloads/${nanoid()}-${res.headers["x-file-name"]}`);
						document.body.appendChild(link);
						link.click();
					});
			},
		},
	};
</script>
