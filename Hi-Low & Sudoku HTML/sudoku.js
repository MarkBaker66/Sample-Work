function clean() {
	document.getElementById('status').innerHTML = '';
	for (var i = 0; i < 16; i++) {
		document.getElementById('cell-'+i).value = '';
		document.getElementById('cell-'+i).readOnly = false;
		document.getElementById('cell-'+i).classList.remove('cell-readonly');
		document.getElementById('cell-'+i).classList.remove('cell-wrong');
	}
}

function solve() {
	document.getElementById('status').innerHTML = '';
	var grid = read_grid();

	if (is_valid(grid))  {
		grid = find_solution(grid);
		status = (is_completed(grid)) ? 'Solved' : 'Not solvable';
		document.getElementById('status').innerHTML = status;
		write_grid(grid, false);
	}
	else {
		document.getElementById('status').innerHTML = 'Input is not valid';
	}
}

function newBoard() {
	generate_sudoku(7);
}


function validate_cells() {
	//resetting
	for (var i = 0; i < 16; i++) document.getElementById('cell-'+i).classList.remove('cell-wrong-border', 'cell-wrong');
	for (var i = 0; i < 16; i++) {
		if (!validate_cell_inner(i)) document.getElementById('cell-'+i).classList.add('cell-wrong-border');
	}
	if (is_completed(read_grid())) document.getElementById('status').innerHTML = 'Solved';
}

function reset() {
	for (var i = 0; i < 16; i++) {
		var element = document.getElementById('cell-'+i);
		if (element.readOnly == false) {
			element.value = '';
		}
		element.classList.remove('cell-wrong-border', 'cell-wrong');
	}
	document.getElementById('status').innerHTML = '';
}

