<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit';
  import type { Item } from '$lib/types';
  const load: Load = async ({ params, fetch }) => {
    const url = `/search/id/${params.slug}.json`;
    const res = await fetch(url);

    if (res.ok) {
      let items: Item[] = await res.json();
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
  import type { Territory } from '$lib/types';

  import { divide } from '$lib/divideItems';

  export let items: Item[] = [];
  let maxPerTerritory = 20,
    baseName = 'TITLE';

  $: territorys = divide(items, baseName, maxPerTerritory);

  let download = null;

  async function startDownload() {
    territorys = divide(items, baseName, maxPerTerritory);
    if (download === null) {
      let makeZip = await import('$lib/makeZip');
      download = async (territorys: Territory[]) => {
        makeZip.downloadFile((await makeZip.generate(territorys)) as Blob, baseName);
      };
    }
    download(territorys);
  }
</script>

<svelte:head>
  <title>Simple Adresses</title>
</svelte:head>

<div id="iholder">
  <h2>Control Panel</h2>
  <label for="max">Base Name</label>
  <input name="max" type="text" bind:value={baseName} />

  <label for="max">Max Addresses Per Territory</label>
  <input name="max" type="number" bind:value={maxPerTerritory} />

  <button on:click={startDownload}>Download Zip</button>
</div>

<br />
<section>
  <h2 style="margin-bottom: 0px">Preview</h2>
  <p>
    Total Addresses: {items.length} Territorys: {Math.ceil(
      items.length / (maxPerTerritory < 1 ? 1 : maxPerTerritory)
    )}
  </p>
  <div id="tholder">
    {#each territorys as territory}
      <div class="territory">
        <h3 style="text-align: center; font-weight: bold">{territory.title}</h3>
        <ul>
          {#each territory.items as item}
            <li><strong>{item.Text}</strong> {item.Description}</li>
          {/each}
        </ul>
      </div>
    {/each}
  </div>
</section>

<style>
  #iholder {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    min-width: 35%;
    margin: 0 auto;
    box-sizing: border-box;
  }
  #tholder {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }
  .territory {
    border: 2px solid black;
    background-color: white;
    margin: 5px;
    padding: 5px;
    display: flexbox;
    flex-grow: 1;
  }

  label {
    text-align: center;
    padding: 2px;
  }
  input,
  button {
    padding: 5px;
    margin: 2px;
  }
  p,
  h2 {
    text-align: center;
  }
  h2 {
    font-size: 40px;
    margin: 10px;
  }
</style>
