var ol;

run();

function run() {
	var values = shuffle(range(1, 11));
	
	ol = document.querySelector('ol');
	values.map(toDOMNode).forEach(ol.appendChild.bind(ol));
	
	var 
		swaps = sort(values).map(function(swap) { return [swap[0] + 1, swap[1] + 1]; }),
		numSwaps = swaps.length,
		swapIt = flatArrayIterator(swaps),
		button = document.getElementsByTagName('button')[0],
		btnListener = (function() {
			var swaps = 0;
			return function(swap, e) {
				e.preventDefault();
				e.stopPropagation();
				
				swap();
				
				if (++swaps === numSwaps) {
					button.disabled = true;
					button.innerHTML = 'Finished';
					button.removeEventListener('click', btnListener, false);
				}
			}
		})()
	;
	
	button.addEventListener('click', wrap(compose(renderSwap, swapIt), btnListener), false);
	
	ol.addEventListener('transitionend', function(e) {
		e.stopPropagation();
		e.target.classList.remove('moving');
	}, false);
}

function toDOMNode(value, i) {
	var li = document.createElement('li'); 
	li.innerHTML = value;
	li.className = 'pos-' + (i+1);
	return li;
}

function sort(a) {
	var
		j, n, i,
		k,
		swaps = []
	;
	
	for (j = 1, n = a.length; j < n; j++) {
		k = a[j];
		i = j - 1;
		while (i >= 0 && k < a[i]) {
			a[i + 1] = a[i];
			swaps.push([i+1, i]);
			i--;
		}
		a[i + 1] = k;
	}
	
	return swaps;
}

function renderSwap(swap/* i, j */) {
	var 
		i = swap[0],
		j = swap[1],
		class_i = 'pos-' + i
		class_j = 'pos-' + j
	;
	
	var itemAti = ol.getElementsByClassName(class_i)[0];
	var itemAtj = ol.getElementsByClassName(class_j)[0];
	
	itemAti.className = class_j;
	itemAti.classList.add('moving');
	itemAtj.className = class_i;
	itemAtj.classList.add('moving');
}
