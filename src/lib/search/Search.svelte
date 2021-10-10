<script lang="ts">
	import type { Item } from '$lib/types';
	let searchBoxText = '',
		resultItems: Item[] = null;

	async function search() {
		resultItems = null;
		let res = await searchByStr(searchBoxText);
		resultItems = res;
	}

	async function searchByStr(str: string) {
		if (searchBoxText === '') return;
		const res = await fetch(`/search/query/${str}.json`);
		return await res.json();
	}
</script>

<section>
	<input
		placeholder="Address"
		type="text"
		bind:value={searchBoxText}
		on:keyup={({ key }) => {
			if (key === 'Enter') {
				search();
			}
		}}
	/>
	<button on:click={search}>Search</button>
	{#if resultItems !== null}
		<p style="margin-bottom: 0px;">Results (Length {resultItems.length})</p>
		<ul>
			{#each resultItems as item}
				<li>
					<a href="/addresses/{item.Id}"><strong>{item.Text}</strong></a>
					{item.Description} ({item.Type})
				</li>
			{/each}
		</ul>
	{/if}
	<div />
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		min-width: 500px;
		text-align: center;
		font-size: 20px;
	}

	button,
	input {
		margin: 2px;
		text-align: center;
	}
	ul {
		font-size: 15px;
		text-align: left;
	}
</style>
