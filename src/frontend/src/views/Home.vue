/* eslint-disable */
<template>
	<div class="home">
		<p>Faça upload de um arquivo seguindo <a href="/sample-files/sample.csv" target="_blank" download>este exemplo</a>, insira a mensagem e clique em gerar</p>

		<div class="formField">
			<label for="atendente">Atendente</label><br />
			<input type="text" id="atendente" name="atendente" v-model="atendente" />
		</div>
		<div class="formField">
			<br /><label for="pronome"
				>Pronome<br />
				<input type="radio" name="pronome" id="o" value="o" v-model="pronome" /> o<br />
				<input type="radio" name="pronome" id="a" value="a" v-model="pronome" /> a<br />
			</label>
		</div>
		<div class="formField">
			<br /><label for="message">Mensagem</label><br />
			<textarea name="message" id="message" cols="30" rows="10" v-model="message"></textarea>
		</div>

		<div class="uploadArea">
			<ul v-if="files.length">
				<li v-for="file in files" :key="file.id">
					<span>{{ file.name }}</span>
				</li>
			</ul>

			<div v-else>
				<div class="text-center p-5">
					<h4>Arraste e solte o arquivo aqui <br />ou</h4>
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
				<button type="button" class="btn btn-success" v-if="!$refs.upload || !$refs.upload.active" @click.prevent="postStuff">
					<label class="button">Gerar</label>
				</button>
			</div>
		</div>
	</div>
</template>

<script>
	import FileUpload from "vue-upload-component";
	import axios from "axios";
	export default {
		name: "Home",
		components: {
			FileUpload,
		},
		data() {
			return {
				files: [],
				atendente: "Gabriel",
				pronome: "o",
				message: "O primeiro nome de [nome] é [pnome], o telefone é [telefone], o email [email] e quem vai atender é [pronome] [atendente]",
			};
		},
		methods: {
			postStuff() {
				const formData = new FormData();
				formData.append("atendente", this.atendente);
				formData.append("pronome", this.pronome);
				formData.append("message", this.message);
				this.files.forEach((file) => formData.append("csv", file.file));

				axios
					.post("http://gerador-de-planilhas-de-zap.herokuapp.com/xls", formData, {
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
						link.setAttribute("download", res.headers["x-file-name"]);
						document.body.appendChild(link);
						link.click();
					});
			},
		},
	};
</script>
