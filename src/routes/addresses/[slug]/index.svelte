<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit';
  const load: Load = async ({ page, fetch }) => {
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
  import type { Item, Territory } from '$lib/types';

  import { divide } from '$lib/divideItems';

  export let items: Item[] = [];
  let maxPerTerritory = 20,
    baseName = 'TITLE';

  let territorys = divide(items, baseName, maxPerTerritory);

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

<label for="max">Base Name</label>
<input name="max" type="text" bind:value={baseName} />

<label for="max">Max Addresses Per Territory</label>
<input name="max" type="number" bind:value={maxPerTerritory} />
<p>Total Addresses: {items.length} Territorys: {Math.ceil(items.length / maxPerTerritory)}</p>
<button on:click={() => (territorys = divide(items, baseName, maxPerTerritory))}>Update</button>
<button on:click={startDownload}>Download</button>

<br />
{#each territorys as territory}
  <p>{territory.title}</p>
  <ul>
    {#each territory.items as item}
      <li><strong>{item.Text}</strong> {item.Description}</li>
    {/each}
  </ul>
{/each}