function is_int(value) {
	return !isNaN(value) && parseInt(Number(value)) == value && !isNaN(parseInt(value, 10));
  }
  
  function remove_from_arr(arr, item) {
	  var new_arr = [];
	  arr.forEach(el => {if (el !== item) new_arr.push(el)});
  
	  return new_arr;
  }
  
  function get_rand_int(min, max) {
	  return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  function read_grid() {
	var grid = [];
	for (var i = 0; i < 16; i++) {
		var val = document.getElementById('cell-'+i).value;
		if (is_int(val) && val > 0 && val < 5) val = parseInt(val);
		else val = 0;
		grid.push(val);
	}

	return grid;
}

function write_grid(grid, read_only) {
	for (var i = 0; i < 16; i++) {
		if (grid[i] === 0) document.getElementById('cell-'+i).value = '';
		else {
			document.getElementById('cell-'+i).value = grid[i];
				if (read_only) {
				document.getElementById('cell-'+i).readOnly = true;
				document.getElementById('cell-'+i).classList.add('cell-readonly');
			}
		}
	}
}

function find_solution(grid) {
	var new_grid = grid.slice();
	var possibilities = [];

	for (var i = 0; i < 16; i++) {
		if (grid[i] !== 0) continue;
		var item = {};
		item.index = i;
		item.poss = get_possibilities(grid, i);
		possibilities.push(item);
	}

	//completed
	if (possibilities.length === 0) return grid;

	//sort
	possibilities.sort((a,b) => (a.poss.length > b.poss.length) ? 1 : ((b.poss.length > a.poss.length) ? -1 : 0));
	
	if (possibilities[0].poss.length === 0) return grid;
	//for each possibility
	for (const val of possibilities[0].poss) {
		new_grid[possibilities[0].index] = val;
		new_grid = find_solution(new_grid);
		if (is_completed(new_grid)) return new_grid;
		new_grid = grid.slice();
	}

	return grid;
}

function get_possibilities(grid, i) {
	var possibilities = [1,2,3,4];

	possibilities = check_row(grid, i, possibilities);
	possibilities = check_column(grid, i, possibilities);
	possibilities = check_square(grid, i, possibilities);

	return possibilities;
}

function check_square(grid, i, possibilities) {
	for (const j of get_square(i)) {
		if (grid[j] !== 0) possibilities = remove_from_arr(possibilities, grid[j]);
	}

	return possibilities;
}

function check_row(grid, i, possibilities) {
	for (const j of get_row(i)) {
		if (grid[j] !== 0) possibilities = remove_from_arr(possibilities, grid[j]);
	}

	return possibilities;
}

function check_column(grid, i, possibilities) {
	for (const j of get_column(i)) {
		if (grid[j] !== 0) possibilities = remove_from_arr(possibilities, grid[j]);
	}

	return possibilities;
}

function is_completed(grid) {
	for (var i = 0; i < 16; i++) {
		if (grid[i] === 0) return false;
	}

	return true;
}

function is_valid(grid) {
	var arr = [];

	//rows
	for (var i = 0; i < 16; i += 4) {
		for (const j of get_row(i)) {
			if (grid[j] === 0) continue;
			if (arr.includes(grid[j])) return false;
			arr.push(grid[j]);
		}
		arr = [];
	}

	//columns
	for (var i = 0; i < 4; i++) {
		for (const j of get_column(i)) {
			if (grid[j] === 0) continue;
			if (arr.includes(grid[j])) return false;
			arr.push(grid[j]);
		}
		arr = [];
	}

	//squares
	for (const i of [0,2,8,10]) {
		for (const j of get_square(i)) {
			if (grid[j] === 0) continue;
			if (arr.includes(grid[j])) return false;
			arr.push(grid[j]);
		}
		arr = [];
	}

	return true;
}

function generate_sudoku_old(x) {
	var empty_indexes = [];
	for (var i = 0; i < 16; i++) empty_indexes.push(i);

	clean();
	var grid = read_grid();

	for (var i = 0; i < x; i++) {
		var index, val;

		while (1) {
			var previous_grid = grid.slice();
			index = empty_indexes[get_rand_int(0, empty_indexes.length-1)];

			//generating value for index
			val = get_rand_int(1, 4);
			grid[index] = val;
			if (is_valid(grid) && is_completed(find_solution(grid))) {
				empty_indexes = remove_from_arr(empty_indexes, index);
				break;
			}
			grid = previous_grid.slice();
		}
	}
	write_grid(grid, true);
}

function generate_sudoku(x) {
	var empty_indexes = [];
	for (var i = 0; i < 16; i++) empty_indexes.push(i);

	clean();
	var grid = read_grid();

	for (var i = 0; i < x; i++) {
		var index, val;

		while (1) {
			var previous_grid = grid.slice();
			index = empty_indexes[get_rand_int(0, empty_indexes.length-1)];

			//get all possibilities for this index
			var possibilities = get_possibilities(grid, index);
			if (possibilities.length === 0) continue;
			//generating value for index

			val = possibilities[get_rand_int(0, possibilities.length-1)];
			grid[index] = val;
			if (is_valid(grid) && is_completed(find_solution(grid))) {
				empty_indexes = remove_from_arr(empty_indexes, index);
				break;
			}
			grid = previous_grid.slice();
		}
	}
	write_grid(grid, true);
}

function validate_cell_inner(id) {
	var element = document.getElementById('cell-'+id);

	if (element.value.length == 0) return true;
	if (!is_int(element.value)) return false;
	var val = parseInt(element.value);

	var possibilities = [val];
	var grid = read_grid();
	grid[id] = 0;

	if (check_row(grid, id, possibilities).length === 0) {
		for (const i of get_row(id)) document.getElementById('cell-'+i).classList.add('cell-wrong');
		return false;
	}
	if (check_column(grid, id, possibilities).length === 0) {
		for (const i of get_column(id)) document.getElementById('cell-'+i).classList.add('cell-wrong');
		return false;
	}
	if (check_square(grid, id, possibilities).length === 0) {
		for (const i of get_square(id)) document.getElementById('cell-'+i).classList.add('cell-wrong');
		return false;
	}

	return true;
}

function get_row(i) {
	var res = [];
	var row_num = Math.floor(i / 4);

	for (var j = row_num*4; j < (row_num*4 + 4); j++) res.push(j);

	return res;
}

function get_column(i) {
	var res = [];
	var column_num = i % 4;

	for (var j = column_num; j < 16; j += 4) res.push(j);

	return res;
}

function get_square(i) {
	var res = [];
	var squares = [
		[0,1,4,5],
		[2,3,6,7],
		[8,9,12,13],
		[10,11,14,15]
	];

	for (var j = 0; j < 4; j++) {
		if (!squares[j].includes(i)) continue;
		squares[j].forEach(el => {res.push(el)});
	}

	return res;
}
