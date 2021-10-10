<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	const load: Load = async ({ page, fetch, session, stuff }) => {
		const url = `/search/id/${page.params.slug}.json`;
		const res = await fetch(url);

		if (res.ok) {
			let items = await res.json();
			return {
				props: {
					items
				}
			};
		}

		return {
			status: res.status,
			error: new Error(`Could not load ${url}`)
		};
	};
	export { load };
</script>

<script lang="ts">
	import type { Item } from '$lib/types';
	import { each } from 'svelte/internal';

	import pdfMake from 'pdfmake/build/pdfmake';
	import pdfFonts from 'pdfmake/build/vfs_fonts';
	pdfMake.vfs = pdfFonts.pdfMake.vfs;

	import jszip from 'jszip';

	export let items: Item[] = [];
	let maxPerTerritory = 20,
		baseName = 'TITLE';

	function divide(): { title: string; items: Item[] }[] {
		console.log(baseName);

		let out = [];
		let i = 0;
		const total = Math.ceil(items.length / maxPerTerritory);
		while (i < total) {
			out.push({
				title: `${baseName} ${String.fromCharCode(97 + i).toLocaleUpperCase()}`,
				items: items.slice(
					Math.ceil(items.length / total) * i,
					Math.ceil(items.length / total) * (i + 1)
				)
			});
			i++;
		}
		return out;
	}
	let territorys = divide();

	const downloadFile = (blob, fileName) => {
		console.log('Download');

		const link = document.createElement('a');
		// create a blobURI pointing to our Blob
		link.href = URL.createObjectURL(blob);
		link.download = fileName;
		// some browser needs the anchor to be in the doc
		document.body.append(link);
		link.click();
		link.remove();
		// in case the Blob uses a lot of memory
		setTimeout(() => URL.revokeObjectURL(link.href), 7000);
	};

	const download = async () => {
		let totalDone = 0;
		let zip = new jszip();
		territorys.forEach(async (t) => {
			let doc = {
				content: [
					{
						text: t.title,
						fontSize: 25,
						alignment: 'center',
						lineHeight: 1,
						decoration: 'underline',
						bold: true
					},
					' ',
					{
						ul: t.items.map((v) => {
							return {
								text: `${v.Text} (${v.Description})`,
								fontSize: 15,
								bold: true,
								lineHeight: 1.5
							};
						})
					}
				]
			};
			pdfMake.createPdf(doc).getBlob(async (blob) => {
				zip.file(t.title + '.pdf', blob);
				totalDone++;
				if (totalDone === territorys.length) {
					downloadFile(
						await zip.generateAsync({
							type: 'blob',
							compression: 'DEFLATE',
							compressionOptions: { level: 9 }
						}),
						territorys[0].title.slice(0, -2)
					);
				}
			});
		});
	};
</script>

<label for="max">Base Name</label>
<input name="max" type="text" bind:value={baseName} />

<label for="max">Max Addresses Per Territory</label>
<input name="max" type="number" bind:value={maxPerTerritory} />
<p>Total Addresses: {items.length} Territorys: {Math.ceil(items.length / maxPerTerritory)}</p>
<button on:click={() => (territorys = divide())}>Update</button>
<button on:click={download}>Download</button>

<br />
{#each territorys as territory}
	<p>{territory.title}</p>
	<ul>
		{#each territory.items as item}
			<li><strong>{item.Text}</strong> {item.Description}</li>
		{/each}
	</ul>
{/each}
