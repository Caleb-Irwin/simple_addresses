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

  export let items: Item[] = [];
  let maxPerTerritory = 20,
    baseName = 'TITLE';

  function divide(): { title: string; items: Item[] }[] {
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

  let download = null;

  async function startDownload() {
    territorys = divide();
    if (download === null) {
      download = (await import('./_makeZip')).download;
    }
    download(territorys);
  }
</script>

<label for="max">Base Name</label>
<input name="max" type="text" bind:value={baseName} />

<label for="max">Max Addresses Per Territory</label>
<input name="max" type="number" bind:value={maxPerTerritory} />
<p>Total Addresses: {items.length} Territorys: {Math.ceil(items.length / maxPerTerritory)}</p>
<button on:click={() => (territorys = divide())}>Update</button>
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
