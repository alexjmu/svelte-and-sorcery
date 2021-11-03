<script>
	import { onMount } from 'svelte';
	
	export let type = '.';
	export let switched = false;
	
	let currentTile;
	
	const types = {
		'.': [['o', '*'], ['*', 'o']],
		'_': [['_', '-'], ['-', '_'], ['_', '_']],
		'K': ['K', 'k'],
		'G': [['G', 'g'], ['g', 'G']],
		'U': [['U', 'u'], ['u', 'U']],
		'#': ['#', '#'],
		',': [',', ','],
		'+': ['+', '+'],
		null: ['0', '0']
	}
	const savedRandomVersions = {};
	function getTileset(type) {
			const list = types[type] || [type, type]; // todo: DEBUG
			if (list === undefined) {
				throw Error(`unknown tile type '${type}'`)
			}
			else if (Array.isArray(list[0])) {
				let version = savedRandomVersions[type] === undefined ?
						Math.floor(Math.random() * list.length) :
						savedRandomVersions[type];
				savedRandomVersions[type] = version;
				return list[version];
			} else {
				return list;
			}
	}
	
	$: {
		const tileset = getTileset(type);
		currentTile = tileset[switched ? 0 : 1];
	}
</script>

<div class="tile {
						{'#': 'wall', ',': 'food', '_': 'ground', null: 'null'}[type] || type
						}">
{currentTile}
</div>

<style>
	.tile {
		color: white;
		font-size: 10pt;
	}
	.K {
		color: pink;
	}
	.G {
		color: darkred;
	}
	.U {
		color: hotpink;
	}
	.wall {
		color: gray;
	}
	.food {
		color: darkgreen;
	}
	.ground {
		color: darkgray;
	}
	.null {
		color: gray;
	}
</style>